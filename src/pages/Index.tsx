import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { FeaturedWorkSection } from '@/components/sections/FeaturedWorkSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { SocialFeedSection } from '@/components/sections/SocialFeedSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { CTASection } from '@/components/sections/CTASection';
import { SEO } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Designing Digital Experiences That Flow"
        description="NovaStream Digital crafts refined websites and web applications for modern businesses. From captivating designs to powerful platforms."
        keywords="web design, web development, digital agency, Ghana, web applications, UI/UX design, brand identity"
      />
      <JsonLd type="organization" />
      <JsonLd type="website" />
      <JsonLd type="localBusiness" />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturedWorkSection />
        <PhilosophySection />
        <SocialFeedSection />
        <TestimonialsSection />
        <NewsletterSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
