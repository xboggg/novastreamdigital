import { motion } from 'framer-motion';

export const PhilosophySection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-primary uppercase tracking-wider mb-8 block"
          >
            Our Philosophy
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-8"
          >
            <span className="gradient-text">Design is not decoration.</span>
            <br />
            <span className="text-muted-foreground">Technology is not noise.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Every pixel serves a purpose. Every interaction tells a story. 
            We believe in digital experiences that feel inevitable—where form 
            and function merge into something truly meaningful.
          </motion.p>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 flex justify-center gap-4"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 0.3,
                  ease: 'easeInOut'
                }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
