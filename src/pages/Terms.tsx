import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { JsonLd, createBreadcrumbSchema } from '@/components/JsonLd';

const Terms = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms' },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms of Service"
        description="Terms of Service for NovaStream Digital - web design, development, and digital solutions. Read our terms and conditions."
        noindex={false}
      />
      <JsonLd type="breadcrumb" data={breadcrumbs} />
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
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using NovaStream Digital's website and services, you agree to be bound by these Terms of Service.
                  If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users,
                  and clients of our website and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
                <p className="text-muted-foreground">
                  NovaStream Digital provides web design, development, and digital solutions. The specific scope, deliverables,
                  timeline, and pricing for each project will be outlined in a separate project agreement or proposal.
                  We reserve the right to modify or discontinue services at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Client Responsibilities</h2>
                <p className="text-muted-foreground mb-4">As a client, you agree to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate and complete information required for your project</li>
                  <li>Provide timely feedback and approvals during the project process</li>
                  <li>Ensure you have the rights to any content, images, or materials you provide</li>
                  <li>Make payments according to the agreed-upon schedule</li>
                  <li>Communicate any concerns or issues promptly</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
                <p className="text-muted-foreground mb-4">
                  <strong>Client Materials:</strong> You retain ownership of all content, logos, and materials you provide to us.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Our Work:</strong> Upon full payment, you will receive ownership of the final deliverables created specifically
                  for your project. We retain the right to use the work in our portfolio and promotional materials unless otherwise agreed.
                </p>
                <p className="text-muted-foreground">
                  <strong>Third-Party Assets:</strong> Some projects may include licensed third-party assets (fonts, images, plugins).
                  These remain subject to their respective licenses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
                <p className="text-muted-foreground mb-4">Unless otherwise specified in your project agreement:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>A 50% deposit is required to begin work</li>
                  <li>The remaining balance is due upon project completion</li>
                  <li>Late payments may incur additional fees</li>
                  <li>Work may be paused on accounts with outstanding balances</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Revisions and Changes</h2>
                <p className="text-muted-foreground">
                  Each project package includes a specified number of revision rounds. Additional revisions or scope changes
                  may incur extra charges. Major changes to project requirements after work has begun may require a revised
                  proposal and timeline.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Warranties and Limitations</h2>
                <p className="text-muted-foreground mb-4">
                  We strive to deliver high-quality work but provide services "as is" without warranties of any kind.
                  We are not liable for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Third-party service failures or outages</li>
                  <li>Issues arising from client-provided content or materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Confidentiality</h2>
                <p className="text-muted-foreground">
                  Both parties agree to keep confidential any proprietary or sensitive information shared during the project.
                  This obligation survives the termination of any agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
                <p className="text-muted-foreground">
                  Either party may terminate a project agreement with written notice. In case of termination,
                  the client is responsible for payment for all work completed up to that point. Any deposits paid
                  are non-refundable unless otherwise specified.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Website Use</h2>
                <p className="text-muted-foreground mb-4">When using our website, you agree not to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Use automated systems to access or scrape content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Submit false or misleading information</li>
                  <li>Use the website for any unlawful purpose</li>
                  <li>Interfere with the website's functionality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms are governed by and construed in accordance with applicable laws. Any disputes
                  shall be resolved through good-faith negotiation or, if necessary, through appropriate legal channels.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may update these terms from time to time. Continued use of our services after changes
                  constitutes acceptance of the updated terms. We encourage you to review this page periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Email:</strong> legal@novastreamdigital.com<br />
                  <strong>Website:</strong> novastreamdigital.com/contact
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

export default Terms;
