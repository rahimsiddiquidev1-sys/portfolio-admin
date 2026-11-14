// components/AdminDashboard.jsx
import { motion } from "framer-motion";
import { FiTool, FiFolder, FiMail, FiClock } from "react-icons/fi";

export function AdminDashboard({ skills, projects, messages }) {
  const unreadCount = messages.filter((m) => !m.read).length;

  const stats = [
    { label: "Total Skills", value: skills.length, icon: FiTool, color: "#00c6ff" },
    { label: "Total Projects", value: projects.length, icon: FiFolder, color: "#0072ff" },
    { label: "Total Messages", value: messages.length, icon: FiMail, color: "#7b5bff" },
    { label: "Unread Messages", value: unreadCount, icon: FiClock, color: "#ff6b6b" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="glass rounded-2xl p-6 transition hover:glow-border"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `rgba(0, 198, 255, 0.15)` }}>
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}