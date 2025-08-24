// import React, { useState } from 'react';
// import PageWithCloseButton from './PageWithCloseButton';
// import { ChevronDown, ChevronRight, Search } from 'lucide-react';

// const policies = [
//   {
//     title: 'Attendance Policy',
//     content: `Employees are expected to arrive on time and adhere to the work schedule.
//       Any planned leave must be requested in advance through the Leave Management System.
//       Unplanned leave should be reported to the reporting manager as soon as possible.`,
//   },
//   {
//     title: 'Employee Conduct',
//     content: `All employees must maintain professionalism, treat colleagues with respect, and follow company rules.
//       Harassment, discrimination, or inappropriate behavior will not be tolerated.`,
//   },
//   {
//     title: 'Work From Home Rules',
//     content: `Work from home is allowed only with prior approval from the reporting manager.
//       Employees must be available during office hours and complete assigned tasks on time.`,
//   },
//   {
//     title: 'Leave Policy',
//     content: `Employees are entitled to a fixed number of annual leaves as per company norms.
//       Unused leaves cannot be carried forward unless specified by the HR department.`,
//   },
//   {
//     title: 'Internet & Email Usage',
//     content: `Company internet and email should be used for official purposes only.
//       Accessing inappropriate websites or sharing confidential information is strictly prohibited.`,
//   },
//   {
//     title: 'Dress Code',
//     content: `Employees should maintain a neat and professional appearance at all times.
//       Casual attire is permitted on Fridays, unless otherwise notified.`,
//   },
// ];

// const Policy = () => {
//   const [expanded, setExpanded] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredPolicies = policies.filter(policy =>
//     policy.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <PageWithCloseButton title="📜 Company Policies">
//       <div className="bg-white p-6 rounded-lg shadow">
//         {/* Search Bar */}
//         <div className="relative mb-4">
//           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search policy by heading..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring focus:ring-blue-200 outline-none"
//           />
//         </div>

//         {/* Policy List */}
//         {filteredPolicies.length > 0 ? (
//           filteredPolicies.map((policy, index) => (
//             <div
//               key={index}
//               className="border-b last:border-0 py-3 cursor-pointer"
//             >
//               <div
//                 className="flex items-center justify-between hover:text-blue-600"
//                 onClick={() =>
//                   setExpanded(expanded === index ? null : index)
//                 }
//               >
//                 <h2 className="font-semibold text-lg">{policy.title}</h2>
//                 {expanded === index ? (
//                   <ChevronDown size={20} />
//                 ) : (
//                   <ChevronRight size={20} />
//                 )}
//               </div>
//               {expanded === index && (
//                 <p className="mt-2 text-gray-600">{policy.content}</p>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No policy found with that heading.</p>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Policy;


//================

// import React, { useState } from 'react';
// import PageWithCloseButton from './PageWithCloseButton';
// import { ChevronDown, ChevronRight, Search } from 'lucide-react';

// const policies = [
//   {
//     title: 'Attendance Policy',
//     content: `Employees are expected to arrive on time and adhere to their designated work schedules. Punctuality is crucial for maintaining team productivity and meeting business objectives.
    
//     - All planned leave must be requested at least 72 hours in advance through the Leave Management System
//     - Unplanned absences (due to illness or emergencies) must be reported to the immediate supervisor within 1 hour of the scheduled start time
//     - Three or more unexcused tardies in a month will result in disciplinary action
//     - Employees must clock in/out using the biometric system or digital time tracking tool
    
//     Exceptions may be made for extraordinary circumstances at management's discretion.`,
//   },
//   {
//     title: 'Employee Conduct & Workplace Behavior',
//     content: `All employees are expected to maintain the highest standards of professional conduct and ethical behavior at all times.
    
