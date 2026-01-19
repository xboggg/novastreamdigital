import { motion } from 'framer-motion';

const clients = [
  {
    name: 'CAGD',
    logo: '/clients/cagd-logo.png',
    description: 'Controller & Accountant General\'s Department',
  },
  {
    name: 'I&P Global',
    logo: '/clients/ipglobal-logo.png',
    description: 'Engineering Solutions',
  },
  {
    name: 'Terrexo Engineering',
    logo: '/clients/terrexo-logo.png',
    description: 'Engineering Excellence',
  },
  {
    name: 'Adomah Kidney Care',
    logo: '/clients/adomah-logo.png',
    description: 'Healthcare Foundation',
  },
  {
    name: 'Matech Global',
    logo: '/clients/matech-logo.png',
    description: 'ICT Solutions',
  },
  {
    name: 'TechTrendi',
    logo: '/clients/techtrendi-logo.png',
    description: 'Tech Platform',
  },
];

export const ClientLogosSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-surface-overlay/30 to-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
            Our Clients
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Trusted by Organizations Across Industries
          </h2>
        </motion.div>

        {/* Client logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group"
            >
              <div className="h-24 flex flex-col items-center justify-center p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                  {client.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1 text-center line-clamp-1">
                  {client.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Industries served */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {['Government', 'Healthcare', 'Engineering', 'NGOs', 'Finance', 'Education'].map((industry, index) => (
            <motion.span
              key={industry}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="px-4 py-2 rounded-full border border-border/50 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
            >
              {industry}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
