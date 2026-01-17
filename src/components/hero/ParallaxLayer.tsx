import { motion, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useMemo } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  offsetX: number;
  offsetY: number;
  intensity?: number;
  className?: string;
  smoothness?: 'low' | 'medium' | 'high';
}

const smoothnessConfig = {
  low: { stiffness: 100, damping: 20 },
  medium: { stiffness: 50, damping: 25 },
  high: { stiffness: 25, damping: 30 },
};

export const ParallaxLayer = ({
  children,
  offsetX,
  offsetY,
  intensity = 1,
  className = '',
  smoothness = 'medium',
}: ParallaxLayerProps) => {
  const config = smoothnessConfig[smoothness];
  
  const springX = useSpring(offsetX * intensity, {
    stiffness: config.stiffness,
    damping: config.damping,
    mass: 0.8,
  });
  
  const springY = useSpring(offsetY * intensity, {
    stiffness: config.stiffness,
    damping: config.damping,
    mass: 0.8,
  });

  // Update spring values when offsets change
  useMemo(() => {
    springX.set(offsetX * intensity);
    springY.set(offsetY * intensity);
  }, [offsetX, offsetY, intensity, springX, springY]);

  return (
    <motion.div
      className={className}
      style={{
        x: springX,
        y: springY,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
};
