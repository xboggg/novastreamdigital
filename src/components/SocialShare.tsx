import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  title: string;
  url?: string;
  description?: string;
  variant?: 'horizontal' | 'vertical';
}

const BASE_URL = 'https://novastreamdigital.techtrendi.com';

export const SocialShare = ({
  title,
  url,
  description,
  variant = 'horizontal',
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url?.startsWith('http') ? url : `${BASE_URL}${url || window.location.pathname}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || title);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const containerClass = variant === 'vertical'
    ? 'flex flex-col gap-2'
    : 'flex items-center gap-2';

  return (
    <div className={containerClass}>
      <span className="text-sm text-muted-foreground flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share
      </span>
      <div className={variant === 'vertical' ? 'flex flex-col gap-2' : 'flex items-center gap-1'}>
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="ghost"
            size="icon"
            className={`rounded-full transition-colors ${link.color}`}
            asChild
          >
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Share on ${link.name}`}
            >
              <link.icon className="w-4 h-4" />
            </a>
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/10 hover:text-primary"
          onClick={copyToClipboard}
          title="Copy link"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-4 h-4 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="link"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Link2 className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
