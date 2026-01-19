-- NovaStream Digital Seed Data
-- Run this in your Supabase SQL Editor to populate initial content

-- ============================================
-- PROJECTS (Portfolio)
-- ============================================

INSERT INTO novastream.projects (title, slug, description, content, category, image_url, website_url, tags, featured, status, display_order) VALUES

-- CAGD Booking System
(
  'CAGD Booking Portal',
  'cagd-booking-portal',
  'A comprehensive online booking and management system for the Controller & Accountant General''s Department of Ghana.',
  '<h2>Project Overview</h2>
<p>We developed a full-featured booking and management platform for the Controller & Accountant General''s Department (CAGD) of Ghana. The system handles appointment scheduling, resource management, and administrative workflows for one of Ghana''s most critical government institutions.</p>

<h2>The Challenge</h2>
<p>CAGD needed a reliable, scalable system to manage appointments and bookings across multiple departments. The existing manual processes were time-consuming and prone to errors. They needed a solution that could handle high traffic while maintaining data integrity and security.</p>

<h2>Our Solution</h2>
<ul>
  <li>Built a responsive web application with real-time availability checking</li>
  <li>Implemented secure user authentication and role-based access control</li>
  <li>Created an admin dashboard for managing bookings and generating reports</li>
  <li>Integrated SMS notifications for booking confirmations and reminders</li>
  <li>Developed a queue management system for walk-in visitors</li>
</ul>

<h2>Results</h2>
<p>The system has processed thousands of bookings since launch, significantly reducing wait times and improving the citizen experience. Administrative efficiency improved by over 60%, and the platform maintains 99.9% uptime.</p>',
  'Web Application',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
  'https://bookings.cagd.gov.gh',
  ARRAY['Government', 'Booking System', 'React', 'Node.js', 'PostgreSQL'],
  true,
  'published',
  1
),

-- I&P Global Limited
(
  'I&P Global Limited',
  'ip-global-limited',
  'A professional corporate website for a leading investment and partnership firm in Ghana.',
  '<h2>Project Overview</h2>
<p>We designed and developed a modern, professional website for I&P Global Limited, showcasing their investment services and partnership opportunities to potential clients and investors.</p>

<h2>The Challenge</h2>
<p>I&P Global needed a website that would establish their credibility in the competitive investment sector. They wanted to clearly communicate their services, team expertise, and track record to attract high-value clients.</p>

<h2>Our Solution</h2>
<ul>
  <li>Created a clean, professional design that reflects their brand values</li>
  <li>Developed clear service pages with compelling calls-to-action</li>
  <li>Built a team showcase section highlighting key personnel</li>
  <li>Implemented contact forms with lead capture functionality</li>
  <li>Optimized for search engines to improve visibility</li>
</ul>

<h2>Results</h2>
<p>The new website has significantly improved I&P Global''s online presence, generating qualified leads and supporting their business development efforts.</p>',
  'Corporate Website',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
  'https://ipgloballimited.com',
  ARRAY['Corporate', 'Finance', 'Investment', 'Responsive Design'],
  true,
  'published',
  2
),

-- Terrexo Engineering
(
  'Terrexo Engineering',
  'terrexo-engineering',
  'A dynamic website for an engineering and construction company showcasing their projects and capabilities.',
  '<h2>Project Overview</h2>
<p>We created a visually impactful website for Terrexo Engineering, an engineering and construction company, to showcase their portfolio of projects and technical capabilities.</p>

<h2>The Challenge</h2>
<p>Terrexo needed a website that would impress potential clients and clearly demonstrate their engineering expertise. They wanted to showcase their completed projects and attract new business opportunities.</p>

<h2>Our Solution</h2>
<ul>
  <li>Designed a bold, modern layout that reflects the construction industry</li>
  <li>Created an interactive project gallery with filtering capabilities</li>
  <li>Developed service pages with detailed technical information</li>
  <li>Implemented a quote request system for potential clients</li>
  <li>Built mobile-responsive design for on-site access</li>
</ul>

<h2>Results</h2>
<p>The website has become a key business development tool, helping Terrexo win new contracts and establish their reputation in the engineering sector.</p>',
  'Corporate Website',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
  'https://terrexoengineering.com',
  ARRAY['Engineering', 'Construction', 'Portfolio', 'Corporate'],
  true,
  'published',
  3
),

