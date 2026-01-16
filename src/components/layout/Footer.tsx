import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2 } from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'Website Design', href: '/services#websites' },
    { name: 'Web Applications', href: '/services#applications' },
    { name: 'Visual Identity', href: '/services#design' },
    { name: 'Digital Care', href: '/services#support' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Insights', href: '/insights' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: '#', icon: 'X' },
  { name: 'LinkedIn', href: '#', icon: 'in' },
  { name: 'Dribbble', href: '#', icon: 'Dr' },
];

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, source: 'footer' }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already on our list!",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        setEmail('');
        toast({
          title: "Subscribed!",
          description: "You'll receive our latest insights.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border bg-surface-overlay">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">N</span>
                </div>
                <span className="font-semibold text-xl tracking-tight">
                  Nova<span className="gradient-text">Stream</span>
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Designing digital experiences that flow. We craft refined websites and 
              applications for modern businesses.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get insights on design, technology, and digital experiences.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Check className="w-4 h-4" />
                <span>Thanks for subscribing!</span>
              </div>
            ) : (
              <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 h-10 px-4 rounded-lg bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-4 rounded-lg gradient-bg text-primary-foreground text-sm font-medium hover:shadow-glow transition-shadow disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NovaStream Digital. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
