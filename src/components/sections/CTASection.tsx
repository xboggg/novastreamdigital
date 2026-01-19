import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ArrowRight, Sparkles, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-bg opacity-10 animate-gradient-flow" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background pointer-events-none" />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb with pulse */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl"
        />

        {/* Additional floating particles */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-1/3 right-1/3 w-3 h-3 bg-accent/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-primary/20 rounded-full blur-sm"
        />
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div
          style={{ scale, opacity }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Glowing card container */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl animate-pulse-glow" />

            <div className="card-3d p-12 md:p-16 text-center relative overflow-hidden">
              {/* Rotating border accent */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-40 h-40 border border-primary/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-20 w-48 h-48 border border-accent/10 rounded-full"
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

              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                Let's Build Together
              </motion.span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 relative">
                Ready to Transform Your{' '}
                <span className="gradient-text text-glow">Digital Presence?</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto relative">
                Let's create something extraordinary together. Share your vision,
                and we'll bring it to life with precision and creativity.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="hero" size="xl" asChild className="animate-pulse-glow">
                    <Link to="/contact" className="group">
                      Start Your Project
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="heroOutline" size="xl" asChild className="hover-lift">
                    <Link to="/pricing">View Pricing</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Bottom decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
