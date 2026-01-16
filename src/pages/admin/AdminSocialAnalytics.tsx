import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay, differenceInDays } from 'date-fns';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { ArrowLeft, Eye, MousePointer, TrendingUp, TrendingDown, BarChart3, Loader2, Download, CalendarIcon, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

type Platform = 'tiktok' | 'youtube' | 'instagram' | 'facebook';
type TimeRange = '7d' | '30d' | '90d' | 'custom';

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

// Growth indicator component
const GrowthIndicator = ({ current, previous, label }: { current: number; previous: number; label: string }) => {
  const change = previous > 0 ? ((current - previous) / previous) * 100 : current > 0 ? 100 : 0;
  const isPositive = change >= 0;
  
  return (
    <div className="flex items-center gap-1">
      {isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
      <span className={cn("text-sm font-medium", isPositive ? "text-green-500" : "text-red-500")}>
        {isPositive ? '+' : ''}{change.toFixed(1)}%
      </span>
      <span className="text-xs text-muted-foreground">vs prev {label}</span>
    </div>
  );
};

const AdminSocialAnalytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [platformFilter, setPlatformFilter] = useState<'all' | Platform>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

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

  // Calculate date range based on selection
  const effectiveDateRange = useMemo(() => {
    if (timeRange === 'custom' && dateRange?.from) {
      return {
        start: startOfDay(dateRange.from),
        end: dateRange.to ? endOfDay(dateRange.to) : endOfDay(new Date()),
      };
    }
    
    const now = new Date();
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return {
      start: startOfDay(subDays(now, daysAgo)),
      end: endOfDay(now),
    };
  }, [timeRange, dateRange]);

  // Filter posts by date range
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const postDate = new Date(post.created_at);
      return postDate >= effectiveDateRange.start && postDate <= effectiveDateRange.end;
    });
  }, [posts, effectiveDateRange]);

  // Calculate previous period for comparison
  const previousPeriodPosts = useMemo(() => {
    const periodLength = differenceInDays(effectiveDateRange.end, effectiveDateRange.start);
    const prevStart = subDays(effectiveDateRange.start, periodLength + 1);
    const prevEnd = subDays(effectiveDateRange.start, 1);
    
    return posts.filter(post => {
      const postDate = new Date(post.created_at);
      return postDate >= prevStart && postDate <= prevEnd;
    });
  }, [posts, effectiveDateRange]);

  // Apply platform filter
  const displayPosts = useMemo(() => {
    if (platformFilter === 'all') return filteredPosts;
    return filteredPosts.filter(p => p.platform === platformFilter);
  }, [filteredPosts, platformFilter]);

  const previousDisplayPosts = useMemo(() => {
    if (platformFilter === 'all') return previousPeriodPosts;
    return previousPeriodPosts.filter(p => p.platform === platformFilter);
  }, [previousPeriodPosts, platformFilter]);

  // Calculate current period totals
  const totals = useMemo(() => {
    const views = displayPosts.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const clicks = displayPosts.reduce((sum, p) => sum + (p.click_count || 0), 0);
    return {
      views,
      clicks,
      posts: displayPosts.length,
      ctr: views > 0 ? (clicks / views) * 100 : 0,
      engagementRate: displayPosts.length > 0 ? (clicks + views) / displayPosts.length : 0,
    };
  }, [displayPosts]);

  // Calculate previous period totals
  const previousTotals = useMemo(() => {
    const views = previousDisplayPosts.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const clicks = previousDisplayPosts.reduce((sum, p) => sum + (p.click_count || 0), 0);
    return {
      views,
      clicks,
      posts: previousDisplayPosts.length,
      ctr: views > 0 ? (clicks / views) * 100 : 0,
      engagementRate: previousDisplayPosts.length > 0 ? (clicks + views) / previousDisplayPosts.length : 0,
    };
  }, [previousDisplayPosts]);

  // Week-over-week metrics
  const wowMetrics = useMemo(() => {
    const now = new Date();
    const thisWeekStart = subDays(now, 7);
    const lastWeekStart = subDays(now, 14);
    const lastWeekEnd = subDays(now, 7);

    const thisWeekPosts = displayPosts.filter(p => {
      const d = new Date(p.created_at);
      return d >= thisWeekStart && d <= now;
    });

    const lastWeekPosts = displayPosts.filter(p => {
      const d = new Date(p.created_at);
      return d >= lastWeekStart && d < lastWeekEnd;
    });

    const thisWeekViews = thisWeekPosts.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const thisWeekClicks = thisWeekPosts.reduce((sum, p) => sum + (p.click_count || 0), 0);
    const lastWeekViews = lastWeekPosts.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const lastWeekClicks = lastWeekPosts.reduce((sum, p) => sum + (p.click_count || 0), 0);

    return {
      thisWeek: { views: thisWeekViews, clicks: thisWeekClicks },
      lastWeek: { views: lastWeekViews, clicks: lastWeekClicks },
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
      engagementRate: data.posts > 0 ? ((data.views + data.clicks) / data.posts).toFixed(1) : '0',
      ctr: data.views > 0 ? ((data.clicks / data.views) * 100).toFixed(2) : '0',
      fill: platformColors[platform as Platform],
    }));
  }, [filteredPosts]);

  // Top performing posts
  const topPosts = useMemo(() => {
    return [...displayPosts]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 10)
      .map(post => ({
        id: post.id,
        name: post.title || post.embed_id.slice(0, 15) + '...',
        views: post.view_count || 0,
        clicks: post.click_count || 0,
        platform: post.platform,
        ctr: post.view_count ? ((post.click_count || 0) / post.view_count * 100).toFixed(1) : '0',
        engagementRate: ((post.view_count || 0) + (post.click_count || 0)).toFixed(0),
        created_at: post.created_at,
      }));
  }, [displayPosts]);

  // Time series data
  const timeSeriesData = useMemo(() => {
    const grouped = displayPosts.reduce((acc, post) => {
      const date = format(new Date(post.created_at), 'MMM d');
      if (!acc[date]) {
        acc[date] = { date, views: 0, clicks: 0, engagement: 0 };
      }
      acc[date].views += post.view_count || 0;
      acc[date].clicks += post.click_count || 0;
      acc[date].engagement += (post.view_count || 0) + (post.click_count || 0);
      return acc;
    }, {} as Record<string, { date: string; views: number; clicks: number; engagement: number }>);

    return Object.values(grouped).slice(-14);
  }, [displayPosts]);

  // Views by platform pie chart data
  const pieData = useMemo(() => {
    return platformData.filter(d => d.views > 0);
  }, [platformData]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Post Title', 'Platform', 'Views', 'Clicks', 'CTR (%)', 'Engagement Rate', 'Created At'];
    const rows = displayPosts.map(post => [
      post.title || post.embed_id,
      post.platform,
      post.view_count || 0,
      post.click_count || 0,
      post.view_count ? ((post.click_count || 0) / post.view_count * 100).toFixed(2) : '0',
      (post.view_count || 0) + (post.click_count || 0),
      format(new Date(post.created_at), 'yyyy-MM-dd HH:mm'),
    ]);

    // Add summary rows
    rows.push([]);
    rows.push(['Summary']);
    rows.push(['Total Views', totals.views]);
    rows.push(['Total Clicks', totals.clicks]);
    rows.push(['Overall CTR (%)', totals.ctr.toFixed(2)]);
    rows.push(['Avg Engagement per Post', totals.engagementRate.toFixed(2)]);
    rows.push(['Date Range', `${format(effectiveDateRange.start, 'yyyy-MM-dd')} to ${format(effectiveDateRange.end, 'yyyy-MM-dd')}`]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `social-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    if (value !== 'custom') {
      const now = new Date();
      const daysAgo = value === '7d' ? 7 : value === '30d' ? 30 : 90;
      setDateRange({
        from: subDays(now, daysAgo),
        to: now,
      });
    }
  };

  const periodLabel = timeRange === '7d' ? 'week' : timeRange === '30d' ? 'month' : 'period';

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
        <div className="flex flex-col gap-4">
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

            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={timeRange} onValueChange={(v) => handleTimeRangeChange(v as TimeRange)}>
              <TabsList>
                <TabsTrigger value="7d">7 days</TabsTrigger>
                <TabsTrigger value="30d">30 days</TabsTrigger>
                <TabsTrigger value="90d">90 days</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>

            {timeRange === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}

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

        {/* Summary Cards with Week-over-Week */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{totals.views.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <GrowthIndicator current={totals.views} previous={previousTotals.views} label={periodLabel} />
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
                <div className="flex-1">
                  <p className="text-2xl font-bold">{totals.clicks.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <GrowthIndicator current={totals.clicks} previous={previousTotals.clicks} label={periodLabel} />
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
                <div className="flex-1">
                  <p className="text-2xl font-bold">{totals.ctr.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">Click-Through Rate</p>
                  <GrowthIndicator current={totals.ctr} previous={previousTotals.ctr} label={periodLabel} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{totals.engagementRate.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Avg Engagement/Post</p>
                  <GrowthIndicator current={totals.engagementRate} previous={previousTotals.engagementRate} label={periodLabel} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{totals.posts}</p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <GrowthIndicator current={totals.posts} previous={previousTotals.posts} label={periodLabel} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week-over-Week Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Week-over-Week Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">This Week Views</p>
                <p className="text-2xl font-bold">{wowMetrics.thisWeek.views.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Last Week Views</p>
                <p className="text-2xl font-bold">{wowMetrics.lastWeek.views.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">This Week Clicks</p>
                <p className="text-2xl font-bold">{wowMetrics.thisWeek.clicks.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Last Week Clicks</p>
                <p className="text-2xl font-bold">{wowMetrics.lastWeek.clicks.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-8 mt-4">
              <GrowthIndicator 
                current={wowMetrics.thisWeek.views} 
                previous={wowMetrics.lastWeek.views} 
                label="week (views)" 
              />
              <GrowthIndicator 
                current={wowMetrics.thisWeek.clicks} 
                previous={wowMetrics.lastWeek.clicks} 
                label="week (clicks)" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Over Time */}
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

          {/* Platform Performance with Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {platformData.length > 0 ? (
                <div className="space-y-4">
                  {platformData.map((platform) => (
                    <div key={platform.platform} className="p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{platform.name}</span>
                        <span className="text-sm text-muted-foreground">{platform.posts} posts</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Views</p>
                          <p className="font-semibold">{platform.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Clicks</p>
                          <p className="font-semibold">{platform.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CTR</p>
                          <p className="font-semibold text-primary">{platform.ctr}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Eng/Post</p>
                          <p className="font-semibold">{platform.engagementRate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {topPosts.map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
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