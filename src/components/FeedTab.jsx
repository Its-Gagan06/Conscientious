import React, { useState } from 'react';
import HomeFeed from './HomeFeed';
import ExploreTab from './ExploreTab';
import CommunityPage from './CommunityPage';

export default function FeedTab({ 
  isFetchingFeed, 
  myIssues, 
  neighborIssues, 
  IssueCard, 
  handleLike, 
  activeCommentIssueId, 
  setActiveCommentIssueId, 
  commentText, 
  setCommentText,
  Loader2
}) {
  const [feedMode, setFeedMode] = useState('home'); // 'home', 'explore', 'reports'
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  if (selectedCommunity) {
    return <CommunityPage community={selectedCommunity} onBack={() => setSelectedCommunity(null)} />;
  }

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      {/* Top Segmented Control */}
      <div className="px-4 mb-6 sticky top-[88px] z-30">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-1 rounded-2xl flex border border-gray-200 dark:border-gray-800 shadow-sm">
          {['home', 'explore', 'reports'].map(mode => (
            <button
              key={mode}
              onClick={() => setFeedMode(mode)}
              className={`flex-1 py-2 text-sm font-bold capitalize rounded-xl transition-all ${
                feedMode === mode 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {feedMode === 'home' && <HomeFeed onOpenCommunity={setSelectedCommunity} />}
        {feedMode === 'explore' && <ExploreTab onOpenCommunity={setSelectedCommunity} />}
        {feedMode === 'reports' && (
          <div className="space-y-6">
            {isFetchingFeed ? (
              <div className="flex justify-center p-8 mt-10"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
            ) : (
              <div className="space-y-8">
                {myIssues.length > 0 && (
                  <div>
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">My Reports</h3>
                    <div className="space-y-4">
                      {myIssues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} isMine={true} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Neighborhood Reports</h3>
                  {neighborIssues.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No neighborhood reports yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {neighborIssues.map(issue => (
                        <IssueCard 
                          key={issue.id} 
                          issue={issue} 
                          isMine={false} 
                          onLike={() => handleLike(issue.id)}
                          activeCommentIssueId={activeCommentIssueId}
                          setActiveCommentIssueId={setActiveCommentIssueId}
                          commentText={commentText}
                          setCommentText={setCommentText}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
