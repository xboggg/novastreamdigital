import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, GripVertical, Search, ChevronDown, ChevronUp } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number | null;
}

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
  });

  const fetchFaqs = async () => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setFaqs(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = faqs.map(f => f.category).filter(Boolean) as string[];
    return [...new Set(cats)];
  }, [faqs]);

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchQuery, categoryFilter]);

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
    });
    setEditingFaq(null);
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const faqData = {
      question: formData.question,
      answer: formData.answer,
      category: formData.category || null,
    };

    if (editingFaq) {
      const { error } = await supabase
        .from('faqs')
        .update(faqData)
        .eq('id', editingFaq.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        toast({ title: 'Success', description: 'FAQ updated successfully' });
        setIsDialogOpen(false);
        resetForm();
        fetchFaqs();
      }
    } else {
      const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.display_order || 0)) : 0;
      const { error } = await supabase.from('faqs').insert({
        ...faqData,
        display_order: maxOrder + 1,
      });

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        toast({ title: 'Success', description: 'FAQ created successfully' });
        setIsDialogOpen(false);
        resetForm();
        fetchFaqs();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    const { error } = await supabase.from('faqs').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'FAQ deleted successfully' });
      fetchFaqs();
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

    const draggedIndex = faqs.findIndex(f => f.id === draggedId);
    const targetIndex = faqs.findIndex(f => f.id === targetId);

    const newFaqs = [...faqs];
    const [removed] = newFaqs.splice(draggedIndex, 1);
    newFaqs.splice(targetIndex, 0, removed);

    setFaqs(newFaqs);
    setDraggedId(null);

    // Update display order in database
    const updates = newFaqs.map((faq, index) =>
      supabase.from('faqs').update({ display_order: index }).eq('id', faq.id)
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
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground mt-1">Manage frequently asked questions ({filteredFaqs.length} of {faqs.length})</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  placeholder="What services do you offer?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Answer *</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border resize-none"
                  placeholder="We offer web design, development, and digital marketing services..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  placeholder="General, Pricing, Services, etc."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  {editingFaq ? 'Update' : 'Create'} FAQ
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary transition-colors"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {faqs.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="text-muted-foreground mb-4">No FAQs yet</p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create your first FAQ
          </Button>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="text-muted-foreground mb-4">No FAQs match your search</p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            <GripVertical className="w-4 h-4 inline mr-1" />
            Drag to reorder FAQs
          </p>
          <div className="grid gap-2">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                draggable
                onDragStart={(e) => handleDragStart(e as any, faq.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e as any, faq.id)}
                className={`card-premium overflow-hidden cursor-grab active:cursor-grabbing ${
                  draggedId === faq.id ? 'opacity-50 scale-[0.98]' : ''
                }`}
              >
                <div className="p-4 flex items-start gap-4">
                  <div className="text-muted-foreground hover:text-foreground transition-colors pt-1">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="w-full text-left flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{faq.question}</h3>
                        {faq.category && (
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded mt-1 inline-block">
                            {faq.category}
                          </span>
                        )}
                      </div>
                      {expandedId === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>

                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-border"
                      >
                        <p className="text-muted-foreground whitespace-pre-wrap">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditDialog(faq)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
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

export default AdminFAQ;
