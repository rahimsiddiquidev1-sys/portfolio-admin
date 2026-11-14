
import { motion } from "framer-motion";
import { FiSettings, FiX, FiLogOut } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export function AdminToggle({ isAdmin, toggleAdmin }) {
  const { logout } = useAdmin();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {isAdmin && (
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 backdrop-blur-xl border border-red-500/20 hover:bg-red-500/30 transition"
        >
          <FiLogOut size={16} /> Logout
        </motion.button>
      )}

      <motion.button
        onClick={toggleAdmin}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all ${
          isAdmin ? "bg-red-500/30 backdrop-blur-xl border border-red-500/30" : ""
        }`}
        style={{
          background: isAdmin ? "rgba(239, 68, 68, 0.2)" : "linear-gradient(135deg, #00c6ff, #0072ff)",
          boxShadow: isAdmin ? "0 8px 32px rgba(239, 68, 68, 0.2)" : "0 8px 32px rgba(0, 114, 255, 0.4)",
        }}
      >
        {isAdmin ? (
          <>
            <FiX size={18} /> Close Admin
          </>
        ) : (
          <>
            <FiSettings size={18} /> Admin Panel
          </>
        )}
      </motion.button>
    </div>
  );
}