-- Adomah Kidney Care
(
  'Adomah Kidney Care Foundation',
  'adomah-kidney-care',
  'A compassionate website for a non-profit organization focused on kidney disease awareness and patient support in Ghana.',
  '<h2>Project Overview</h2>
<p>We developed a warm, accessible website for Adomah Kidney Care Foundation, a non-profit dedicated to kidney disease awareness, patient support, and advocacy in Ghana.</p>

<h2>The Challenge</h2>
<p>The foundation needed a website that could effectively communicate their mission, attract donors, and provide resources for kidney disease patients. They wanted to make it easy for people to get involved and support their cause.</p>

<h2>Our Solution</h2>
<ul>
  <li>Created an emotionally engaging design that reflects their mission</li>
  <li>Built a donation system for one-time and recurring contributions</li>
  <li>Developed a patient resources section with educational content</li>
  <li>Implemented event registration for awareness campaigns</li>
  <li>Created volunteer signup and management functionality</li>
</ul>

<h2>Results</h2>
<p>The website has helped the foundation increase donations and volunteer engagement, while providing valuable resources to kidney disease patients and their families.</p>',
  'Non-Profit Website',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
  'https://adomahkidneycare.org',
  ARRAY['Non-Profit', 'Healthcare', 'Donation Platform', 'NGO'],
  true,
  'published',
  4
),

-- Matech Global
(
  'Matech Global',
  'matech-global',
  'A technology-focused corporate website for a global tech solutions provider.',
  '<h2>Project Overview</h2>
<p>We designed and developed a cutting-edge website for Matech Global, showcasing their technology solutions and global capabilities.</p>

<h2>The Challenge</h2>
<p>Matech Global needed a website that would position them as a leader in the technology space, clearly communicating their services and expertise to potential enterprise clients.</p>

<h2>Our Solution</h2>
<ul>
  <li>Created a sleek, technology-forward design aesthetic</li>
  <li>Developed detailed service pages with case studies</li>
  <li>Built an interactive solutions finder for prospects</li>
  <li>Implemented multi-language support for global reach</li>
  <li>Optimized performance for fast loading worldwide</li>
</ul>

<h2>Results</h2>
<p>The new website has strengthened Matech Global''s brand positioning and generated significant interest from enterprise clients.</p>',
  'Corporate Website',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  'https://matechglobal.org',
  ARRAY['Technology', 'Corporate', 'Global', 'Enterprise'],
  false,
  'published',
  5
),

-- TechTrendi
(
  'TechTrendi',
  'techtrendi',
  'A modern tech news and reviews platform delivering the latest in technology trends and gadget reviews.',
  '<h2>Project Overview</h2>
<p>We built TechTrendi, a content-rich technology news and reviews platform that keeps readers up-to-date with the latest tech trends, gadget reviews, and industry news.</p>

<h2>The Challenge</h2>
<p>The client wanted a fast, engaging platform that could handle high traffic volumes while providing an excellent reading experience. The site needed to support multiple content types and integrate with various third-party services.</p>

<h2>Our Solution</h2>
<ul>
  <li>Built a custom content management system for easy publishing</li>
  <li>Implemented a responsive design optimized for readability</li>
  <li>Created category and tag-based navigation</li>
  <li>Integrated social sharing and commenting features</li>
  <li>Optimized for SEO to maximize organic traffic</li>
</ul>

<h2>Results</h2>
<p>TechTrendi has grown to attract thousands of monthly readers, establishing itself as a go-to source for tech news in the region.</p>',
  'Media Platform',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
  'https://techtrendi.com',
  ARRAY['Media', 'Technology', 'Blog', 'Content Platform'],
  false,
  'published',
  6
);


-- ============================================
-- PRICING PACKAGES
-- ============================================

INSERT INTO novastream.pricing_packages (name, description, price, price_suffix, features, highlighted, display_order) VALUES

(
  'Starter',
  'Perfect for individuals and small businesses',
  'GHS 3,500 - 5,000',
  'per project',
  ARRAY[
    'Up to 5 pages',
    'Mobile-responsive design',
    'Contact form integration',
    'Social media links',
    'Basic SEO optimization',
    'SSL certificate included',
    '1 month support',
    '1-2 week delivery'
  ],
  false,
  1
),

(
  'Business',
  'Ideal for SMEs and corporate organizations',
  'GHS 6,000 - 10,000',
  'per project',
  ARRAY[
    'Up to 15 pages',
    'Custom design & branding',
    'Content management system',
    'Blog functionality',
    'Advanced SEO optimization',
    'Google Analytics integration',
    'Email newsletter setup',
    'E-commerce ready (up to 50 products)',
    '3 months support',
    '2-4 week delivery'
  ],
  true,
  2
),

