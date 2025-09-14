import React from 'react';
import { Plus, MessageCircle, GraduationCap, CheckSquare, TrendingUp, PenTool, BookOpen, Settings } from 'lucide-react';

interface QuickActionsProps {
  onNavigate?: (tab: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const quickActions = [
    {
      id: 'new-chat',
      title: 'Start New Chat',
      description: 'Get personalized admissions guidance',
      icon: MessageCircle,
      color: 'bg-blue-500',
      action: () => onNavigate?.('chats')
    },
    {
      id: 'add-college',
      title: 'Add College',
      description: 'Research and add universities to your list',
      icon: GraduationCap,
      color: 'bg-green-500',
      action: () => onNavigate?.('colleges')
    },
    {
      id: 'create-task',
      title: 'Create Task',
      description: 'Set deadlines and track progress',
      icon: CheckSquare,
      color: 'bg-orange-500',
      action: () => onNavigate?.('tasks')
    },
    {
      id: 'essay-help',
      title: 'Essay Assistant',
      description: 'Get help with your application essays',
      icon: PenTool,
      color: 'bg-purple-500',
      action: () => onNavigate?.('essay-assistant')
    },
    {
      id: 'check-progress',
      title: 'Check Progress',
      description: 'Review your application status',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      action: () => onNavigate?.('progress')
    },
    {
      id: 'browse-resources',
      title: 'Browse Resources',
      description: 'Access helpful tools and links',
      icon: BookOpen,
      color: 'bg-teal-500',
      action: () => onNavigate?.('resources')
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quick Actions</h1>
        <p className="text-gray-600">Fast access to all your essential college application tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => {
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
              <p className="text-gray-600 text-sm leading-relaxed">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Additional Quick Stats */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-600">Colleges Added</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-600">Tasks Completed</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">0%</p>
            <p className="text-sm text-gray-600">Overall Progress</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">1</p>
            <p className="text-sm text-gray-600">Active Chats</p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Getting Started Tips</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Start by adding colleges you're interested in to build your target list</li>
          <li>• Create tasks for important deadlines like application submissions and test dates</li>
          <li>• Use the Essay Assistant for personalized writing guidance and feedback</li>
          <li>• Check the Resources tab for helpful external tools and links</li>
          <li>• Chat with AdmissionBot for personalized admissions advice anytime</li>
        </ul>
      </div>
    </div>
  );
};

export default QuickActions;