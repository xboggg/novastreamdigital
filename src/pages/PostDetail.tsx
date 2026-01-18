import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import DOMPurify from "dompurify";
import { SEO } from "@/components/SEO";
import { JsonLd, createArticleSchema, createBreadcrumbSchema } from "@/components/JsonLd";
import { SocialShare } from "@/components/SocialShare";
import { ReadingProgress } from "@/components/ReadingProgress";
import { RelatedPosts } from "@/components/RelatedPosts";
import { OptimizedImage } from "@/components/OptimizedImage";

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container max-w-3xl mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (error || !post) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/insights">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Insights
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: post.title, url: `/insights/${slug}` },
  ]);

  const articleSchema = createArticleSchema({
    title: post.title,
    description: post.excerpt || post.title,
    slug: slug || post.id,
    image: post.featured_image,
    publishedAt: post.published_at || post.created_at,
    modifiedAt: post.updated_at || post.published_at,
  });

  return (
    <PageTransition>
      <ReadingProgress />
      <SEO
        title={post.title}
        description={post.excerpt || `Read ${post.title} on NovaStream Digital Insights`}
        image={post.featured_image}
        type="article"
        publishedTime={post.published_at || post.created_at}
        modifiedTime={post.updated_at}
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <JsonLd type="article" data={articleSchema} />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <article className="container max-w-3xl mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/insights">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Insights
              </Link>
            </Button>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {post.category && (
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  {new Date(post.published_at || post.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              {post.reading_time && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{post.reading_time} min read</span>
                </div>
              )}
            </div>
          </motion.header>

          {/* Featured Image */}
          {post.featured_image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <OptimizedImage
                src={post.featured_image}
                alt={post.title}
                aspectRatio="video"
                containerClassName="rounded-xl"
                priority
              />
            </motion.div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
            ) : (
              <p className="text-muted-foreground">
                Full article content coming soon.
              </p>
            )}
          </motion.div>

          {/* Tags and Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-8 border-t"
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Share */}
              <div>
                <SocialShare
                  title={post.title}
                  url={`/insights/${slug}`}
                  description={post.excerpt}
                />
              </div>
            </div>
          </motion.div>

          {/* Related Posts */}
          <RelatedPosts
            currentPostId={post.id}
            category={post.category}
            tags={post.tags}
          />
        </article>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default PostDetail;
