import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Layers, Palette, HeartHandshake, Check } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { JsonLd, createBreadcrumbSchema } from '@/components/JsonLd';

const services = [
  {
    id: 'websites',
    icon: Globe,
    title: 'Website Design & Development',
    description: 'Captivating websites that tell your story and convert visitors into loyal customers.',
    color: 'from-blue-500 to-cyan-400',
    features: [
      'Business & Corporate Websites',
      'Portfolio & Personal Brands',
      'E-commerce Experiences',
      'Landing Pages & Campaigns',
      'Website Redesigns & Modernization',
    ],
  },
  {
    id: 'applications',
    icon: Layers,
    title: 'Web Applications & Platforms',
    description: 'Powerful custom solutions that streamline operations and delight users.',
    color: 'from-violet-500 to-purple-400',
    features: [
      'Booking & Reservation Systems',
      'Custom Dashboards & Admin Panels',
      'Client Portals & Intranets',
      'Internal Business Tools',
      'SaaS Product Development',
    ],
  },
  {
    id: 'design',
    icon: Palette,
    title: 'Visual Identity & Design',
    description: 'Memorable brand identities that communicate your values and resonate with your audience.',
    color: 'from-pink-500 to-rose-400',
    features: [
      'Brand Identity Systems',
      'Logo Design & Guidelines',
      'Marketing & Campaign Materials',
      'Social Media Visual Assets',
      'Presentation Design',
    ],
  },
  {
    id: 'support',
    icon: HeartHandshake,
    title: 'Ongoing Digital Care',
    description: 'Continuous support and optimization to keep your digital presence thriving.',
    color: 'from-emerald-500 to-teal-400',
    features: [
      'Website Maintenance & Updates',
      'Performance Optimization',
      'Security Monitoring',
      'Content Management',
      'Technical Support & Consulting',
    ],
  },
];

const Services = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Our Services"
        description="Comprehensive digital solutions including website design, web applications, brand identity, and ongoing support. Everything you need to thrive online."
        keywords="web design services, web development, web applications, brand identity, digital support, Ghana"
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
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="gradient-text">Thrive Online</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From stunning websites to powerful applications, we provide comprehensive 
              digital solutions tailored to your unique business goals.
            </p>
          </motion.div>
        </section>

        {/* Services List */}
        <section className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="hero" size="lg" asChild>
                    <Link to="/contact" className="group">
                      Get Started
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                {/* Visual placeholder */}
                <div className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className={`aspect-square rounded-3xl bg-gradient-to-br ${service.color} opacity-10`} />
                  <div className="absolute inset-8 rounded-2xl bg-card border border-border flex items-center justify-center">
                    <service.icon className="w-24 h-24 text-muted-foreground/20" />
                  </div>
                </div>
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
            className="card-premium p-12 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your project and find the perfect solution together.
              Every great partnership starts with a conversation.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="group">
                Schedule a Consultation
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

export default Services;
