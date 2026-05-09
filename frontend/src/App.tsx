import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NewReview from "./pages/NewReview";
import ReviewDetail from "./pages/ReviewDetail";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155" },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/review/new" element={<NewReview />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          <Route path="/history" element={<History />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
