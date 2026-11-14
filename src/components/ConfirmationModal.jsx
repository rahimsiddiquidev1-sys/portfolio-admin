// src/components/ConfirmationModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      button: "bg-red-500 hover:bg-red-600",
      iconBg: "bg-red-500/20"
    },
    warning: {
      icon: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      button: "bg-yellow-500 hover:bg-yellow-600",
      iconBg: "bg-yellow-500/20"
    },
    info: {
      icon: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      button: "bg-blue-500 hover:bg-blue-600",
      iconBg: "bg-blue-500/20"
    }
  };

  const style = colors[type] || colors.danger;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="glass-strong rounded-2xl max-w-md w-full p-6 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
            >
              <FiX size={18} />
            </button>

            {/* Icon */}
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${style.iconBg} mx-auto`}>
              <FiAlertTriangle className={`h-7 w-7 ${style.icon}`} />
            </div>

            {/* Title & Message */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {message}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] ${style.button}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}