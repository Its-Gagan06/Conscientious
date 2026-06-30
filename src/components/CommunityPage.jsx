import React from 'react';
import { ArrowLeft, Users, Star, Share2, MapPin, Calendar, MessageCircle, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

export default function CommunityPage({ community, onBack }) {
  if (!community) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto"
    >
      {/* Banner */}
      <div className="h-72 relative">
        <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-black/20"></div>
        
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 pt-safe">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Content over banner */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Star size={12} className="fill-yellow-400 text-yellow-400" /> Top 5% Community
              </div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">{community.name}</h1>
              <p className="text-gray-300 flex items-center gap-2 text-sm font-medium">
                <MapPin size={14} /> Global <span className="w-1 h-1 rounded-full bg-gray-500"></span> <Users size={14} /> {community.members} Members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 pb-24 max-w-2xl mx-auto space-y-8">
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-semibold transition-colors shadow-lg shadow-blue-500/20 text-sm">
            Join Community
          </button>
          <button className="px-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-3.5 rounded-2xl font-semibold transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 text-sm">
            <MessageCircle size={18} /> Chat
          </button>
        </div>

        {/* About */}
        <section>
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-3">About</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            Welcome to {community.name}! We are a group of passionate individuals dedicated to making a positive impact. Whether you're here to learn, share, or collaborate, you've found the right place. Join us in our upcoming events and connect with like-minded people.
          </p>
        </section>

        {/* Members Preview */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">Members</h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">View all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${community.name}Member${i}`} alt="Member" className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 shadow-sm" />
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">User {i}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex flex-col justify-center items-center text-blue-600 dark:text-blue-400 shrink-0">
                  <span className="text-xs font-bold uppercase">Oct</span>
                  <span className="text-lg font-display font-bold leading-tight">{14 + i}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Weekly Meetup & Discussion</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                    <Calendar size={12} /> 6:00 PM - 8:00 PM
                  </p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(j => (
                      <img key={j} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Event${i}${j}`} alt="Attendee" className="w-6 h-6 rounded-full border border-white dark:border-gray-800 bg-gray-200" />
                    ))}
                    <div className="w-6 h-6 rounded-full border border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-300">
                      +12
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}