//     Core Principles:
//     - Treat all colleagues, clients, and visitors with dignity and respect
//     - Maintain a harassment-free workplace (including sexual, verbal, and psychological harassment)
//     - Avoid conflicts of interest and disclose any potential conflicts to HR
//     - Protect company confidential information and intellectual property
//     - Refrain from discriminatory behavior based on race, gender, religion, age, disability, or sexual orientation
    
//     Violations of conduct policies may result in immediate termination depending on severity. All employees must complete annual anti-harassment training.`,
//   },
//   {
//     title: 'Remote Work & Flexible Arrangements',
//     content: `The company supports flexible work arrangements when operationally feasible, subject to manager approval.
    
//     Remote Work Requirements:
//     - Minimum 48 hours notice required for ad hoc remote work days
//     - Permanent remote arrangements require VP-level approval
//     - Employees must maintain a professional, distraction-free work environment
//     - Core availability hours (10am-3pm local time) must be maintained
//     - All company equipment must be used in secure locations
    
//     Performance metrics for remote employees will be evaluated quarterly. The company reserves the right to recall remote employees to office locations with 30 days notice.`,
//   },
//   {
//     title: 'Leave & Time Off Benefits',
//     content: `Our comprehensive leave program supports employee wellbeing and work-life balance.
    
//     Leave Categories:
//     - Vacation: 15-25 days annually based on tenure
//     - Sick Leave: 10 days per calendar year
//     - Bereavement: 5 days for immediate family
//     - Parental Leave: 12 weeks paid (primary caregiver), 4 weeks (secondary)
//     - Jury Duty: Full pay for duration of service
    
//     All leave exceeding 5 consecutive days requires HR approval. Unused vacation may be carried over up to 5 days to the next year with manager approval. Leave balances are prorated for new hires during their first year.`,
//   },
//   {
//     title: 'Technology & Data Security',
//     content: `Protecting company digital assets and maintaining system integrity is every employee's responsibility.
    
//     Usage Guidelines:
//     - Company devices may not be used for personal commercial activities
//     - All passwords must meet complexity requirements and be changed quarterly
//     - No unauthorized software installations permitted
//     - VPN must be used when accessing company systems remotely
//     - All suspicious emails must be reported to IT immediately
    
//     Data Classification:
//     - Public: May be shared externally
//     - Internal: Company use only
//     - Confidential: Requires need-to-know access
//     - Restricted: Special handling required
    
//     Violations may result in disciplinary action up to termination and legal consequences.`,
//   },
//   {
//     title: 'Dress Code & Appearance',
//     content: `Employees represent our company brand and should maintain a professional appearance appropriate for their role.
    
//     Office Attire Guidelines:
//     - Business Professional (Client-facing roles): Suits, dress shirts, dress shoes
//     - Business Casual (Internal roles): Collared shirts, slacks, skirts/dresses of appropriate length
//     - Casual Fridays: Jeans permitted with company logo shirts or neat casual tops
    
//     Prohibited Items:
//     - Clothing with offensive language/graphics
//     - Excessively revealing attire
//     - Flip-flops or beachwear
//     - Strong perfumes/colognes that may disturb others
    
//     Department heads may establish role-specific variations to these guidelines.`,
//   },
//   {
//     title: 'Health & Safety Protocols',
//     content: `Employee health and safety is our top priority in all work environments.
    
//     Key Policies:
//     - Emergency exits must remain unobstructed at all times
//     - All accidents/injuries must be reported within 24 hours
//     - Ergonomic assessments available upon request
//     - Prohibited substances may not be brought onto company property
//     - Workplace violence will not be tolerated
    
//     Safety Committees:
//     Each department elects a safety representative to participate in quarterly reviews of facilities and procedures. Employees may report concerns anonymously through the ethics hotline.`,
//   },
//   {
//     title: 'Performance Management',
//     content: `We believe in continuous feedback and development to help employees grow in their careers.
    
//     Evaluation Process:
//     - Quarterly check-ins with managers
//     - Annual comprehensive performance review
//     - 360° feedback for leadership roles
//     - SMART goal setting aligned with company objectives
    
