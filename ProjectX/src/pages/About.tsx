import Section from '../components/common/Section';
import Meta from '../components/common/Meta';
import { Target, Award, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <>
      <Meta
        title="About Us | Expertalkz Global Solutions"
        description="Learn about Expertalkz's mission to bridge the massive gap between classroom knowledge and real-world offshore industry demands."
      />
      {/* Header */}
      <div className="bg-surface-dark py-12 md:py-16 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white leading-tight">We Are Engineers of Society.<br className="md:hidden" /> Architects of Ambition.</h1>
          <p className="text-base md:text-xl text-[#9dabb9] max-w-2xl mx-auto">
            Expertalkz Global Solutions LLP — Powering the Future of Industry Since 2020.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-white">
              Born from a Gap. <span className="text-primary">Built for a Generation.</span>
            </h2>
            <div className="flex flex-col gap-4 text-[#9dabb9] text-base md:text-lg leading-relaxed">
              <p>
                Expertalkz was founded in 2020 with one clear mission: to bridge the massive gap between classroom knowledge and real-world offshore industry demands.
              </p>
              <p>
                We saw brilliant engineers struggling to land jobs — not because they lacked intelligence, but because no one had trained them for the realities of offshore projects, international codes, and industry-grade software. We decided to change that.
              </p>
              <p>
                Starting small, growing fast — we now serve professionals across India and 15+ countries, offering training that is built the way the industry works.
              </p>
            </div>
          </div>
          <div className="h-[260px] md:h-[400px] bg-card-dark rounded-2xl border border-white/5 relative overflow-hidden mt-4 md:mt-0">
            <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url("/Cointainer/Group Logo 2.png")' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background-transparent"></div>
          </div>
        </div>
      </Section>

      {/* Core Values */}
      <Section variant="surface">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target size={32} className="text-primary" />,
              title: "Excellence",
              desc: "We set the bar high — because the industry does.",
              accent: "text-primary bg-primary/10"
            },
            {
              icon: <Award size={32} className="text-pink-500" />,
              title: "Integrity",
              desc: "Transparent, honest, and accountable in everything we do.",
              accent: "text-pink-500 bg-pink-500/10"
            },
            {
              icon: <Lightbulb size={32} className="text-emerald-500" />,
              title: "Innovation",
              desc: "We evolve constantly so our students stay ahead of the curve.",
              accent: "text-emerald-500 bg-emerald-500/10"
            }
          ].map((value, i) => (
            <div key={i} className="bg-background-dark p-8 rounded-xl border border-white/5 hover:border-white/10 transition-colors text-center">
              <div className={`w-16 h-16 rounded-full ${value.accent} flex items-center justify-center mx-auto mb-6`}>
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
              <p className="text-[#9dabb9]">{value.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};

export default About;
