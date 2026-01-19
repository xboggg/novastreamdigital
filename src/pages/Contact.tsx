import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Send, Sparkles, MessageSquare, Mail, Building } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { JsonLd, createBreadcrumbSchema } from '@/components/JsonLd';

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';

const serviceOptions = [
  { id: 'website', label: 'Website Design', icon: '🌐', color: 'from-blue-500 to-cyan-400' },
  { id: 'application', label: 'Web Application', icon: '⚡', color: 'from-violet-500 to-purple-400' },
  { id: 'identity', label: 'Visual Identity', icon: '🎨', color: 'from-pink-500 to-rose-400' },
  { id: 'support', label: 'Ongoing Support', icon: '🤝', color: 'from-emerald-500 to-teal-400' },
];

const budgetRanges = [
  '$5k - $10k',
  '$10k - $25k',
  '$25k - $50k',
  '$50k+',
  'Not Sure Yet',
];

const timelineOptions = [
  'ASAP',
  '1-2 Months',
  '3-6 Months',
  'Flexible',
];

const Contact = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    services: [] as string[],
    description: '',
    timeline: '',
    budget: '',
    name: '',
    email: '',
    company: '',
    referral: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const { toast } = useToast();

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      toast({ variant: 'destructive', title: 'Verification Required', description: 'Please complete the captcha verification.' });
      return;
    }

    const rateLimitKey = 'novastream_contact_submissions';
    const submissions = JSON.parse(localStorage.getItem(rateLimitKey) || '[]') as number[];
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentSubmissions = submissions.filter(time => time > oneHourAgo);

    if (recentSubmissions.length >= 3) {
      toast({ variant: 'destructive', title: 'Rate Limit', description: 'Too many submissions. Please try again later.' });
      return;
    }

    setIsSubmitting(true);

    const leadData = {
      name: formData.name,
      email: formData.email,
      company: formData.company || null,
      services: formData.services,
      message: formData.description,
      budget: formData.budget,
      timeline: formData.timeline,
      referral_source: formData.referral || null,
    };

    const { error } = await supabase.from('leads').insert(leadData);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit. Please try again.' });
      setIsSubmitting(false);
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } else {
      recentSubmissions.push(Date.now());
      localStorage.setItem(rateLimitKey, JSON.stringify(recentSubmissions));

      try {
        await supabase.functions.invoke('notify-new-lead', {
          body: leadData,
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
      setSubmitted(true);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.services.length > 0;
    if (step === 2) return formData.description && formData.timeline && formData.budget;
    return formData.name && formData.email && captchaToken;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background overflow-hidden">
        <Navbar />
        <main className="pt-32 pb-20 relative">
          {/* Background effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl animate-float-slow" />
          </div>

          <div className="container-custom relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              {/* Success animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse-glow"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold mb-4"
              >
                Message <span className="gradient-text">Received!</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mb-8"
              >
                Thank you for reaching out. We'll review your project details and
                get back to you within 24-48 hours.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="heroOutline" size="lg" onClick={() => { setSubmitted(false); setStep(1); setFormData({ services: [], description: '', timeline: '', budget: '', name: '', email: '', company: '', referral: '' }); }}>
                  Submit Another Request
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden" ref={containerRef}>
      <SEO
        title="Contact Us"
        description="Start a project with NovaStream Digital. Tell us about your vision and we'll get back to you within 24-48 hours."
        keywords="contact NovaStream Digital, start a project, web design inquiry, get a quote Ghana"
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl animate-float-slow"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl blob"
        />
      </div>

      {/* Decorative grid */}
      <div className="fixed inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <main className="pt-32 pb-20 relative">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Start a Project
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let's Create Something{' '}
              <span className="gradient-text">Extraordinary</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your project and we'll get back to you within 24-48 hours.
            </p>
          </motion.div>

          {/* Progress */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {[
                { num: 1, icon: MessageSquare, label: 'Services' },
                { num: 2, icon: Building, label: 'Details' },
                { num: 3, icon: Mail, label: 'Contact' },
              ].map((s, index) => (
                <div key={s.num} className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                      s.num <= step
                        ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {s.num < step ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  {index < 2 && (
                    <div className="relative w-20 md:w-28 h-1 mx-2">
                      <div className="absolute inset-0 bg-secondary rounded" />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: s.num < step ? 1 : 0 }}
                        className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded origin-left"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-sm text-muted-foreground px-1">
              <span className={step >= 1 ? 'text-primary font-medium' : ''}>Services</span>
              <span className={step >= 2 ? 'text-primary font-medium' : ''}>Details</span>
              <span className={step >= 3 ? 'text-primary font-medium' : ''}>Contact</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6">What can we help you with?</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {serviceOptions.map((service, index) => (
                      <motion.button
                        key={service.id}
                        type="button"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => toggleService(service.id)}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`card-3d p-6 text-left transition-all relative overflow-hidden ${
                          formData.services.includes(service.id)
                            ? 'ring-2 ring-primary'
                            : ''
                        }`}
                      >
                        {/* Glow effect when selected */}
                        {formData.services.includes(service.id) && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10`} />
                        )}
                        <span className="text-3xl mb-3 block">{service.icon}</span>
                        <span className="font-medium relative">{service.label}</span>
                        {formData.services.includes(service.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <label className="block text-lg font-medium mb-3">Tell us about your project</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Share your vision, goals, and any specific requirements..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-3">Timeline</label>
                    <div className="flex flex-wrap gap-3">
                      {timelineOptions.map((option, index) => (
                        <motion.button
                          key={option}
                          type="button"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setFormData(prev => ({ ...prev, timeline: option }))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-5 py-2.5 rounded-full border-2 transition-all ${
                            formData.timeline === option
                              ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                              : 'border-border hover:border-primary/50 glass-premium'
                          }`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-3">Budget Range</label>
                    <div className="flex flex-wrap gap-3">
                      {budgetRanges.map((range, index) => (
                        <motion.button
                          key={range}
                          type="button"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setFormData(prev => ({ ...prev, budget: range }))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-5 py-2.5 rounded-full border-2 transition-all ${
                            formData.budget === range
                              ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                              : 'border-border hover:border-primary/50 glass-premium'
                          }`}
                        >
                          {range}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6">How can we reach you?</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Your Company Name"
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
                    <input
                      type="text"
                      value={formData.referral}
                      onChange={(e) => setFormData(prev => ({ ...prev, referral: e.target.value }))}
                      placeholder="Google, Referral, Social Media..."
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={HCAPTCHA_SITE_KEY}
                      onVerify={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => setCaptchaToken(null)}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-12">
              {step > 1 ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="button" variant="outline" size="lg" onClick={() => setStep(s => s - 1)} className="hover-lift">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </motion.div>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="hero"
                    size="lg"
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canProceed()}
                    className="group"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={!canProceed() || isSubmitting}
                    className={`group ${!isSubmitting ? 'animate-pulse-glow' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
