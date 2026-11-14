// src/components/AdminSkills.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiPlus, FiX, FiEdit2 } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { auth, db } from '../firebase/config';
import { ref, set, push, onValue, update, remove } from "firebase/database";
import { toast } from "react-toastify";
import { ConfirmationModal } from "./ConfirmationModal";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as ImIcons from "react-icons/im";
import * as VscIcons from "react-icons/vsc";
import * as CgIcons from "react-icons/cg";
import * as TbIcons from "react-icons/tb";
import * as RxIcons from "react-icons/rx";

export function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", icon: "FaReact", color: "#61DAFB" });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // All Icons Collection
  const allIcons = {
    ...FaIcons,
    ...SiIcons,
    ...FiIcons,
    ...AiIcons,
    ...IoIcons,
    ...MdIcons,
    ...BsIcons,
    ...BiIcons,
    ...RiIcons,
    ...GiIcons,
    ...GoIcons,
    ...GrIcons,
    ...HiIcons,
    ...ImIcons,
    ...VscIcons,
    ...CgIcons,
    ...TbIcons,
    ...RxIcons,
  };

  // Debug: Log all available icon names
 
  // Get Icon Component with multiple fallback strategies
  const getIcon = (iconName) => {
    if (!iconName) {
      console.warn("No icon name provided, using default");
      return FaIcons.FaReact;
    }

    // Trim whitespace
    const trimmedName = iconName.trim();
    
    // Strategy 1: Direct match
    if (allIcons[trimmedName]) {
      return allIcons[trimmedName];
    }

    // Strategy 2: Case-insensitive match
    const matchedKey = Object.keys(allIcons).find(
      key => key.toLowerCase() === trimmedName.toLowerCase()
    );
    if (matchedKey) {
      return allIcons[matchedKey];
    }

    // Strategy 3: Check if it's in FaIcons specifically (for debugging)
    if (FaIcons[trimmedName]) {
      return FaIcons[trimmedName];
    }

    // Strategy 4: Try to find partial match (if icon name has prefix)
    const partialMatch = Object.keys(allIcons).find(
      key => key.toLowerCase().includes(trimmedName.toLowerCase()) || 
             trimmedName.toLowerCase().includes(key.toLowerCase())
    );
    if (partialMatch) {
      return allIcons[partialMatch];
    }

    // If nothing found, log warning and return default
    return FaIcons.FaReact;
  };

  // Check if icon exists
  const isValidIcon = (iconName) => {
    if (!iconName) return false;
    const trimmedName = iconName.trim();
    return !!(allIcons[trimmedName] || 
              Object.keys(allIcons).some(key => key.toLowerCase() === trimmedName.toLowerCase()));
  };

  // Fetch Skills from Firebase
  const fetchSkills = () => {
    const skillsRef = ref(db, "skills");
    onValue(skillsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const skillsArray = Object.keys(data).map((key) => {
          const skill = data[key];
          // Debug: Log each skill's icon
          return {
            id: key,
            ...skill
          };
        });
        setSkills(skillsArray);
      } else {
        setSkills([]);
      }
    });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Add Skill
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name.trim()) {
      toast.error("Skill name is required", { position: "top-center" });
      setLoading(false);
      return;
    }

    // Clean icon name
    const cleanIcon = form.icon.trim();
    
    // Validate icon
    if (!isValidIcon(cleanIcon)) {
      toast.warning(`Icon "${cleanIcon}" not found. Using default React icon.`, {
        position: "top-center"
      });
    }

    try {
      const newRef = push(ref(db, "skills"));
      await set(newRef, {
        name: form.name.trim(),
        icon: cleanIcon || "FaReact",
        color: form.color || "#61DAFB",
        createdAt: new Date().toISOString()
      });

      toast.success(`Skill "${form.name}" added successfully!`, { 
        position: "top-center" 
      });
      setForm({ name: "", icon: "FaReact", color: "#61DAFB" });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill: " + error.message, { 
        position: "top-center" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Update Skill
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name.trim()) {
      toast.error("Skill name is required", { position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      await update(ref(db, `skills/${editingId}`), {
        name: form.name.trim(),
        icon: form.icon.trim() || "FaReact",
        color: form.color || "#61DAFB",
        updatedAt: new Date().toISOString()
      });

      toast.success("Skill updated successfully!", { position: "top-center" });
      setForm({ name: "", icon: "FaReact", color: "#61DAFB" });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill: " + error.message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await remove(ref(db, `skills/${deleteTarget}`));
      toast.success("Skill deleted successfully!", { position: "top-center" });
    } finally {
      setDeleteTarget(null);
    }
  };

  const startEdit = (skill) => {
    setForm({
      name: skill.name,
      icon: skill.icon || "FaReact",
      color: skill.color || "#61DAFB"
    });
    setEditingId(skill.id);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setForm({ name: "", icon: "FaReact", color: "#61DAFB" });
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Skill?"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete Skill"
        cancelText="Cancel"
        type="danger"
      />

      {!isAdding && !editingId && (
        <button
          onClick={() => setIsAdding(true)}
          className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-foreground transition hover:glow-border"
        >
          <FiPlus size={16} /> Add Skill
        </button>
      )}

      {(isAdding || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground">
            {editingId ? "✏️ Edit Skill" : "➕ Add New Skill"}
          </h3>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="mt-4 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Skill Name (e.g., HTML5)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="flex-1 min-w-[140px] rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              disabled={loading}
            />

            <input
              type="text"
              placeholder="Icon Name (e.g., FaHtml5)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="flex-1 min-w-[140px] rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              disabled={loading}
            />

            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="h-11 w-11 cursor-pointer rounded-xl border border-white/10 bg-transparent"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:opacity-70"
            >
              {loading ? "Saving..." : editingId ? "Update" : "Add"}
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Cancel
            </button>
          </form>

          {/* Icon Preview */}
          {form.icon && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Preview:</span>
              {(() => {
                const IconComponent = getIcon(form.icon);
                const isValid = isValidIcon(form.icon);
                const iconName = form.icon.trim();
                
                // Debug: Log what we're trying to render
                
                return (
                  <>
                    <IconComponent 
                      color={form.color} 
                      size={24} 
                      className={!isValid ? "opacity-50" : ""}
                    />
                    <span className="text-xs text-muted-foreground">
                      {form.name || "Skill Name"}
                      {!isValid && (
                        <span className="ml-2 text-yellow-400">(Using default icon)</span>
                      )}
                      {isValid && (
                        <span className="ml-2 text-green-400 text-[10px]">✓</span>
                      )}
                    </span>
                  </>
                );
              })()}
            </div>
          )}
        </motion.div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {skills.map((skill) => {
          const IconComponent = getIcon(skill.icon);
          const isValid = isValidIcon(skill.icon);
          
          // Debug: Log each skill rendering
          
          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass group relative rounded-2xl p-4 transition hover:glow-border"
            >
              <div className="flex items-center gap-3">
                <IconComponent 
                  color={skill.color || "#61DAFB"} 
                  size={28}
                  className={!isValid ? "opacity-50" : ""}
                />
                <span className="text-sm font-medium text-foreground">{skill.name}</span>
                {!isValid && (
                  <span className="text-[8px] text-yellow-400" title={`Icon "${skill.icon}" not found`}>
                    ⚠️
                  </span>
                )}
              </div>

              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => startEdit(skill)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/20 hover:text-red-400"
                >
                  <FiX size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No skills added yet. Click "Add Skill" to get started.</p>
        </div>
      )}
    </div>
  );
} 