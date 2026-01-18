import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { JsonLd, createBreadcrumbSchema } from '@/components/JsonLd';

const About = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Us"
        description="Learn about NovaStream Digital - a creative studio dedicated to designing and building exceptional digital experiences for forward-thinking businesses."
        keywords="about NovaStream Digital, digital agency Ghana, web design studio, our story"
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Header */}
        <section className="container-custom mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              We Believe in Digital{' '}
              <span className="gradient-text">Craftsmanship</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              NovaStream Digital is a creative studio dedicated to designing and building 
              exceptional digital experiences for forward-thinking businesses.
            </p>
          </motion.div>
        </section>

        {/* Story */}
        <section className="container-custom mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded with a passion for beautiful, functional design, NovaStream Digital 
                  emerged from a simple belief: every business deserves a digital presence that 
                  truly represents their vision.
                </p>
                <p>
                  We combine strategic thinking with meticulous execution, creating websites 
                  and applications that don't just look stunning—they perform exceptionally.
                </p>
                <p>
                  Our approach is collaborative and transparent. We see ourselves as an 
                  extension of your team, working together to bring your digital vision to life.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl gradient-bg opacity-20" />
              <div className="absolute inset-8 rounded-2xl bg-card border border-border" />
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-surface-overlay section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The principles that guide every project we take on.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Craft Over Speed',
                  description: 'We take the time to do things right. Quality is never sacrificed for deadlines.',
                },
                {
                  title: 'Clarity in Complexity',
                  description: 'We simplify the complex. Every element serves a purpose.',
                },
                {
                  title: 'Partnership, Not Service',
                  description: 'We collaborate deeply with our clients, becoming an extension of their team.',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-premium p-8 text-center"
                >
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-custom section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Work Together?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's create something extraordinary.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="group">
                Start a Conversation
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
