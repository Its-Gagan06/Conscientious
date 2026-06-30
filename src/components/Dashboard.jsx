import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#f97316', '#22c55e', '#ef4444'];

export default function Dashboard({ user, myIssues }) {
  const issuesReported = user.reports || 0;
  
  // Calculate how many people found issues helpful (total upvotes)
  const totalHelpful = myIssues.reduce((sum, issue) => sum + (issue.upvotes || 0), 0);
  const totalPoints = user.points || 0;

  const barData = [
    { name: 'Issues Reported', value: issuesReported },
    { name: 'Helpful Votes', value: totalHelpful },
    { name: 'Points Earned', value: totalPoints }
  ];

  // For pie chart, let's categorize by issue category if possible, or just a simple split
  const categoryCount = myIssues.reduce((acc, issue) => {
    const cat = issue.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  if (pieData.length === 0) {
    pieData.push({ name: 'No Data Yet', value: 1 });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-left">Impact Dashboard</h3>
      
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 text-left">Your Community Impact</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 text-left">Issues by Category</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
