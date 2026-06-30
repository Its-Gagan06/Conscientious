import React, { useState, useRef } from 'react';
import { Settings, Award, Calendar, MapPin, Edit3, LogOut, Heart, Users, Camera, X, Loader2, ArrowLeft, Moon, Sun, Bell, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfileTab({ user, setUser, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [editName, setEditName] = useState(user.name || '');
  const [editPassword, setEditPassword] = useState('');
  const [editAvatar, setEditAvatar] = useState(user.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editName) return;
    
    if (editPassword && (editPassword.length < 6 || !/[a-zA-Z]/.test(editPassword) || !/[0-9]/.test(editPassword))) {
      alert("Password must be at least 6 characters and contain both letters and numbers.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          name: editName, 
          contact: user.contact, 
          password: editPassword,
          avatar: editAvatar 
        })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('community_user', JSON.stringify(data.user));
        setIsEditing(false);
        setEditPassword('');
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (e) {
      alert("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const currentAvatarSrc = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;
  const editAvatarSrc = editAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editName || 'Guest'}`;

  if (showSettings) {
    return (
      <div className="pb-24 animate-in fade-in duration-500 max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setShowSettings(false)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} className="text-gray-900 dark:text-gray-100" />
          </button>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">Settings</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
               <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100 font-medium">
                 <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"><Bell size={18} /></div>
                 Notifications
               </div>
               <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end p-1 shadow-inner"><div className="w-4 h-4 bg-white rounded-full"></div></div>
             </div>
             <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors" onClick={() => {
                 document.documentElement.classList.toggle('dark');
             }}>
               <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100 font-medium">
                 <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Moon size={18} /></div>
                 Toggle Dark Mode
               </div>
             </div>
             <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
               <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100 font-medium">
                 <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><Shield size={18} /></div>
                 Privacy & Security
               </div>
             </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="pb-24 animate-in fade-in duration-500 max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsEditing(false)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} className="text-gray-900 dark:text-gray-100" />
            </button>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">Edit Profile</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
           <div className="flex flex-col items-center">
             <div className="w-28 h-28 rounded-full border-4 border-gray-100 dark:border-gray-700 overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img src={editAvatarSrc} alt={editName} className="w-full h-full object-cover bg-blue-50 dark:bg-gray-700" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
             </div>
             <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>Change Photo</p>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Display Name</label>
             <input 
               type="text" 
               value={editName}
               onChange={(e) => setEditName(e.target.value)}
               className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all font-medium"
               placeholder="Your name"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">New Password (Optional)</label>
             <input 
               type="password" 
               value={editPassword}
               onChange={(e) => setEditPassword(e.target.value)}
               className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all font-medium"
               placeholder="Leave blank to keep current"
             />
           </div>

           <div className="pt-4">
             <button
               onClick={handleSave}
               disabled={isSaving || !editName}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
             >
               {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in fade-in duration-500 max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-b-[40px] shadow-sm border-b border-gray-100 dark:border-gray-700 p-6 pt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 to-teal-400 opacity-20"></div>
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button onClick={() => setIsEditing(true)} className="w-10 h-10 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm">
            <Edit3 size={18} />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm">
            <Settings size={18} />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center mt-4">
          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden mb-4 relative group cursor-pointer" onClick={() => setIsEditing(true)}>
            <img src={currentAvatarSrc} alt={user.name} className="w-full h-full object-cover bg-blue-50 dark:bg-gray-700" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 flex items-center gap-1">
            <MapPin size={14} /> San Francisco, CA
          </p>
          
          <div className="flex gap-6 mt-6 w-full justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.4k</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Followers</p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1.1k</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Following</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        
        {/* Stats & Score */}
        <section>
          <h3 className="text-lg font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Community Impact</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-5 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
               <Award size={24} className="mb-2 opacity-90 relative z-10" />
               <p className="text-3xl font-display font-bold relative z-10">{user.points || 0}</p>
               <p className="text-sm font-medium opacity-90 mt-1 relative z-10">Impact Points</p>
             </div>
             <div className="bg-gradient-to-br from-blue-500 to-teal-400 rounded-3xl p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
               <Heart size={24} className="mb-2 opacity-90 relative z-10" />
               <p className="text-3xl font-display font-bold relative z-10">{user.reports || 0}</p>
               <p className="text-sm font-medium opacity-90 mt-1 relative z-10">Reports Filed</p>
             </div>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h3 className="text-lg font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Badges & Achievements</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
             {['Top Reporter', 'Friendly Neighbor', 'Event Organizer', 'Early Adopter'].map((badge, i) => (
               <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-24">
                 <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center text-2xl relative">
                   {['🏆', '🤝', '📅', '🚀'][i]}
                   {i === 0 && <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-gray-900">3</div>}
                 </div>
                 <span className="text-xs font-semibold text-center text-gray-600 dark:text-gray-400 leading-tight">{badge}</span>
               </div>
             ))}
          </div>
        </section>

        {/* Interests */}
        <section>
          <h3 className="text-lg font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {['Environment', 'Technology', 'Art & Design', 'Local Events', 'Volunteering', 'Sports'].map(interest => (
              <span key={interest} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                {interest}
              </span>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
