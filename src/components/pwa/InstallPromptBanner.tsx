import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPromptBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');
    const dismissedAt = wasDismissed ? parseInt(wasDismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);

    if (isInstalled || (wasDismissed && daysSinceDismissed < 7)) {
      return;
    }

    // Detect mobile and iOS
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /iphone|ipad|ipod|android|mobile/.test(userAgent);
    const ios = /iphone|ipad|ipod/.test(userAgent);
    
    setIsMobile(mobile);
    setIsIOS(ios);

    // For iOS, show banner after delay (no beforeinstallprompt event)
    if (ios) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // Listen for install prompt on Android/Desktop Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setIsVisible(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  // Only show on mobile or when install prompt is available
  if (!isMobile && !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe"
        >
          <div className="max-w-lg mx-auto bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative p-4 sm:p-5">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <div className="flex items-start gap-4">
                {/* App Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <Smartphone className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="font-semibold text-foreground mb-1">
                    Install NovaStream
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add to home screen for quick access & offline use
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {isIOS ? (
                      <Button size="sm" asChild className="gap-2">
                        <Link to="/install">
                          <Download className="w-4 h-4" />
                          How to Install
                        </Link>
                      </Button>
                    ) : deferredPrompt ? (
                      <Button size="sm" onClick={handleInstall} className="gap-2">
                        <Download className="w-4 h-4" />
                        Install Now
                      </Button>
                    ) : (
                      <Button size="sm" asChild className="gap-2">
                        <Link to="/install">
                          <Download className="w-4 h-4" />
                          Learn More
                        </Link>
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleDismiss}
                      className="text-muted-foreground"
                    >
                      Not now
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 10, ease: 'linear' }}
              className="h-1 bg-primary/20 origin-left"
              onAnimationComplete={() => {
                // Auto-dismiss after 10 seconds
                handleDismiss();
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
