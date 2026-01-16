import { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Pencil, Trash2, Star, ExternalLink, Loader2, HelpCircle, Upload, 
  Grid, List, Image, GripVertical, Eye, MousePointer, ChevronDown 
} from 'lucide-react';

type Platform = 'tiktok' | 'youtube' | 'instagram' | 'facebook';
type ContentStatus = 'draft' | 'published';
type ViewMode = 'grid' | 'table';

interface SocialPost {
  id: string;
  platform: Platform;
  video_url: string;
  embed_id: string;
  title: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  display_order: number;
  status: ContentStatus;
  created_at: string;
  view_count?: number;
  click_count?: number;
}

const platformConfig: Record<Platform, { label: string; color: string; bgColor: string }> = {
  tiktok: { label: 'TikTok', color: 'text-foreground', bgColor: 'bg-foreground text-background' },
  youtube: { label: 'YouTube', color: 'text-red-500', bgColor: 'bg-red-500 text-white' },
  instagram: { label: 'Instagram', color: 'text-pink-500', bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white' },
  facebook: { label: 'Facebook', color: 'text-blue-500', bgColor: 'bg-blue-600 text-white' },
};

const POSTS_PER_PAGE = 10;

// URL parsing functions
const parseVideoUrl = (url: string): { platform: Platform | null; embedId: string | null; thumbnailUrl: string | null } => {
  try {
    // YouTube Shorts
    const youtubeShortMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (youtubeShortMatch) {
      const embedId = youtubeShortMatch[1];
      return { 
        platform: 'youtube', 
        embedId, 
        thumbnailUrl: `https://img.youtube.com/vi/${embedId}/maxresdefault.jpg` 
      };
    }
    
    // YouTube regular/embed
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      const embedId = youtubeMatch[1];
      return { 
        platform: 'youtube', 
        embedId, 
        thumbnailUrl: `https://img.youtube.com/vi/${embedId}/maxresdefault.jpg` 
      };
    }
    
    // TikTok
    const tiktokMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (tiktokMatch) return { platform: 'tiktok', embedId: tiktokMatch[1], thumbnailUrl: null };
    
    // Instagram Reels/Posts
    const instagramMatch = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
    if (instagramMatch) return { platform: 'instagram', embedId: instagramMatch[1], thumbnailUrl: null };
    
    // Facebook Reels/Videos
    const facebookReelMatch = url.match(/facebook\.com\/reel\/(\d+)/);
    if (facebookReelMatch) return { platform: 'facebook', embedId: facebookReelMatch[1], thumbnailUrl: null };
    
    const facebookVideoMatch = url.match(/facebook\.com\/watch\/?\?v=(\d+)/);
    if (facebookVideoMatch) return { platform: 'facebook', embedId: facebookVideoMatch[1], thumbnailUrl: null };
    
    return { platform: null, embedId: null, thumbnailUrl: null };
  } catch {
    return { platform: null, embedId: null, thumbnailUrl: null };
  }
};