//     Development Opportunities:
//     - $2,000 annual tuition reimbursement
//     - Access to LinkedIn Learning platform
//     - Mentorship program participation
//     - Conference attendance (subject to approval)
    
//     Poor performance will result in a Performance Improvement Plan (PIP) with clear metrics and timelines for improvement.`,
//   },
// ];

// const Policy = () => {
//   const [expanded, setExpanded] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredPolicies = policies.filter(policy =>
//     policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     policy.content.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <PageWithCloseButton title="📜 Company Policies">
//       <div className="max-w-4xl mx-auto">
//         {/* Search Bar */}
//         <div className="relative mb-6">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search policies by keyword..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
//           />
//         </div>

//         {/* Policy List */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           {filteredPolicies.length > 0 ? (
//             filteredPolicies.map((policy, index) => (
//               <div
//                 key={index}
//                 className={`border-b border-gray-100 last:border-0 transition-all duration-200 ${expanded === index ? 'bg-blue-50' : ''}`}
//               >
//                 <div
//                   className="flex items-center justify-between p-5 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
//                   onClick={() => setExpanded(expanded === index ? null : index)}
//                 >
//                   <div>
//                     <h2 className="font-bold text-xl text-gray-800">{policy.title}</h2>
//                     {expanded !== index && (
//                       <p className="text-gray-500 mt-1 line-clamp-2">
//                         {policy.content.split('\n')[0]}
//                       </p>
//                     )}
//                   </div>
//                   {expanded === index ? (
//                     <ChevronDown className="h-6 w-6 text-blue-600" />
//                   ) : (
//                     <ChevronRight className="h-6 w-6 text-gray-400" />
//                   )}
//                 </div>
//                 {expanded === index && (
//                   <div className="px-5 pb-5 pt-2">
//                     <div className="prose prose-blue max-w-none">
//                       {policy.content.split('\n').map((paragraph, i) => (
//                         <p key={i} className="mb-4 text-gray-700">
//                           {paragraph}
//                         </p>
//                       ))}
//                     </div>
//                     <div className="mt-4 text-sm text-blue-600 font-medium">
//                       Last updated: {new Date().toLocaleDateString()}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center">
//               <div className="text-gray-400 mb-4">
//                 <Search className="h-12 w-12 mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900">No policies found</h3>
//               <p className="mt-1 text-gray-500">
//                 Try searching with different keywords or browse all policies
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Help Section */}
//         <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
//           <h3 className="font-bold text-blue-800 mb-2">Need help understanding a policy?</h3>
//           <p className="text-blue-700 mb-3">
//             Contact HR at <span className="font-semibold">hr-support@company.com</span> or 
//             call <span className="font-semibold">(555) 123-4567</span> for clarification.
//           </p>
//           <button className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//             Request Policy Exception
//           </button>
//         </div>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Policy;
//===============================

// import React, { useState } from 'react';
// import PageWithCloseButton from './PageWithCloseButton';
// import { ChevronDown, ChevronRight, Search } from 'lucide-react';

// const policies = [
//   {
//     title: 'Attendance Policy',
//     content: `Employees are expected to arrive on time and adhere to their designated work schedules. Punctuality is crucial for maintaining team productivity and meeting business objectives.
    
//     - All planned leave must be requested at least 72 hours in advance through the Leave Management System
//     - Unplanned absences (due to illness or emergencies) must be reported to the immediate supervisor within 1 hour of the scheduled start time
//     - Three or more unexcused tardies in a month will result in disciplinary action
//     - Employees must clock in/out using the biometric system or digital time tracking tool
    
//     Exceptions may be made for extraordinary circumstances at management's discretion.`,
//   },
//   {
//     title: 'Employee Conduct & Workplace Behavior',
//     content: `All employees are expected to maintain the highest standards of professional conduct and ethical behavior at all times.
    
