import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  offsetX: number;
  offsetY: number;
  intensity?: number;
  className?: string;
}

export const ParallaxLayer = ({
  children,
  offsetX,
  offsetY,
  intensity = 1,
  className = '',
}: ParallaxLayerProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        x: offsetX * intensity,
        y: offsetY * intensity,
      }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 30,
        mass: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};
