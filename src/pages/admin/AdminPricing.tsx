import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, GripVertical, Star, StarOff } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PricingPackage {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  price_suffix: string | null;
  features: string[] | null;
  highlighted: boolean | null;
  display_order: number | null;
}

const AdminPricing = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    price_suffix: '/project',
    features: '',
    highlighted: false,
  });

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setPackages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      price_suffix: '/project',
      features: '',
      highlighted: false,
    });
    setEditingPackage(null);
  };

  const openEditDialog = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price || '',
      price_suffix: pkg.price_suffix || '/project',
      features: pkg.features?.join('\n') || '',
      highlighted: pkg.highlighted || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const packageData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      price_suffix: formData.price_suffix,
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
      highlighted: formData.highlighted,
    };

    if (editingPackage) {
      const { error } = await supabase
        .from('pricing_packages')
        .update(packageData)
        .eq('id', editingPackage.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        toast({ title: 'Success', description: 'Package updated successfully' });
        setIsDialogOpen(false);
        resetForm();
        fetchPackages();
      }
    } else {
      const maxOrder = packages.length > 0 ? Math.max(...packages.map(p => p.display_order || 0)) : 0;
      const { error } = await supabase.from('pricing_packages').insert({
        ...packageData,
        display_order: maxOrder + 1,
      });

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        toast({ title: 'Success', description: 'Package created successfully' });
        setIsDialogOpen(false);
        resetForm();
        fetchPackages();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing package?')) return;

    const { error } = await supabase.from('pricing_packages').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Package deleted successfully' });
      fetchPackages();
    }
  };

  const toggleHighlighted = async (pkg: PricingPackage) => {
    const { error } = await supabase
      .from('pricing_packages')
      .update({ highlighted: !pkg.highlighted })
      .eq('id', pkg.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      fetchPackages();
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIndex = packages.findIndex(p => p.id === draggedId);
    const targetIndex = packages.findIndex(p => p.id === targetId);

    const newPackages = [...packages];
    const [removed] = newPackages.splice(draggedIndex, 1);
    newPackages.splice(targetIndex, 0, removed);

    setPackages(newPackages);
    setDraggedId(null);

    // Update display order in database
    const updates = newPackages.map((pkg, index) =>
      supabase.from('pricing_packages').update({ display_order: index }).eq('id', pkg.id)
    );

    await Promise.all(updates);
    toast({ title: 'Success', description: 'Order updated' });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pricing Packages</h1>
          <p className="text-muted-foreground mt-1">Manage your pricing plans</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Package Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  placeholder="e.g., Starter, Professional, Enterprise"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  placeholder="Perfect for small businesses"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                    placeholder="$999 or Custom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price Suffix</label>
                  <input
                    type="text"
                    value={formData.price_suffix}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_suffix: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                    placeholder="/project, /month"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border resize-none"
                  placeholder="Custom website design&#10;Mobile responsive&#10;SEO optimization&#10;3 revision rounds"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlighted"
                  checked={formData.highlighted}
                  onChange={(e) => setFormData(prev => ({ ...prev, highlighted: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="highlighted" className="text-sm font-medium">Highlight this package (recommended)</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  {editingPackage ? 'Update' : 'Create'} Package
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {packages.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="text-muted-foreground mb-4">No pricing packages yet</p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create your first package
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            <GripVertical className="w-4 h-4 inline mr-1" />
            Drag to reorder packages
          </p>
          <div className="grid gap-4">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                draggable
                onDragStart={(e) => handleDragStart(e as any, pkg.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e as any, pkg.id)}
                className={`card-premium p-6 cursor-grab active:cursor-grabbing ${
                  draggedId === pkg.id ? 'opacity-50 scale-[0.98]' : ''
                } ${pkg.highlighted ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground hover:text-foreground transition-colors pt-1">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                      {pkg.highlighted && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                          Recommended
                        </span>
                      )}
                    </div>
                    {pkg.description && (
                      <p className="text-muted-foreground mb-3">{pkg.description}</p>
                    )}
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold">{pkg.price || 'Custom'}</span>
                      {pkg.price_suffix && (
                        <span className="text-muted-foreground">{pkg.price_suffix}</span>
                      )}
                    </div>
                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="space-y-1">
                        {pkg.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                        {pkg.features.length > 5 && (
                          <li className="text-sm text-muted-foreground">
                            +{pkg.features.length - 5} more features
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHighlighted(pkg)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      title={pkg.highlighted ? 'Remove highlight' : 'Highlight package'}
                    >
                      {pkg.highlighted ? (
                        <StarOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Star className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditDialog(pkg)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPricing;
