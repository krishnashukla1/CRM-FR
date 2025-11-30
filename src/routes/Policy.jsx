import React, { useState } from 'react';
import PageWithCloseButton from './PageWithCloseButton';
import { ChevronDown,BookOpen, ChevronRight, Search, FileText, HelpCircle, Clock, Users, Home, Heart, Shield, Shirt, AlertTriangle, TrendingUp } from 'lucide-react';

const policies = [
  {
    title: 'Attendance Policy',
    icon: Clock,
    content: `Employees are expected to arrive on time and adhere to their designated work schedules. Punctuality is crucial for maintaining team productivity and meeting business objectives.
    
    - All planned leave must be requested at least 72 hours in advance through the Leave Management System
    - Unplanned absences (due to illness or emergencies) must be reported to the immediate supervisor within 1 hour of the scheduled start time
    - Three or more unexcused tardies in a month will result in disciplinary action
    - Employees must clock in/out using the biometric system or digital time tracking tool
    
    Exceptions may be made for extraordinary circumstances at management's discretion.`,
  },
  {
    title: 'Employee Conduct & Workplace Behavior',
    icon: Users,
    content: `All employees are expected to maintain the highest standards of professional conduct and ethical behavior at all times.
    
    Core Principles:
    - Treat all colleagues, clients, and visitors with dignity and respect
    - Maintain a harassment-free workplace (including sexual, verbal, and psychological harassment)
    - Avoid conflicts of interest and disclose any potential conflicts to HR
    - Protect company confidential information and intellectual property
    - Refrain from discriminatory behavior based on race, gender, religion, age, disability, or sexual orientation
    
    Violations of conduct policies may result in immediate termination depending on severity. All employees must complete annual anti-harassment training.`,
  },
  {
    title: 'Remote Work & Flexible Arrangements',
    icon: Home,
    content: `The company supports flexible work arrangements when operationally feasible, subject to manager approval.
    
    Remote Work Requirements:
    - Minimum 48 hours notice required for ad hoc remote work days
    - Permanent remote arrangements require VP-level approval
    - Employees must maintain a professional, distraction-free work environment
    - Core availability hours (10am-3pm local time) must be maintained
    - All company equipment must be used in secure locations
    
    Performance metrics for remote employees will be evaluated quarterly. The company reserves the right to recall remote employees to office locations with 30 days notice.`,
  },
  {
    title: 'Leave & Time Off Benefits',
    icon: Heart,
    content: `Our comprehensive leave program supports employee wellbeing and work-life balance.
    
    Leave Categories:
    - Vacation: 15-25 days annually based on tenure
    - Sick Leave: 10 days per calendar year
    - Bereavement: 5 days for immediate family
    - Parental Leave: 12 weeks paid (primary caregiver), 4 weeks (secondary)
    - Jury Duty: Full pay for duration of service
    
    All leave exceeding 5 consecutive days requires HR approval. Unused vacation may be carried over up to 5 days to the next year with manager approval. Leave balances are prorated for new hires during their first year.`,
  },
  {
    title: 'Technology & Data Security',
    icon: Shield,
    content: `Protecting company digital assets and maintaining system integrity is every employee's responsibility.
    
    Usage Guidelines:
    - Company devices may not be used for personal commercial activities
    - All passwords must meet complexity requirements and be changed quarterly
    - No unauthorized software installations permitted
    - VPN must be used when accessing company systems remotely
    - All suspicious emails must be reported to IT immediately
    
    Data Classification:
    - Public: May be shared externally
    - Internal: Company use only
    - Confidential: Requires need-to-know access
    - Restricted: Special handling required
    
    Violations may result in disciplinary action up to termination and legal consequences.`,
  },
  {
    title: 'Dress Code & Appearance',
    icon: Shirt,
    content: `Employees represent our company brand and should maintain a professional appearance appropriate for their role.
    
    Office Attire Guidelines:
    - Business Professional (Client-facing roles): Suits, dress shirts, dress shoes
    - Business Casual (Internal roles): Collared shirts, slacks, skirts/dresses of appropriate length
    - Casual Fridays: Jeans permitted with company logo shirts or neat casual tops
    
    Prohibited Items:
    - Clothing with offensive language/graphics
    - Excessively revealing attire
    - Flip-flops or beachwear
    - Strong perfumes/colognes that may disturb others
    
    Department heads may establish role-specific variations to these guidelines.`,
  },
  {
    title: 'Health & Safety Protocols',
    icon: AlertTriangle,
    content: `Employee health and safety is our top priority in all work environments.
    
    Key Policies:
    - Emergency exits must remain unobstructed at all times
    - All accidents/injuries must be reported within 24 hours
    - Ergonomic assessments available upon request
    - Prohibited substances may not be brought onto company property
    - Workplace violence will not be tolerated
    
    Safety Committees:
    Each department elects a safety representative to participate in quarterly reviews of facilities and procedures. Employees may report concerns anonymously through the ethics hotline.`,
  },
  {
    title: 'Performance Management',
    icon: TrendingUp,
    content: `We believe in continuous feedback and development to help employees grow in their careers.
    
    Evaluation Process:
    - Quarterly check-ins with managers
    - Annual comprehensive performance review
    - 360° feedback for leadership roles
    - SMART goal setting aligned with company objectives
    
    Development Opportunities:
    - $2,000 annual tuition reimbursement
    - Access to LinkedIn Learning platform
    - Mentorship program participation
    - Conference attendance (subject to approval)
    
    Poor performance will result in a Performance Improvement Plan (PIP) with clear metrics and timelines for improvement.`,
  },
];

