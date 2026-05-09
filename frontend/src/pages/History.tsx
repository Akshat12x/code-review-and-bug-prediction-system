import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import type { Review } from "../types";
import ScoreRing from "../components/ScoreRing";
import { Search, Bug, ShieldAlert, Plus, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function History() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reviews/history")
      .then((r) => setReviews(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this review?")) return;
    await api.delete(`/reviews/${id}`);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("Deleted");
  };

  const languages = ["all", ...Array.from(new Set(reviews.map((r) => r.language)))];
  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (r.title.toLowerCase().includes(q) || r.language.toLowerCase().includes(q))
      && (langFilter === "all" || r.language === langFilter);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">History</h1>
          <p className="text-sm text-gray-400 mt-0.5">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/review/new" className="btn-primary">
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">New Review</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9 text-sm" placeholder="Search reviews…" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-36 text-sm shrink-0" value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}>
          {languages.map((l) => (
            <option key={l} value={l}>{l === "all" ? "All" : l}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 text-sm mb-4">No reviews found</p>
          <Link to="/review/new" className="btn-primary inline-flex">
            <Plus size={15} /> Start a review
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <Link key={r.id} to={`/review/${r.id}`}
              className="card flex items-center gap-4 hover:border-violet-200 hover:shadow-md transition-all group p-4">
              <ScoreRing score={r.overall_score} size={48} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-violet-600 transition-colors">
                  {r.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{r.language}</span>
                  <span className="flex items-center gap-1 text-xs text-red-500">
                    <Bug size={10} strokeWidth={2} />{r.bugs.length}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <ShieldAlert size={10} strokeWidth={2} />{r.security_issues.length}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={(e) => handleDelete(r.id, e)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-violet-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
