import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
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
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Pricing
            </span>
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
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`relative rounded-2xl p-8 ${
                    pkg.highlighted
                      ? 'bg-gradient-to-b from-primary/10 to-background border-2 border-primary'
                      : 'card-premium'
                  }`}
                >
                  {pkg.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-sm font-medium text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground mb-6">{pkg.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground ml-2">{pkg.price_suffix}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={pkg.highlighted ? 'hero' : 'heroOutline'}
                    className="w-full"
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

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="card-premium px-6 border-none"
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
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
