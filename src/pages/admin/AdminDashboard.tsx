import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FolderKanban, FileText, MessageSquare, Users, ArrowRight, TrendingUp, Mail, BarChart3, PieChart, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Stats {
  projects: number;
  posts: number;
  testimonials: number;
  leads: number;
  newLeads: number;
  subscribers: number;
}

interface GrowthData {
  date: string;
  count: number;
  rawDate: string;
}

interface SourceData {
  name: string;
  value: number;
  color: string;
}

interface WoWMetrics {
  subscribersThisWeek: number;
  subscribersLastWeek: number;
  subscriberChange: number;
  leadsThisWeek: number;
  leadsLastWeek: number;
  leadsChange: number;
}

type DateRange = 7 | 30 | 90;

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
  const [subscriberGrowth, setSubscriberGrowth] = useState<GrowthData[]>([]);
  const [leadsGrowth, setLeadsGrowth] = useState<GrowthData[]>([]);
  const [subscriberSources, setSubscriberSources] = useState<SourceData[]>([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [wowMetrics, setWowMetrics] = useState<WoWMetrics>({
    subscribersThisWeek: 0,
    subscribersLastWeek: 0,
    subscriberChange: 0,
    leadsThisWeek: 0,
    leadsLastWeek: 0,
    leadsChange: 0,
  });
  const [dateRange, setDateRange] = useState<DateRange>(30);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
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

      // Fetch data based on selected date range
      const startDate = subDays(new Date(), dateRange).toISOString();
      const { data: subscribers } = await supabase
        .from('newsletter_subscribers')
        .select('subscribed_at, source')
        .gte('subscribed_at', startDate)
        .order('subscribed_at', { ascending: true });

      const { data: leadsData } = await supabase
        .from('leads')
        .select('created_at')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true });

      // Fetch week-over-week data
      const thisWeekStart = subDays(new Date(), 7).toISOString();
      const lastWeekStart = subDays(new Date(), 14).toISOString();

      const [subsThisWeek, subsLastWeek, leadsThisWeekRes, leadsLastWeekRes] = await Promise.all([
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).gte('subscribed_at', thisWeekStart),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).gte('subscribed_at', lastWeekStart).lt('subscribed_at', thisWeekStart),
        supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', thisWeekStart),
        supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', lastWeekStart).lt('created_at', thisWeekStart),
      ]);

      const subscribersThisWeek = subsThisWeek.count || 0;
      const subscribersLastWeek = subsLastWeek.count || 0;
      const leadsThisWeek = leadsThisWeekRes.count || 0;
      const leadsLastWeek = leadsLastWeekRes.count || 0;

      const calcChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      setWowMetrics({
        subscribersThisWeek,
        subscribersLastWeek,
        subscriberChange: calcChange(subscribersThisWeek, subscribersLastWeek),
        leadsThisWeek,
        leadsLastWeek,
        leadsChange: calcChange(leadsThisWeek, leadsLastWeek),
      });

      // Calculate conversion rate
      const totalLeads = leadsRes.count || 0;
      const totalSubscribers = subscribersRes.count || 0;
      if (totalLeads > 0) {
        setConversionRate(Math.round((totalSubscribers / totalLeads) * 100));
      }

      // Process subscriber data into cumulative growth
      if (subscribers && subscribers.length > 0) {
        const dailyCounts: Record<string, number> = {};
        const sourceCounts: Record<string, number> = {};
        
        for (let i = dateRange; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          dailyCounts[date] = 0;
        }

        subscribers.forEach((sub) => {
          const date = format(new Date(sub.subscribed_at), 'yyyy-MM-dd');
          if (dailyCounts[date] !== undefined) {
            dailyCounts[date]++;
          }
          const source = sub.source || 'website';
          sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });

        let cumulative = 0;
        const growthData: GrowthData[] = Object.entries(dailyCounts)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, count]) => {
            cumulative += count;
            return {
              date: format(new Date(date), 'MMM d'),
              rawDate: date,
              count: cumulative,
            };
          });

        setSubscriberGrowth(growthData);

        const sourceColors: Record<string, string> = {
          homepage: 'hsl(var(--primary))',
          footer: 'hsl(221, 83%, 53%)',
          website: 'hsl(142, 76%, 36%)',
          blog: 'hsl(262, 83%, 58%)',
        };
        
        const sourceData: SourceData[] = Object.entries(sourceCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: sourceColors[name] || 'hsl(var(--muted-foreground))',
        }));
        
        setSubscriberSources(sourceData);
      } else {
        setSubscriberGrowth([]);
        setSubscriberSources([]);
      }

      // Process leads growth data
      if (leadsData && leadsData.length > 0) {
        const dailyCounts: Record<string, number> = {};
        
        for (let i = dateRange; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          dailyCounts[date] = 0;
        }

        leadsData.forEach((lead) => {
          const date = format(new Date(lead.created_at), 'yyyy-MM-dd');
          if (dailyCounts[date] !== undefined) {
            dailyCounts[date]++;
          }
        });

        let cumulative = 0;
        const growthData: GrowthData[] = Object.entries(dailyCounts)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, count]) => {
            cumulative += count;
            return {
              date: format(new Date(date), 'MMM d'),
              rawDate: date,
              count: cumulative,
            };
          });

        setLeadsGrowth(growthData);
      } else {
        setLeadsGrowth([]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const exportToCSV = () => {
    const headers = ['Date', 'Subscribers', 'Leads'];
    const rows = subscriberGrowth.map((sub, index) => {
      const lead = leadsGrowth[index];
      return [sub.rawDate, sub.count, lead?.count || 0];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics-${dateRange}days-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    
    toast({
      title: 'Export successful',
      description: `Analytics data for the last ${dateRange} days has been downloaded.`,
    });
  };

  const statCards = [
    { icon: FolderKanban, label: 'Projects', value: stats.projects, path: '/admin/projects', color: 'from-blue-500 to-cyan-500' },
    { icon: FileText, label: 'Blog Posts', value: stats.posts, path: '/admin/posts', color: 'from-violet-500 to-purple-500' },
    { icon: MessageSquare, label: 'Testimonials', value: stats.testimonials, path: '/admin/testimonials', color: 'from-emerald-500 to-teal-500' },
    { icon: Users, label: 'Leads', value: stats.leads, path: '/admin/leads', color: 'from-rose-500 to-pink-500', badge: stats.newLeads > 0 ? `${stats.newLeads} new` : undefined },
    { icon: Mail, label: 'Subscribers', value: stats.subscribers, path: '/admin/newsletter', color: 'from-amber-500 to-orange-500' },
  ];

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
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

  const GrowthIndicator = ({ change }: { change: number }) => (
    <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
      {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
      {Math.abs(change)}%
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your admin panel</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  dateRange === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

      {/* Week-over-Week Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-premium p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Week-over-Week Performance</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Subscribers This Week</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{wowMetrics.subscribersThisWeek}</p>
              <GrowthIndicator change={wowMetrics.subscriberChange} />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Subscribers Last Week</p>
            <p className="text-2xl font-bold">{wowMetrics.subscribersLastWeek}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Leads This Week</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{wowMetrics.leadsThisWeek}</p>
              <GrowthIndicator change={wowMetrics.leadsChange} />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Leads Last Week</p>
            <p className="text-2xl font-bold">{wowMetrics.leadsLastWeek}</p>
          </div>
        </div>
      </motion.div>

      {/* Conversion Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card-premium p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Conversion Metrics</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-bold text-primary">{stats.leads}</p>
            <p className="text-sm text-muted-foreground">Total Leads</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-bold text-primary">{stats.subscribers}</p>
            <p className="text-sm text-muted-foreground">Total Subscribers</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-bold text-emerald-500">{conversionRate}%</p>
            <p className="text-sm text-muted-foreground">Lead-to-Subscriber Ratio</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Subscriber Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Subscriber Growth</h2>
            </div>
            <Link
              to="/admin/newsletter"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {subscriberGrowth.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No subscriber data yet. Growth will appear here as people subscribe.
            </p>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={subscriberGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="subscriberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickMargin={8}
                    interval={dateRange === 7 ? 0 : dateRange === 30 ? 4 : 10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value} subscribers`, 'Total']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(38, 92%, 50%)"
                    strokeWidth={2}
                    fill="url(#subscriberGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Leads Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card-premium p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Leads Growth</h2>
            </div>
            <Link
              to="/admin/leads"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {leadsGrowth.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No leads data yet. Growth will appear here as leads come in.
            </p>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadsGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(346, 77%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(346, 77%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickMargin={8}
                    interval={dateRange === 7 ? 0 : dateRange === 30 ? 4 : 10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value} leads`, 'Total']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(346, 77%, 50%)"
                    strokeWidth={2}
                    fill="url(#leadsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Grid: Sources and Recent Leads */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Subscriber Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-premium p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
              <PieChart className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Subscriber Sources</h2>
          </div>

          {subscriberSources.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No source data yet. Analytics will appear as subscribers sign up.
            </p>
          ) : (
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={subscriberSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {subscriberSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [`${value} subscribers`, name]}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {subscriberSources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-sm">{source.name}</span>
                    </div>
                    <span className="text-sm font-medium">{source.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