const Policy = () => {
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.content.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <PageWithCloseButton title="Company Policies">
      <style>{customStyles}</style>
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          {/* <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full shadow-lg bg-gradient-to-r from-teal-400 to-indigo-500">
            <FileText className="w-8 h-8 text-white" />
          </div> */}

            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>

            
          <h1 className="mb-3 text-4xl font-bold text-gray-800">Company Policies</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Review our comprehensive policies designed to create a productive, safe, and inclusive work environment for all employees.
          </p>
        </div>



        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-indigo-400" />
          </div>
          <input
            type="text"
            placeholder="Search policies by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full py-4 pl-12 pr-4 text-base text-gray-700 placeholder-gray-400 transition-all duration-300 bg-white border-0 shadow-lg rounded-xl focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:ring-opacity-50"
            aria-label="Search company policies"
          />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4 mb-10 md:grid-cols-4">
          <div className="p-4 text-center bg-white shadow-md rounded-xl">
            <div className="text-2xl font-bold text-indigo-600">{policies.length}</div>
            <div className="text-sm text-gray-500">Total Policies</div>
          </div>
          <div className="p-4 text-center bg-white shadow-md rounded-xl">
            <div className="text-2xl font-bold text-teal-600">24/7</div>
            <div className="text-sm text-gray-500">HR Support</div>
          </div>
          <div className="p-4 text-center bg-white shadow-md rounded-xl">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-500">Compliance</div>
          </div>
          <div className="p-4 text-center bg-white shadow-md rounded-xl">
            <div className="text-2xl font-bold text-amber-600">2024</div>
            <div className="text-sm text-gray-500">Last Updated</div>
          </div>
        </div>

        {/* Policy List */}
        <div className="mb-10 overflow-hidden shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-2xl">
          {filteredPolicies.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredPolicies.map((policy, index) => {
                const IconComponent = policy.icon;
                return (
                  <div
                    key={index}
                    className={`transition-all duration-300 ${
                      expanded === index ? 'bg-gradient-to-r from-teal-50 to-indigo-50' : 'bg-white'
                    } hover:shadow-sm`}
                    role="region"
                    aria-expanded={expanded === index}
                    aria-labelledby={`policy-title-${index}`}
                  >
                    <button
                      className="flex items-start justify-between w-full p-6 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-inset"
                      onClick={() => setExpanded(expanded === index ? null : index)}
                      aria-controls={`policy-content-${index}`}
                      id={`policy-title-${index}`}
                    >
                      <div className="flex items-start text-left">
                        <div className="flex-shrink-0 p-2 mr-4 bg-teal-100 rounded-lg">
                          <IconComponent className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-800">{policy.title}</h2>
                          {expanded !== index && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {policy.content.split('\n')[0]}
                            </p>
                          )}
                        </div>
                      </div>
                      {expanded === index ? (
                        <ChevronDown className="flex-shrink-0 w-5 h-5 mt-1 text-indigo-500" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="flex-shrink-0 w-5 h-5 mt-1 text-gray-400" aria-hidden="true" />
                      )}
                    </button>
                    {expanded === index && (
                      <div
                        id={`policy-content-${index}`}
                        className="px-6 pt-2 pb-6 ml-12 animate-fade-in"
                        role="region"
                      >
                        <div className="prose text-gray-700 prose-teal max-w-none">
                          {policy.content.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-4 text-sm leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        <div className="mt-4 text-xs font-medium text-gray-500">
                          Last updated: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="mb-4 text-indigo-300">
                <Search className="w-16 h-16 mx-auto" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-700">No policies found</h3>
              <p className="text-sm text-gray-500">
                Try searching with different keywords or browse all policies
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="p-6 border border-teal-100 shadow-md bg-gradient-to-r from-teal-50 to-indigo-50 rounded-2xl">
          <div className="flex items-start">
            <div className="p-3 mr-4 bg-white rounded-full shadow-sm">
              <HelpCircle className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">Need help understanding a policy?</h3>
              <p className="mb-4 text-sm text-gray-700">
                Contact our HR team for clarification or to discuss policy exceptions.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:hr-support@company.com"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200"
                >
                  Email HR Team
                </a>
                <a
                  href="tel:5551234567"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200"
                >
                  Call (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWithCloseButton>
  );
};

// Custom CSS for animations and additional styling
const customStyles = `
  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Improved focus states */
  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.3);
  }

  /* Custom scrollbar for policy content */
  .prose {
    scrollbar-width: thin;
    scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
  }

  .prose::-webkit-scrollbar {
    width: 4px;
  }

  .prose::-webkit-scrollbar-track {
    background: transparent;
  }

  .prose::-webkit-scrollbar-thumb {
    background-color: rgba(99, 102, 241, 0.3);
    border-radius: 20px;
  }

  /* Hover effects */
  .hover\\:shadow-sm:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  /* Gradient text for headings */
  .gradient-text {
    background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export default Policy;
