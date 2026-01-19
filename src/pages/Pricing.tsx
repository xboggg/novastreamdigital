import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, X, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';
import { JsonLd, createBreadcrumbSchema, createFAQSchema } from '@/components/JsonLd';

interface PricingPackage {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  price_suffix: string | null;
  features: string[] | null;
  highlighted: boolean | null;
  display_order: number | null;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

// Comparison table data
const comparisonFeatures = [
  { name: 'Pages', starter: 'Up to 5', business: 'Up to 15', enterprise: 'Unlimited' },
  { name: 'Custom Design', starter: 'Template-based', business: 'Fully Custom', enterprise: 'Fully Custom' },
  { name: 'Mobile Responsive', starter: true, business: true, enterprise: true },
  { name: 'Content Management', starter: false, business: true, enterprise: true },
  { name: 'E-commerce', starter: false, business: 'Up to 50 products', enterprise: 'Unlimited' },
  { name: 'Blog/News Section', starter: false, business: true, enterprise: true },
  { name: 'Custom Applications', starter: false, business: false, enterprise: true },
  { name: 'Database Development', starter: false, business: false, enterprise: true },
  { name: 'API Integrations', starter: false, business: 'Basic', enterprise: 'Advanced' },
  { name: 'SEO Optimization', starter: 'Basic', business: 'Advanced', enterprise: 'Advanced' },
  { name: 'Analytics Setup', starter: false, business: true, enterprise: true },
  { name: 'Support Duration', starter: '1 month', business: '3 months', enterprise: '6 months' },
  { name: 'Delivery Time', starter: '1-2 weeks', business: '2-4 weeks', enterprise: '4-12 weeks' },
  { name: 'Revision Rounds', starter: '2 rounds', business: '4 rounds', enterprise: 'Unlimited' },
];

const Pricing = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Pricing', url: '/pricing' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const [packagesRes, faqsRes] = await Promise.all([
        supabase.from('pricing_packages').select('*').order('display_order'),
        supabase.from('faqs').select('*').order('display_order'),
      ]);
      setPackages(packagesRes.data || []);
      setFaqs(faqsRes.data || []);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const faqSchema = faqs.length > 0 ? createFAQSchema(faqs) : null;

  const renderComparisonValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Pricing"
        description="Transparent pricing for exceptional digital experiences. Web design, development, and brand identity packages starting from affordable rates."
        keywords="web design pricing, web development cost, digital agency rates, Ghana web design prices"
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      {faqSchema && <JsonLd type="faq" data={faqSchema} />}
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Header */}
        <section className="container-custom mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Pricing
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Investment in{' '}
              <span className="gradient-text">Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Transparent pricing for exceptional digital experiences. Every project is unique—these are starting points.
            </p>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="container-custom mb-24">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className={`relative rounded-2xl p-6 ${
                    pkg.highlighted
                      ? 'bg-gradient-to-b from-primary/10 to-background border-2 border-primary shadow-xl shadow-primary/10'
                      : 'card-3d'
                  }`}
                >
                  {pkg.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-sm font-medium text-white whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                  <div className="mb-6">
                    <span className="text-2xl md:text-3xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground text-sm ml-2 block mt-1">{pkg.price_suffix}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features?.slice(0, 6).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {pkg.features && pkg.features.length > 6 && (
                      <li className="text-sm text-muted-foreground">
                        +{pkg.features.length - 6} more features
                      </li>
                    )}
                  </ul>
                  <Button
                    variant={pkg.highlighted ? 'hero' : 'heroOutline'}
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link to="/contact">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Comparison Table */}
        <section className="container-custom mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Compare Plans
              </h2>
              <p className="text-muted-foreground">
                Choose the perfect plan for your needs
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">Feature</th>
                    <th className="text-center py-4 px-4 font-bold">Starter</th>
                    <th className="text-center py-4 px-4 font-bold text-primary">Business</th>
                    <th className="text-center py-4 px-4 font-bold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <motion.tr
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-medium">{feature.name}</td>
                      <td className="py-4 px-4 text-center">{renderComparisonValue(feature.starter)}</td>
                      <td className="py-4 px-4 text-center bg-primary/5">{renderComparisonValue(feature.business)}</td>
                      <td className="py-4 px-4 text-center">{renderComparisonValue(feature.enterprise)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Enterprise CTA */}
        <section className="container-custom mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="card-3d p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Need a Custom Solution?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  For complex projects, custom applications, or enterprise requirements,
                  let's discuss your specific needs and create a tailored proposal.
                </p>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/contact" className="group">
                    Schedule a Consultation
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about working with us.
              </p>
            </div>

            {faqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="card-3d px-6 border-none"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>FAQs coming soon.</p>
              </div>
            )}
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