const AdminSocial = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [platformFilter, setPlatformFilter] = useState<'all' | Platform>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [draggedPost, setDraggedPost] = useState<SocialPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    platform: '' as Platform | '',
    video_url: '',
    embed_id: '',
    title: '',
    thumbnail_url: '',
    status: 'draft' as ContentStatus,
    is_featured: false,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['social-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SocialPost[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('social_posts').insert([{
        platform: data.platform,
        video_url: data.video_url,
        embed_id: data.embed_id,
        title: data.title || null,
        thumbnail_url: data.thumbnail_url || null,
        status: data.status,
        is_featured: data.is_featured,
        display_order: posts.length,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Social post created successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create social post.', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase.from('social_posts').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      setIsDialogOpen(false);
      setEditingPost(null);
      resetForm();
      toast({ title: 'Success', description: 'Social post updated successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update social post.', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('social_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      toast({ title: 'Success', description: 'Social post deleted successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete social post.', variant: 'destructive' });
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from('social_posts').update({ is_featured }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: string; display_order: number }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('social_posts')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      toast({ title: 'Success', description: 'Order updated successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update order.', variant: 'destructive' });
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: ContentStatus }) => {
      const { error } = await supabase
        .from('social_posts')
        .update({ status })
        .in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      setSelectedPosts(new Set());
      toast({ title: 'Success', description: 'Posts updated successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update posts.', variant: 'destructive' });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      setSelectedPosts(new Set());
      toast({ title: 'Success', description: 'Posts deleted successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete posts.', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      platform: '',
      video_url: '',
      embed_id: '',
      title: '',
      thumbnail_url: '',
      status: 'draft',
      is_featured: false,
    });
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, video_url: url }));
    const { platform, embedId, thumbnailUrl } = parseVideoUrl(url);
    if (platform && embedId) {
      setFormData(prev => ({ 
        ...prev, 
        video_url: url,
        platform, 
        embed_id: embedId,
        thumbnail_url: thumbnailUrl && !prev.thumbnail_url ? thumbnailUrl : prev.thumbnail_url,
      }));
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image must be less than 5MB.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('social-thumbnails')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('social-thumbnails')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
      toast({ title: 'Success', description: 'Thumbnail uploaded successfully.' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error', description: 'Failed to upload thumbnail.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEdit = (post: SocialPost) => {
    setEditingPost(post);
    setFormData({
      platform: post.platform,
      video_url: post.video_url,
      embed_id: post.embed_id,
      title: post.title || '',
      thumbnail_url: post.thumbnail_url || '',
      status: post.status,
      is_featured: post.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.embed_id) {
      toast({ title: 'Error', description: 'Please enter a valid video URL.', variant: 'destructive' });
      return;
    }
    
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (post: SocialPost) => {
    setDraggedPost(post);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPost: SocialPost) => {
    if (!draggedPost || draggedPost.id === targetPost.id) return;

    const sortedPosts = [...posts].sort((a, b) => a.display_order - b.display_order);
    const draggedIndex = sortedPosts.findIndex(p => p.id === draggedPost.id);
    const targetIndex = sortedPosts.findIndex(p => p.id === targetPost.id);

    const newPosts = [...sortedPosts];
    newPosts.splice(draggedIndex, 1);
    newPosts.splice(targetIndex, 0, draggedPost);

    const updates = newPosts.map((post, index) => ({
      id: post.id,
      display_order: index,
    }));

    reorderMutation.mutate(updates);
    setDraggedPost(null);
  };

  // Selection handlers
  const toggleSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === paginatedPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(paginatedPosts.map(p => p.id)));
    }
  };

  // Filtering and pagination
  const filteredPosts = platformFilter === 'all' 
    ? posts 
    : posts.filter(p => p.platform === platformFilter);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset page when filter changes
  const handleFilterChange = (filter: 'all' | Platform) => {
    setPlatformFilter(filter);
    setCurrentPage(1);
    setSelectedPosts(new Set());
  };

  // Metrics totals
  const metrics = useMemo(() => {
    return {
      totalViews: posts.reduce((sum, p) => sum + (p.view_count || 0), 0),
      totalClicks: posts.reduce((sum, p) => sum + (p.click_count || 0), 0),
      published: posts.filter(p => p.status === 'published').length,
      drafts: posts.filter(p => p.status === 'draft').length,
    };
  }, [posts]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Social Media</h1>
            <p className="text-muted-foreground mt-1">
              Manage videos from TikTok, YouTube, Instagram, and Facebook
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingPost(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-bg">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Video' : 'Add Video'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="video_url">Video URL</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The full URL of the video (e.g., https://youtube.com/shorts/abc123). We'll automatically detect the platform and extract the embed ID.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="video_url"
                    placeholder="Paste TikTok, YouTube, Instagram, or Facebook URL..."
                    value={formData.video_url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    required
                  />
                  {formData.platform && formData.embed_id && (
                    <p className="text-sm text-muted-foreground">
                      Detected: <span className={platformConfig[formData.platform].color}>{platformConfig[formData.platform].label}</span> • ID: {formData.embed_id}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={formData.platform} 
                      onValueChange={(value: Platform) => setFormData(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="embed_id">Embed ID</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The unique video identifier extracted from the URL. For YouTube "abc123" from youtube.com/shorts/abc123. This is used to embed the video on your site.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="embed_id"
                      placeholder="Video/Post ID"
                      value={formData.embed_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, embed_id: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title (optional)</Label>
                  <Textarea
                    id="title"
                    placeholder="Video title or caption..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://... or upload below"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                      className="flex-1"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {formData.thumbnail_url && (
                    <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                      <img 
                        src={formData.thumbnail_url} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    YouTube thumbnails are auto-fetched. For other platforms, paste URL or upload an image.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: ContentStatus) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Featured</Label>
                    <div className="h-10 flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm">Show on homepage</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingPost ? 'Update' : 'Add'} Video
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <MousePointer className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.totalClicks.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.published}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Pencil className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.drafts}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs value={platformFilter} onValueChange={(v) => handleFilterChange(v as typeof platformFilter)}>
            <TabsList>
              <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
              <TabsTrigger value="tiktok">TikTok</TabsTrigger>
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedPosts.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
            <span className="text-sm font-medium">{selectedPosts.size} selected</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkStatusMutation.mutate({ ids: Array.from(selectedPosts), status: 'published' })}
                disabled={bulkStatusMutation.isPending}
              >
                Publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkStatusMutation.mutate({ ids: Array.from(selectedPosts), status: 'draft' })}
                disabled={bulkStatusMutation.isPending}
              >
                Unpublish
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive" disabled={bulkDeleteMutation.isPending}>
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedPosts.size} posts?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All selected posts will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => bulkDeleteMutation.mutate(Array.from(selectedPosts))}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedPosts(new Set())}
              className="ml-auto"
            >
              Clear selection
            </Button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No social posts yet. Add your first video!</p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedPosts.size === paginatedPosts.length && paginatedPosts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-16">Thumb</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-24">Platform</TableHead>
                  <TableHead className="w-20 text-center">Views</TableHead>
                  <TableHead className="w-20 text-center">Clicks</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-20 text-center">Featured</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPosts.map((post) => (
                  <TableRow 
                    key={post.id} 
                    className={`hover:bg-secondary/30 ${draggedPost?.id === post.id ? 'opacity-50' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(post)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(post)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedPosts.has(post.id)}
                        onCheckedChange={() => toggleSelection(post.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                        {post.thumbnail_url ? (
                          <img 
                            src={post.thumbnail_url} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-muted-foreground"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></span>';
                            }}
                          />
                        ) : (
                          <Image className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium line-clamp-1">{post.title || 'Untitled video'}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{post.embed_id}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={platformConfig[post.platform].bgColor}>
                        {platformConfig[post.platform].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm text-muted-foreground">{(post.view_count || 0).toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm text-muted-foreground">{(post.click_count || 0).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => toggleFeatured.mutate({ id: post.id, is_featured: !post.is_featured })}
                        className={`p-1.5 rounded-full transition-colors ${
                          post.is_featured 
                            ? 'bg-yellow-500 text-yellow-900' 
                            : 'bg-secondary text-muted-foreground hover:text-yellow-500'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={post.is_featured ? 'currentColor' : 'none'} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={post.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this video?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The video will be removed from your social feed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {paginatedPosts.map((post) => (
              <div
                key={post.id}
                className={`group relative bg-card rounded-xl border overflow-hidden hover:border-primary/30 transition-all ${
                  selectedPosts.has(post.id) ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
                draggable
                onDragStart={() => handleDragStart(post)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(post)}
              >
                {/* Selection checkbox */}
                <div className="absolute top-1.5 left-1.5 z-10">
                  <Checkbox
                    checked={selectedPosts.has(post.id)}
                    onCheckedChange={() => toggleSelection(post.id)}
                    className="bg-background/80"
                  />
                </div>

                {/* Thumbnail */}
                <div className="aspect-[9/12] bg-secondary flex items-center justify-center relative">
                  {post.thumbnail_url ? (
                    <img 
                      src={post.thumbnail_url} 
                      alt={post.title || 'Video thumbnail'} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className={`text-3xl mb-1 ${platformConfig[post.platform].color}`}>
                        {post.platform === 'youtube' && '▶'}
                        {post.platform === 'tiktok' && '♪'}
                        {post.platform === 'instagram' && '📷'}
                        {post.platform === 'facebook' && 'f'}
                      </div>
                      <p className="text-[10px] text-muted-foreground">No thumbnail</p>
                    </div>
                  )}
                  
                  {/* Platform badge */}
                  <div className={`absolute top-1.5 right-10 px-1.5 py-0.5 rounded text-[10px] font-medium ${platformConfig[post.platform].bgColor}`}>
                    {platformConfig[post.platform].label}
                  </div>

                  {/* Featured star */}
                  <button
                    onClick={() => toggleFeatured.mutate({ id: post.id, is_featured: !post.is_featured })}
                    className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-colors ${
                      post.is_featured 
                        ? 'bg-yellow-500 text-yellow-900' 
                        : 'bg-background/80 text-muted-foreground hover:text-yellow-500'
                    }`}
                  >
                    <Star className="w-3 h-3" fill={post.is_featured ? 'currentColor' : 'none'} />
                  </button>

                  {/* Status badge */}
                  <Badge
                    variant={post.status === 'published' ? 'default' : 'secondary'}
                    className="absolute bottom-1.5 left-1.5 text-[10px] px-1.5 py-0"
                  >
                    {post.status}
                  </Badge>

                  {/* Metrics */}
                  <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                    <span className="bg-background/80 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> {post.view_count || 0}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2">
                  <p className="text-xs font-medium line-clamp-1 mb-1">
                    {post.title || 'Untitled video'}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <div className="cursor-grab active:cursor-grabbing p-1">
                      <GripVertical className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <a
                      href={post.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded hover:bg-secondary transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-1 rounded hover:bg-secondary transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this video?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The video will be removed from your social feed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(post.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1} to {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSocial;
