import React, { useState } from 'react';
import { Filter, Users, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function ExploreTab({ onOpenCommunity }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Sports', 'Tech', 'Environment', 'Art', 'Food'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-4 px-2">
           <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">Explore Categories</h3>
           <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
             <Filter size={18} />
           </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Communities */}
      <div>
        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4 px-2 flex items-center gap-2">
          <Sparkles size={20} className="text-yellow-500" /> Suggested for you
        </h3>
        <div className="space-y-4 px-2">
          {[
            { id: 4, name: "Urban Photographers", members: "2.1k", desc: "Capturing the city's hidden gems.", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500&q=80" },
            { id: 5, name: "Weekend Hikers", members: "4.5k", desc: "Explore local trails every weekend.", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&q=80" }
          ].map(community => (
            <div 
              key={community.id}
              onClick={() => onOpenCommunity(community)}
              className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex gap-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
            >
               <img src={community.image} alt={community.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
               <div className="flex-1 min-w-0 flex flex-col justify-center">
                 <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">{community.name}</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{community.desc}</p>
                 <p className="text-xs font-medium text-gray-400 flex items-center gap-1 mt-2">
                   <Users size={12} /> {community.members}
                 </p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Now */}
      <div>
        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4 px-2 flex items-center gap-2">
          <TrendingUp size={20} className="text-red-500" /> Popular Now
        </h3>
        <div className="grid grid-cols-2 gap-4 px-2">
          {[
            { id: 6, name: "Book Club", members: "12k", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80" },
            { id: 7, name: "Pet Lovers", members: "8.2k", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80" },
            { id: 8, name: "Coding Help", members: "45k", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80" },
            { id: 9, name: "Yoga Mornings", members: "3.1k", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80" }
          ].map(community => (
            <div 
              key={community.id}
              onClick={() => onOpenCommunity(community)}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer group hover:shadow-md transition-shadow"
            >
              <div className="h-28 relative">
                <img src={community.image} alt={community.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-3 text-white">
                  <p className="text-[10px] font-bold flex items-center gap-1 opacity-90 mb-0.5"><Users size={10} /> {community.members}</p>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{community.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
