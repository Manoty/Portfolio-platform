import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { analyticsService } from "@/services/analytics.service";
import type { AnalyticsSummary, DailyView, TopItem } from "@/types";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";

const RANGE_OPTIONS = [7, 14, 30, 90];

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dailyViews, setDailyViews] = useState<DailyView[]>([]);
  const [topProjects, setTopProjects] = useState<TopItem[]>([]);
  const [topPosts, setTopPosts] = useState<TopItem[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [s, dv, tp, tb] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getDailyViews(days),
        analyticsService.getTopProjects(),
        analyticsService.getTopPosts(),
      ]);
      setSummary(s);
      setDailyViews(dv);
      setTopProjects(tp);
      setTopPosts(tb);
      setLoading(false);
    };
    load();
  }, [days]);

  if (loading) return <PageSpinner />;
  if (!summary) return null;

  const summaryCards = [
    { label: "Total Page Views", value: summary.total_views },
    { label: "Unique Visitors", value: summary.unique_visitors },
    { label: "Views (30 days)", value: summary.recent_views_30d },
    { label: "Resume Downloads", value: summary.resume_downloads },
    { label: "Contact Submissions", value: summary.contact_submissions },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Self-hosted platform metrics</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map(({ label, value }) => (
          <Card key={label}>
            <CardBody>
              <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Traffic chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-gray-900">Page Views Over Time</h2>
            <div className="flex gap-1">
              {RANGE_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    days === d
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyViews}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                labelFormatter={(v) => formatDate(v)}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#grad)"
                name="Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Top content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Top Projects</h2>
          </CardHeader>
          <CardBody>
            {topProjects.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProjects} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="object_title"
                    tick={{ fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Views" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Top Blog Posts</h2>
          </CardHeader>
          <CardBody>
            {topPosts.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topPosts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="object_title"
                    tick={{ fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Views" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}