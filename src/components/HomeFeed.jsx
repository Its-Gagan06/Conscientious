import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, ChevronRight, Play, Star, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomeFeed({ onOpenCommunity }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Welcome & Search */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-[32px] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold mb-2">Good morning!</h1>
          <p className="text-blue-50 font-medium mb-6">Discover what's happening around you.</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search communities, events, or people..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/30 font-medium placeholder-gray-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Community Stories */}
      <div>
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-gray-100 mb-4 px-2">Community Stories</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-teal-400">
                <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 overflow-hidden relative">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Story${i}`} alt="Story" className="w-full h-full object-cover bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition-transform duration-300" />
                   {i === 1 && (
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                       <Play size={16} className="text-white" fill="currentColor" />
                     </div>
                   )}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {i === 1 ? 'Live' : `Story ${i}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Communities */}
      <div>
        <div className="flex justify-between items-end mb-4 px-2">
           <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">Featured Communities</h3>
           <button className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center hover:text-blue-700 transition-colors">See all <ChevronRight size={16} /></button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-2">
          {[
            { id: 1, name: "Eco Warriors", members: "1.2k", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80" },
            { id: 2, name: "Tech Innovators", members: "3.4k", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80" },
            { id: 3, name: "Local Artists", members: "856", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80" }
          ].map(community => (
            <motion.div 
              whileHover={{ y: -4 }}
              key={community.id} 
              onClick={() => onOpenCommunity(community)}
              className="w-64 shrink-0 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
            >
              <div className="h-32 relative">
                <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <h4 className="font-display font-bold text-lg leading-tight">{community.name}</h4>
                  <p className="text-xs font-medium opacity-90 flex items-center gap-1 mt-1"><Users size={12} /> {community.members} members</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                 <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${community.name}${i}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100" alt="member" />
                   ))}
                 </div>
                 <button className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                   Join
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Events */}
      <div className="px-2">
        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Trending Events</h3>
        <div className="space-y-4">
          {[
            { id: 1, title: "Sunday Morning Run", time: "Tomorrow, 7:00 AM", location: "Central Park", participants: 42, color: "from-orange-400 to-pink-500" },
            { id: 2, title: "Community Cleanup", time: "Sat, 10:00 AM", location: "Downtown Plaza", participants: 128, color: "from-teal-400 to-emerald-500" }
          ].map(event => (
            <div key={event.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 items-center group cursor-pointer hover:border-blue-200 transition-colors">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${event.color} flex flex-col items-center justify-center text-white shrink-0 shadow-inner`}>
                <Calendar size={20} className="mb-1 opacity-90" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Join</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate text-base">{event.title}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {event.participants}</span>
                </div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
