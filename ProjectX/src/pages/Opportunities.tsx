import { useState } from 'react';
import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import Section from '../components/common/Section';

const Opportunities = () => {
  const [activeTab, setActiveTab] = useState('Roles');

  const careerRoles = [
    {
      id: 1,
      title: ' Offsour Piping Stree Analysis',
      salary: '₹2.0 - ₹6.5 LPA/year',
      demand: 'High',
      courses: ['Piping (Basc-Adv)','PipeStress Analysis using CAESAR_II','ASME Codes'],
      skills: ['Pipe routing & layout', 'AutoCAD', 'Stress & flexibility analysis', 'Nozzle load checking', 'P&ID reading'],
      icon: '🛠️',
      color: 'blue',
    },
    {
      id: 2,
      title: 'Piping Design Engineering (E3D)',
      salary: '₹2 - ₹5 LPA/year',
      demand: 'High',
      courses: ['Isometric Drawing', 'AutoCAD', 'P&ID Reading'],
      skills: ['E3D / PDMS ⭐','Clash detection', 'Material take-off (MTO)', 'Navisworks', 'ASME standards', 'Plant safety clearances'],
      icon: '🏭',
      color: 'purple',
    },
    {
      id: 3,
      title: 'Piping Design Engineering (SPSD)',
      salary: '₹3 - ₹8 LPA/year',
      demand: 'High',
      courses: ['Equipment modeling', 'Pipe routing', 'Structural modeling','HVAC/cable tray basics','Isometric extraction','Clash checking','Drawing generation'],
      skills: ['SP3D ⭐', 'ASME codes', 'Clash detection', 'Drawing extraction'],
      icon: '🔧',
      color: 'green',
    },
    {
      id: 4,
      title: 'Subsea Pipe line Engineering and Installation',
      salary: '₹2 - ₹5 LPA/year',
      demand: 'High',
      courses: ['Subsea pipeline design' ,'Pipeline route engineering', 'Pipeline installation methods', 'Offshore pipeline laying', 'Pipeline welding and fabrication', 'Subsea inspection and maintenance', 'Pipeline stability and on-bottom design'],
      skills: ['Subsea Engineering ⭐', 'Offshore Pipeline Design', 'Pipeline Installation', 'ASME/API Codes', 'ROV Operations','Pipeline Inspection'],
      icon: '🌊',
      color: 'red',
    },
    {
      id: 5,
      title: 'Electrical Engineering on ETAP',
      salary: '₹2 - ₹5 LPA/year',
      demand: 'High',
      courses: ['AutoCAD 2D Drafting ⭐', 'Engineering Drawing Basics', 'Mechanical / Civil Drafting Basics', 'P&ID Reading', 'Isometric Drawing Basics'],
      skills: ['2D Drafting & Annotation ⭐', 'Pipe Routing Layouts', 'Isometric Drawing', 'Structural Drafting', 'Drawing Generation'],
      icon: '🚰',
      color: 'green',
    },
  ];

  const roadmaps = [
    {
      id: 1,
      title: 'Offsour Piping Stree Analysis',
      duration: '6-8 months',
      steps: [
        { phase: 'Phase 1', topics: ['Piping Engineering Design ⭐', 'Mechanical Engineering Fundamentals', 'Pipe Fittings, Valves & Specifications', 'P&ID Reading', 'AutoCAD (2D Drafting & Isometric Drawings)' ] },
        { phase: 'Framework', topics: ['SP3D / E3D / PDMS Basics', 'Plant Layout & Pipe Routing', 'Equipment Connections & Nozzle Orientation', 'Pipe Support Fundamentals', 'ASME B31.1 & B31.3 Code Basics ⭐'] },
        { phase: 'Advanced', topics: ['CAESAR II Interface & Modeling', 'Load Cases & Stress Analysis', 'Thermal Expansion & Flexibility Analysis', 'Sustained, Occasional & Operating Loads', 'Spring Supports, Hangers & Restraints'] },
        { phase: 'Professional', topics: ['Advanced CAESAR II Projects ⭐', 'Nozzle Load Evaluation', 'Dynamic & Seismic Analysis', 'Stress Optimization & Troubleshooting', 'EPC Workflow, Reports & Interview Preparation'] },
      ],
    },
    {
      id: 2,
      title: 'SP3D',
      duration: '6-9 months',
      steps: [
        { phase: 'Foundation', topics: ['Piping Engineering Design ⭐', 'Mechanical Equipment Basics', 'P&ID Reading', 'AutoCAD (2D Drafting & ISO Drawings)', 'Pipe Fittings, Valves & Specifications'] },
        { phase: 'Framework', topics: ['SP3D Interface & Navigation', 'Equipment Modeling', 'Pipe Routing', 'Structural Modeling', 'Catalogs & Pipe Specification'] },
        { phase: 'Advanced', topics: ['Advanced Pipe Routing', 'Clash Detection & Resolution', 'Isometric Extraction', 'Pipe Support Basics', 'Orthographic Drawings & MTO Reports'] },
        { phase: 'Professional', topics: ['Real EPC Project Modeling ⭐', 'Industry Standards (ASME Basics)', 'Navisworks Coordination', 'CAESAR II (Advanced Stress Analysis)','Interview Preparation & Portfolio Building'] },
      ],
    },
    {
      id: 3,
      title: 'E3D',
      duration: '8-12 months',
      steps: [
        { phase: 'Foundation', topics: ['Piping Engineering Design ⭐', 'Mechanical Engineering Fundamentals', 'Pipe Fittings, Valves & Specifications', 'P&ID Reading', 'AutoCAD (2D Drafting & Isometric Drawings)'] },
        { phase: 'Core ML', topics: ['PDMS Interface & Navigation', 'Equipment Modeling', 'Pipe Routing Basics', 'Structural Modeling', 'Catalogs & Pipe Specifications ⭐'] },
        { phase: 'Deep Learning', topics: ['Advanced Pipe Routing', 'Clash Detection & Design Review', 'Isometric Extraction & Drawing Generation','Pipe Support Basics', 'MTO Reports & Orthographic Drawings'] },
        { phase: 'Specialization', topics: ['Real EPC Plant Modeling Projects ⭐', 'ASME Codes & Industry Standards', 'Navisworks Coordination', 'CAESAR II (Advanced Stress Analysis)', 'Portfolio Building & Interview Preparation'] },
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
      
      {/* Hero Banner Section */}
      <div className="relative py-16 md:py-28 text-center bg-cover bg-center"
          style={{ backgroundImage: 'url("https://cdn.searchenginejournal.com/wp-content/uploads/2018/06/5-SEO-Opportunities-You-May-Be-Missing-Out-On.png")' }}>
        <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg cursor-pointer hover:scale-95 transition duration-300">
            CAREER OPPORTUNITIES
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto drop-shadow-md cursor-pointer hover:text-white transition duration-300">
            Discover what roles you can pursue and the courses you need to get there.
          </p>
        </div>
      </div>

      <Section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

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
