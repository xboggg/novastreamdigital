import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ArrowRight, Globe, Layers, Palette, HeartHandshake, Check, Sparkles, Rocket } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { JsonLd, createBreadcrumbSchema } from '@/components/JsonLd';

const services = [
  {
    id: 'applications',
    icon: Layers,
    title: 'Custom Web Applications',
    description: 'Enterprise-grade applications built for real-world demands. From government booking systems to business management platforms, we build solutions that scale.',
    color: 'from-violet-500 to-purple-400',
    shadowColor: 'shadow-violet-500/20',
    highlighted: true,
    features: [
      'Booking & Reservation Systems',
      'Staff & Resource Management Platforms',
      'Transport & Fleet Management Systems',
      'Attendance & HR Systems',
      'Custom Dashboards & Admin Panels',
      'Client Portals & Intranets',
      'SaaS Product Development',
    ],
  },
  {
    id: 'websites',
    icon: Globe,
    title: 'Website Design & Development',
    description: 'Captivating websites that tell your story and convert visitors into loyal customers. Mobile-responsive, fast, and built for results.',
    color: 'from-blue-500 to-cyan-400',
    shadowColor: 'shadow-blue-500/20',
    highlighted: false,
    features: [
      'Business & Corporate Websites',
      'NGO & Non-Profit Websites',
      'Portfolio & Personal Brands',
      'E-commerce Experiences',
      'Landing Pages & Campaigns',
      'Website Redesigns & Modernization',
    ],
  },
  {
    id: 'design',
    icon: Palette,
    title: 'Visual Identity & Design',
    description: 'Memorable brand identities that communicate your values and resonate with your audience. From logos to complete brand systems.',
    color: 'from-pink-500 to-rose-400',
    shadowColor: 'shadow-pink-500/20',
    highlighted: false,
    features: [
      'Logo Design & Brand Guidelines',
      'Brand Identity Systems',
      'Marketing & Campaign Materials',
      'Social Media Visual Assets',
      'Presentation Design',
      'Print Design (Letterheads, Posters, Flyers)',
    ],
  },
  {
    id: 'support',
    icon: HeartHandshake,
    title: 'Ongoing Digital Care',
    description: 'Continuous support and optimization to keep your digital presence thriving. We become an extension of your team.',
    color: 'from-emerald-500 to-teal-400',
    shadowColor: 'shadow-emerald-500/20',
    highlighted: false,
    features: [
      'Website Maintenance & Updates',
      'Performance Optimization',
      'Security Monitoring & Updates',
      'Content Management',
      'Technical Support & Consulting',
      'Training & Documentation',
    ],
  },
];

const Services = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div className="min-h-screen bg-background overflow-hidden" ref={containerRef}>
      <SEO
        title="Our Services"
        description="Custom web applications, website design, and branding services in Ghana. From booking systems to business management platforms, we build solutions that scale."
        keywords="custom web applications Ghana, booking systems, management platforms, web design Accra, website development, brand identity, digital agency Ghana"
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl animate-float-slow"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl blob"
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
              Our Services
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="gradient-text text-glow">Thrive Online</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From stunning websites to powerful applications, we provide comprehensive
              digital solutions tailored to your unique business goals.
            </p>
          </motion.div>
        </section>

        {/* Services List */}
        <section className="container-custom">
          <div className="space-y-32">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`grid md:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  {/* Highlighted badge */}
                  {service.highlighted && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-pulse-glow"
                    >
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Our Specialty
                    </motion.div>
                  )}

                  {/* Icon with animation */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6 shadow-lg ${service.shadowColor}`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features with stagger animation */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + featureIndex * 0.05 }}
                        className="flex items-center gap-3 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 shadow-md ${service.shadowColor}`}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                        <span className="text-foreground group-hover:text-primary transition-colors">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="hero" size="lg" asChild className="group">
                      <Link to="/contact">
                        Get Started
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Enhanced visual card */}
                <motion.div
                  className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glow effect behind */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 blur-3xl rounded-full`} />

                  {/* Floating decorative elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br ${service.color} opacity-30 rounded-2xl blur-sm`}
                  />
                  <motion.div
                    animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-6 -left-6 w-12 h-12 bg-accent/20 rounded-full blur-sm"
                  />

                  <div className={`aspect-square rounded-3xl bg-gradient-to-br ${service.color} opacity-10 animate-breathe`} />
                  <div className="absolute inset-8 rounded-2xl card-3d flex items-center justify-center overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />

                    <motion.div
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <service.icon className={`w-24 h-24 text-muted-foreground/20`} />
                    </motion.div>

                    {/* Orbiting dot */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${service.color} absolute top-8 shadow-lg`} />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container-custom mt-32">
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
              {/* Rotating decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-32 h-32 border border-primary/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-40 h-40 border border-accent/10 rounded-full"
              />

              {/* Floating icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-8 shadow-lg shadow-primary/20"
              >
                <Rocket className="w-8 h-8 text-white animate-bounce" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
                Not Sure Which Service You <span className="gradient-text">Need?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto relative">
                Let's discuss your project and find the perfect solution together.
                Every great partnership starts with a conversation.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero" size="xl" asChild className="animate-pulse-glow">
                  <Link to="/contact" className="group">
                    Schedule a Consultation
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
