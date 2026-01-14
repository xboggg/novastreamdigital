import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your admin panel</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-8"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
            <p className="text-muted-foreground mb-4">
              This admin panel allows you to manage all content on your website including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Portfolio projects - Add, edit, and manage your work showcase</li>
              <li>Blog posts - Create and publish articles for your insights page</li>
              <li>Testimonials - Manage client feedback and reviews</li>
              <li>Leads - View and track contact form submissions</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-6">
              To make yourself an admin, update your profile role in the database to 'admin'.
            </p>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminSettings;
