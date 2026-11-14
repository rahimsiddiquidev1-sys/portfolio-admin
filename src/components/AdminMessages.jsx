// components/AdminMessages.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiMail, FiCheck, FiTrash2, FiEyeOff, FiInbox } from "react-icons/fi";
import { db } from "../firebase/config";
import { ref, onValue, update, remove } from "firebase/database";

export function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  //  FETCH Messages from Firebase
  useEffect(() => {
    const messagesRef = ref(db, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      
      //  Condition 1: Collection exists but empty
      if (data && typeof data === 'object') {
        const messagesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        
        //  Condition 2: Check if array has data
        if (messagesArray.length > 0) {
          // Sort: Latest first
          messagesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
          setMessages(messagesArray);
        } else {
          //  Collection exists but no messages
          setMessages([]);
        }
      } else {
        //  Collection doesn't exist
        setMessages([]);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //  Mark as Read
  const markAsRead = async (id) => {
    try {
      await update(ref(db, `messages/${id}`), { read: true });

    } catch (error) {
      console.error(" Error marking as read:", error);
    }
  };

  //  Mark as Unread
  const markAsUnread = async (id) => {
    try {
      await update(ref(db, `messages/${id}`), { read: false });
    } catch (error) {
      console.error(" Error marking as unread:", error);
    }
  };

  //  Delete Message
  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await remove(ref(db, `messages/${id}`));
    } catch (error) {
      console.error(" Error deleting message:", error);
    }
  };

  //  Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  //  LOADING STATE
  if (loading) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neon-cyan/30 border-t-neon-cyan" />
        </div>
        <p className="mt-4 text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  //  NO MESSAGES STATE
  if (messages.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <FiInbox size={48} className="mx-auto text-muted-foreground/30" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No messages yet</h3>
        <p className="mt-2 text-sm text-muted-foreground/60 max-w-sm mx-auto">
          When someone sends a message from your portfolio's contact form, 
          it will appear here.
        </p>
        <div className="mt-4 text-xs text-muted-foreground/40">
          <span className="glass px-3 py-1.5 rounded-full inline-block">
            💡 Check your portfolio contact form
          </span>
        </div>
      </div>
    );
  }

  //  MESSAGES LIST
  return (
    <div className="space-y-4">
      {/* Message Count */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {messages.length} message{messages.length > 1 ? 's' : ''}
          {' • '}
          <span className="text-neon-cyan">
            {messages.filter(m => !m.read).length} unread
          </span>
        </span>
      </div>

      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-2xl p-5 transition hover:glow-border ${
            !message.read ? "border-l-4 border-l-[color:var(--neon-cyan)]" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className="font-semibold text-foreground">{message.name || "Anonymous"}</h4>
                <span className="text-sm text-muted-foreground">•</span>
                <a href={`mailto:${message.email}`} className="text-sm text-neon-cyan hover:underline">
                  {message.email || "No email"}
                </a>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{formatDate(message.date)}</span>
                {!message.read && (
                  <span className="ml-2 rounded-full bg-neon-cyan/20 px-2 py-0.5 text-xs font-medium text-neon-cyan">
                    New
                  </span>
                )}
              </div>
              {message.subject && (
                <p className="mt-1 text-sm font-medium text-foreground/80">{message.subject}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {!message.read && (
                <button
                  onClick={() => markAsRead(message.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-green-500/20 hover:text-green-400 transition"
                  title="Mark as read"
                >
                  <FiCheck size={16} />
                </button>
              )}
              {message.read && (
                <button
                  onClick={() => markAsUnread(message.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-yellow-500/20 hover:text-yellow-400 transition"
                  title="Mark as unread"
                >
                  <FiEyeOff size={16} />
                </button>
              )}
              <button
                onClick={() => deleteMessage(message.id)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition"
                title="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}