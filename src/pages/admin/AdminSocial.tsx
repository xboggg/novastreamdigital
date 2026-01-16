import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Star, ExternalLink, Loader2 } from 'lucide-react';

type Platform = 'tiktok' | 'youtube' | 'instagram' | 'facebook';
type ContentStatus = 'draft' | 'published';

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
}

const platformConfig: Record<Platform, { label: string; color: string; bgColor: string }> = {
  tiktok: { label: 'TikTok', color: 'text-foreground', bgColor: 'bg-foreground text-background' },
  youtube: { label: 'YouTube', color: 'text-red-500', bgColor: 'bg-red-500 text-white' },
  instagram: { label: 'Instagram', color: 'text-pink-500', bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white' },
  facebook: { label: 'Facebook', color: 'text-blue-500', bgColor: 'bg-blue-600 text-white' },
};

// URL parsing functions
const parseVideoUrl = (url: string): { platform: Platform | null; embedId: string | null } => {
  try {
    // YouTube Shorts
    const youtubeShortMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (youtubeShortMatch) return { platform: 'youtube', embedId: youtubeShortMatch[1] };
    
    // YouTube regular/embed
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) return { platform: 'youtube', embedId: youtubeMatch[1] };
    
    // TikTok
    const tiktokMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (tiktokMatch) return { platform: 'tiktok', embedId: tiktokMatch[1] };
    
    // Instagram Reels/Posts
    const instagramMatch = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
    if (instagramMatch) return { platform: 'instagram', embedId: instagramMatch[1] };
    
    // Facebook Reels/Videos
    const facebookReelMatch = url.match(/facebook\.com\/reel\/(\d+)/);
    if (facebookReelMatch) return { platform: 'facebook', embedId: facebookReelMatch[1] };
    
    const facebookVideoMatch = url.match(/facebook\.com\/watch\/?\?v=(\d+)/);
    if (facebookVideoMatch) return { platform: 'facebook', embedId: facebookVideoMatch[1] };
    
    return { platform: null, embedId: null };
  } catch {
    return { platform: null, embedId: null };
  }
};

const AdminSocial = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [platformFilter, setPlatformFilter] = useState<'all' | Platform>('all');
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
    const { platform, embedId } = parseVideoUrl(url);
    if (platform && embedId) {
      setFormData(prev => ({ 
        ...prev, 
        video_url: url,
        platform, 
        embed_id: embedId 
      }));
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

  const filteredPosts = platformFilter === 'all' 
    ? posts 
    : posts.filter(p => p.platform === platformFilter);

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-8">
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
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Video' : 'Add Video'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
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
                  <Label htmlFor="embed_id">Embed ID</Label>
                  <Input
                    id="embed_id"
                    placeholder="Video/Post ID"
                    value={formData.embed_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, embed_id: e.target.value }))}
                    required
                  />
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
                  <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
                  <Input
                    id="thumbnail_url"
                    placeholder="https://..."
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  />
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

        {/* Platform filter tabs */}
        <Tabs value={platformFilter} onValueChange={(v) => setPlatformFilter(v as typeof platformFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No social posts yet. Add your first video!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all"
              >
                {/* Thumbnail */}
                <div className="aspect-[9/16] bg-secondary flex items-center justify-center relative">
                  {post.thumbnail_url ? (
                    <img 
                      src={post.thumbnail_url} 
                      alt={post.title || 'Video thumbnail'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className={`text-4xl mb-2 ${platformConfig[post.platform].color}`}>
                        {post.platform === 'youtube' && '▶'}
                        {post.platform === 'tiktok' && '♪'}
                        {post.platform === 'instagram' && '📷'}
                        {post.platform === 'facebook' && 'f'}
                      </div>
                      <p className="text-xs text-muted-foreground">No thumbnail</p>
                    </div>
                  )}
                  
                  {/* Platform badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${platformConfig[post.platform].bgColor}`}>
                    {platformConfig[post.platform].label}
                  </div>

                  {/* Featured star */}
                  <button
                    onClick={() => toggleFeatured.mutate({ id: post.id, is_featured: !post.is_featured })}
                    className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                      post.is_featured 
                        ? 'bg-yellow-500 text-yellow-900' 
                        : 'bg-background/80 text-muted-foreground hover:text-yellow-500'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={post.is_featured ? 'currentColor' : 'none'} />
                  </button>

                  {/* Status badge */}
                  <Badge
                    variant={post.status === 'published' ? 'default' : 'secondary'}
                    className="absolute bottom-2 left-2"
                  >
                    {post.status}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2 mb-2">
                    {post.title || 'Untitled video'}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSocial;
