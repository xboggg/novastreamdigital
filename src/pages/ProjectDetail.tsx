import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { JsonLd, createBreadcrumbSchema } from "@/components/JsonLd";
import { SocialShare } from "@/components/SocialShare";
import { OptimizedImage } from "@/components/OptimizedImage";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
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
          <div className="container max-w-4xl mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (error || !project) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
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
    { name: 'Portfolio', url: '/portfolio' },
    { name: project.title, url: `/portfolio/${slug}` },
  ]);

  return (
    <PageTransition>
      <SEO
        title={project.title}
        description={project.description || `View ${project.title} - a project by NovaStream Digital`}
        image={project.image_url}
        keywords={`${project.category}, web design project, ${project.tags?.join(', ') || ''}`}
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <article className="container max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
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
            {project.category && (
              <Badge variant="secondary" className="mb-4">
                {project.category}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-xl text-muted-foreground mb-6">
                {project.description}
              </p>
            )}
            {project.website_url && (
              <Button asChild>
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Live Site
                </a>
              </Button>
            )}
          </motion.header>

          {/* Featured Image */}
          {project.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <OptimizedImage
                src={project.image_url}
                alt={project.title}
                aspectRatio="video"
                containerClassName="rounded-xl"
                priority
              />
            </motion.div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {project.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground"
          >
            {project.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: project.content }}
                className="[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:leading-relaxed [&>ul]:space-y-2 [&>ul]:my-4 [&>ul>li]:ml-4"
              />
            ) : (
              <p className="text-muted-foreground">
                No detailed case study available for this project yet.
              </p>
            )}
          </motion.div>

          {/* Meta and Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-8 border-t"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Published on{" "}
                  {new Date(project.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <SocialShare
                title={project.title}
                url={`/portfolio/${slug}`}
                description={project.description}
              />
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default ProjectDetail;
