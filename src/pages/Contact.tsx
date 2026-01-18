import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Send } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'; // Test key as fallback

const serviceOptions = [
  { id: 'website', label: 'Website Design', icon: '🌐' },
  { id: 'application', label: 'Web Application', icon: '⚡' },
  { id: 'identity', label: 'Visual Identity', icon: '🎨' },
  { id: 'support', label: 'Ongoing Support', icon: '🤝' },
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

    // Rate limiting: max 3 submissions per hour
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
      // Record successful submission for rate limiting
      recentSubmissions.push(Date.now());
      localStorage.setItem(rateLimitKey, JSON.stringify(recentSubmissions));

      // Send email notification (fire and forget)
      try {
        await supabase.functions.invoke('notify-new-lead', {
          body: leadData,
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't block form submission if email fails
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-20 h-20 mx-auto mb-8 rounded-full gradient-bg flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Message Received!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Thank you for reaching out. We'll review your project details and 
                get back to you within 24-48 hours.
              </p>
              <Button variant="heroOutline" size="lg" onClick={() => { setSubmitted(false); setStep(1); setFormData({ services: [], description: '', timeline: '', budget: '', name: '', email: '', company: '', referral: '' }); }}>
                Submit Another Request
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Start a Project
            </span>
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
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    s <= step ? 'gradient-bg text-white' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {s < step ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-24 md:w-32 h-1 mx-2 rounded transition-colors ${
                      s < step ? 'gradient-bg' : 'bg-secondary'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Services</span>
              <span>Details</span>
              <span>Contact</span>
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
                    {serviceOptions.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          formData.services.includes(service.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{service.icon}</span>
                        <span className="font-medium">{service.label}</span>
                      </button>
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
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-3">Timeline</label>
                    <div className="flex flex-wrap gap-3">
                      {timelineOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, timeline: option }))}
                          className={`px-4 py-2 rounded-full border transition-all ${
                            formData.timeline === option
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-3">Budget Range</label>
                    <div className="flex flex-wrap gap-3">
                      {budgetRanges.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, budget: range }))}
                          className={`px-4 py-2 rounded-full border transition-all ${
                            formData.budget === range
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {range}
                        </button>
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Your Company Name"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
                    <input
                      type="text"
                      value={formData.referral}
                      onChange={(e) => setFormData(prev => ({ ...prev, referral: e.target.value }))}
                      placeholder="Google, Referral, Social Media..."
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="mt-6">
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={HCAPTCHA_SITE_KEY}
                      onVerify={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => setCaptchaToken(null)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-12">
              {step > 1 ? (
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(s => s - 1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={!canProceed() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
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
