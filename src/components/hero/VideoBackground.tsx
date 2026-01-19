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
  const [hasError, setHasError] = useState(false);

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
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
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
              onError={handleError}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              style={{
                filter: 'brightness(0.85) saturate(1.2)',
              }}
            />
          </motion.div>

          {/* Fallback gradient background when video fails */}
          {hasError && (
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(135deg, 
                    ${service.colors.primary} 0%, 
                    ${service.colors.secondary} 100%
                  )
                `,
              }}
            />
          )}

          {/* Loading state - show poster */}
          {!isLoaded && !hasError && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${service.posterUrl})`,
                filter: 'brightness(0.85)',
              }}
            />
          )}

          {/* Dark overlay for better video visibility */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Left side gradient for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to right,
                  rgba(0, 0, 0, 0.7) 0%,
                  rgba(0, 0, 0, 0.4) 40%,
                  transparent 70%
                )
              `,
            }}
          />

          {/* Top gradient fade for navbar */}
          <div
            className="absolute inset-x-0 top-0 h-32"
            style={{
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent)',
            }}
          />

          {/* Bottom gradient fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-48"
            style={{
              background: 'linear-gradient(to top, hsl(var(--background)), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
