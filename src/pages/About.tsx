import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Zap, Heart } from 'lucide-react';
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
        description="Learn about NovaStream Digital - a Ghana-based digital agency specializing in custom websites and web applications for businesses, NGOs, and government institutions."
        keywords="about NovaStream Digital, digital agency Ghana, web design Accra, founder story"
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
              Building Digital Solutions{' '}
              <span className="gradient-text">That Matter</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're a Ghana-based digital agency passionate about creating powerful
              websites and custom applications that help organizations thrive in the digital age.
            </p>
          </motion.div>
        </section>

        {/* Founder Section */}
        <section className="container-custom mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
                Our Story
              </span>
              <h2 className="text-3xl font-bold mb-6">
                From Government Systems to Business Solutions
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NovaStream Digital was founded with a vision to bring enterprise-level
                  digital solutions to businesses of all sizes in Ghana and beyond.
                </p>
                <p>
                  With experience building critical systems for government institutions—including
                  booking and management platforms for the Controller & Accountant General's
                  Department—we understand what it takes to create reliable, scalable solutions
                  that handle real-world demands.
                </p>
                <p>
                  We leverage modern technologies and AI-assisted development to deliver
                  high-quality solutions faster than traditional agencies, without compromising
                  on craftsmanship or attention to detail.
                </p>
                <p>
                  Whether you're a startup looking for your first website, an NGO needing a
                  donation platform, or an enterprise requiring custom management systems,
                  we bring the same level of dedication and expertise to every project.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-1 md:order-2"
            >
              <div className="aspect-square rounded-3xl gradient-bg opacity-20" />
              <div className="absolute inset-8 rounded-2xl bg-card border border-border flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold gradient-text">NS</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">NovaStream Digital</h3>
                  <p className="text-muted-foreground text-sm">Founder & Lead Developer</p>
                  <p className="text-primary text-sm mt-2">Accra, Ghana</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What We Do Best */}
        <section className="bg-surface-overlay section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Sets Us Apart</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We're not just another web design agency. Here's why organizations trust us with their digital presence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Zap,
                  title: 'Custom Applications',
                  description: 'We build what templates can\'t—booking systems, management platforms, and custom tools tailored to your needs.',
                },
                {
                  icon: Award,
                  title: 'Government Experience',
                  description: 'Our systems serve critical government functions, proving our reliability and technical capability.',
                },
                {
                  icon: Users,
                  title: 'Client Partnership',
                  description: 'We work as an extension of your team, not just a service provider. Your success is our success.',
                },
                {
                  icon: Heart,
                  title: 'Local Understanding',
                  description: 'Based in Ghana, we understand local business needs, payment methods, and user expectations.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-premium p-8 text-center"
                >
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="section-padding">
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
                  title: 'Quality Over Speed',
                  description: 'We take the time to do things right. Every line of code, every pixel, every interaction matters.',
                },
                {
                  title: 'Transparency Always',
                  description: 'No hidden costs, no surprises. We communicate clearly and keep you informed throughout.',
                },
                {
                  title: 'Results That Matter',
                  description: 'A beautiful website means nothing if it doesn\'t help your business grow. We focus on outcomes.',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-premium p-8"
                >
                  <div className="text-5xl font-bold gradient-text mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries We Serve */}
        <section className="bg-surface-overlay section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We've worked with organizations across diverse sectors, understanding the unique needs of each.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Government & Public Sector',
                'Healthcare & Medical',
                'Non-Profit & NGOs',
                'Engineering & Construction',
                'Education & Training',
                'Finance & Insurance',
                'Entertainment & Media',
                'E-commerce & Retail',
              ].map((industry, index) => (
                <motion.span
                  key={industry}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-6 py-3 rounded-full bg-card border border-border text-sm font-medium"
                >
                  {industry}
                </motion.span>
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
            className="card-premium p-12 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Something Great?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you need a simple website or a complex custom application,
              we're here to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact" className="group">
                  Start a Conversation
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/portfolio">
                  View Our Work
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
