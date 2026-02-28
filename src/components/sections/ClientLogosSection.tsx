import { motion } from 'framer-motion';

const clients = [
  {
    name: 'CAGD',
    description: 'Controller & Accountant General\'s Department',
    initials: 'CA',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'I&P Global',
    description: 'Engineering Solutions',
    initials: 'IP',
    color: 'from-violet-500 to-purple-400',
  },
  {
    name: 'Terrexo Engineering',
    description: 'Engineering Excellence',
    initials: 'TE',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    name: 'Adomah Kidney Care',
    description: 'Healthcare Foundation',
    initials: 'AK',
    color: 'from-rose-500 to-pink-400',
  },
  {
    name: 'Matech Global',
    description: 'ICT Solutions',
    initials: 'MG',
    color: 'from-amber-500 to-orange-400',
  },
  {
    name: 'TechTrendi',
    description: 'Tech Platform',
    initials: 'TT',
    color: 'from-indigo-500 to-blue-400',
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

        {/* Client cards grid */}
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
              <div className="h-28 flex flex-col items-center justify-center p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${client.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-xs font-bold">{client.initials}</span>
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors text-center leading-tight">
                  {client.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 text-center line-clamp-1">
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
