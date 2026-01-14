import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const categories = ['All', 'Business', 'E-commerce', 'Applications', 'Portfolio', 'Blogs'];

const projects = [
  {
    id: 1,
    title: 'Lumina Finance',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=450&fit=crop',
    description: 'Corporate website for a leading financial advisory firm.',
  },
  {
    id: 2,
    title: 'Artisan Collective',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=450&fit=crop',
    description: 'E-commerce platform for handcrafted goods marketplace.',
  },
  {
    id: 3,
    title: 'Zenith Health',
    category: 'Applications',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=450&fit=crop',
    description: 'Patient portal and booking system for healthcare provider.',
  },
  {
    id: 4,
    title: 'Studio Forma',
    category: 'Portfolio',
    image: 'https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=600&h=450&fit=crop',
    description: 'Minimalist portfolio for an architecture studio.',
  },
  {
    id: 5,
    title: 'TechFlow SaaS',
    category: 'Applications',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=450&fit=crop',
    description: 'Dashboard and admin panel for project management tool.',
  },
  {
    id: 6,
    title: 'Gourmet Kitchen',
    category: 'Blogs',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=450&fit=crop',
    description: 'Recipe blog and culinary content platform.',
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Header */}
        <section className="container-custom mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Our Work
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Featured{' '}
              <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A curated selection of our finest work across industries and platforms.
            </p>
          </motion.div>
        </section>

        {/* Filter */}
        <section className="container-custom mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Projects Grid */}
        <section className="container-custom">
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/portfolio/${project.id}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
