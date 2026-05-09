import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Clock, Cpu, X, Menu } from "lucide-react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/review/new", icon: PlusCircle, label: "New Review" },
  { to: "/history", icon: Clock, label: "History" },
];

function NavLinks({ onClose }: { onClose?: () => void }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
        >
          <Icon size={17} strokeWidth={1.8} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Cpu size={14} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-semibold text-gray-900 text-sm">CodeSentinel</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-64 bg-white h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Cpu size={14} className="text-white" strokeWidth={2} />
                </div>
                <span className="font-semibold text-gray-900 text-sm">CodeSentinel</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>
            <NavLinks onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 min-h-screen bg-white border-r border-gray-100 flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center">
            <Cpu size={16} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">CodeSentinel</p>
            <p className="text-xs text-gray-400 leading-tight">AI Code Review</p>
          </div>
        </div>
        <NavLinks />
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">Powered by Gemini AI</p>
        </div>
      </aside>
    </>
  );
}
