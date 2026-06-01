import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/admin";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio CMS</h1>
          <p className="text-gray-400 text-sm">Admin access only</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              loading={isLoading}
              className="w-full mt-2"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <a href="/admin/reset-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          <a href="/" className="hover:text-gray-400 transition-colors">
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}