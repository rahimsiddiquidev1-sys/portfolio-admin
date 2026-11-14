// src/components/Login.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export function Login() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);
    
    if (!success) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a23] p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-strong rounded-3xl p-8 max-w-md w-full border border-white/10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-12 py-3 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </span>
            ) : (
              <>
                <FiLogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}