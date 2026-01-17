import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { heroServices } from '@/components/hero/heroData';
import { VideoBackground } from '@/components/hero/VideoBackground';
import { HeroSlide } from '@/components/hero/HeroSlide';
import { HeroNavigation } from '@/components/hero/HeroNavigation';

const SLIDE_DURATION = 6000; // 6 seconds per slide
const PROGRESS_INTERVAL = 50; // Update progress every 50ms

export const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { x, y } = useMouseParallax(1);

  // Auto-rotate slides
  useEffect(() => {
    if (isPaused) return;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (PROGRESS_INTERVAL / SLIDE_DURATION);
        if (next >= 1) {
          setActiveIndex((current) => (current + 1) % heroServices.length);
          return 0;
        }
        return next;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(progressTimer);
  }, [isPaused]);

  // Handle navigation
  const handleNavigate = useCallback((index: number) => {
    setActiveIndex(index);
    setProgress(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigate((activeIndex + 1) % heroServices.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigate((activeIndex - 1 + heroServices.length) % heroServices.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleNavigate]);

  const activeService = heroServices[activeIndex];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Video backgrounds */}
      {heroServices.map((service, index) => (
        <VideoBackground
          key={service.id}
          service={service}
          isActive={index === activeIndex}
          mouseX={x}
          mouseY={y}
        />
      ))}

      {/* Content slides */}
      <AnimatePresence mode="wait">
        <HeroSlide
          key={activeService.id}
          service={activeService}
          isActive={true}
          mouseX={x}
          mouseY={y}
        />
      </AnimatePresence>

      {/* Navigation */}
      <HeroNavigation
        activeIndex={activeIndex}
        onNavigate={handleNavigate}
        progress={progress}
      />

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full"
            style={{
              background: activeService.colors.gradient,
              width: `${progress * 100}%`,
            }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </motion.div>
      </motion.div>

      {/* Service counter */}
      <div className="absolute bottom-12 left-6 md:left-10 z-30 hidden md:flex items-center gap-4">
        <span className="text-5xl font-bold text-white/20">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <div className="h-12 w-px bg-white/20" />
        <span className="text-sm text-white/50 uppercase tracking-widest">
          {String(heroServices.length).padStart(2, '0')} Services
        </span>
      </div>
    </section>
  );
};
