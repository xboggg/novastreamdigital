import { Globe, Layers, Palette, HeartHandshake } from 'lucide-react';

export interface HeroService {
  id: string;
  icon: typeof Globe;
  title: string;
  tagline: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  colors: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  cta: {
    text: string;
    link: string;
  };
}

export const heroServices: HeroService[] = [
  {
    id: 'websites',
    icon: Globe,
    title: 'Website Design & Development',
    tagline: 'Captivating Digital Presence',
    description: 'We craft stunning, high-performance websites that captivate visitors and convert them into loyal customers.',
    // Tech/code visualization with dark background - Pexels
    videoUrl: 'https://videos.pexels.com/video-files/5377684/5377684-uhd_2560_1440_25fps.mp4',
    posterUrl: 'https://images.pexels.com/videos/5377684/pexels-photo-5377684.jpeg?auto=compress&cs=tinysrgb&w=1920',
    colors: {
      primary: 'hsl(217, 91%, 60%)',
      secondary: 'hsl(186, 100%, 42%)',
      gradient: 'linear-gradient(135deg, hsl(217 91% 60% / 0.7), hsl(186 100% 42% / 0.5))',
    },
    cta: {
      text: 'Explore Websites',
      link: '/portfolio?category=websites',
    },
  },
  {
    id: 'applications',
    icon: Layers,
    title: 'Web Applications',
    tagline: 'Powerful Digital Solutions',
    description: 'Custom web applications that streamline operations, boost productivity, and scale with your business.',
    // Dark tech/data visualization - Pexels
    videoUrl: 'https://videos.pexels.com/video-files/6963744/6963744-uhd_2560_1440_25fps.mp4',
    posterUrl: 'https://images.pexels.com/videos/6963744/pexels-photo-6963744.jpeg?auto=compress&cs=tinysrgb&w=1920',
    colors: {
      primary: 'hsl(271, 91%, 65%)',
      secondary: 'hsl(280, 100%, 70%)',
      gradient: 'linear-gradient(135deg, hsl(271 91% 65% / 0.7), hsl(280 100% 70% / 0.5))',
    },
    cta: {
      text: 'View Applications',
      link: '/portfolio?category=applications',
    },
  },
  {
    id: 'branding',
    icon: Palette,
    title: 'Visual Identity & Design',
    tagline: 'Memorable Brand Experiences',
    description: 'Distinctive visual identities that tell your story and create lasting impressions across every touchpoint.',
    // Creative team working - Pexels
    videoUrl: 'https://videos.pexels.com/video-files/3255275/3255275-uhd_2560_1440_25fps.mp4',
    posterUrl: 'https://images.pexels.com/videos/3255275/free-video-3255275.jpg?auto=compress&cs=tinysrgb&w=1920',
    colors: {
      primary: 'hsl(330, 81%, 60%)',
      secondary: 'hsl(350, 100%, 70%)',
      gradient: 'linear-gradient(135deg, hsl(330 81% 60% / 0.7), hsl(350 100% 70% / 0.5))',
    },
    cta: {
      text: 'See Our Work',
      link: '/portfolio?category=branding',
    },
  },
  {
    id: 'care',
    icon: HeartHandshake,
    title: 'Ongoing Digital Care',
    tagline: 'Continuous Growth & Support',
    description: 'Dedicated partnership to maintain, optimize, and evolve your digital presence as your business grows.',
    // Business growth/support visualization - Pexels
    videoUrl: 'https://videos.pexels.com/video-files/7989479/7989479-uhd_2732_1440_25fps.mp4',
    posterUrl: 'https://images.pexels.com/videos/7989479/pexels-photo-7989479.jpeg?auto=compress&cs=tinysrgb&w=1920',
    colors: {
      primary: 'hsl(160, 84%, 39%)',
      secondary: 'hsl(172, 66%, 50%)',
      gradient: 'linear-gradient(135deg, hsl(160 84% 39% / 0.7), hsl(172 66% 50% / 0.5))',
    },
    cta: {
      text: 'Learn More',
      link: '/services#care',
    },
  },
];
