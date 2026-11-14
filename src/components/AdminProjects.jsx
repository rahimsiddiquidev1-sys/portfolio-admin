
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { FiPlus, FiX, FiEdit2, FiGithub, FiExternalLink, FiImage, FiUpload } from "react-icons/fi";
import { db } from "../firebase/config";
import { ref, set, push, onValue, update, remove } from "firebase/database";
import { toast } from "react-toastify";
export function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    tech: [],
    github: "",
    demo: "",
    image: "",
  });
  const [techInput, setTechInput] = useState("");

  //  FETCH Projects from Firebase
  useEffect(() => {
    const projectsRef = ref(db, "all-project");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectsArray = Object.values(data);
        setProjects(projectsArray);
      } else {
        setProjects([]);
      }
    });
    return () => unsubscribe();
  }, []);

  //  Handle Image File Select
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  //  Remove Image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm({ ...form, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //  ADD Project
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill title and description",{
        position:"top-center"
      });
      return;
    }

    try {
      const techArray = techInput.split(",").map((t) => t.trim()).filter((t) => t);
      const newRef = push(ref(db, "all-project"));
      const projectData = {
        title: form.title,
        description: form.description,
        tech: techArray,
        github: form.github || "",
        demo: form.demo || "",
        image: form.image || "",
        id: newRef.key,
        createdAt: new Date().toISOString()
      };

      await set(newRef, projectData);
      toast.success("Project added!",{
              position:"top-center"
            });
      resetForm();
    } catch (error) {
      toast.error("Please enter your name",{
        position:"top-center"
      });
    }
  };

  //  UPDATE Project
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !editingId) {
      toast.error("Please fill all fields",{
        position:"top-center"
      });
      return;
    }

    try {
      const techArray = techInput.split(",").map((t) => t.trim()).filter((t) => t);
      await update(ref(db, `all-project/${editingId}`), {
        title: form.title,
        description: form.description,
        tech: techArray,
        github: form.github || "",
        demo: form.demo || "",
        image: form.image || "",
        updatedAt: new Date().toISOString()
      });
      toast.success("Project updated!",{
        position:"top-center"
      });
      resetForm();
    } catch (error) {
      toast.error("Error:"+ error.message,{
        position:"top-center"
      });
    }
  };

  //  DELETE Project
  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await remove(ref(db, `all-project/${id}`));
      toast.error("Project deleted",{
        position:"top-center"
      });
    } catch (error) {
      toast.error("Error:"+ error.message,{
        position:"top-center"
      });
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", tech: [], github: "", demo: "", image: "" });
    setTechInput("");
    setImageFile(null);
    setImagePreview("");
    setIsAdding(false);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      tech: project.tech || [],
      github: project.github || "",
      demo: project.demo || "",
      image: project.image || "",
    });
    setImagePreview(project.image || "");
    setTechInput((project.tech || []).join(", "));
    setEditingId(project.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <button
          onClick={() => setIsAdding(true)}
          className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-foreground transition hover:glow-border"
        >
          <FiPlus size={16} /> Add Project
        </button>
      )}

      {(isAdding || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground">
            {editingId ? "✏️ Edit Project" : "➕ Add New Project"}
          </h3>
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="mt-4 space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
                <FiImage className="inline mr-1.5" size={14} /> Project Image
              </label>

              <div className="flex items-center gap-4 flex-wrap">
                {imagePreview && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Project Preview"
                      className="h-20 w-20 rounded-xl object-cover border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                )}

                <div className="flex-1 min-w-[150px]">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                    id="projectImage"
                  />
                  <label
                    htmlFor="projectImage"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground cursor-pointer transition hover:bg-white/10 hover:glow-border"
                  >
                    <FiUpload size={16} /> Choose Image
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP</p>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="OR Image URL"
                    value={form.image}
                    onChange={(e) => {
                      setForm({ ...form, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Project Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              />
              <input
                type="text"
                placeholder="Tech Stack (comma separated)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              />
            </div>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="GitHub URL"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              />
              <input
                type="text"
                placeholder="Live Demo URL"
                value={form.demo}
                onChange={(e) => setForm({ ...form, demo: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
                style={{ boxShadow: "0 8px 24px rgba(0, 114, 255, 0.35)" }}
              >
                {editingId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/*  Projects List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No projects added yet. Click "Add Project" to get started.
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass group relative rounded-2xl p-5 transition hover:glow-border"
            >
              <div className="flex gap-4">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-20 w-20 rounded-xl object-cover flex-shrink-0 border border-white/10"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{project.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(project.tech || []).map((t, i) => (
                      <span key={i} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="text-xs text-neon-cyan hover:underline">
                        <FiGithub className="inline mr-1" size={14} /> GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noreferrer" className="text-xs text-neon-cyan hover:underline">
                        <FiExternalLink className="inline mr-1" size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => startEdit(project)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/20 hover:text-red-400"
                >
                  <FiX size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}