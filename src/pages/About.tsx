import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ArrowRight, Award, Users, Zap, Heart, Sparkles } from 'lucide-react';
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

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-background overflow-hidden" ref={containerRef}>
      <SEO
        title="About Us"
        description="Learn about NovaStream Digital - a Ghana-based digital agency specializing in custom websites and web applications for businesses, NGOs, and government institutions."
        keywords="about NovaStream Digital, digital agency Ghana, web design Accra, founder story"
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/3 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float-slow"
        />
        <motion.div
          style={{ y: y3 }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl blob"
        />
      </div>

      <main className="pt-32 pb-20 relative">
        {/* Header */}
        <section className="container-custom mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              About Us
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Building Digital Solutions{' '}
              <span className="gradient-text text-glow">That Matter</span>
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
                  We leverage modern technologies and streamlined development processes to deliver
                  high-quality solutions efficiently, without compromising on craftsmanship or
                  attention to detail.
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
              {/* Floating decorative elements */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 w-20 h-20 bg-primary/20 rounded-2xl blur-sm"
              />
              <motion.div
                animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 w-16 h-16 bg-accent/20 rounded-full blur-sm"
              />

              <div className="aspect-square rounded-3xl gradient-bg opacity-20 animate-breathe" />
              <div className="absolute inset-8 rounded-2xl glass-premium flex items-center justify-center animate-pulse-glow">
                <div className="text-center p-8">
                  <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 mx-auto mb-4 flex items-center justify-center animate-breathe"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-4xl font-bold gradient-text">NS</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-1">NovaStream Digital</h3>
                  <p className="text-muted-foreground text-sm">Founder & Lead Developer</p>
                  <p className="text-primary text-sm mt-2">Accra, Ghana</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What We Do Best */}
        <section className="bg-surface-overlay/50 backdrop-blur-sm section-padding relative">
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="container-custom relative">
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
                  color: 'from-blue-500 to-cyan-400',
                },
                {
                  icon: Award,
                  title: 'Government Experience',
                  description: 'Our systems serve critical government functions, proving our reliability and technical capability.',
                  color: 'from-violet-500 to-purple-400',
                },
                {
                  icon: Users,
                  title: 'Client Partnership',
                  description: 'We work as an extension of your team, not just a service provider. Your success is our success.',
                  color: 'from-emerald-500 to-teal-400',
                },
                {
                  icon: Heart,
                  title: 'Local Understanding',
                  description: 'Based in Ghana, we understand local business needs, payment methods, and user expectations.',
                  color: 'from-rose-500 to-pink-400',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card-3d p-8 text-center group cursor-pointer"
                >
                  <motion.div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="section-padding relative">
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
                  gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
                },
                {
                  title: 'Transparency Always',
                  description: 'No hidden costs, no surprises. We communicate clearly and keep you informed throughout.',
                  gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
                },
                {
                  title: 'Results That Matter',
                  description: 'A beautiful website means nothing if it doesn\'t help your business grow. We focus on outcomes.',
                  gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="card-3d p-8 relative">
                    <motion.div
                      className="text-6xl font-bold gradient-text mb-4 opacity-50 group-hover:opacity-100 transition-opacity"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries We Serve */}
        <section className="bg-surface-overlay/50 backdrop-blur-sm section-padding relative overflow-hidden">
          {/* Animated background orbs */}
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-20 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-60 h-60 bg-accent/5 rounded-full blur-3xl"
          />

          <div className="container-custom relative">
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
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="px-6 py-3 rounded-full glass-premium text-sm font-medium cursor-default hover:border-primary/50 transition-all duration-300"
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
            className="relative"
          >
            {/* Glow effect behind CTA */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl animate-pulse-glow" />

            <div className="card-3d p-12 md:p-16 text-center relative overflow-hidden">
              {/* Animated particles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-10 right-10 w-20 h-20 border border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-10 left-10 w-32 h-32 border border-accent/20 rounded-full"
              />

              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
                Ready to Build Something <span className="gradient-text">Great?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto relative">
                Whether you need a simple website or a complex custom application,
                we're here to help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
                <Button variant="hero" size="xl" asChild className="group animate-pulse-glow">
                  <Link to="/contact">
                    Start a Conversation
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild className="hover-lift">
                  <Link to="/portfolio">
                    View Our Work
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
