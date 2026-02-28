import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ClientLogosSection } from '@/components/sections/ClientLogosSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { FeaturedWorkSection } from '@/components/sections/FeaturedWorkSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { SEO } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Web Design & Custom Applications in Ghana"
        description="NovaStream Digital builds stunning websites and powerful web applications for businesses, NGOs, and government institutions in Ghana. From booking systems to management platforms."
        keywords="web design Ghana, web development Accra, custom web applications, booking systems, government websites, NGO websites, digital agency Ghana"
      />
      <JsonLd type="organization" />
      <JsonLd type="website" />
      <JsonLd type="localBusiness" />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <ClientLogosSection />
        <FeaturedWorkSection />
        <TestimonialsSection />
        <PhilosophySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
