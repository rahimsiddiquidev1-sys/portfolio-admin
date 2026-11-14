// src/pages/Home.jsx
import { useState } from "react";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import { ParticlesBackground, GlowOrbs } from "../components/particlesBackground";
import { AdminToggle } from "../components/AdminToggle";
import { AdminPanel } from "../components/AdminPanel";
import { Login } from "../components/Login"; //  Import Login
import { PortfolioProvider, useAdmin } from "../context/AdminContext";
import { FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

//  Main App Component with Auth
function AppContent() {
  const { isAdmin, setIsAdmin, user, loading } = useAdmin();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  //  Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a23]">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  //  If not admin, show login page
  if (!isAdmin) {
    return (
      <Login onLogin={() => {
        setIsAdmin(true);
      }} />
    );
  }

  //  If admin, show portfolio with admin panel
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GlowOrbs />
      <ParticlesBackground />
      
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 py-4">
          <div className="mx-auto max-w-7xl px-4">
            <div className="glass-strong flex items-center justify-between rounded-2xl px-5 py-3">
              <a href="/" className="text-2xl font-bold tracking-tight text-gradient">
                MR<span className="text-foreground/60">.</span>
              </a>
              <div className="hidden items-center gap-1 md:flex">
                <a href="#home" className="relative rounded-lg px-3 py-2 text-sm font-medium text-foreground">
                  Home
                </a>
                <a href="#skills" className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Skills
                </a>
                <a href="#projects" className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Projects
                </a>
                <a href="#contact" className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-emerald-400 hidden sm:inline">
                  🟢 Admin
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <section id="home" className="relative flex min-h-screen items-center pt-28 pb-16">
            <div className="mx-auto max-w-7xl px-4 text-center">
              <h1 className="text-5xl font-bold text-white">
                Hi, I'm <span className="text-gradient">MUHAMMAD RAHIM SIDDIQUI</span>
              </h1>
              <p className="mt-4 text-xl text-white/60">MERN Stack Developer</p>
            </div>
          </section>

          <footer className="relative border-t border-white/10 py-8">
            <div className="mx-auto max-w-7xl px-4 text-center text-white/60">
              © 2024 <span className="text-gradient font-semibold">MR</span>. Built with care.
            </div>
          </footer>
        </main>
      </div>

      {/*  Admin Toggle */}
      <AdminToggle 
        isAdmin={true} 
        toggleAdmin={() => setShowAdminPanel(!showAdminPanel)} 
      />
      
      {/*  Admin Panel */}
      <AnimatePresence>
        {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      </AnimatePresence>

      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

//  Main Home Component
export default function Home() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}