// components/AdminProfile.jsx
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiImage, FiUpload, FiX, FiEdit2 } from "react-icons/fi";
import { db } from "../firebase/config";
import { ref, set, push, onValue, update, remove } from "firebase/database";
import { toast } from "react-toastify";
export function AdminProfile() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    image: "",
  });

  const [profileId, setProfileId] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const profileRef = ref(db, "profile-detail");
    const unsubscribe = onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Get first profile (assuming only one)
        const keys = Object.keys(data);
        const firstKey = keys[0];
        const profileData = data[firstKey];
        
        setForm({
          name: profileData.name || "",
          title: profileData.title || "",
          bio: profileData.bio || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          github: profileData.github || "",
          linkedin: profileData.linkedin || "",
          image: profileData.profile || profileData.image || "",
        });
        setImagePreview(profileData.profile || profileData.image || "");
        setProfileId(firstKey);
        setIsEditing(true);
      } else {
        setIsEditing(false);
        setProfileId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  //  Upload Image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "portfolio-image");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dociusesl/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (result.secure_url) {
        setImageFile(result.secure_url);
        setImagePreview(result.secure_url);
        setForm({ ...form, image: result.secure_url });
     } else {
        console.error(" Upload failed:", result);
      }
    } catch (error) {
      console.error(" Upload error:", error);
    }
  };

  //  Handle File Select
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  // Remove Image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm({ ...form, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Submit (Add New)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error("Please enter your name",{
        position:"top-center"
      });
      return;
    }

    try {
      const newRef = push(ref(db, "profile-detail"));
      await set(newRef, {
        name: form.name,
        title: form.title,
        bio: form.bio,
        email: form.email,
        phone: form.phone,
        location: form.location,
        github: form.github,
        linkedin: form.linkedin,
        profile: form.image || "",
        id: newRef.key,
        createdAt: new Date().toISOString()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Profile saved successfully!",{
        position:"top-center"
      });
      setIsEditing(true);
      setProfileId(newRef.key);
    } catch (error) {
      toast.error("Error:"+error.message,{
        position:"top-center"
      });
    }
  };

  // Handle Update (Edit Existing)
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error("Please enter your name",{
        position:"top-center"
      });
      return;
    }

    if (!profileId) {
      toast.error("No profile found to update",{
        position:"top-center"
      });
      return;
    }

    try {
      await update(ref(db, `profile-detail/${profileId}`), {
        name: form.name,
        title: form.title,
        bio: form.bio,
        email: form.email,
        phone: form.phone,
        location: form.location,
        github: form.github,
        linkedin: form.linkedin,
        profile: form.image || "",
        updatedAt: new Date().toISOString()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Profile updated successfully!",{
        position:"top-center"
      });
    } catch (error) {
     toast.error("Error:"+ error.message,{
        position:"top-center"
      });
    }
  };

  //  Reset Form (Clear All)
  const resetForm = () => {
    if (!confirm("Clear all profile data?")) return;
    
    setForm({
      name: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      location: "",
      github: "",
      linkedin: "",
      image: "",
    });
    setImagePreview("");
    setImageFile(null);
    setProfileId(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Delete Profile
  const deleteProfile = async () => {
    if (!profileId) {
      toast.error("No profile found to delete",{
        position:"top-center"
      });
      return;
    }

    if (!confirm("Are you sure you want to delete your profile?")) return;

    try {
      await remove(ref(db, `profile-detail/${profileId}`));
      setProfileId(null);
      setIsEditing(false);
      setForm({
        name: "",
        title: "",
        bio: "",
        email: "",
        phone: "",
        location: "",
        github: "",
        linkedin: "",
        image: "",
      });
      setImagePreview("");
      setImageFile(null);
      toast.success("Profile deleted",{
        position:"top-center"
      });
    } catch (error) {
      toast.error("Error:"+ error.message,{
        position:"top-center"
      });
     }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-foreground">
            <FiUser className="inline mr-2" /> Profile Settings
          </h2>
          <div className="flex items-center gap-2">
            {isEditing && (
              <span className="text-xs text-green-400">Profile exists</span>
            )}
            {!isEditing && (
              <span className="text-xs text-yellow-400">⚠️ No profile</span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {isEditing ? "Edit your profile information." : "Create your profile information."}
        </p>

        <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="space-y-4">
          {/* Profile Image - File Upload */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
              <FiImage className="inline mr-1.5" size={14} /> Profile Image
            </label>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Image Preview */}
              <div className="relative flex-shrink-0">
                <img
                  src={imagePreview || "https://ui-avatars.com/api/?name=User&size=128&background=0072ff&color=fff&bold=true"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border-2 border-white/10"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1 min-w-[150px]">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                  id="profileImage"
                />
                <label
                  htmlFor="profileImage"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground cursor-pointer transition hover:bg-white/10 hover:glow-border"
                >
                  <FiUpload size={16} />
                  Choose Image
                </label>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP</p>
              </div>

              {/* OR Image URL */}
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

          {/* Name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
              <FiUser className="inline mr-1.5" size={14} /> Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
              Professional Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="MERN Stack Developer | Full Stack Engineer"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
              Bio / Description
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="I design and build fast, resilient web products..."
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
                <FiMail className="inline mr-1.5" size={14} /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
                <FiPhone className="inline mr-1.5" size={14} /> Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
              <FiMapPin className="inline mr-1.5" size={14} /> Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Your location"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Social Links</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  <FiGithub className="inline mr-1" size={14} /> GitHub
                </label>
                <input
                  type="text"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  <FiLinkedin className="inline mr-1" size={14} /> LinkedIn
                </label>
                <input
                  type="text"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground outline-none transition focus:border-[color:var(--neon-cyan)]/60 focus:ring-2 focus:ring-[color:var(--neon-cyan)]/25"
                />
              </div>
            </div>
          </div>

          {/* Success Message */}
          {saved && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm flex items-center gap-1.5">
               Profile {isEditing ? "updated" : "saved"} successfully!
            </motion.p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
              style={{ boxShadow: "0 8px 24px rgba(0, 114, 255, 0.35)" }}
            >
              <FiSave size={18} /> {isEditing ? "Update Profile" : "Save Profile"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-3 rounded-xl border border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-white/20 transition"
            >
              Clear
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={deleteProfile}
                className="px-4 py-3 rounded-xl border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
              >
                Delete Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}