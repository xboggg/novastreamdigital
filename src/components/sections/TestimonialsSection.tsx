import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "NovaStream transformed our digital presence completely. The attention to detail and user experience is exceptional. Our conversion rates have increased by 40%.",
    author: "Sarah Chen",
    role: "CEO",
    company: "Lumina Finance",
  },
  {
    id: 2,
    quote: "Working with NovaStream felt like having an extension of our own team. They understood our vision and delivered beyond expectations.",
    author: "Marcus Rodriguez",
    role: "Founder",
    company: "Artisan Collective",
  },
  {
    id: 3,
    quote: "The web application they built for us has streamlined our entire operation. Clean, intuitive, and incredibly fast. Our patients love it.",
    author: "Dr. Emily Watson",
    role: "Director",
    company: "Zenith Health",
  },
  {
    id: 4,
    quote: "Finally, a team that gets both design and development. The portfolio they created for us is a work of art that actually converts.",
    author: "Alex Kim",
    role: "Creative Director",
    company: "Studio Forma",
  },
];

export const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section 
      className="section-padding bg-surface-overlay"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
            Client Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Trusted by Innovators
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial card */}
          <div className="min-h-[280px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="card-premium p-8 md:p-12 text-center"
              >
                <Quote className="w-10 h-10 text-primary/30 mx-auto mb-6" />
                <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed mb-8">
                  "{testimonials[current].quote}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonials[current].author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'w-8 bg-primary'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
