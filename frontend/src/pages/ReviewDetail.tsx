import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../lib/api";
import type { Review } from "../types";
import ScoreRing from "../components/ScoreRing";
import SeverityBadge from "../components/SeverityBadge";
import toast from "react-hot-toast";
import { Download, Trash2, Bug, ShieldAlert, Zap, Lightbulb, Code2, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

function Section({ title, icon: Icon, count, accent, children }: {
  title: string; icon: any; count: number; accent: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="card">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full group">
        <div className="flex items-center gap-2.5">
          <Icon size={16} className={accent} strokeWidth={2} />
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">{count}</span>
        </div>
        {open
          ? <ChevronUp size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          : <ChevronDown size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors" />}
      </button>
      {open && <div className="mt-4 space-y-2.5">{children}</div>}
    </div>
  );
}

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<Review | null>(null);
  const [showFixed, setShowFixed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reviews/${id}`)
      .then((r) => setReview(r.data))
      .catch(() => { toast.error("Review not found"); navigate("/history"); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleExport = async () => {
    try {
      const res = await api.get(`/reviews/${id}/export/pdf`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url; a.download = `review_${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Export failed"); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;
    await api.delete(`/reviews/${id}`);
    toast.success("Deleted");
    navigate("/history");
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="flex items-center gap-3 text-gray-400">
        <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Fetching analysis…</span>
      </div>
    </div>
  );
  if (!review) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate("/history")} className="btn-ghost p-2 mt-0.5 shrink-0">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900 truncate">{review.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="capitalize">{review.language}</span> · {new Date(review.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={handleExport} className="btn-ghost">
            <Download size={15} /> <span className="hidden sm:inline">PDF</span>
          </button>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 size={15} /> <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Score card */}
      <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <ScoreRing score={review.overall_score} size={88} />
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Overall Quality Score</p>
          <p className="text-sm text-gray-600 leading-relaxed">{review.summary}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            {[
              { label: `${review.bugs.length} bugs`, color: "text-red-500" },
              { label: `${review.security_issues.length} security`, color: "text-amber-600" },
              { label: `${review.performance_issues.length} performance`, color: "text-blue-500" },
              { label: `${review.suggestions.length} suggestions`, color: "text-violet-600" },
            ].map(({ label, color }) => (
              <span key={label} className={`text-xs font-semibold ${color}`}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bugs */}
      {review.bugs.length > 0 && (
        <Section title="Bugs & Errors" icon={Bug} count={review.bugs.length} accent="text-red-500">
          {review.bugs.map((bug, i) => (
            <div key={i} className="bg-red-50/60 border border-red-100 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <SeverityBadge severity={bug.severity} />
                <span className="text-sm font-medium text-gray-800">{bug.type}</span>
                {bug.line && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Line {bug.line}</span>}
              </div>
              <p className="text-sm text-gray-600">{bug.description}</p>
              <p className="text-sm text-emerald-600 mt-2 font-medium">→ {bug.suggestion}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Security */}
      {review.security_issues.length > 0 && (
        <Section title="Security Issues" icon={ShieldAlert} count={review.security_issues.length} accent="text-amber-600">
          {review.security_issues.map((s, i) => (
            <div key={i} className="bg-amber-50/60 border border-amber-100 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <SeverityBadge severity={s.severity} />
                <span className="text-sm font-medium text-gray-800">{s.issue}</span>
                {s.line && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Line {s.line}</span>}
              </div>
              <p className="text-sm text-emerald-600 font-medium">→ {s.recommendation}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Performance */}
      {review.performance_issues.length > 0 && (
        <Section title="Performance" icon={Zap} count={review.performance_issues.length} accent="text-blue-500">
          {review.performance_issues.map((p, i) => (
            <div key={i} className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-sm text-emerald-600 mt-2 font-medium">→ {p.recommendation}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Suggestions */}
      {review.suggestions.length > 0 && (
        <Section title="Suggestions" icon={Lightbulb} count={review.suggestions.length} accent="text-violet-600">
          {review.suggestions.map((s, i) => (
            <div key={i} className="flex gap-3 p-3 bg-violet-50/60 border border-violet-100 rounded-xl">
              <span className="text-xs bg-white text-violet-600 border border-violet-200 px-2 py-0.5 rounded-full h-fit whitespace-nowrap font-medium">{s.category}</span>
              <p className="text-sm text-gray-600">{s.description}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Fixed Code */}
      {review.fixed_code && (
        <div className="card">
          <button onClick={() => setShowFixed(!showFixed)} className="flex items-center justify-between w-full group">
            <div className="flex items-center gap-2.5">
              <Code2 size={16} className="text-emerald-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-gray-800">AI-Fixed Code</span>
            </div>
            {showFixed
              ? <ChevronUp size={15} className="text-gray-300" />
              : <ChevronDown size={15} className="text-gray-300" />}
          </button>
          {showFixed && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 h-[380px]">
              <Editor
                height="100%"
                language={review.language}
                value={review.fixed_code}
                theme="vs"
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, padding: { top: 14 }, fontFamily: "'Fira Code', monospace" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
