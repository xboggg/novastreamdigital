import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: 1,
    title: 'Lumina Finance',
    category: 'Corporate Website',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    color: 'from-blue-600/20 to-cyan-600/20',
  },
  {
    id: 2,
    title: 'Artisan Collective',
    category: 'E-commerce Platform',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
    color: 'from-violet-600/20 to-purple-600/20',
  },
  {
    id: 3,
    title: 'Zenith Health',
    category: 'Web Application',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
    color: 'from-emerald-600/20 to-teal-600/20',
  },
  {
    id: 4,
    title: 'Studio Forma',
    category: 'Portfolio Website',
    image: 'https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=800&h=600&fit=crop',
    color: 'from-rose-600/20 to-pink-600/20',
  },
];

export const FeaturedWorkSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  return (
    <section ref={containerRef} className="section-padding overflow-hidden">
      <div className="container-custom mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Selected Work
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Featured Projects
            </h2>
          </div>
          <Button variant="heroOutline" size="lg" asChild>
            <Link to="/portfolio" className="group">
              Explore Portfolio
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Horizontal scroll gallery */}
      <motion.div style={{ x }} className="flex gap-6 pl-4 md:pl-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex-shrink-0 w-[300px] md:w-[400px] lg:w-[500px]"
          >
            <Link to={`/portfolio/${project.id}`}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                {/* Image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-sm text-muted-foreground mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
