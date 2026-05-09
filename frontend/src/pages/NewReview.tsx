import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../lib/api";
import toast from "react-hot-toast";
import { Sparkles, Paperclip } from "lucide-react";

const LANGUAGES = ["python", "javascript", "typescript", "java", "cpp", "c", "go", "rust", "php", "ruby", "kotlin", "swift", "sql", "bash"];

export default function NewReview() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("# Paste your code here\n");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.trim() === "# Paste your code here") {
      toast.error("Please enter some code to review");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/reviews/analyze", { title, language, code });
      toast.success("Analysis complete!");
      navigate(`/review/${data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCode(ev.target?.result as string);
    reader.readAsText(file);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto h-full flex flex-col gap-5">

      <div>
        <h1 className="text-xl font-semibold text-gray-900">New Review</h1>
        <p className="text-sm text-gray-400 mt-0.5">Paste your code and get an instant AI analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Title</label>
            <input className="input" placeholder="e.g. User authentication module" value={title}
              onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Language</label>
            <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code</label>
            <label className="btn-ghost text-xs cursor-pointer">
              <Paperclip size={13} strokeWidth={2} />
              Upload file
              <input type="file" className="hidden"
                accept=".py,.js,.ts,.java,.cpp,.c,.go,.rs,.php,.rb,.kt,.swift,.sql,.sh"
                onChange={handleFileUpload} />
            </label>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 min-h-[380px] shadow-sm">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                lineHeight: 22,
                renderLineHighlight: "none",
              }}
            />
          </div>
        </div>

        <div className="flex justify-end pb-2">
          <button type="submit" className="btn-primary px-6" disabled={loading}>
            <Sparkles size={16} strokeWidth={2} />
            {loading ? "Analyzing…" : "Analyze with AI"}
          </button>
        </div>
      </form>
    </div>
  );
}
