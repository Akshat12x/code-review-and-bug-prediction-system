import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import toast from "react-hot-toast";
import { Code2, Zap, Shield, BarChart3 } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        await api.post("/auth/register", form);
        toast.success("Account created! Please log in.");
        setMode("login");
      } else {
        const { data } = await api.post("/auth/login", { username: form.username, password: form.password });
        login(data.access_token, data.user);
        toast.success(`Welcome back, ${data.user.username}!`);
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-16 border-r border-slate-800">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Code2 size={28} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">CodeSentinel AI</span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          AI-Powered Code Review &<br />
          <span className="text-blue-400">Bug Prediction System</span>
        </h1>
        <p className="text-slate-400 text-lg mb-12">
          Leverage Google Gemini AI to detect bugs, security vulnerabilities, and performance issues in your code instantly.
        </p>
        <div className="space-y-5">
          {[
            { icon: Zap, label: "Instant AI Analysis", desc: "Get deep code review in seconds" },
            { icon: Shield, label: "Security Scanning", desc: "Detect vulnerabilities before they ship" },
            { icon: BarChart3, label: "Analytics Dashboard", desc: "Track code quality over time" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="p-2 bg-blue-900/50 rounded-lg border border-blue-800">
                <Icon size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">{label}</p>
                <p className="text-slate-500 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Code2 size={24} className="text-blue-400" />
            <span className="text-xl font-bold">CodeSentinel AI</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="text-slate-400 mb-8">{mode === "login" ? "Sign in to your account" : "Start reviewing code with AI"}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <input className="input" placeholder="johndoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-blue-400 hover:text-blue-300 font-medium">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {mode === "login" && (
            <div className="mt-4 p-3 bg-slate-800 border border-slate-700 rounded-lg text-center">
              <p className="text-xs text-slate-400 mb-1">Demo credentials</p>
              <p className="text-sm text-slate-200">
                <span className="text-blue-400 font-mono">demo</span>
                {" / "}
                <span className="text-blue-400 font-mono">demo1234</span>
              </p>
              <button
                type="button"
                onClick={() => setForm({ ...form, username: "demo", password: "demo1234" })}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Click to autofill
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
