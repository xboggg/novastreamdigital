import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'novastream_cookie_consent';

type ConsentType = 'all' | 'essential' | null;

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (type: ConsentType) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      type,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);

    // If accepting all cookies, you could initialize analytics here
    if (type === 'all') {
      // Initialize analytics, marketing cookies, etc.
      console.log('All cookies accepted');
    }
  };

  const handleDecline = () => {
    handleAccept('essential');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container-custom">
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-12 h-12 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                    <button
                      onClick={handleDecline}
                      className="text-muted-foreground hover:text-foreground transition-colors sm:hidden"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies.{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Learn more
                    </Link>
                  </p>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-4"
                      >
                        <div className="space-y-3 py-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Essential Cookies</p>
                              <p className="text-sm text-muted-foreground">Required for basic website functionality</p>
                            </div>
                            <span className="text-sm text-muted-foreground">Always Active</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Analytics Cookies</p>
                              <p className="text-sm text-muted-foreground">Help us understand how visitors use our site</p>
                            </div>
                            <span className="text-sm text-muted-foreground">Optional</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Marketing Cookies</p>
                              <p className="text-sm text-muted-foreground">Used to deliver relevant advertisements</p>
                            </div>
                            <span className="text-sm text-muted-foreground">Optional</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                      className="order-3 sm:order-1"
                    >
                      {showDetails ? 'Hide Details' : 'Cookie Settings'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDecline}
                      className="order-2"
                    >
                      Essential Only
                    </Button>
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => handleAccept('all')}
                      className="order-1 sm:order-3"
                    >
                      Accept All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
