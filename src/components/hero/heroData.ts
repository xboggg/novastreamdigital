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
    // Dark coding/tech video - Pexels
    videoUrl: 'https://videos.pexels.com/video-files/5380642/5380642-uhd_2560_1440_25fps.mp4',
    posterUrl: 'https://images.pexels.com/videos/5380642/free-video-5380642.jpg?auto=compress&cs=tinysrgb&w=1920',
    colors: {
      primary: 'hsl(217, 91%, 60%)',
      secondary: 'hsl(186, 100%, 42%)',
      gradient: 'linear-gradient(135deg, hsl(217 91% 60%), hsl(186 100% 42%))',
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
    // Dark abstract tech/data - Pexels
    videoUrl: 'https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_25fps.mp4',
    posterUrl: 'https://images.pexels.com/videos/3141208/free-video-3141208.jpg?auto=compress&cs=tinysrgb&w=1920',
    colors: {
      primary: 'hsl(271, 91%, 65%)',
      secondary: 'hsl(280, 100%, 70%)',
      gradient: 'linear-gradient(135deg, hsl(271 91% 65%), hsl(280 100% 70%))',
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
    // Creative/design video - Pexels
    videoUrl: 'https://videos.pexels.com/video-files/6804110/6804110-uhd_2732_1440_25fps.mp4',
    posterUrl: 'https://images.pexels.com/videos/6804110/pexels-photo-6804110.jpeg?auto=compress&cs=tinysrgb&w=1920',
    colors: {
      primary: 'hsl(330, 81%, 60%)',
      secondary: 'hsl(350, 100%, 70%)',
      gradient: 'linear-gradient(135deg, hsl(330 81% 60%), hsl(350 100% 70%))',
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
    // Business/growth video - Pexels
    videoUrl: 'https://videos.pexels.com/video-files/7989479/7989479-uhd_2732_1440_25fps.mp4',
    posterUrl: 'https://images.pexels.com/videos/7989479/pexels-photo-7989479.jpeg?auto=compress&cs=tinysrgb&w=1920',
    colors: {
      primary: 'hsl(160, 84%, 39%)',
      secondary: 'hsl(172, 66%, 50%)',
      gradient: 'linear-gradient(135deg, hsl(160 84% 39%), hsl(172 66% 50%))',
    },
    cta: {
      text: 'Learn More',
      link: '/services#care',
    },
  },
];
