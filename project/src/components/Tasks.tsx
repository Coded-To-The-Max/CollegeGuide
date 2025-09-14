import React, { useState } from 'react';
import { Plus, Calendar, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    type: 'custom' as 'application' | 'essay' | 'test' | 'custom'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline,
      status: 'pending',
      type: formData.type
    };

    setTasks(prev => [...prev, newTask]);
    setFormData({
      title: '',
      description: '',
      deadline: '',
      type: 'custom'
    });
    setShowAddForm(false);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' as const }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = selectedDate
    ? tasks.filter(task => task.deadline === selectedDate)
    : tasks;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application': return '📝';
      case 'essay': return '✍️';
      case 'test': return '📊';
      case 'custom': return '📌';
      default: return '📌';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Generate calendar dates for the current month
  const generateCalendarDates = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayTasks = tasks.filter(task => task.deadline === dateString);
      
      dates.push({
        date: day,
        dateString,
        tasks: dayTasks,
        isToday: date.toDateString() === now.toDateString()
      });
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tasks</h1>
        <p className="text-gray-600">Manage your college application tasks and deadlines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDates.map(({ date, dateString, tasks: dayTasks, isToday }) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(selectedDate === dateString ? '' : dateString)}
                  className={`aspect-square p-2 rounded-lg text-sm font-medium transition-colors duration-200 relative ${
                    selectedDate === dateString
                      ? 'bg-blue-600 text-white'
                      : isToday
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {date}
                  {dayTasks.length > 0 && (
                    <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                      selectedDate === dateString ? 'bg-white' : 'bg-blue-600'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Add Task Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Task</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="application">Application Deadline</option>
                      <option value="essay">Essay</option>
                      <option value="test">Test</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedDate ? `Tasks for ${new Date(selectedDate).toLocaleDateString()}` : 'All Tasks'}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Show All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {selectedDate ? 'No tasks for this date' : 'No tasks yet'}
                </p>
              ) : (
                filteredTasks.map((task) => {
                  const daysUntil = getDaysUntilDeadline(task.deadline);
                  const isOverdue = daysUntil < 0;
                  const isUrgent = daysUntil <= 3 && daysUntil >= 0;

                  return (
                    <div
                      key={task.id}
                      className={`p-4 border rounded-lg transition-all duration-200 ${
                        task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                              task.status === 'completed'
                                ? 'bg-green-600 border-green-600 text-white'
                                : 'border-gray-300 hover:border-blue-500'
                            }`}
                          >
                            {task.status === 'completed' && <CheckSquare className="w-3 h-3" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{getTypeIcon(task.type)}</span>
                              <h4 className={`font-medium ${
                                task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
                              }`}>
                                {task.title}
                              </h4>
                            </div>
                            {task.description && (
                              <p className="text-sm text-gray-600">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-3 mt-2">
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(task.deadline).toLocaleDateString()}</span>
                              </div>
                              {isOverdue && (
                                <div className="flex items-center space-x-1 text-sm text-red-600">
                                  <AlertCircle className="w-4 h-4" />
                                  <span>Overdue</span>
                                </div>
                              )}
                              {isUrgent && !isOverdue && (
                                <div className="flex items-center space-x-1 text-sm text-orange-600">
                                  <Clock className="w-4 h-4" />
                                  <span>Due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {task.type.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;