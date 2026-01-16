import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FolderKanban, FileText, MessageSquare, Users, ArrowRight, TrendingUp, Mail } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  projects: number;
  posts: number;
  testimonials: number;
  leads: number;
  newLeads: number;
  subscribers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    posts: 0,
    testimonials: 0,
    leads: 0,
    newLeads: 0,
    subscribers: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, postsRes, testimonialsRes, leadsRes, newLeadsRes, subscribersRes] = await Promise.all([
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('testimonials').select('id', { count: 'exact', head: true }),
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        ]);

        setStats({
          projects: projectsRes.count || 0,
          posts: postsRes.count || 0,
          testimonials: testimonialsRes.count || 0,
          leads: leadsRes.count || 0,
          newLeads: newLeadsRes.count || 0,
          subscribers: subscribersRes.count || 0,
        });

        // Fetch recent leads
        const { data: leads } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentLeads(leads || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: FolderKanban, label: 'Projects', value: stats.projects, path: '/admin/projects', color: 'from-blue-500 to-cyan-500' },
    { icon: FileText, label: 'Blog Posts', value: stats.posts, path: '/admin/posts', color: 'from-violet-500 to-purple-500' },
    { icon: MessageSquare, label: 'Testimonials', value: stats.testimonials, path: '/admin/testimonials', color: 'from-emerald-500 to-teal-500' },
    { icon: Users, label: 'Leads', value: stats.leads, path: '/admin/leads', color: 'from-rose-500 to-pink-500', badge: stats.newLeads > 0 ? `${stats.newLeads} new` : undefined },
    { icon: Mail, label: 'Subscribers', value: stats.subscribers, path: '/admin/newsletter', color: 'from-amber-500 to-orange-500' },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={stat.path}
              className="block card-premium p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.badge && (
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {stat.badge}
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-muted-foreground flex items-center gap-2">
                {stat.label}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-premium p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Recent Leads</h2>
          </div>
          <Link
            to="/admin/leads"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No leads yet. They will appear here when someone submits the contact form.
          </p>
        ) : (
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
              >
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'new' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {lead.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
