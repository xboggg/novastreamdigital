import { useState, useEffect, useCallback } from 'react';

interface MouseParallax {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export const useMouseParallax = (sensitivity: number = 1): MouseParallax => {
  const [position, setPosition] = useState<MouseParallax>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate position relative to center of viewport
    const x = (clientX - innerWidth / 2) * sensitivity;
    const y = (clientY - innerHeight / 2) * sensitivity;
    
    // Normalized values between -1 and 1
    const normalizedX = ((clientX / innerWidth) * 2 - 1) * sensitivity;
    const normalizedY = ((clientY / innerHeight) * 2 - 1) * sensitivity;
    
    setPosition({ x, y, normalizedX, normalizedY });
  }, [sensitivity]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove]);

  return position;
};
