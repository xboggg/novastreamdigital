import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  NovaStream Digital ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
                  This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website
                  or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We may collect the following types of information:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, company name, phone number when you contact us or submit forms.</li>
                  <li><strong>Project Information:</strong> Details about your project requirements, budget, and timeline preferences.</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, and browsing patterns through cookies and analytics.</li>
                  <li><strong>Communication Data:</strong> Records of correspondence when you contact us.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use collected information to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Respond to your inquiries and provide requested services</li>
                  <li>Send you relevant updates, newsletters, and marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Analyze usage patterns and optimize user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
                <p className="text-muted-foreground">
                  We do not sell your personal information. We may share data with trusted third-party service providers
                  who assist us in operating our website and conducting business, provided they agree to keep this information confidential.
                  These include hosting providers, analytics services, and email marketing platforms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie preferences
                  through your browser settings. Essential cookies are required for basic website functionality, while analytics and
                  marketing cookies help us understand usage patterns and improve our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access,
                  alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                <p className="text-muted-foreground mb-4">Depending on your location, you may have the right to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Withdraw consent at any time</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain personal data only for as long as necessary to fulfill the purposes for which it was collected,
                  including legal, accounting, or reporting requirements. Contact form submissions are retained for up to 2 years
                  unless you request earlier deletion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Third-Party Links</h2>
                <p className="text-muted-foreground">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices
                  of these external sites. We encourage you to review their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify you of significant changes by posting
                  the new policy on this page with an updated revision date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this privacy policy or wish to exercise your rights, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Email:</strong> privacy@novastreamdigital.com<br />
                  <strong>Website:</strong> novastreamdigital.techtrendi.com/contact
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
