import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { HeroService } from './heroData';

interface VideoBackgroundProps {
  service: HeroService;
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}

export const VideoBackground = ({ service, isActive, mouseX, mouseY }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked, that's okay
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  // Calculate subtle parallax offset for background
  const translateX = mouseX * 0.02;
  const translateY = mouseY * 0.02;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={service.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 overflow-hidden"
        >
          {/* Video element */}
          <motion.div
            className="absolute inset-[-5%] w-[110%] h-[110%]"
            animate={{
              x: translateX,
              y: translateY,
            }}
            transition={{
              type: 'spring',
              stiffness: 30,
              damping: 30,
            }}
          >
            <video
              ref={videoRef}
              src={service.videoUrl}
              poster={service.posterUrl}
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={handleLoadedData}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              style={{
                filter: 'brightness(0.7) saturate(1.1)',
              }}
            />
          </motion.div>

          {/* Loading state - show poster with gradient */}
          {!isLoaded && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${service.posterUrl})` }}
            />
          )}

          {/* Color gradient overlay - reduced opacity */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, 
                  ${service.colors.primary}50 0%, 
                  ${service.colors.secondary}30 50%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'multiply',
            }}
          />

          {/* Secondary gradient for depth - reduced opacity */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to right, 
                  hsl(var(--background)) 0%,
                  hsl(var(--background) / 0.5) 25%,
                  transparent 50%
                )
              `,
            }}
          />

          {/* Top gradient fade */}
          <div 
            className="absolute inset-x-0 top-0 h-40"
            style={{
              background: 'linear-gradient(to bottom, hsl(var(--background)), transparent)',
            }}
          />

          {/* Bottom gradient fade */}
          <div 
            className="absolute inset-x-0 bottom-0 h-60"
            style={{
              background: 'linear-gradient(to top, hsl(var(--background)), transparent)',
            }}
          />

          {/* Vignette effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.6) 100%)',
            }}
          />

          {/* Noise texture overlay */}
          <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
