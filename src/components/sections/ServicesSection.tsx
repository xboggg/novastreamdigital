import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ArrowRight, Globe, Layers, Palette, HeartHandshake, Sparkles } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Website Design & Development',
    description: 'Captivating business websites, portfolios, and e-commerce experiences that convert visitors into customers.',
    color: 'from-blue-500 to-cyan-400',
    shadowColor: 'shadow-blue-500/20',
    link: '/services#websites',
  },
  {
    icon: Layers,
    title: 'Web Applications',
    description: 'Powerful dashboards, booking systems, and custom platforms that streamline your business operations.',
    color: 'from-violet-500 to-purple-400',
    shadowColor: 'shadow-violet-500/20',
    link: '/services#applications',
    featured: true,
  },
  {
    icon: Palette,
    title: 'Visual Identity & Design',
    description: 'Memorable brand identities, marketing materials, and social media visuals that tell your story.',
    color: 'from-pink-500 to-rose-400',
    shadowColor: 'shadow-pink-500/20',
    link: '/services#design',
  },
  {
    icon: HeartHandshake,
    title: 'Consulting & Support',
    description: 'Continuous updates, performance optimization, and support to keep your digital presence thriving.',
    color: 'from-emerald-500 to-teal-400',
    shadowColor: 'shadow-emerald-500/20',
    link: '/services#support',
  },
];

export const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl"
      />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            What We Do
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Crafting Digital <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From concept to launch, we deliver comprehensive digital solutions
            tailored to your unique vision and business goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={service.link}>
                <motion.div
                  className={`card-3d p-8 h-full relative overflow-hidden ${service.featured ? 'ring-2 ring-primary/20' : ''}`}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Featured badge */}
                  {service.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                      Popular
                    </div>
                  )}

                  {/* Animated gradient glow on hover */}
                  <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-15 blur-3xl transition-all duration-700 pointer-events-none -translate-y-10 group-hover:translate-y-0`} />

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  <div className="relative z-10">
                    {/* Icon with breathing animation */}
                    <motion.div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6 shadow-lg ${service.shadowColor}`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <service.icon className="w-6 h-6 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Link with animated arrow */}
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <span className="relative">
                        Learn more
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                      </span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${service.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-tl-full`} />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
