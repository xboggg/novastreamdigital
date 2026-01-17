import { motion, type Easing } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroService } from './heroData';
import { ParallaxLayer } from './ParallaxLayer';

interface HeroSlideProps {
  service: HeroService;
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}

const easeOutCubic: Easing = [0.25, 0.46, 0.45, 0.94];
const easeInOut: Easing = [0.42, 0, 0.58, 1];
const easeOut: Easing = [0, 0, 0.2, 1];

const contentVariants = {
  hidden: { 
    opacity: 0, 
    x: -60,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: easeOutCubic,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: 60,
    filter: 'blur(10px)',
    transition: {
      duration: 0.5,
      ease: easeInOut,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
  exit: { opacity: 0, y: -20 },
};

export const HeroSlide = ({ service, isActive, mouseX, mouseY }: HeroSlideProps) => {
  const Icon = service.icon;
  
  if (!isActive) return null;

  return (
    <motion.div
      key={service.id}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 flex items-center"
    >
      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-3xl">
          {/* Service indicator */}
          <ParallaxLayer offsetX={mouseX} offsetY={mouseY} intensity={0.02}>
            <motion.div variants={itemVariants} className="mb-6">
              <span 
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10"
                style={{ 
                  background: `linear-gradient(135deg, ${service.colors.primary}20, ${service.colors.secondary}10)`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: service.colors.primary }} />
                <span className="text-sm font-medium text-white/90">{service.tagline}</span>
              </span>
            </motion.div>
          </ParallaxLayer>

          {/* Main headline */}
          <ParallaxLayer offsetX={mouseX} offsetY={mouseY} intensity={0.01}>
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white"
              style={{
                textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              }}
            >
              {service.title.split(' ').map((word, i) => (
                <span key={i}>
                  {i === service.title.split(' ').length - 1 ? (
                    <span 
                      className="inline-block"
                      style={{ 
                        background: service.colors.gradient.replace('0.8', '1').replace('0.6', '1'),
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {word}
                    </span>
                  ) : (
                    <>{word} </>
                  )}
                </span>
              ))}
            </motion.h1>
          </ParallaxLayer>

          {/* Description */}
          <ParallaxLayer offsetX={mouseX} offsetY={mouseY} intensity={0.015}>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed"
            >
              {service.description}
            </motion.p>
          </ParallaxLayer>

          {/* CTA Buttons */}
          <ParallaxLayer offsetX={mouseX} offsetY={mouseY} intensity={0.02}>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button 
                size="xl" 
                asChild
                className="group relative overflow-hidden"
                style={{
                  background: service.colors.gradient,
                  border: 'none',
                }}
              >
                <Link to={service.cta.link}>
                  <span className="relative z-10 flex items-center gap-2">
                    {service.cta.text}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button 
                variant="heroOutline" 
                size="xl" 
                asChild
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link to="/contact">Start a Project</Link>
              </Button>
            </motion.div>
          </ParallaxLayer>
        </div>
      </div>

      {/* Floating decorative elements */}
      <ParallaxLayer 
        offsetX={mouseX} 
        offsetY={mouseY} 
        intensity={0.08}
        className="absolute top-1/4 right-1/4 hidden lg:block"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${service.colors.primary}40, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
      </ParallaxLayer>
      
      <ParallaxLayer 
        offsetX={mouseX} 
        offsetY={mouseY} 
        intensity={0.06}
        className="absolute bottom-1/3 right-1/3 hidden lg:block"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-48 h-48 rounded-full"
          style={{
            background: `radial-gradient(circle, ${service.colors.secondary}30, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer 
        offsetX={mouseX} 
        offsetY={mouseY} 
        intensity={0.1}
        className="absolute top-1/2 right-[15%] hidden xl:block"
      >
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="w-20 h-20 border border-white/10 rounded-2xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${service.colors.primary}10, transparent)`,
          }}
        />
      </ParallaxLayer>
    </motion.div>
  );
};
