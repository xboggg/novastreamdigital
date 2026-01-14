import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const articles = [
  {
    id: 1,
    title: 'The Art of Digital Minimalism in Web Design',
    excerpt: 'How simplicity and intentionality create more impactful digital experiences.',
    category: 'Design',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop',
    date: 'Jan 10, 2026',
  },
  {
    id: 2,
    title: 'Building Performant Web Applications in 2026',
    excerpt: 'Modern techniques and best practices for lightning-fast web apps.',
    category: 'Development',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    date: 'Jan 5, 2026',
  },
  {
    id: 3,
    title: 'Why Your Brand Needs a Digital Experience Strategy',
    excerpt: 'Beyond websites: creating cohesive digital touchpoints for your audience.',
    category: 'Strategy',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    date: 'Dec 28, 2025',
  },
  {
    id: 4,
    title: 'The Psychology of Micro-Interactions',
    excerpt: 'Small details that make a big difference in user engagement.',
    category: 'UX Design',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    date: 'Dec 20, 2025',
  },
];

const Insights = () => {
  return (
    <div className="min-h-screen bg-background">
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
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/insights/${article.id}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/2] mb-6">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {article.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Read Article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Insights;
