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
    <section className="py-16 border-y border-border/50">
      <div className="container-custom">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground uppercase tracking-wider mb-10"
        >
          Trusted by Organizations Across Industries
        </motion.p>

        {/* Logo carousel - infinite scroll effect */}
        <div className="relative overflow-hidden">
          <div className="flex gap-12 items-center justify-center flex-wrap md:flex-nowrap">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-col items-center min-w-[120px]"
              >
                {/* Placeholder for logo - using text until actual logos are available */}
                <div className="h-12 flex items-center justify-center px-4 py-2 rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors">
                  <span className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                    {client.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                  {client.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Industries served */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {['Government', 'Healthcare', 'Engineering', 'NGOs', 'Finance', 'Education'].map((industry) => (
            <span
              key={industry}
              className="px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground"
            >
              {industry}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
