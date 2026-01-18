import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { SEO } from '@/components/SEO';
import { JsonLd, createBreadcrumbSchema } from '@/components/JsonLd';
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

const Insights = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
  ]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, category, featured_image, reading_time, published_at, created_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Insights"
        description="Thoughts on design, technology, and craft. Ideas, perspectives, and lessons from our work in the digital space."
        keywords="web design blog, digital insights, technology articles, design tips, Ghana tech blog"
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Header */}
        <section className="container-custom mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Insights
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Thoughts on Design,{' '}
              <span className="gradient-text">Technology & Craft</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Ideas, perspectives, and lessons from our work in the digital space.
            </p>
          </motion.div>
        </section>

        {/* Articles Grid */}
        <section className="container-custom">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/2] rounded-2xl" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No articles published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/insights/${post.slug || post.id}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/2] mb-6">
                      <OptimizedImage
                        src={post.featured_image || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop'}
                        alt={post.title}
                        className="transition-transform duration-500 group-hover:scale-105"
                        priority={index < 2}
                      />
                      {post.category && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>
                        {post.published_at 
                          ? format(new Date(post.published_at), 'MMM d, yyyy')
                          : format(new Date(post.created_at), 'MMM d, yyyy')
                        }
                      </span>
                      {post.reading_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.reading_time} min read
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                      Read Article
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Insights;
