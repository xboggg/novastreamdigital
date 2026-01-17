import { motion } from 'framer-motion';
import { heroServices } from './heroData';

interface HeroNavigationProps {
  activeIndex: number;
  onNavigate: (index: number) => void;
  progress: number;
}

export const HeroNavigation = ({ activeIndex, onNavigate, progress }: HeroNavigationProps) => {
  return (
    <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
      {heroServices.map((service, index) => {
        const isActive = index === activeIndex;
        const Icon = service.icon;
        
        return (
          <button
            key={service.id}
            onClick={() => onNavigate(index)}
            className="group relative flex items-center justify-end gap-3"
            aria-label={`Go to ${service.title}`}
          >
            {/* Label on hover */}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="hidden md:block text-sm font-medium text-white/80 whitespace-nowrap"
            >
              {service.title.split(' ')[0]}
            </motion.span>
            
            {/* Dot indicator */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Background glow */}
              {isActive && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{ 
                    background: service.colors.gradient,
                    filter: 'blur(8px)',
                  }}
                />
              )}
              
              {/* Progress ring */}
              {isActive && (
                <svg className="absolute inset-0 w-12 h-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={126}
                    strokeDashoffset={126 - (126 * progress)}
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                  />
                </svg>
              )}
              
              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.7,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <Icon 
                  className="w-5 h-5 text-white transition-colors"
                  style={{ 
                    filter: isActive ? `drop-shadow(0 0 8px ${service.colors.primary})` : 'none' 
                  }}
                />
              </motion.div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
