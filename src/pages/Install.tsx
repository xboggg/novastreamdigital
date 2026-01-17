import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Smartphone, Monitor, Share, PlusSquare, MoreVertical, Download, Chrome, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect device
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Install App</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Install NovaStream Digital
            </h1>
            <p className="text-lg text-muted-foreground">
              Add our app to your home screen for quick access, offline capabilities, and a native app experience.
            </p>
          </motion.div>

          {/* Already Installed Message */}
          {isInstalled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mb-12 p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-green-500 mb-2">Already Installed!</h3>
              <p className="text-muted-foreground">
                You're already using the installed version of our app.
              </p>
            </motion.div>
          )}

          {/* Quick Install Button (for supported browsers) */}
          {deferredPrompt && !isInstalled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-12"
            >
              <Button
                size="xl"
                onClick={handleInstallClick}
                className="w-full gap-2"
              >
                <Download className="w-5 h-5" />
                Install Now
              </Button>
            </motion.div>
          )}

          {/* Instructions Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* iOS Instructions */}
            <motion.div
              variants={itemVariants}
              className={`p-8 rounded-2xl border transition-all ${
                isIOS 
                  ? 'bg-primary/5 border-primary/20 ring-2 ring-primary/20' 
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Apple className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">iPhone & iPad</h3>
                  <p className="text-sm text-muted-foreground">Safari Browser</p>
                </div>
              </div>

              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Open in Safari</p>
                    <p className="text-sm text-muted-foreground">Make sure you're using Safari browser</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    2
                  </span>
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="font-medium">Tap the Share button</p>
                      <p className="text-sm text-muted-foreground">Located at the bottom of the screen</p>
                    </div>
                    <Share className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    3
                  </span>
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="font-medium">Select "Add to Home Screen"</p>
                      <p className="text-sm text-muted-foreground">Scroll down in the share menu</p>
                    </div>
                    <PlusSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    4
                  </span>
                  <div>
                    <p className="font-medium">Tap "Add"</p>
                    <p className="text-sm text-muted-foreground">Confirm to add the app icon</p>
                  </div>
                </li>
              </ol>
            </motion.div>

            {/* Android Instructions */}
            <motion.div
              variants={itemVariants}
              className={`p-8 rounded-2xl border transition-all ${
                isAndroid 
                  ? 'bg-primary/5 border-primary/20 ring-2 ring-primary/20' 
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Chrome className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Android</h3>
                  <p className="text-sm text-muted-foreground">Chrome Browser</p>
                </div>
              </div>

              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Open in Chrome</p>
                    <p className="text-sm text-muted-foreground">Use Chrome for best experience</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    2
                  </span>
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="font-medium">Tap the menu button</p>
                      <p className="text-sm text-muted-foreground">Three dots in the top right</p>
                    </div>
                    <MoreVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    3
                  </span>
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="font-medium">Select "Add to Home screen"</p>
                      <p className="text-sm text-muted-foreground">Or "Install app" if shown</p>
                    </div>
                    <PlusSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    4
                  </span>
                  <div>
                    <p className="font-medium">Tap "Add" or "Install"</p>
                    <p className="text-sm text-muted-foreground">Confirm to install the app</p>
                  </div>
                </li>
              </ol>
            </motion.div>
          </motion.div>

          {/* Desktop Instructions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto mt-8 p-8 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Desktop</h3>
                <p className="text-sm text-muted-foreground">Chrome, Edge, or other supported browsers</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">
              Look for the install icon in the address bar (usually on the right side) or use the browser menu to find "Install NovaStream Digital" option.
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="w-4 h-4" />
              <span>The install option appears automatically in supported browsers</span>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-8">Why Install?</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-6 rounded-xl bg-card border border-border">
                <Smartphone className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Quick Access</h3>
                <p className="text-sm text-muted-foreground">Launch directly from your home screen</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Download className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Works Offline</h3>
                <p className="text-sm text-muted-foreground">Access content even without internet</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Monitor className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Full Screen</h3>
                <p className="text-sm text-muted-foreground">Native app-like experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Install;
