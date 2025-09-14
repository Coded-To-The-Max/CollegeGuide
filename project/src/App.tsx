import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AuthModal from './components/AuthModal';
import { authService } from './components/AuthService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chats from './components/Chats';
import Colleges from './components/Colleges';
import Tasks from './components/Tasks';
import Progress from './components/Progress';
import EssayAssistant from './components/EssayAssistant';
import Resources from './components/Resources';
import Settings from './components/Settings';
import { GraduationCap } from 'lucide-react';
import {
  User,
  College,
  Task,
  Chat,
  LoginCredentials,
  RegisterData,
  RecoveryData,
  ErrorState
} from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [colleges, setColleges] = useState<College[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string>('1');
  const [isTyping, setIsTyping] = useState(false);

  // Load user data from Supabase
  const loadUserData = async (userId: string) => {
    try {
      const { data: collegesData, error: collegesError } = await supabase
        .from('colleges')
        .select('*')
        .eq('user_id', userId);
      if (collegesError) throw collegesError;
      setColleges(collegesData || []);

      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId);
      if (chatsError) throw chatsError;

      const formattedChats = (chatsData || []).map(chat => ({
        ...chat,
        messages: chat.messages || [],
        createdAt: new Date(chat.created_at)
      }));

      setChats(
        formattedChats.length > 0
          ? formattedChats
          : [
              {
                id: '1',
                title: 'New Chat 1',
                messages: [
                  {
                    id: '1',
                    content:
                      "Hello! I'm AdmissionBot, your personal admissions assistant. How can I help you with your college journey today?",
                    sender: 'bot',
                    timestamp: new Date()
                  }
                ],
                createdAt: new Date()
              }
            ]
      );

      if (formattedChats.length > 0) setCurrentChat(formattedChats[0].id);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError({ message: 'Failed to load user data', type: 'error' });
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();
        if (session?.user) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            await loadUserData(currentUser.id);
          }
        } else {
          setShowAuthModal(true);
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setError({ message: 'Failed to initialize app', type: 'error' });
        setShowAuthModal(true);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const success = await authService.login(credentials);
      if (success) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserData(currentUser.id);
          setShowAuthModal(false);
          setError(null);
        }
      }
      return success;
    } catch (error) {
      console.error('Login error:', error);
      setError({ message: 'Login failed. Please try again.', type: 'error' });
      return false;
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      const result = await authService.register(data);
      if (result.success) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserData(currentUser.id);
          setError(null);
        }
      }
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const handleRecover = async (data: RecoveryData) => await authService.recover(data);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setColleges([]);
      setTasks([]);
      setChats([]);
      setShowAuthModal(true);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError({ message: 'Logout failed', type: 'error' });
    }
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    try {
      if (user) {
        const success = await authService.updateProfile(updates);
        if (success) setUser({ ...user, ...updates });
        else setError({ message: 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError({ message: 'Profile update failed', type: 'error' });
    }
  };

  const handleTabChange = (tab: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150);
  };

  // Chat AI integration
  const handleSendMessage = async (message: string) => {
    if (!currentChat || !message.trim() || !user) return;

    const userMessage: Chat['messages'][0] = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChat
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setIsTyping(true);

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      let data: { reply?: string } = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('Failed to parse OpenAI response JSON:', err);
        data = {};
      }

      const botResponse: Chat['messages'][0] = {
        id: (Date.now() + 1).toString(),
        content: data.reply || "Sorry, I couldn't process your message.",
        sender: 'bot',
        timestamp: new Date()
      };

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChat
            ? { ...chat, messages: [...chat.messages, botResponse] }
            : chat
        )
      );
    } catch (err) {
      console.error('Error communicating with OpenAI:', err);
      const botResponse: Chat['messages'][0] = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, there was an error processing your message.",
        sender: 'bot',
        timestamp: new Date()
      };
      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChat
            ? { ...chat, messages: [...chat.messages, botResponse] }
            : chat
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const renderContent = () => {
    if (!user) return null;

    const contentClass = `transition-all duration-300 ${
      isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
    }`;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className={contentClass}>
            <Dashboard
              colleges={colleges}
              tasks={tasks}
              chats={chats}
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              handleTabChange={handleTabChange}
            />
          </div>
        );
      case 'chats':
        return (
          <div className={contentClass}>
            <Chats
              chats={chats}
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              setChats={setChats}
              user={user}
              handleSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          </div>
        );
      case 'colleges':
        return (
          <div className={contentClass}>
            <Colleges colleges={colleges} setColleges={setColleges} />
          </div>
        );
      case 'tasks':
        return (
          <div className={contentClass}>
            <Tasks tasks={tasks} setTasks={setTasks} />
          </div>
        );
      case 'progress':
        return (
          <div className={contentClass}>
            <Progress colleges={colleges} setColleges={setColleges} />
          </div>
        );
      case 'essay-assistant':
        return (
          <div className={contentClass}>
            <EssayAssistant user={user} />
          </div>
        );
      case 'resources':
        return (
          <div className={contentClass}>
            <Resources />
          </div>
        );
      case 'settings':
        return (
          <div className={contentClass}>
            <Settings user={user} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-shimmer rounded-full h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CollegeGuide...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-bounce-slow animate-fade-in" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">CollegeGuide</h1>
            <p className="text-gray-600 mb-8 animate-fade-in">Admissions made easy. For everyone.</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium btn-ripple hover-lift animate-fade-in"
            >
              Get Started
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onRecover={handleRecover}
        />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 animate-fade-in">
      {error && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-slide-in-right ${
            error.type === 'error'
              ? 'bg-red-100 border border-red-200 text-red-800'
              : error.type === 'warning'
              ? 'bg-yellow-100 border border-yellow-200 text-yellow-800'
              : 'bg-blue-100 border border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{error.message}</span>
            <button onClick={() => setError(null)} className="ml-4 text-current hover:opacity-70">
              ×
            </button>
          </div>
        </div>
      )}

      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} user={user} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}

export default App;
