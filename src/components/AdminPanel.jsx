import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiHome, FiTool, FiFolder, FiMail, FiUser, FiX, FiFile, FiAward, FiStar } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { AdminDashboard } from "./AdminDashboard";
import { AdminSkills } from "./AdminSkills";
import { AdminProjects } from "./AdminProjects"; import AdminCertificates from "./AdminCertificates"; import AdminAchievements from "./AdminAchievements";
import { AdminMessages } from "./AdminMessages";
// import { AdminSettings } from "./AdminSettings";
import { AdminProfile } from "./AdminProfile";
import { Cv } from "./cv"; 

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: FiHome },
  { id: "skills", label: "Skills", icon: FiTool },
  { id: "projects", label: "Projects", icon: FiFolder }, { id: "certificates", label: "Certificates", icon: FiAward }, { id: "achievements", label: "Achievements", icon: FiStar },
  { id: "messages", label: "Messages", icon: FiMail },
  { id: "cv", label: "CV", icon: FiFile }, 
  { id: "profile", label: "Profile", icon: FiUser },
];

export function AdminPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { skills, projects, messages } = useAdmin();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard skills={skills} projects={projects} messages={messages} />;
      case "skills":
        return <AdminSkills />;
      case "projects":
        return <AdminProjects />; case "certificates": return <AdminCertificates />; case "achievements": return <AdminAchievements />;
      case "messages":
        return <AdminMessages />;
      case "cv":
        return <Cv />;
      case "settings":
        return <AdminSettings />;
      case "profile":
        return <AdminProfile />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-[#0a0a23] p-4 pt-20"
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 glass rounded-xl p-2 text-muted-foreground transition hover:text-foreground hover:glow-border"
      >
        <FiX size={22} />
      </button>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient sm:text-4xl">⚙️ Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your skills, projects, and view messages.</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "glass-strong text-foreground glow-border"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {/*  Messages Badge COMPLETELY REMOVED */}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
