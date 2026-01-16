import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { supabase } from '@/integrations/supabase/client';
import { VideoModal } from '@/components/ui/video-modal';
import { Play, ExternalLink } from 'lucide-react';

type Platform = 'tiktok' | 'youtube' | 'instagram' | 'facebook';

interface SocialPost {
  id: string;
  platform: Platform;
  video_url: string;
  embed_id: string;
  title: string | null;
  thumbnail_url: string | null;
}

const platformConfig: Record<Platform, { label: string; icon: React.ReactNode; gradient: string }> = {
  tiktok: {
    label: 'TikTok',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    ),
    gradient: 'from-[#25F4EE] via-[#FE2C55] to-[#000000]',
  },
  youtube: {
    label: 'YouTube',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    gradient: 'from-[#FF0000] to-[#CC0000]',
  },
  instagram: {
    label: 'Instagram',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
  },
  facebook: {
    label: 'Facebook',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    gradient: 'from-[#1877F2] to-[#0D5FC4]',
  },
};

// Track click (when user clicks on a post thumbnail)
const trackClick = async (postId: string) => {
  try {
    // Use raw SQL via RPC - types will be updated after migration
    await (supabase.rpc as any)('increment_social_post_click', { post_id: postId });
  } catch (error) {
    // Silent fail - don't interrupt user experience
    console.error('Failed to track click:', error);
  }
};

// Track view (when user watches the video in modal)
const trackView = async (postId: string) => {
  try {
    // Use raw SQL via RPC - types will be updated after migration
    await (supabase.rpc as any)('increment_social_post_view', { post_id: postId });
  } catch (error) {
    // Silent fail - don't interrupt user experience
    console.error('Failed to track view:', error);
  }
};

export const SocialFeedSection = () => {
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    dragFree: true,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['social-posts-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('id, platform, video_url, embed_id, title, thumbnail_url')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SocialPost[];
    },
  });

  // Auto-scroll
  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || posts.length === 0) return;
    
    const interval = setInterval(autoplay, 4000);
    
    emblaApi.on('pointerDown', () => clearInterval(interval));
    
    return () => clearInterval(interval);
  }, [emblaApi, autoplay, posts.length]);

  const handlePostClick = (post: SocialPost) => {
    trackClick(post.id);
    setSelectedPost(post);
  };

  const handlePostView = useCallback(() => {
    if (selectedPost) {
      trackView(selectedPost.id);
    }
  }, [selectedPost]);

  if (posts.length === 0) return null;

  return (
    <>
      <section className="section-padding bg-surface-overlay overflow-hidden">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {(['tiktok', 'youtube', 'instagram', 'facebook'] as Platform[]).map((platform, i) => (
                <motion.div
                  key={platform}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${platformConfig[platform].gradient} flex items-center justify-center text-white`}
                >
                  {platformConfig[platform].icon}
                </motion.div>
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Follow Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Watch our latest videos and behind-the-scenes content across all platforms
            </p>
          </motion.div>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-none w-[200px] sm:w-[240px] md:w-[280px]"
                >
                  <div
                    className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-card border border-border cursor-pointer hover:border-primary/50 transition-all duration-300"
                    onClick={() => handlePostClick(post)}
                  >
                    {/* Thumbnail or placeholder */}
                    {post.thumbnail_url ? (
                      <img
                        src={post.thumbnail_url}
                        alt={post.title || 'Video'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${platformConfig[post.platform].gradient} opacity-20`} />
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Platform badge */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${platformConfig[post.platform].gradient} text-white text-xs font-medium flex items-center gap-1.5`}>
                      {platformConfig[post.platform].icon}
                      <span>{platformConfig[post.platform].label}</span>
                    </div>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* Title overlay */}
                    {post.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social links CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center"
          >
            <p className="text-muted-foreground text-sm mb-4">
              Follow us on your favorite platform
            </p>
            <div className="flex items-center justify-center gap-3">
              {(['tiktok', 'youtube', 'instagram', 'facebook'] as Platform[]).map((platform) => (
                <a
                  key={platform}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-secondary hover:bg-gradient-to-br ${platformConfig[platform].gradient} hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300`}
                >
                  {platformConfig[platform].icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedPost && (
        <VideoModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          platform={selectedPost.platform}
          embedId={selectedPost.embed_id}
          title={selectedPost.title || undefined}
          onView={handlePostView}
        />
      )}
    </>
  );
};