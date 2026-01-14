import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Layers, Palette, HeartHandshake } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Website Design & Development',
    description: 'Captivating business websites, portfolios, and e-commerce experiences that convert visitors into customers.',
    color: 'from-blue-500 to-cyan-400',
    link: '/services#websites',
  },
  {
    icon: Layers,
    title: 'Web Applications',
    description: 'Powerful dashboards, booking systems, and custom platforms that streamline your business operations.',
    color: 'from-violet-500 to-purple-400',
    link: '/services#applications',
  },
  {
    icon: Palette,
    title: 'Visual Identity & Design',
    description: 'Memorable brand identities, marketing materials, and social media visuals that tell your story.',
    color: 'from-pink-500 to-rose-400',
    link: '/services#design',
  },
  {
    icon: HeartHandshake,
    title: 'Ongoing Digital Care',
    description: 'Continuous updates, performance optimization, and support to keep your digital presence thriving.',
    color: 'from-emerald-500 to-teal-400',
    link: '/services#support',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export const ServicesSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-overlay/50 to-background pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Crafting Digital Excellence
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From concept to launch, we deliver comprehensive digital solutions 
            tailored to your unique vision and business goals.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group"
            >
              <Link to={service.link}>
                <div className="card-premium p-8 h-full relative overflow-hidden">
                  {/* Gradient glow on hover */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 pointer-events-none`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-6`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Link */}
                    <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
