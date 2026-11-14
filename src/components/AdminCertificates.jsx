// src/components/AdminCertificates.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAward, FiExternalLink, FiCalendar } from "react-icons/fi";
import { db } from "../firebase/config";
import { ref, push, onValue, update, remove } from "firebase/database";
import { toast } from "react-toastify";
import { ConfirmationModal } from "./ConfirmationModal";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
    imageUrl: "",
  });

  // Fetch certificates from Firebase Realtime Database
  useEffect(() => {
    const certificatesRef = ref(db, "certificates");
    const unsubscribe = onValue(certificatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, cert]) => ({ id, ...cert }));
        list.sort((a, b) => {
          if (a.issueDate && b.issueDate) return b.issueDate.localeCompare(a.issueDate);
          if (a.issueDate) return -1;
          if (b.issueDate) return 1;
          return 0;
        });
        setCertificates(list);
      } else {
        setCertificates([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ title: "", issuer: "", issueDate: "", credentialUrl: "", imageUrl: "" });
    setEditingCertificate(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim()) {
      toast.error("Please enter a title and an issuer.");
      return;
    }
    setLoading(true);
    try {
      if (editingCertificate) {
        await update(ref(db, `certificates/${editingCertificate}`), {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Certificate updated successfully!");
      } else {
        await push(ref(db, "certificates"), {
          ...formData,
          createdAt: new Date().toISOString(),
        });
        toast.success("Certificate added successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast.error("Failed to save certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (certificate) => {
    setEditingCertificate(certificate.id);
    setFormData({
      title: certificate.title || "",
      issuer: certificate.issuer || "",
      issueDate: certificate.issueDate || "",
      credentialUrl: certificate.credentialUrl || "",
      imageUrl: certificate.imageUrl || "",
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await remove(ref(db, `certificates/${deleteConfirm}`));
      toast.success("Certificate deleted successfully!");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Failed to delete certificate. Please try again.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading && certificates.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        Loading certificates...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">Certificates</h2>
          <p className="mt-1 text-sm text-gray-400">
            {certificates.length} certificate{certificates.length === 1 ? "" : "s"} shown on the portfolio
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-purple-500"
        >
          {showForm ? <FiX /> : <FiPlus />}
          {showForm ? "Close" : "Add Certificate"}
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
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="cert-title">Title *</label>
              <input id="cert-title" type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. MERN Stack Development" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="cert-issuer">Issuer *</label>
              <input id="cert-issuer" type="text" name="issuer" value={formData.issuer} onChange={handleInputChange} placeholder="e.g. Saylani Mass IT Training" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="cert-issue-date">Issue Date</label>
              <input id="cert-issue-date" type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 [color-scheme:dark]" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="cert-credential-url">Credential URL</label>
              <input id="cert-credential-url" type="url" name="credentialUrl" value={formData.credentialUrl} onChange={handleInputChange} placeholder="https://example.com/verify/certificate" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="cert-image-url">Image URL</label>
              <input id="cert-image-url" type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://example.com/certificate.png" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Certificate preview" className="mt-3 h-32 w-auto rounded-xl border border-white/10 object-cover" />
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-purple-500">
              {editingCertificate ? "Update Certificate" : "Add Certificate"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/10">
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cyan-400">
            <FiAward size={24} />
          </span>
          <p className="font-medium text-white">No certificates yet</p>
          <p className="text-sm text-gray-400">Add your first certificate above — it will appear on the portfolio site.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {cert.imageUrl ? (
                <img src={cert.imageUrl} alt={cert.title} className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-white/5">
                  <FiAward size={40} className="text-cyan-400" />
                </div>
              )}
              <div className="space-y-1.5 p-4">
                <h3 className="font-semibold leading-snug text-white">{cert.title}</h3>
                <p className="text-sm text-gray-400">{cert.issuer}</p>
                {cert.issueDate && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FiCalendar size={12} />
                    {cert.issueDate}
                  </p>
                )}
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:underline">
                    View Credential <FiExternalLink size={12} />
                  </a>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => startEdit(cert)} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-white/10">
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(cert.id)} className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20">
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
        title="Delete Certificate?"
        message="This certificate will be permanently removed from the portfolio. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
