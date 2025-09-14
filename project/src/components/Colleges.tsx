import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, GraduationCap } from 'lucide-react';
import { College } from '../types';

interface CollegesProps {
  colleges: College[];
  setColleges: (colleges: College[] | ((prev: College[]) => College[])) => void;
}

const Colleges: React.FC<CollegesProps> = ({ colleges, setColleges }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'target' as 'reach' | 'target' | 'safety',
    country: 'US',
    earlyAction: '',
    earlyDecision: '',
    regularDecision: ''
  });

  const countries = [
    { code: 'all', name: 'All Countries', flag: '🌍' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
  ];

  const mockColleges = [
    { name: 'Harvard University', country: 'US' },
    { name: 'Oxford University', country: 'UK' },
    { name: 'University of Toronto', country: 'CA' },
    { name: 'MIT', country: 'US' },
    { name: 'Stanford University', country: 'US' },
    { name: 'Cambridge University', country: 'UK' },
    { name: 'Peking University', country: 'CN' },
  ];

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || college.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const filteredSuggestions = mockColleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCountry === 'all' || college.country === selectedCountry) &&
    !colleges.some(c => c.name === college.name)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'target',
      country: 'US',
      earlyAction: '',
      earlyDecision: '',
      regularDecision: ''
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCollege: College = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      country: formData.country,
      deadlines: {
        ...(formData.earlyAction && { earlyAction: formData.earlyAction }),
        ...(formData.earlyDecision && { earlyDecision: formData.earlyDecision }),
        regularDecision: formData.regularDecision
      },
      progress: 0
    };

    if (editingId) {
      setColleges(prev => prev.map(college =>
        college.id === editingId ? newCollege : college
      ));
    } else {
      setColleges(prev => [...prev, newCollege]);
    }

    resetForm();
  };

  const handleEdit = (college: College) => {
    setFormData({
      name: college.name,
      type: college.type,
      country: college.country,
      earlyAction: college.deadlines.earlyAction || '',
      earlyDecision: college.deadlines.earlyDecision || '',
      regularDecision: college.deadlines.regularDecision
    });
    setEditingId(college.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setColleges(prev => prev.filter(college => college.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reach': return 'bg-red-100 text-red-800';
      case 'target': return 'bg-blue-100 text-blue-800';
      case 'safety': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Colleges</h1>
        <p className="text-gray-600">Search and manage your college list</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Country dropdown (no external flag icon) */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {`${country.code} – ${country.name}`}
              </option>
            ))}
          </select>

          {/* Add college button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add College</span>
          </button>
        </div>

        {/* Search Suggestions */}
        {searchTerm && filteredSuggestions.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Suggestions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredSuggestions.slice(0, 6).map((college, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      name: college.name,
                      country: college.country
                    }));
                    setShowAddForm(true);
                  }}
                  className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-sm text-gray-800">{college.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {countries.find(c => c.code === college.country)?.flag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit College' : 'Add New College'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="reach">Reach</option>
                  <option value="target">Target</option>
                  <option value="safety">Safety</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {countries.filter(c => c.code !== 'all').map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {`${country.code} – ${country.name}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Decision Deadline
                </label>
                <input
                  type="date"
                  required
                  value={formData.regularDecision}
                  onChange={(e) => setFormData(prev => ({ ...prev, regularDecision: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Early Action Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formData.earlyAction}
                  onChange={(e) => setFormData(prev => ({ ...prev, earlyAction: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Early Decision Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formData.earlyDecision}
                  onChange={(e) => setFormData(prev => ({ ...prev, earlyDecision: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {editingId ? 'Update College' : 'Add College'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* College List */}
      <div className="space-y-4">
        {filteredColleges.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No colleges found. Add some colleges to get started!</p>
          </div>
        ) : (
          filteredColleges.map((college) => (
            <div key={college.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{college.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(college.type)}`}>
                        {college.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {countries.find(c => c.code === college.country)?.flag} {countries.find(c => c.code === college.country)?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(college)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(college.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {college.deadlines.earlyAction && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Early Action</p>
                    <p className="text-sm text-gray-800">{new Date(college.deadlines.earlyAction).toLocaleDateString()}</p>
                  </div>
                )}
                {college.deadlines.earlyDecision && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Early Decision</p>
                    <p className="text-sm text-gray-800">{new Date(college.deadlines.earlyDecision).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Regular Decision</p>
                  <p className="text-sm text-gray-800">{new Date(college.deadlines.regularDecision).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Colleges;
