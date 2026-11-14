// src/context/AdminContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  ref, 
  get, 
  set, 
  update, 
  push, 
  remove, 
  onValue 
} from "firebase/database";
import { toast } from "sonner";
import { DiBlackberry } from "react-icons/di";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  //  Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Data States
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [adminCreds, setAdminCreds] = useState({ email: "admin@portfolio.com", password: "admin123" });

  //  Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        // Fetch data from Realtime DB
        fetchAllData();
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  //  Fetch all data from Realtime Database
  const fetchAllData = async () => {
    try {
      // Fetch Skills
      const skillsRef = ref(db, 'skills');
      const skillsSnap = await get(skillsRef);
      if (skillsSnap.exists()) {
        const data = skillsSnap.val();
        const skillsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setSkills(skillsArray);
      } else {
        // Initialize with default data
        const defaultSkills = [
          { name: "React", icon: "⚛️", level: 90 },
          { name: "Next.js", icon: "▲", level: 85 },
          { name: "Node.js", icon: "🟢", level: 80 },
          { name: "MongoDB", icon: "🍃", level: 75 },
          { name: "TypeScript", icon: "📘", level: 70 },
          { name: "Tailwind CSS", icon: "🎨", level: 85 },
        ];
        const newSkillsRef = ref(db, 'skills');
        await set(newSkillsRef, defaultSkills);
        setSkills(defaultSkills);
      }

      // Fetch Projects
      const projectsRef = ref(db, 'projects');
      const projectsSnap = await get(projectsRef);
      if (projectsSnap.exists()) {
        const data = projectsSnap.val();
        const projectsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProjects(projectsArray);
      } else {
        const defaultProjects = [
          { title: "E-Commerce App", description: "Full-stack e-commerce with React & Node.js", tech: ["React", "Node.js", "MongoDB"] },
          { title: "Portfolio Website", description: "Modern portfolio with glassmorphism", tech: ["React", "Tailwind CSS"] },
        ];
        const newProjectsRef = ref(db, 'projects');
        await set(newProjectsRef, defaultProjects);
        setProjects(defaultProjects);
      }

      // Fetch Messages
      const messagesRef = ref(db, 'messages');
      const messagesSnap = await get(messagesRef);
      if (messagesSnap.exists()) {
        const data = messagesSnap.val();
        const messagesArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMessages(messagesArray);
      } else {
        const defaultMessages = [
          { text: "Hello! I'm interested in your services.", read: false, date: new Date().toISOString() },
        ];
        const newMessagesRef = ref(db, 'messages');
        await set(newMessagesRef, defaultMessages);
        setMessages(defaultMessages);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data from database");
    }
  };

  //  Real-time listeners for data updates
  useEffect(() => {
    if (!isAuthenticated) return;

    // Listen for skills updates
    const skillsRef = ref(db, 'skills');
    const skillsUnsubscribe = onValue(skillsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const skillsArray = Array.isArray(data) ? data : Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setSkills(skillsArray);
      }
    });

    // Listen for projects updates
    const projectsRef = ref(db, 'projects');
    const projectsUnsubscribe = onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projectsArray = Array.isArray(data) ? data : Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProjects(projectsArray);
      }
    });

    // Listen for messages updates
    const messagesRef = ref(db, 'messages');
    const messagesUnsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Array.isArray(data) ? data : Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMessages(messagesArray);
      }
    });

    return () => {
      skillsUnsubscribe();
      projectsUnsubscribe();
      messagesUnsubscribe();
    };
  }, [isAuthenticated]);

  //  Auth Functions
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setIsAuthenticated(true);
      setUser(user);
      await fetchAllData();
      toast.success("Welcome back! 🎉");
      return true;
    } catch (error) {
      console.error("❌ Login error:", error);
      let errorMessage = "Invalid email or password";
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password. Please try again.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email format.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
      setSkills([]);
      setProjects([]);
      setMessages([]);
      toast.success("Logged out successfully");
      return true;
    } catch (error) {
      console.error("❌ Logout error:", error);
      toast.error("Failed to logout");
      return false;
    }
  };

  const updateCreds = async (email, password) => {
    setAdminCreds({ email, password });
    // Save to Realtime DB
    try {
      const credsRef = ref(db, 'admin/creds');
      await set(credsRef, { email, password });
      toast.success("Credentials updated successfully");
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast.error("Failed to save credentials");
    }
  };

  //  Skills Functions
  const addSkill = async (skill) => {
    try {
      const skillsRef = ref(db, 'skills');
      const newSkillRef = push(skillsRef);
      await set(newSkillRef, skill);
      toast.success("Skill added successfully 🎉");
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  const deleteSkill = async (id) => {
    try {
      const skillRef = ref(db, `skills/${id}`);
      await remove(skillRef);
      toast.success("Skill deleted successfully");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    }
  };

  const updateSkill = async (id, updated) => {
    try {
      const skillRef = ref(db, `skills/${id}`);
      await update(skillRef, updated);
      toast.success("Skill updated successfully");
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill");
    }
  };

  //  Projects Functions
  const addProject = async (project) => {
    try {
      const projectsRef = ref(db, 'projects');
      const newProjectRef = push(projectsRef);
      await set(newProjectRef, project);
      toast.success("Project added successfully 🎉");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  const deleteProject = async (id) => {
    try {
      const projectRef = ref(db, `projects/${id}`);
      await remove(projectRef);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const updateProject = async (id, updated) => {
    try {
      const projectRef = ref(db, `projects/${id}`);
      await update(projectRef, updated);
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  //  Messages Functions
  const addMessage = async (message) => {
    try {
      const messagesRef = ref(db, 'messages');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        ...message,
        date: new Date().toISOString(),
        read: false
      });
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error adding message:", error);
      toast.error("Failed to send message");
    }
  };

  const deleteMessage = async (id) => {
    try {
      const messageRef = ref(db, `messages/${id}`);
      await remove(messageRef);
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const markAsRead = async (id) => {
    try {
      const messageRef = ref(db, `messages/${id}`);
      await update(messageRef, { read: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const value = {
    // Auth
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    adminCreds,
    updateCreds,
    
    // Skills
    skills,
    addSkill,
    deleteSkill,
    updateSkill,
    
    // Projects
    projects,
    addProject,
    deleteProject,
    updateProject,
    
    // Messages
    messages,
    addMessage,
    deleteMessage,
    markAsRead,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};