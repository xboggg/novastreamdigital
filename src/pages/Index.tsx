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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