//     Core Principles:
//     - Treat all colleagues, clients, and visitors with dignity and respect
//     - Maintain a harassment-free workplace (including sexual, verbal, and psychological harassment)
//     - Avoid conflicts of interest and disclose any potential conflicts to HR
//     - Protect company confidential information and intellectual property
//     - Refrain from discriminatory behavior based on race, gender, religion, age, disability, or sexual orientation
    
//     Violations of conduct policies may result in immediate termination depending on severity. All employees must complete annual anti-harassment training.`,
//   },
//   {
//     title: 'Remote Work & Flexible Arrangements',
//     content: `The company supports flexible work arrangements when operationally feasible, subject to manager approval.
    
//     Remote Work Requirements:
//     - Minimum 48 hours notice required for ad hoc remote work days
//     - Permanent remote arrangements require VP-level approval
//     - Employees must maintain a professional, distraction-free work environment
//     - Core availability hours (10am-3pm local time) must be maintained
//     - All company equipment must be used in secure locations
    
//     Performance metrics for remote employees will be evaluated quarterly. The company reserves the right to recall remote employees to office locations with 30 days notice.`,
//   },
//   {
//     title: 'Leave & Time Off Benefits',
//     content: `Our comprehensive leave program supports employee wellbeing and work-life balance.
    
//     Leave Categories:
//     - Vacation: 15-25 days annually based on tenure
//     - Sick Leave: 10 days per calendar year
//     - Bereavement: 5 days for immediate family
//     - Parental Leave: 12 weeks paid (primary caregiver), 4 weeks (secondary)
//     - Jury Duty: Full pay for duration of service
    
//     All leave exceeding 5 consecutive days requires HR approval. Unused vacation may be carried over up to 5 days to the next year with manager approval. Leave balances are prorated for new hires during their first year.`,
//   },
//   {
//     title: 'Technology & Data Security',
//     content: `Protecting company digital assets and maintaining system integrity is every employee's responsibility.
    
//     Usage Guidelines:
//     - Company devices may not be used for personal commercial activities
//     - All passwords must meet complexity requirements and be changed quarterly
//     - No unauthorized software installations permitted
//     - VPN must be used when accessing company systems remotely
//     - All suspicious emails must be reported to IT immediately
    
//     Data Classification:
//     - Public: May be shared externally
//     - Internal: Company use only
//     - Confidential: Requires need-to-know access
//     - Restricted: Special handling required
    
//     Violations may result in disciplinary action up to termination and legal consequences.`,
//   },
//   {
//     title: 'Dress Code & Appearance',
//     content: `Employees represent our company brand and should maintain a professional appearance appropriate for their role.
    
//     Office Attire Guidelines:
//     - Business Professional (Client-facing roles): Suits, dress shirts, dress shoes
//     - Business Casual (Internal roles): Collared shirts, slacks, skirts/dresses of appropriate length
//     - Casual Fridays: Jeans permitted with company logo shirts or neat casual tops
    
//     Prohibited Items:
//     - Clothing with offensive language/graphics
//     - Excessively revealing attire
//     - Flip-flops or beachwear
//     - Strong perfumes/colognes that may disturb others
    
//     Department heads may establish role-specific variations to these guidelines.`,
//   },
//   {
//     title: 'Health & Safety Protocols',
//     content: `Employee health and safety is our top priority in all work environments.
    
//     Key Policies:
//     - Emergency exits must remain unobstructed at all times
//     - All accidents/injuries must be reported within 24 hours
//     - Ergonomic assessments available upon request
//     - Prohibited substances may not be brought onto company property
//     - Workplace violence will not be tolerated
    
//     Safety Committees:
//     Each department elects a safety representative to participate in quarterly reviews of facilities and procedures. Employees may report concerns anonymously through the ethics hotline.`,
//   },
//   {
//     title: 'Performance Management',
//     content: `We believe in continuous feedback and development to help employees grow in their careers.
    
