import React from 'react';
import { ExternalLink, BookOpen, DollarSign, PenTool } from 'lucide-react';

const Resources: React.FC = () => {
  const applicationTools = [
    { title: 'Common Application', url: 'https://www.commonapp.org/', description: 'Apply to 900+ colleges with one application' },
    { title: 'UC Application', url: 'https://admission.universityofcalifornia.edu/apply/', description: 'Apply to University of California schools' },
    { title: 'Coalition Application', url: 'https://www.coalitionforcollegeaccess.org/', description: 'Alternative application platform for many colleges' },
    { title: 'ApplyTexas', url: 'https://www.applytexas.org/', description: 'Apply to Texas public universities and colleges' },
  ];

  const testPrepResources = [
    { title: 'Khan Academy SAT Prep', url: 'https://www.khanacademy.org/sat', description: 'Free, official SAT practice from Khan Academy' },
    { title: 'College Board SAT', url: 'https://collegereadiness.collegeboard.org/sat', description: 'Official SAT information and registration' },
    { title: 'ACT Official Prep', url: 'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html', description: 'Official ACT test preparation materials' },
    { title: 'Khan Academy LSAT Prep', url: 'https://www.khanacademy.org/prep/lsat', description: 'Free LSAT preparation for law school applicants' },
  ];

  const financialAidResources = [
    { title: 'FAFSA', url: 'https://studentaid.gov/', description: 'Free Application for Federal Student Aid' },
    { title: 'College Board CSS Profile', url: 'https://cssprofile.collegeboard.org/', description: 'Additional financial aid application for some schools' },
    { title: 'Scholarship.com', url: 'https://www.scholarship.com/', description: 'Search for scholarships and grants' },
    { title: 'Federal Student Aid', url: 'https://studentaid.gov/understand-aid/types', description: 'Learn about types of federal student aid' },
    { title: 'Work-Study Programs', url: '#', description: 'Federal Work-Study provides part-time jobs to help pay education expenses. Check each school\'s financial aid office.' },
  ];

  const ResourceSection = ({ title, icon: Icon, resources, color }: { title: string; icon: any; resources: any[]; color: string }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="grid gap-4">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url !== '#' ? resource.url : undefined}
            target={resource.url !== '#' ? '_blank' : undefined}
            rel={resource.url !== '#' ? 'noopener noreferrer' : undefined}
            className={`block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
              resource.url !== '#' ? 'cursor-pointer hover:border-blue-300' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                  {resource.url !== '#' && <ExternalLink className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Resources</h1>
        <p className="text-gray-600">Essential tools and links for your college application journey</p>
      </div>

      <div className="space-y-8">
        <ResourceSection title="Application Tools" icon={PenTool} resources={applicationTools} color="bg-blue-500" />
        <ResourceSection title="Test Preparation" icon={BookOpen} resources={testPrepResources} color="bg-green-500" />
        <ResourceSection title="Financial Aid Resources" icon={DollarSign} resources={financialAidResources} color="bg-purple-500" />
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Start your FAFSA as soon as possible after October 1st for the best financial aid opportunities</li>
          <li>• Create accounts on application platforms early to avoid last-minute technical issues</li>
          <li>• Many test prep resources are completely free - explore Khan Academy and official prep materials first</li>
          <li>• Keep track of deadlines for each resource - FAFSA and CSS Profile have different due dates</li>
          <li>• Contact each university's financial aid office directly for school-specific work-study opportunities</li>
        </ul>
      </div>
    </div>
  );
};

export default Resources;
