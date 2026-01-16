import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, Upload, X } from 'lucide-react';
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

interface Project {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  category: string | null;
  image_url: string | null;
  tags: string[] | null;
  featured: boolean | null;
  status: 'draft' | 'published';
  display_order: number | null;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    image_url: '',
    tags: '',
    featured: false,
    status: 'draft' as 'draft' | 'published',
  });

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: '',
      image_url: '',
      tags: '',
      featured: false,
      status: 'draft',
    });
    setEditingProject(null);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug || '',
      description: project.description || '',
      category: project.category || '',
      image_url: project.image_url || '',
      tags: project.tags?.join(', ') || '',
      featured: project.featured || false,
      status: project.status,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'Error', description: 'Image must be less than 5MB' });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Error', description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      category: formData.category,
      image_url: formData.image_url,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: formData.featured,
      status: formData.status,
    };

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        toast({ title: 'Success', description: 'Project updated successfully' });
        setIsDialogOpen(false);
        resetForm();
        fetchProjects();
      }
    } else {
      const { error } = await supabase.from('projects').insert(projectData);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        toast({ title: 'Success', description: 'Project created successfully' });
        setIsDialogOpen(false);
        resetForm();
        fetchProjects();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Project deleted successfully' });
      fetchProjects();
    }
  };

  const toggleStatus = async (project: Project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('projects')
      .update({ status: newStatus })
      .eq('id', project.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      fetchProjects();
    }
  };

  const toggleFeatured = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ featured: !project.featured })
      .eq('id', project.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      fetchProjects();
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
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="auto-generated-from-title"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                  />
                </div>
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
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Project Image</label>
                {formData.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img 
                      src={formData.image_url} 
                      alt="Project preview" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-border bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-sm text-muted-foreground">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload image</span>
                        <span className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG/WebP</span>
                      </div>
                    )}
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Or enter Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="E-commerce, React, Design"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured project</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  {editingProject ? 'Update' : 'Create'} Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-4 flex items-center gap-4"
            >
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{project.title}</h3>
                  {project.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{project.category}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.status === 'published' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {project.status}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(project)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title={project.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  {project.featured ? (
                    <StarOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Star className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => toggleStatus(project)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {project.status === 'published' ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => openEditDialog(project)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
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

export default AdminProjects;
