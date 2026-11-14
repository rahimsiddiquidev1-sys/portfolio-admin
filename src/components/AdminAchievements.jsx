import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiCalendar } from "react-icons/fi";
import { db } from "../firebase/config";
import { ref, push, onValue, update, remove } from "firebase/database";
import { toast } from "react-toastify";
import { ConfirmationModal } from "./ConfirmationModal";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    event: "",
    date: "",
    description: "",
    imageUrl: "",
  });

  // Fetch achievements from Firebase Realtime Database
  useEffect(() => {
    const achievementsRef = ref(db, "achievements");
    const unsubscribe = onValue(achievementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, achievement]) => ({ id, ...achievement }));
        list.sort((a, b) => {
          if (a.date && b.date) return b.date.localeCompare(a.date);
          if (a.date) return -1;
          if (b.date) return 1;
          return 0;
        });
        setAchievements(list);
      } else {
        setAchievements([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ title: "", event: "", date: "", description: "", imageUrl: "" });
    setEditingAchievement(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.event.trim()) {
      toast.error("Please enter a title and an event.");
      return;
    }
    setLoading(true);
    try {
      if (editingAchievement) {
        await update(ref(db, `achievements/${editingAchievement}`), {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Achievement updated successfully!");
      } else {
        await push(ref(db, "achievements"), {
          ...formData,
          createdAt: new Date().toISOString(),
        });
        toast.success("Achievement added successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast.error("Failed to save achievement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (achievement) => {
    setEditingAchievement(achievement.id);
    setFormData({
      title: achievement.title || "",
      event: achievement.event || achievement.issuer || "",
      date: achievement.date || "",
      description: achievement.description || "",
      imageUrl: achievement.imageUrl || achievement.badgeUrl || "",
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await remove(ref(db, `achievements/${deleteConfirm}`));
      toast.success("Achievement deleted successfully!");
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Failed to delete achievement. Please try again.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading && achievements.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        Loading achievements...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">Achievements & Badges</h2>
          <p className="mt-1 text-sm text-gray-400">
            {achievements.length} achievement{achievements.length === 1 ? "" : "s"} shown on the portfolio
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {showForm ? <FiX /> : <FiPlus />}
          {showForm ? "Close" : "Add Achievement"}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="ach-title">Title *</label>
              <input id="ach-title" type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Coding Night Winner" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="ach-event">Event / Issuer *</label>
              <input id="ach-event" type="text" name="event" value={formData.event} onChange={handleInputChange} placeholder="e.g. Coding Night" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="ach-date">Date</label>
              <input id="ach-date" type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-cyan-400" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="ach-description">Description</label>
              <textarea id="ach-description" name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="What was the achievement about?" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-cyan-400" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="ach-image-url">Image / Badge URL</label>
              <input id="ach-image-url" type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-cyan-400" />
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Badge preview" className="mt-3 h-32 w-auto rounded-xl border border-white/10 object-cover" />
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
              {editingAchievement ? "Update Achievement" : "Add Achievement"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/10">
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {achievements.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cyan-400">
            <FiStar size={24} />
          </span>
          <p className="font-medium text-white">No achievements yet</p>
          <p className="text-sm text-gray-400">Add your first badge or event achievement above — it will appear on the portfolio.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <motion.div key={achievement.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {achievement.imageUrl || achievement.badgeUrl ? (
                <img src={achievement.imageUrl || achievement.badgeUrl} alt={achievement.title} className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-white/5">
                  <FiStar size={40} className="text-cyan-400" />
                </div>
              )}
              <div className="space-y-1.5 p-4">
                <h3 className="font-semibold leading-snug text-white">{achievement.title}</h3>
                <p className="text-sm text-gray-400">{achievement.event || achievement.issuer}</p>
                {achievement.date && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FiCalendar size={12} />
                    {achievement.date}
                  </p>
                )}
                {achievement.description && (
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => startEdit(achievement)} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/10">
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(achievement.id)} className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20">
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Achievement?"
        message="This achievement will be permanently removed from the portfolio. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
