import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { OptimizedImage } from '@/components/OptimizedImage';

interface Post {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  reading_time: number | null;
  published_at: string | null;
  created_at: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  category?: string | null;
  tags?: string[] | null;
  limit?: number;
}

export const RelatedPosts = ({
  currentPostId,
  category,
  tags,
  limit = 3,
}: RelatedPostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setIsLoading(true);

      // First try to find posts in the same category
      let query = supabase
        .from('posts')
        .select('id, title, slug, excerpt, category, featured_image, reading_time, published_at, created_at')
        .eq('status', 'published')
        .neq('id', currentPostId)
        .limit(limit);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(data);
      } else {
        // If no posts found in category, get recent posts
        const { data: recentData } = await supabase
          .from('posts')
          .select('id, title, slug, excerpt, category, featured_image, reading_time, published_at, created_at')
          .eq('status', 'published')
          .neq('id', currentPostId)
          .order('published_at', { ascending: false })
          .limit(limit);

        setPosts(recentData || []);
      }

      setIsLoading(false);
    };

    fetchRelatedPosts();
  }, [currentPostId, category, tags, limit]);

  if (isLoading) {
    return (
      <div className="mt-16 pt-12 border-t">
        <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/2] rounded-xl" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-16 pt-12 border-t"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Related Articles</h2>
        <Link
          to="/blog"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link to={`/blog/${post.slug || post.id}`} className="group block">
              <div className="relative rounded-xl overflow-hidden aspect-[3/2] mb-4">
                <OptimizedImage
                  src={post.featured_image || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop'}
                  alt={post.title}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                {post.category && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span>
                  {post.published_at
                    ? format(new Date(post.published_at), 'MMM d, yyyy')
                    : format(new Date(post.created_at), 'MMM d, yyyy')}
                </span>
                {post.reading_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.reading_time} min
                  </span>
                )}
              </div>

              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedPosts;
