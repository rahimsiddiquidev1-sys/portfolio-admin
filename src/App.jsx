// App.jsx
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AdminProvider, useAdmin } from "./context/AdminContext";
// import { Login } from "./components/Login";
import { AdminToggle } from "./components/AdminToggle";
import { AdminPanel } from "./components/AdminPanel";
import "./styles.css";

function AppContent() {
  // const { isAuthenticated } = useAdmin();
  const [isAdmin, setIsAdmin] = useState(false);

  // if (!isAuthenticated) {
  //   return <Login />;
  // }

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      {/* Portfolio UI Content Here */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-4">Hi, I'm MUHAMMAD RAHIM SIDDIQUI</h1>
          <p className="text-2xl text-muted-foreground mb-4">Building Scalable Web Apps</p>
          <p className="text-muted-foreground max-w-xl mx-auto">
            I design and build fast, resilient web products end-to-end — from clean APIs to interfaces that feel great to use.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <button className="glass px-6 py-3 rounded-xl text-sm font-semibold hover:glow-border transition">View My Work</button>
            <button className="bg-gradient-primary px-6 py-3 rounded-xl text-sm font-semibold text-white transition hover:scale-105">Contact Me</button>
          </div>
          <div className="mt-6 flex gap-6 justify-center text-sm text-muted-foreground">
            <span>✨ 1+ yrs exp.</span>
            <span>📊 20+ projects</span>
          </div>
        </div>
      </div>

      <AdminToggle isAdmin={isAdmin} toggleAdmin={() => setIsAdmin(!isAdmin)} />

      <AnimatePresence>
        {isAdmin && <AdminPanel onClose={() => setIsAdmin(false)} />}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}

export default App;