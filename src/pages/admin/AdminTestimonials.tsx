import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff } from 'lucide-react';
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

interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  content: string;
  avatar_url: string | null;
  rating: number | null;
  featured: boolean | null;
  status: 'draft' | 'published';
  display_order: number | null;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    client_name: '',
    company: '',
    role: '',
    content: '',
    avatar_url: '',
    rating: '5',
    featured: false,
    status: 'draft' as 'draft' | 'published',
  });

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setTestimonials(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setFormData({
      client_name: '',
      company: '',
      role: '',
      content: '',
      avatar_url: '',
      rating: '5',
      featured: false,
      status: 'draft',
    });
    setEditingTestimonial(null);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      client_name: testimonial.client_name,
      company: testimonial.company || '',
      role: testimonial.role || '',
      content: testimonial.content,
      avatar_url: testimonial.avatar_url || '',
      rating: testimonial.rating?.toString() || '5',
      featured: testimonial.featured || false,
      status: testimonial.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const testimonialData = {
      client_name: formData.client_name,
      company: formData.company,
      role: formData.role,
      content: formData.content,
      avatar_url: formData.avatar_url,
      rating: parseInt(formData.rating),
      featured: formData.featured,
      status: formData.status,
    };

    if (editingTestimonial) {
      const { error } = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', editingTestimonial.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        toast({ title: 'Success', description: 'Testimonial updated successfully' });
        setIsDialogOpen(false);
        resetForm();
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from('testimonials').insert(testimonialData);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        toast({ title: 'Success', description: 'Testimonial created successfully' });
        setIsDialogOpen(false);
        resetForm();
        fetchTestimonials();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const { error } = await supabase.from('testimonials').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Testimonial deleted successfully' });
      fetchTestimonials();
    }
  };

  const toggleStatus = async (testimonial: Testimonial) => {
    const newStatus = testimonial.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('testimonials')
      .update({ status: newStatus })
      .eq('id', testimonial.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      fetchTestimonials();
    }
  };

  const toggleFeatured = async (testimonial: Testimonial) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ featured: !testimonial.featured })
      .eq('id', testimonial.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      fetchTestimonials();
    }
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
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage client testimonials</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Role/Title</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="CEO, Founder, etc."
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Testimonial Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured testimonial</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  {editingTestimonial ? 'Update' : 'Create'} Testimonial
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="text-muted-foreground mb-4">No testimonials yet</p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add your first testimonial
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-4 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold flex-shrink-0">
                {testimonial.client_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{testimonial.client_name}</h3>
                  {testimonial.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                </p>
                <p className="text-sm mt-2 line-clamp-2">{testimonial.content}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                testimonial.status === 'published' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {testimonial.status}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleFeatured(testimonial)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title={testimonial.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  {testimonial.featured ? (
                    <StarOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Star className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => toggleStatus(testimonial)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title={testimonial.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {testimonial.status === 'published' ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => openEditDialog(testimonial)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTestimonials;