(
  'Enterprise',
  'Custom apps and complex systems',
  'GHS 15,000 - 50,000+',
  'per project',
  ARRAY[
    'Unlimited pages',
    'Custom web applications',
    'Booking & reservation systems',
    'Management platforms',
    'Third-party API integrations',
    'Database development',
    'User authentication & roles',
    'Admin dashboards',
    'Priority support',
    '6 months support included'
  ],
  false,
  3
),

(
  'Maintenance',
  'Keep your digital presence running smoothly',
  'GHS 500 - 2,000',
  'per month',
  ARRAY[
    'Regular updates & backups',
    'Security monitoring',
    'Performance optimization',
    'Content updates (up to 5 hours)',
    'Monthly reports',
    'Priority email support',
    'Uptime monitoring',
    '24-hour response time'
  ],
  false,
  4
);


-- ============================================
-- TESTIMONIALS
-- ============================================

INSERT INTO novastream.testimonials (client_name, role, company, content, rating, featured, status, display_order) VALUES

(
  'Samuel Mensah',
  'IT Director',
  'Controller & Accountant General''s Department',
  'NovaStream Digital delivered an exceptional booking system for our department. Their understanding of our requirements and ability to translate them into a working solution was impressive. The system has significantly improved our service delivery.',
  5,
  true,
  'published',
  1
),

(
  'Grace Adomah',
  'Founder',
  'Adomah Kidney Care Foundation',
  'Working with NovaStream was a wonderful experience. They understood our mission and created a website that truly represents what we stand for. The donation system works flawlessly, and our supporters love it.',
  5,
  true,
  'published',
  2
),

(
  'Emmanuel Ofori',
  'CEO',
  'I&P Global Limited',
  'Our new website has transformed our online presence. NovaStream delivered a professional, modern design that perfectly represents our brand. We''ve seen a significant increase in client inquiries since launch.',
  5,
  true,
  'published',
  3
),

(
  'Kwame Asante',
  'Managing Director',
  'Terrexo Engineering',
  'The team at NovaStream understood exactly what we needed. Our website now showcases our projects beautifully and has become a key tool in winning new contracts. Highly recommended!',
  5,
  false,
  'published',
  4
),

(
  'Abena Owusu',
  'Operations Manager',
  'Matech Global',
  'Professional, responsive, and creative. NovaStream delivered our website on time and exceeded our expectations. Their ongoing support has been invaluable.',
  5,
  false,
  'published',
  5
);


-- ============================================
-- FAQs
-- ============================================

INSERT INTO novastream.faqs (question, answer, category, display_order) VALUES

(
  'How long does it take to build a website?',
  'A typical business website takes 2-4 weeks from start to finish. More complex projects like custom web applications can take 6-12 weeks depending on the requirements. We''ll provide a detailed timeline during our initial consultation.',
  'Timeline',
  1
),

(
  'What is your payment structure?',
  'We typically require 50% deposit to begin work, with the remaining 50% due upon completion. For larger projects, we can arrange milestone-based payments. We accept mobile money, bank transfers, and international payments.',
  'Payment',
  2
),

(
  'Do you provide website hosting?',
  'Yes, we can set up and manage hosting for your website. We use reliable cloud hosting providers to ensure your site is fast and always available. Hosting costs are separate from development fees and billed monthly or annually.',
  'Services',
  3
),

(
  'Can you help with website maintenance?',
  'Absolutely! We offer ongoing maintenance packages that include regular updates, security monitoring, backups, and content updates. This ensures your website remains secure and up-to-date.',
  'Services',
  4
),

(
  'Do you work with clients outside Ghana?',
  'Yes, we work with clients globally. We''ve successfully completed projects for clients in Europe, the US, and across Africa. We use video calls and project management tools to collaborate effectively regardless of location.',
  'General',
  5
),

(
  'What technologies do you use?',
  'We use modern, industry-standard technologies including React, Next.js, Node.js, and PostgreSQL. For simpler projects, we also work with WordPress. We choose the best technology stack based on your specific needs and budget.',
  'Technical',
  6
),

(
  'Can you redesign my existing website?',
  'Yes, website redesigns are one of our core services. We''ll analyze your current site, understand your goals, and create a modern, improved version. We can also migrate your content and improve your SEO in the process.',
  'Services',
  7
),

(
  'Do you offer branding services?',
  'Yes, we offer visual identity and branding services including logo design, brand guidelines, marketing materials, and social media assets. We can create a cohesive brand identity for your business.',
  'Services',
  8
);


-- ============================================
-- NOTE: Update the WhatsApp number in the code
-- ============================================
-- After running this seed, remember to update the WhatsApp number in:
-- src/components/WhatsAppButton.tsx
-- Replace '233XXXXXXXXX' with your actual WhatsApp number
