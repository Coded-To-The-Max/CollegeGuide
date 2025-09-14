import React from 'react';
import {
  Home,
  MessageCircle,
  GraduationCap,
  CheckSquare,
  TrendingUp,
  PenTool,
  BookOpen,
  Settings,
  User as UserIcon
} from 'lucide-react';
import { User, Country } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chats', label: 'Chats', icon: MessageCircle },
    { id: 'colleges', label: 'Colleges', icon: GraduationCap },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'essay-assistant', label: 'Essay Assistant', icon: PenTool },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const countries: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    // ... rest of countries
  ];

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">CollegeGuide</h1>
        </div>
        <p className="text-sm text-gray-600">Admissions made easy. For everyone.</p>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">
              {user.displayName || user.username}
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>{countries.find(c => c.code === user.country)?.flag}</span>
              <span>→</span>
              <span>{countries.find(c => c.code === user.residence)?.flag}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
