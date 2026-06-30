import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle, X, Award, AlertTriangle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NeighborhoodChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const messagesEndRef = useRef(null);

  const [activeUsers, setActiveUsers] = useState([]);

  const fetchMessages = async () => {
    try {
      const [chatRes, usersRes] = await Promise.all([
        fetch('/api/neighborhood-chat'),
        fetch('/api/active-users')
      ]);
      const chatData = await chatRes.json();
      const usersData = await usersRes.json();
      
      if (chatData.success) {
        setMessages(chatData.messages);
      }
      if (usersData.success) {
        setActiveUsers(usersData.activeUsers.filter(u => u.id !== user.id)); // exclude self
      }
    } catch (e) {
      console.error("Failed to fetch chat data", e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUserClick = async (userId) => {
    setIsFetchingUser(true);
    setSelectedUser(null);
    setIsUserModalOpen(true);
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedUser(data.user);
      } else {
        setIsUserModalOpen(false);
      }
    } catch (e) {
      console.error("Failed to fetch user details", e);
      setIsUserModalOpen(false);
    } finally {
      setIsFetchingUser(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await fetch('/api/neighborhood-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userName: user.name, text: input })
      });
      setInput('');
      fetchMessages();
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4 shrink-0">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
          <MessageCircle size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Neighbors Chat</h3>
      </div>

      {/* Active Users */}
      {activeUsers.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">Active Neighbors</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
            {activeUsers.map(activeUser => (
              <button 
                key={activeUser.id}
                onClick={() => handleUserClick(activeUser.id)}
                className="flex flex-col items-center gap-1 min-w-[60px] group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-gray-700 border-2 border-blue-100 dark:border-gray-600 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.name}`} alt={activeUser.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate w-full text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {activeUser.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg) => {
          const isMine = msg.userId === user.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              <div className="flex items-end gap-2 max-w-[80%]">
                {!isMine && (
                  <button 
                    onClick={() => handleUserClick(msg.userId)}
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    {msg.userAvatar ? (
                      <img src={msg.userAvatar} alt={msg.userName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold">{msg.userName?.charAt(0).toUpperCase()}</span>
                    )}
                  </button>
                )}
                <div 
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    isMine 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                  }`}
                >
                  {!isMine && <p className="text-xs font-semibold mb-1 opacity-70">{msg.userName}</p>}
                  <p>{msg.text}</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 mx-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message your neighbors..."
          className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl outline-none text-gray-800 dark:text-gray-100 text-sm transition-all"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </form>

      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-xl relative border border-gray-100 dark:border-gray-700"
            >
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                <X size={18} />
              </button>

              {isFetchingUser ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
                </div>
              ) : selectedUser ? (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-inner overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} alt={selectedUser.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedUser.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mt-2 mb-6">
                    <Phone size={14} />
                    <span className="text-sm">{selectedUser.contact}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-600">
                       <Award size={24} className="text-yellow-500 mb-2" />
                       <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedUser.points || 0}</span>
                       <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mt-1">Points</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-600">
                       <AlertTriangle size={24} className="text-red-500 mb-2" />
                       <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedUser.reports || 0}</span>
                       <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mt-1">Reports</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-red-500">
                  Failed to load user profile.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
