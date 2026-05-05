import { useState } from 'react';
import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import Section from '../components/common/Section';

const Events = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Sales', 'New Courses', 'Sessions', 'Workshops'];

  const events = [
    {
      id: 1,
      type: 'Sales',
      title: 'Black Friday Sale - 50% Off All Courses',
      date: 'Nov 24-27, 2024',
      description: 'Get 50% off on all our premium courses. Limited time offer!',
      image: '🎉',
      color: 'red',
      badge: 'HOT DEAL',
    },
    {
      id: 2,
      type: 'New Courses',
      title: 'Advanced AI & Machine Learning Course',
      date: 'Launching Dec 1, 2024',
      description: 'Master AI and ML with hands-on projects and real-world applications.',
      image: '🤖',
      color: 'blue',
      badge: 'NEW',
    },
    {
      id: 3,
      type: 'Sessions',
      title: 'Career Guidance Session with Industry Experts',
      date: 'Nov 30, 2024 at 6:00 PM',
      description: 'Join our live Q&A session with tech industry leaders.',
      image: '💼',
      color: 'green',
      badge: 'LIVE',
    },
    {
      id: 4,
      type: 'Workshops',
      title: 'React Performance Optimization Workshop',
      date: 'Dec 5, 2024 at 3:00 PM',
      description: 'Learn advanced techniques to optimize your React applications.',
      image: '⚡',
      color: 'purple',
      badge: 'WORKSHOP',
    },
    {
      id: 5,
      type: 'Sales',
      title: 'Year-End Clearance - Up to 70% Off',
      date: 'Dec 20-31, 2024',
      description: 'Biggest sale of the year! Save up to 70% on selected courses.',
      image: '🎁',
      color: 'orange',
      badge: 'MEGA SALE',
    },
    {
      id: 6,
      type: 'New Courses',
      title: 'Full-Stack Web3 Development',
      date: 'Coming Jan 2025',
      description: 'Build decentralized applications with blockchain technology.',
      image: '⛓️',
      color: 'blue',
      badge: 'COMING SOON',
    },
  ];

  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(event => event.type === activeFilter);

  const colorMap: Record<string, string> = {
    red: 'from-red-500/20 to-red-600/5 border-red-500/30',
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/5 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
  };

  const badgeColorMap: Record<string, string> = {
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <>
      <Meta title="Events | ExpertTalkz" description="Upcoming events, sales, and special sessions." />
      
      {/* Hero Banner Section */}
      <div className="relative py-16 md:py-28 text-center bg-cover bg-center"
          style={{ backgroundImage: "url('/Cointainer/upcoming events.png')" }}>
        <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg cursor-pointer hover:scale-95 transition duration-300">
            UPCOMING EVENTS
          </h1>
          <p className="text-lg md:text-xl text-white font-medium max-w-2xl mx-auto drop-shadow-md cursor-pointer hover:text-black transition duration-300">
            Stay updated with our latest course sales, new launches, and exclusive student sessions.
          </p>
        </div>
      </div>

      <Section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`bg-gradient-to-br ${colorMap[event.color]} border rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <div className="p-8">
                  {/* Icon */}
                  <div className="text-6xl mb-4">{event.image}</div>
                  
                  {/* Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${badgeColorMap[event.color]}`}>
                      {event.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                    <span className="material-symbols-outlined !text-[16px]">calendar_today</span>
                    <span>{event.date}</span>
                  </div>

                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl border border-primary/20 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-black text-white mb-4">Don't Miss Out!</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to get notified about upcoming events, exclusive deals, and new course launches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
              />
              <Button className="w-full sm:w-auto whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Events;
