import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Award, Users, ThumbsUp, Sparkles } from 'lucide-react';

const stats = [
  { value: 25, suffix: '+', label: 'Projects Delivered', icon: TrendingUp, color: 'from-blue-500 to-cyan-400' },
  { value: 5, suffix: '+', label: 'Years Experience', icon: Award, color: 'from-violet-500 to-purple-400' },
  { value: 15, suffix: '+', label: 'Happy Clients', icon: Users, color: 'from-emerald-500 to-teal-400' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', icon: ThumbsUp, color: 'from-rose-500 to-pink-400' },
];

const AnimatedCounter = ({
  value,
  suffix,
  isInView
}: {
  value: number;
  suffix: string;
  isInView: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return (
    <span className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text text-glow">
      {count}{suffix}
    </span>
  );
};

export const StatsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="section-padding bg-surface-overlay/50 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        style={{ y }}
        className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-float-slow"
      />

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            Our Track Record
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Businesses <span className="gradient-text">Across Ghana</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've helped organizations from startups to government institutions build their digital presence.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="card-3d p-6 md:p-8 text-center relative overflow-hidden">
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />

                {/* Icon */}
                <motion.div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </motion.div>

                {/* Counter */}
                <div className="mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isInView={isInView}
                  />
                </div>

                <p className="text-muted-foreground text-sm md:text-base group-hover:text-foreground transition-colors">
                  {stat.label}
                </p>

                {/* Progress bar animation */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} origin-left`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
