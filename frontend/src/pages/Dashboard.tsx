import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import api from "../lib/api";
import type { AnalyticsSummary, Review } from "../types";
import ScoreRing from "../components/ScoreRing";
import { Plus, Bug, ShieldAlert, FileCode2, TrendingUp, ArrowRight } from "lucide-react";

const PIE_COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recent, setRecent] = useState<Review[]>([]);

  useEffect(() => {
    api.get("/reviews/analytics").then((r) => setAnalytics(r.data)).catch(() => {});
    api.get("/reviews/history").then((r) => setRecent(r.data.slice(0, 5))).catch(() => {});
  }, []);

  const langData = analytics
    ? Object.entries(analytics.languages_used).map(([name, value]) => ({ name, value }))
    : [];

  const stats = [
    { label: "Total Reviews", value: analytics?.total_reviews ?? 0, icon: FileCode2, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Average Score", value: analytics ? `${analytics.avg_score}/10` : "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Bugs Detected", value: analytics?.bugs_found ?? 0, icon: Bug, color: "text-red-500", bg: "bg-red-50" },
    { label: "Security Issues", value: analytics?.security_issues_found ?? 0, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your code review analytics</p>
        </div>
        <Link to="/review/new" className="btn-primary">
          <Plus size={16} strokeWidth={2.5} />
          New Review
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`p-2.5 rounded-xl ${bg} shrink-0`}>
              <Icon size={18} className={color} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Language chart */}
        <div className="card lg:col-span-2">
          <p className="text-sm font-semibold text-gray-700 mb-4">Languages</p>
          {langData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={langData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75}>
                    {langData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 12, fontSize: 12 }}
                    itemStyle={{ color: "#374151" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {langData.map((d, i) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sm text-gray-300">No data yet</div>
          )}
        </div>

        {/* Recent reviews */}
        <div className="card lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-700">Recent Reviews</p>
            <Link to="/history" className="text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recent.length > 0 ? (
            <div className="space-y-2">
              {recent.map((r) => (
                <Link key={r.id} to={`/review/${r.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <ScoreRing score={r.overall_score} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-violet-600 transition-colors">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.language} · {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-violet-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                <FileCode2 size={22} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No reviews yet</p>
              <Link to="/review/new" className="btn-primary text-xs px-4 py-2">Start your first review</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