//     Evaluation Process:
//     - Quarterly check-ins with managers
//     - Annual comprehensive performance review
//     - 360° feedback for leadership roles
//     - SMART goal setting aligned with company objectives
    
//     Development Opportunities:
//     - $2,000 annual tuition reimbursement
//     - Access to LinkedIn Learning platform
//     - Mentorship program participation
//     - Conference attendance (subject to approval)
    
//     Poor performance will result in a Performance Improvement Plan (PIP) with clear metrics and timelines for improvement.`,
//   },
// ];

// const Policy = () => {
//   const [expanded, setExpanded] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredPolicies = policies.filter(policy =>
//     policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     policy.content.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <PageWithCloseButton title="📜 Company Policies">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Search Bar */}
//         <div className="relative mb-8">
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//             <Search className="h-5 w-5 text-indigo-500" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search policies by keyword..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base sm:text-lg text-gray-700 placeholder-gray-400 transition-all duration-200 ease-in-out"
//             aria-label="Search company policies"
//           />
//         </div>

//         {/* Policy List */}
//         <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden">
//           {filteredPolicies.length > 0 ? (
//             filteredPolicies.map((policy, index) => (
//               <div
//                 key={index}
//                 className={`border-b border-gray-100 last:border-0 transition-all duration-300 ${
//                   expanded === index ? 'bg-teal-50' : 'bg-white'
//                 } hover:shadow-md`}
//                 role="region"
//                 aria-expanded={expanded === index}
//                 aria-labelledby={`policy-title-${index}`}
//               >
//                 <button
//                   className="flex items-center justify-between w-full p-6 hover:bg-teal-50 focus:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-inset transition-all duration-200 transform hover:scale-[1.01]"
//                   onClick={() => setExpanded(expanded === index ? null : index)}
//                   aria-controls={`policy-content-${index}`}
//                   id={`policy-title-${index}`}
//                 >
//                   <div className="text-left">
//                     <h2 className="font-bold text-xl sm:text-2xl text-teal-700">{policy.title}</h2>
//                     {expanded !== index && (
//                       <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">
//                         {policy.content.split('\n')[0]}
//                       </p>
//                     )}
//                   </div>
//                   {expanded === index ? (
//                     <ChevronDown className="h-6 w-6 text-indigo-600" aria-hidden="true" />
//                   ) : (
//                     <ChevronRight className="h-6 w-6 text-indigo-400" aria-hidden="true" />
//                   )}
//                 </button>
//                 {expanded === index && (
//                   <div
//                     id={`policy-content-${index}`}
//                     className="px-6 pb-6 pt-2 animate-fade-in"
//                     role="region"
//                   >
//                     <div className="prose prose-teal max-w-none text-gray-700">
//                       {policy.content.split('\n').map((paragraph, i) => (
//                         <p key={i} className="mb-3 text-sm sm:text-base leading-relaxed">
//                           {paragraph}
//                         </p>
//                       ))}
//                     </div>
//                     <div className="mt-4 text-sm text-indigo-600 font-medium">
//                       Last updated: {new Date().toLocaleDateString()}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center">
//               <div className="text-indigo-300 mb-4">
//                 <Search className="h-12 w-12 mx-auto" aria-hidden="true" />
//               </div>
//               <h3 className="text-lg font-medium text-teal-700">No policies found</h3>
//               <p className="mt-2 text-gray-600 text-sm sm:text-base">
//                 Try searching with different keywords or browse all policies
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Help Section */}
//         <div className="mt-8 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-xl p-6 border border-teal-100 shadow-md">
//           <h3 className="font-bold text-lg sm:text-xl text-teal-700 mb-3">Need help understanding a policy?</h3>
//           <p className="text-gray-700 mb-4 text-sm sm:text-base">
//             Contact HR at <span className="font-semibold text-indigo-600">hr-support@company.com</span> or 
//             call <span className="font-semibold text-indigo-600">(555) 123-4567</span> for clarification.
//           </p>
//           <button
//             className="inline-flex items-center px-5 py-2.5 bg-indigo-600 !text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
//             aria-label="Request a policy exception"
//           >
//             Request Policy Exception
//           </button>
//         </div>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// // Custom CSS for animations and additional styling
// const customStyles = `
//   @keyframes fade-in {
//     0% { opacity: 0; transform: translateY(5px); }
//     100% { opacity: 1; transform: translateY(0); }
//   }

