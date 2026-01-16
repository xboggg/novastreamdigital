import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Mail, Users } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  status: string;
  source: string | null;
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setSubscribers(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;

    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Removed', description: 'Subscriber removed successfully' });
      fetchSubscribers();
    }
  };

  const exportCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.status === 'active');
    const csv = [
      'Email,Subscribed Date,Status,Source',
      ...activeSubscribers.map(s => 
        `${s.email},${new Date(s.subscribed_at).toLocaleDateString()},${s.status},${s.source || 'website'}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Exported', description: `${activeSubscribers.length} subscribers exported to CSV` });
  };

  const activeCount = subscribers.filter(s => s.status === 'active').length;

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Newsletter</h1>
          <p className="text-muted-foreground mt-1">Manage your email subscribers</p>
        </div>
        <Button variant="hero" onClick={exportCSV} disabled={subscribers.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-premium p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active Subscribers</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Mail className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subscribers.length}</p>
              <p className="text-sm text-muted-foreground">Total Signups</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-6 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">
            Export subscribers to use with<br />
            <span className="text-foreground font-medium">Mailchimp, Brevo, ConvertKit</span>
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No subscribers yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add the newsletter component to your pages to start collecting emails
          </p>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Subscribed</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <motion.tr
                  key={subscriber.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-medium">{subscriber.email}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscriber.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminNewsletter;
