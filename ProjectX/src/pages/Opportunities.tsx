import { useState } from 'react';
import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import Section from '../components/common/Section';

const Opportunities = () => {
  const [activeTab, setActiveTab] = useState('Roles');

  const careerRoles = [
    {
      id: 1,
      title: 'Full-Stack Developer',
      salary: '$80k - $150k/year',
      demand: 'High',
      courses: ['React Fundamentals', 'Node.js Backend', 'Database Design'],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'],
      icon: '💻',
      color: 'blue',
    },
    {
      id: 2,
      title: 'AI/ML Engineer',
      salary: '$100k - $180k/year',
      demand: 'Very High',
      courses: ['Python for AI', 'Machine Learning', 'Deep Learning'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Neural Networks'],
      icon: '🤖',
      color: 'purple',
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      salary: '$90k - $160k/year',
      demand: 'High',
      courses: ['Docker & Kubernetes', 'CI/CD Pipelines', 'Cloud Computing'],
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
      icon: '⚙️',
      color: 'green',
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      salary: '$70k - $130k/year',
      demand: 'Medium',
      courses: ['Figma Mastery', 'Design Thinking', 'User Research'],
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Testing', 'Design Systems'],
      icon: '🎨',
      color: 'pink',
    },
    {
      id: 5,
      title: 'Blockchain Developer',
      salary: '$95k - $170k/year',
      demand: 'Very High',
      courses: ['Solidity Basics', 'Smart Contracts', 'Web3 Development'],
      skills: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'DeFi'],
      icon: '⛓️',
      color: 'orange',
    },
    {
      id: 6,
      title: 'Data Scientist',
      salary: '$85k - $155k/year',
      demand: 'High',
      courses: ['Statistics', 'Data Analysis', 'Machine Learning'],
      skills: ['Python', 'R', 'SQL', 'Pandas', 'Data Visualization'],
      icon: '📊',
      color: 'cyan',
    },
  ];

  const roadmaps = [
    {
      id: 1,
      title: 'Frontend Developer Roadmap',
      duration: '6-8 months',
      steps: [
        { phase: 'Foundation', topics: ['HTML/CSS', 'JavaScript Basics', 'Git'] },
        { phase: 'Framework', topics: ['React.js', 'State Management', 'Routing'] },
        { phase: 'Advanced', topics: ['TypeScript', 'Testing', 'Performance'] },
        { phase: 'Professional', topics: ['Next.js', 'CI/CD', 'Deployment'] },
      ],
    },
    {
      id: 2,
      title: 'Backend Developer Roadmap',
      duration: '6-9 months',
      steps: [
        { phase: 'Foundation', topics: ['Programming Basics', 'Databases', 'APIs'] },
        { phase: 'Framework', topics: ['Node.js/Express', 'Authentication', 'Security'] },
        { phase: 'Advanced', topics: ['Microservices', 'Caching', 'Message Queues'] },
        { phase: 'Professional', topics: ['Cloud Deployment', 'Monitoring', 'Scaling'] },
      ],
    },
    {
      id: 3,
      title: 'AI/ML Engineer Roadmap',
      duration: '8-12 months',
      steps: [
        { phase: 'Foundation', topics: ['Python', 'Mathematics', 'Statistics'] },
        { phase: 'Core ML', topics: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks'] },
        { phase: 'Deep Learning', topics: ['CNNs', 'RNNs', 'Transformers'] },
        { phase: 'Specialization', topics: ['NLP', 'Computer Vision', 'MLOps'] },
      ],
    },
  ];

  const demandColors: Record<string, string> = {
    'Very High': 'bg-green-500/20 text-green-400 border-green-500/30',
    'High': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Medium': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <>
      <Meta title="Opportunities | ExpertTalkz" description="Explore career opportunities and learning roadmaps." />
      
      <Section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Career Opportunities
            </h1>
            <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
              Discover what roles you can pursue and the courses you need to get there.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {['Roles', 'Roadmaps'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Career Roles Tab */}
          {activeTab === 'Roles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {careerRoles.map((role) => (
                <div
                  key={role.id}
                  className="bg-card-dark border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-all group"
                >
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">{role.icon}</div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-sm text-slate-400 font-medium">{role.salary}</p>
                    </div>
                  </div>

                  {/* Demand Badge */}
                  <div className="mb-6">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${demandColors[role.demand]}`}>
                      {role.demand} Demand
                    </span>
                  </div>

                  {/* Required Courses */}
                  <div className="mb-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Required Courses</h4>
                    <div className="flex flex-col gap-2">
                      {role.courses.map((course, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="material-symbols-outlined !text-[16px] text-primary">check_circle</span>
                          {course}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                    View Courses
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Roadmaps Tab */}
          {activeTab === 'Roadmaps' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {roadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-card-dark border border-white/10 rounded-2xl p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{roadmap.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="material-symbols-outlined !text-[16px]">schedule</span>
                      {roadmap.duration}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {roadmap.steps.map((step, idx) => (
                      <div key={idx} className="relative pl-8">
                        {/* Timeline Line */}
                        {idx < roadmap.steps.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-white/10"></div>
                        )}
                        
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>

                        {/* Content */}
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-2">
                            Phase {idx + 1}: {step.phase}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {step.topics.map((topic, topicIdx) => (
                              <span
                                key={topicIdx}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-8">
                    Start This Path
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl border border-primary/20 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-black text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Browse our courses and find the perfect learning path for your dream career.
            </p>
            <Button size="lg">
              Explore All Courses
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Opportunities;