//   .animate-fade-in {
//     animation: fade-in 0.3s ease-out;
//   }

//   /* Accessibility focus states */
//   button:focus {
//     outline: none;
//     box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.3);
//   }

//   /* Improved typography */
//   .prose {
//     line-height: 1.8;
//     color: #374151; /* gray-700 */
//   }

//   /* Responsive adjustments */
//   @media (min-width: 640px) {
//     .prose {
//       font-size: 1.05rem;
//     }
//   }

//   /* Subtle card hover effect */
//   .hover\:shadow-md:hover {
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   }
// `;

// export default Policy;




//=========================only chnage css==============


import React, { useState } from 'react';
import PageWithCloseButton from './PageWithCloseButton';
import { ChevronDown, ChevronRight, Search, FileText, HelpCircle, Clock, Users, Home, Heart, Shield, Shirt, AlertTriangle, TrendingUp } from 'lucide-react';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full shadow-lg mb-4">
            <FileText className="h-8 w-8 text-white" />
      

          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Company Policies</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review our comprehensive policies designed to create a productive, safe, and inclusive work environment for all employees.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-indigo-400" />
          </div>
          <input
            type="text"
            placeholder="Search policies by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:ring-opacity-50 text-base text-gray-700 placeholder-gray-400 transition-all duration-300"
            aria-label="Search company policies"
          />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-indigo-600">{policies.length}</div>
            <div className="text-sm text-gray-500">Total Policies</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-teal-600">24/7</div>
            <div className="text-sm text-gray-500">HR Support</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-500">Compliance</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-amber-600">2024</div>
            <div className="text-sm text-gray-500">Last Updated</div>
          </div>
        </div>

        {/* Policy List */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden mb-10">
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
                      className="flex items-start justify-between w-full p-6 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-inset transition-all duration-200"
                      onClick={() => setExpanded(expanded === index ? null : index)}
                      aria-controls={`policy-content-${index}`}
                      id={`policy-title-${index}`}
                    >
                      <div className="flex items-start text-left">
                        <div className="p-2 bg-teal-100 rounded-lg mr-4 flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <h2 className="font-bold text-lg text-gray-800">{policy.title}</h2>
                          {expanded !== index && (
                            <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                              {policy.content.split('\n')[0]}
                            </p>
                          )}
                        </div>
                      </div>
                      {expanded === index ? (
                        <ChevronDown className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-1" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" aria-hidden="true" />
                      )}
                    </button>
                    {expanded === index && (
                      <div
                        id={`policy-content-${index}`}
                        className="px-6 pb-6 pt-2 ml-12 animate-fade-in"
                        role="region"
                      >
                        <div className="prose prose-teal max-w-none text-gray-700">
                          {policy.content.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-4 text-sm leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        <div className="mt-4 text-xs text-gray-500 font-medium">
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
              <div className="text-indigo-300 mb-4">
                <Search className="h-16 w-16 mx-auto" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No policies found</h3>
              <p className="text-gray-500 text-sm">
                Try searching with different keywords or browse all policies
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-teal-50 to-indigo-50 rounded-2xl p-6 border border-teal-100 shadow-md">
          <div className="flex items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mr-4">
              <HelpCircle className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Need help understanding a policy?</h3>
              <p className="text-gray-700 mb-4 text-sm">
                Contact our HR team for clarification or to discuss policy exceptions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
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