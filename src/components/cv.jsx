// src/components/AdminCV.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLink, FiSave, FiRefreshCw, FiExternalLink } from "react-icons/fi";
import { toast } from "sonner";
import { db } from "../firebase/config"; 
import { ref, get, set, onValue } from "firebase/database";

export function Cv() {
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  //  Fetch existing CV URL - Realtime Database
  useEffect(() => {
    fetchCV();

    //  Real-time listener
    const cvRef = ref(db, 'cv/url');
    const unsubscribe = onValue(cvRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCvUrl(data);
      }
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  const fetchCV = async () => {
    try {
      setLoading(true);
      const cvRef = ref(db, 'cv/url');
      const snapshot = await get(cvRef);
      
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCvUrl(data);
      } else {
        setCvUrl("");
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
      toast.error("Failed to load CV link: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveCV = async () => {
    
    if (!cvUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      setSaving(true);
      const cvRef = ref(db, 'cv/url');
      
      //  Save to Realtime Database
      await set(cvRef, cvUrl.trim());
      
      toast.success("CV link saved successfully! 🎉");
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error("Failed to save CV link: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const openCV = () => {
    if (cvUrl) {
      window.open(cvUrl, "_blank");
    } else {
      toast.error("No CV link set yet");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">📄 CV / Resume</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Set your CV download or view link (Realtime Database)
          </p>
        </div>
        <button
          onClick={fetchCV}
          disabled={loading}
          className="glass rounded-xl p-2 text-muted-foreground transition hover:text-foreground"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            CV Link (Google Drive, Dropbox, or direct PDF URL)
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="url"
                value={cvUrl}
                onChange={(e) => {
                  setCvUrl(e.target.value);
                }}
                placeholder="https://example.com/cv.pdf"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/20"
              />
            </div>
            <button
              onClick={openCV}
              disabled={!cvUrl}
              className="glass flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition hover:text-foreground disabled:opacity-50"
            >
              <FiExternalLink size={18} />
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Supported: Google Drive, Dropbox, OneDrive, or direct PDF URL
          </p>
        </div>

        {/* Current CV Status */}
        {cvUrl && (
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-foreground">Current CV URL set</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {cvUrl}
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={saveCV}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:opacity-70 hover:shadow-lg hover:shadow-[color:var(--neon-cyan)]/20"
        >
          {saving ? (
            <>
              <FiRefreshCw className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            <>
              <FiSave size={18} />
              Save CV Link
            </>
          )}
        </button>
      </div>

      {/* Preview Section */}
      {cvUrl && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-muted-foreground">Preview:</p>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-2 text-neon-cyan hover:underline"
          >
            {cvUrl.length > 50 ? cvUrl.substring(0, 50) + "..." : cvUrl}
            <FiExternalLink size={14} />
          </a>
        </div>
      )}
    </motion.div>
  );
}