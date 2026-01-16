import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

type Platform = 'tiktok' | 'youtube' | 'instagram' | 'facebook';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
  embedId: string;
  title?: string;
  onView?: () => void;
}

const getEmbedUrl = (platform: Platform, embedId: string): string => {
  switch (platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${embedId}?autoplay=1`;
    case 'tiktok':
      return `https://www.tiktok.com/embed/v2/${embedId}`;
    case 'instagram':
      return `https://www.instagram.com/p/${embedId}/embed`;
    case 'facebook':
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/${embedId}&show_text=false`;
    default:
      return '';
  }
};

export const VideoModal = ({ isOpen, onClose, platform, embedId, title, onView }: VideoModalProps) => {
  const embedUrl = getEmbedUrl(platform, embedId);

  // Track view when modal opens
  useEffect(() => {
    if (isOpen && onView) {
      onView();
    }
  }, [isOpen, onView]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[400px] aspect-[9/16] bg-card rounded-2xl overflow-hidden shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video embed */}
            <iframe
              src={embedUrl}
              title={title || 'Video'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>

          {/* Title */}
          {title && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-foreground font-medium max-w-md px-4"
            >
              {title}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};