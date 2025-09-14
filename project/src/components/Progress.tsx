import React from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';
import { College } from '../types';

interface ProgressProps {
  colleges: College[];
  setColleges: (colleges: College[] | ((prev: College[]) => College[])) => void;
}

const Progress: React.FC<ProgressProps> = ({ colleges, setColleges }) => {
  const updateProgress = (collegeId: string, progress: number) => {
    setColleges(prev => prev.map(college =>
      college.id === collegeId ? { ...college, progress } : college
    ));
  };

  const getOverallProgress = () => {
    if (colleges.length === 0) return 0;
    const totalProgress = colleges.reduce((sum, college) => sum + college.progress, 0);
    return Math.round(totalProgress / colleges.length);
  };

  const getTypeStats = () => {
    const stats = { reach: 0, target: 0, safety: 0 };
    colleges.forEach(college => {
      stats[college.type] += 1;
    });
    return stats;
  };

  const typeStats = getTypeStats();
  const overallProgress = getOverallProgress();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress Tracker</h1>
        <p className="text-gray-600">Monitor your college application progress</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Overall Progress</p>
              <p className="text-3xl font-bold text-blue-600">{overallProgress}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Reach Schools</p>
              <p className="text-3xl font-bold text-red-600">{typeStats.reach}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Target className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Target Schools</p>
              <p className="text-3xl font-bold text-blue-600">{typeStats.target}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Safety Schools</p>
              <p className="text-3xl font-bold text-green-600">{typeStats.safety}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* College Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Individual College Progress</h2>
        
        {colleges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No colleges added yet. Add some colleges to track your progress!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {colleges.map((college) => (
              <div key={college.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{college.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        college.type === 'reach' ? 'bg-red-100 text-red-800' :
                        college.type === 'target' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {college.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        Deadline: {new Date(college.deadlines.regularDecision).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{college.progress}%</p>
                    <p className="text-sm text-gray-600">Complete</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Application Progress</p>
                    <p className="text-sm text-gray-600">{college.progress}/100%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        college.progress >= 80 ? 'bg-green-500' :
                        college.progress >= 50 ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${college.progress}%` }}
                    />
                  </div>
                </div>

                {/* Progress Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Progress
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={college.progress}
                    onChange={(e) => updateProgress(college.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Progress Milestones */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className={`text-center p-3 rounded-lg ${
                    college.progress >= 25 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${
                      college.progress >= 25 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <p className="text-xs font-medium text-gray-700">Research</p>
                  </div>
                  
                  <div className={`text-center p-3 rounded-lg ${
                    college.progress >= 50 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${
                      college.progress >= 50 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <p className="text-xs font-medium text-gray-700">Essay Draft</p>
                  </div>
                  
                  <div className={`text-center p-3 rounded-lg ${
                    college.progress >= 75 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${
                      college.progress >= 75 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <p className="text-xs font-medium text-gray-700">Review</p>
                  </div>
                  
                  <div className={`text-center p-3 rounded-lg ${
                    college.progress >= 100 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${
                      college.progress >= 100 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <p className="text-xs font-medium text-gray-700">Submit</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;