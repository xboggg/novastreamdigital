import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { ArrowLeft, Eye, MousePointer, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

type Platform = 'tiktok' | 'youtube' | 'instagram' | 'facebook';
type TimeRange = '7d' | '30d' | '90d' | 'all';

interface SocialPost {
  id: string;
  platform: Platform;
  title: string | null;
  embed_id: string;
  view_count: number;
  click_count: number;
  status: string;
  created_at: string;
  is_featured: boolean;
}

const platformColors: Record<Platform, string> = {
  tiktok: 'hsl(var(--chart-1))',
  youtube: 'hsl(var(--chart-2))',
  instagram: 'hsl(var(--chart-3))',
  facebook: 'hsl(var(--chart-4))',
};

const platformLabels: Record<Platform, string> = {
  tiktok: 'TikTok',
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
};

const chartConfig = {
  views: { label: 'Views', color: 'hsl(var(--chart-1))' },
  clicks: { label: 'Clicks', color: 'hsl(var(--chart-2))' },
  tiktok: { label: 'TikTok', color: 'hsl(var(--chart-1))' },
  youtube: { label: 'YouTube', color: 'hsl(var(--chart-2))' },
  instagram: { label: 'Instagram', color: 'hsl(var(--chart-3))' },
  facebook: { label: 'Facebook', color: 'hsl(var(--chart-4))' },
};

const AdminSocialAnalytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [platformFilter, setPlatformFilter] = useState<'all' | Platform>('all');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['social-posts-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as SocialPost[];
    },
  });

  // Filter posts by time range
  const filteredPosts = useMemo(() => {
    if (timeRange === 'all') return posts;
    
    const now = new Date();
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    return posts.filter(post => new Date(post.created_at) >= cutoff);
  }, [posts, timeRange]);

  // Apply platform filter
  const displayPosts = useMemo(() => {
    if (platformFilter === 'all') return filteredPosts;
    return filteredPosts.filter(p => p.platform === platformFilter);
  }, [filteredPosts, platformFilter]);

  // Calculate totals
  const totals = useMemo(() => {
    return {
      views: displayPosts.reduce((sum, p) => sum + (p.view_count || 0), 0),
      clicks: displayPosts.reduce((sum, p) => sum + (p.click_count || 0), 0),
      posts: displayPosts.length,
      ctr: displayPosts.reduce((sum, p) => sum + (p.view_count || 0), 0) > 0
        ? (displayPosts.reduce((sum, p) => sum + (p.click_count || 0), 0) / 
           displayPosts.reduce((sum, p) => sum + (p.view_count || 0), 0) * 100)
        : 0,
    };
  }, [displayPosts]);

  // Platform breakdown data
  const platformData = useMemo(() => {
    const grouped = filteredPosts.reduce((acc, post) => {
      const platform = post.platform as Platform;
      if (!acc[platform]) {
        acc[platform] = { views: 0, clicks: 0, posts: 0 };
      }
      acc[platform].views += post.view_count || 0;
      acc[platform].clicks += post.click_count || 0;
      acc[platform].posts += 1;
      return acc;
    }, {} as Record<Platform, { views: number; clicks: number; posts: number }>);

    return Object.entries(grouped).map(([platform, data]) => ({
      name: platformLabels[platform as Platform],
      platform: platform as Platform,
      views: data.views,
      clicks: data.clicks,
      posts: data.posts,
      fill: platformColors[platform as Platform],
    }));
  }, [filteredPosts]);

  // Top performing posts
  const topPosts = useMemo(() => {
    return [...displayPosts]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 10)
      .map(post => ({
        name: post.title || post.embed_id.slice(0, 15) + '...',
        views: post.view_count || 0,
        clicks: post.click_count || 0,
        platform: post.platform,
        ctr: post.view_count ? ((post.click_count || 0) / post.view_count * 100).toFixed(1) : '0',
      }));
  }, [displayPosts]);

  // Time series data (posts created over time with their metrics)
  const timeSeriesData = useMemo(() => {
    const grouped = displayPosts.reduce((acc, post) => {
      const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = { date, views: 0, clicks: 0 };
      }
      acc[date].views += post.view_count || 0;
      acc[date].clicks += post.click_count || 0;
      return acc;
    }, {} as Record<string, { date: string; views: number; clicks: number }>);

    return Object.values(grouped).slice(-14);
  }, [displayPosts]);

  // Views by platform pie chart data
  const pieData = useMemo(() => {
    return platformData.filter(d => d.views > 0);
  }, [platformData]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/social">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Social Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Track views, clicks, and engagement across all social posts
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Tabs value={platformFilter} onValueChange={(v) => setPlatformFilter(v as typeof platformFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totals.views.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <MousePointer className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totals.clicks.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totals.ctr.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">Click-Through Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totals.posts}</p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {timeSeriesData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stackId="2"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for this time range
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Views by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={pieData}
                      dataKey="views"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No view data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Breakdown Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {platformData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={platformData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="views" name="Views" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="clicks" name="Clicks" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No platform data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {topPosts.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {topPosts.map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg font-bold text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{post.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{post.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <p className="font-medium">{post.views.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">views</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{post.clicks.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">clicks</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">{post.ctr}%</p>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No posts to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSocialAnalytics;