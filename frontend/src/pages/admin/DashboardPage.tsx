import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban, FileText, MessageSquare, Download,
  TrendingUp, Eye, Users, ArrowRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { analyticsService } from "@/services/analytics.service";
import { projectsService } from "@/services/projects.service";
import { blogService } from "@/services/blog.service";
import { contactService } from "@/services/contact.service";
import type { AnalyticsSummary, DailyView, TopItem } from "@/types";
import { PageSpinner } from "@/components/ui/Spinner";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface DashboardStats {
  analytics: AnalyticsSummary;
  dailyViews: DailyView[];
  topProjects: TopItem[];
  topPosts: TopItem[];
  totalProjects: number;
  totalPosts: number;
  unreadMessages: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [analytics, dailyViews, topProjects, topPosts, projects, posts, messages] =
          await Promise.all([
            analyticsService.getSummary(),
            analyticsService.getDailyViews(30),
            analyticsService.getTopProjects(),
            analyticsService.getTopPosts(),
            projectsService.list({ all: true }),
            blogService.list({ all: true }),
            contactService.list({ status: "unread" }),
          ]);

        setStats({
          analytics,
          dailyViews,
          topProjects,
          topPosts,
          totalProjects: projects.count,
          totalPosts: posts.count,
          unreadMessages: messages.count,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageSpinner />;
  if (!stats) return null;

  const summaryCards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "text-blue-600 bg-blue-50",
      to: "/admin/projects",
    },
    {
      label: "Blog Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-purple-600 bg-purple-50",
      to: "/admin/blog",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "text-yellow-600 bg-yellow-50",
      to: "/admin/messages",
    },
    {
      label: "Resume Downloads",
      value: stats.analytics.resume_downloads,
      icon: Download,
      color: "text-green-600 bg-green-50",
      to: "/admin/resume",
    },
    {
      label: "Total Page Views",
      value: stats.analytics.total_views,
      icon: Eye,
      color: "text-indigo-600 bg-indigo-50",
      to: "/admin/analytics",
    },
    {
      label: "Unique Visitors",
      value: stats.analytics.unique_visitors,
      icon: Users,
      color: "text-pink-600 bg-pink-50",
      to: "/admin/analytics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your portfolio platform
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to}>
            <Card hover className="h-full">
              <CardBody className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {value.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Traffic chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Traffic — Last 30 Days</h2>
            <div className="flex items-center gap-1.5 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>{stats.analytics.recent_views_30d.toLocaleString()} views</span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.dailyViews}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(val) =>
                  new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
                labelFormatter={(val) => formatDate(val)}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorViews)"
                name="Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Top content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Top Projects</h2>
              <Link
                to="/admin/projects"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {stats.topProjects.length === 0 ? (
              <p className="text-sm text-gray-400 px-6 py-4">No data yet</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {stats.topProjects.map((item, i) => (
                  <div key={item.object_id} className="flex items-center gap-3 px-6 py-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-gray-700 truncate">
                      {item.object_title || "Untitled"}
                    </span>
                    <Badge variant="info">{item.count} views</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Top posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Top Blog Posts</h2>
              <Link
                to="/admin/blog"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {stats.topPosts.length === 0 ? (
              <p className="text-sm text-gray-400 px-6 py-4">No data yet</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {stats.topPosts.map((item, i) => (
                  <div key={item.object_id} className="flex items-center gap-3 px-6 py-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-gray-700 truncate">
                      {item.object_title || "Untitled"}
                    </span>
                    <Badge variant="info">{item.count} views</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}