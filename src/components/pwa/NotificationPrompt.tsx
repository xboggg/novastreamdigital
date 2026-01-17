import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const NotificationPrompt = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const { isSupported, permission, isSubscribed, isLoading, subscribe } = usePushNotifications();

  // Don't show if not supported, already subscribed, or denied
  if (!isSupported || isSubscribed || permission === 'denied' || !isVisible) {
    return null;
  }

  const handleSubscribe = async () => {
    const subscription = await subscribe();
    if (subscription) {
      setShowSuccess(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('notification-prompt-dismissed', Date.now().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-4 z-50 max-w-sm"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative p-5">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="font-medium text-green-500">Notifications enabled!</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-6">
                      <h3 className="font-semibold text-foreground mb-1">
                        Stay Updated
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get notified about new projects, insights, and special offers.
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSubscribe}
                          disabled={isLoading}
                          className="gap-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                          Enable
                        </Button>
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
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Settings toggle component for notification preferences
export const NotificationToggle = () => {
  const { isSupported, permission, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
        <BellOff className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">Notifications not supported</p>
          <p className="text-xs text-muted-foreground">Your browser doesn't support push notifications</p>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10">
        <BellOff className="w-5 h-5 text-destructive" />
        <div>
          <p className="font-medium text-sm text-destructive">Notifications blocked</p>
          <p className="text-xs text-muted-foreground">Enable notifications in your browser settings</p>
        </div>
      </div>
    );
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {isSubscribed ? (
          <Bell className="w-5 h-5 text-primary" />
        ) : (
          <BellOff className="w-5 h-5 text-muted-foreground" />
        )}
        <div className="text-left">
          <p className="font-medium text-sm">Push Notifications</p>
          <p className="text-xs text-muted-foreground">
            {isSubscribed ? 'You will receive updates' : 'Get notified about new content'}
          </p>
        </div>
      </div>
      
      <div className={`relative w-11 h-6 rounded-full transition-colors ${isSubscribed ? 'bg-primary' : 'bg-muted'}`}>
        {isLoading ? (
          <Loader2 className="absolute top-1 left-1 w-4 h-4 animate-spin text-primary-foreground" />
        ) : (
          <motion.div
            animate={{ x: isSubscribed ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow"
          />
        )}
      </div>
    </button>
  );
};
