import React from 'react';
import { Calendar, TrendingUp, MessageCircle, GraduationCap, CheckSquare, PenTool, BookOpen } from 'lucide-react';
import { College, Task, Chat } from '../types';

interface DashboardProps {
  colleges: College[];
  tasks: Task[];
  chats: Chat[];
  handleTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ colleges, tasks, chats, handleTabChange }) => {

  // Upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(task => new Date(task.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  // Stats
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const totalApplications = colleges?.length || 0;
  const overallProgress = tasks?.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Quick actions buttons
  const quickActions = [
    { id: 'new-chat', title: 'Start New Chat', description: 'Get personalized admissions guidance', icon: MessageCircle, color: 'bg-purple-500', action: () => handleTabChange('chats') },
    { id: 'add-college', title: 'Add College', description: 'Research and add universities to your list', icon: GraduationCap, color: 'bg-green-500', action: () => handleTabChange('colleges') },
    { id: 'create-task', title: 'Create Task', description: 'Set deadlines and track progress', icon: CheckSquare, color: 'bg-orange-500', action: () => handleTabChange('tasks') },
    { id: 'essay-help', title: 'Essay Assistant', description: 'Get help with your application essays', icon: PenTool, color: 'bg-indigo-500', action: () => handleTabChange('essay-assistant') },
    { id: 'check-progress', title: 'Check Progress', description: 'Review your application status', icon: TrendingUp, color: 'bg-blue-500', action: () => handleTabChange('progress') },
    { id: 'browse-resources', title: 'Browse Resources', description: 'Access helpful tools and links', icon: BookOpen, color: 'bg-teal-500', action: () => handleTabChange('resources') },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's your college admissions overview.</p>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
        </div>
        <div className="space-y-3">
          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
          ) : (
            upcomingDeadlines.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center bg-white p-6 rounded-lg shadow-md">
          <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalApplications}</p>
          <p className="text-sm text-gray-600">Colleges Added</p>
        </div>

        <div className="text-center bg-white p-6 rounded-lg shadow-md">
          <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{completedTasks}</p>
          <p className="text-sm text-gray-600">Tasks Completed</p>
        </div>

        <div className="text-center bg-white p-6 rounded-lg shadow-md">
          <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{overallProgress}%</p>
          <p className="text-sm text-gray-600">Overall Progress</p>
        </div>
      </div>

      {/* Quick Actions Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`${action.color} p-3 rounded-full group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                    {action.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
