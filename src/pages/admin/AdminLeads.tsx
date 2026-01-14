import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Building, DollarSign, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  services: string[] | null;
  message: string | null;
  budget: string | null;
  timeline: string | null;
  referral_source: string | null;
  status: 'new' | 'read' | 'contacted' | 'converted' | 'closed';
  notes: string | null;
  created_at: string;
}

const statusColors = {
  new: 'bg-blue-500/10 text-blue-500',
  read: 'bg-gray-500/10 text-gray-500',
  contacted: 'bg-yellow-500/10 text-yellow-500',
  converted: 'bg-emerald-500/10 text-emerald-500',
  closed: 'bg-red-500/10 text-red-500',
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setLeads(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: Lead['status']) => {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      fetchLeads();
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ notes })
      .eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

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
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-muted-foreground mt-1">Manage contact form submissions</p>
      </div>

      {leads.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No leads yet. They will appear here when someone submits the contact form.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => {
                  setExpandedLead(expandedLead === lead.id ? null : lead.id);
                  if (lead.status === 'new') {
                    updateStatus(lead.id, 'read');
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{lead.name}</h3>
                      {lead.status === 'new' && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {lead.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                  {expandedLead === lead.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {expandedLead === lead.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border"
                >
                  <div className="p-6 space-y-6">
                    {/* Info grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {lead.company && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span>{lead.company}</span>
                        </div>
                      )}
                      {lead.budget && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>{lead.budget}</span>
                        </div>
                      )}
                      {lead.timeline && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{lead.timeline}</span>
                        </div>
                      )}
                      {lead.referral_source && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          Referred by: {lead.referral_source}
                        </div>
                      )}
                    </div>

                    {/* Services */}
                    {lead.services && lead.services.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Services requested:</p>
                        <div className="flex flex-wrap gap-2">
                          {lead.services.map((service) => (
                            <span
                              key={service}
                              className="px-3 py-1 rounded-full bg-secondary text-sm"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    {lead.message && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Message:</p>
                        <p className="text-sm bg-secondary/50 rounded-xl p-4">{lead.message}</p>
                      </div>
                    )}

                    {/* Status update */}
                    <div className="flex flex-wrap gap-2">
                      <p className="text-sm text-muted-foreground mr-2">Update status:</p>
                      {(['new', 'read', 'contacted', 'converted', 'closed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(lead.id, status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            lead.status === status
                              ? statusColors[status]
                              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    {/* Notes */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Internal notes:</p>
                      <textarea
                        defaultValue={lead.notes || ''}
                        onBlur={(e) => updateNotes(lead.id, e.target.value)}
                        placeholder="Add notes about this lead..."
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminLeads;
