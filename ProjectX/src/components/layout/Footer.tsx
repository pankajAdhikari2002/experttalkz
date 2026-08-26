import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className="border-t border-white/10 mt-auto"
      style={{
        backgroundImage: `url('https://cdn.prod.website-files.com/6768f29a6d5da42209173f20/6768f29b6d5da42209177487_Rectangle%20(83).svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 font-extrabold text-base md:text-lg text-white tracking-tight">
              Expertalkz Global Solutions LLP
            </h3>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              "Shaping the Future of Oil &amp; Gas — Jobs, Training &amp; Industry Solutions."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-bold text-xs text-white uppercase tracking-widest">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Training Courses', to: '/courses' },
                { label: 'Knowledge Hub', to: '/blog' },
                { label: 'Opportunities', to: '/opportunities' },
                { label: 'Contact Us', to: '/contact' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-bold text-xs text-white uppercase tracking-widest">
              Legal
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms & Conditions', to: '/terms' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 pb-6 border-t border-white/10 flex flex-col gap-2 text-center">
          <p className="text-slate-200 text-xs font-normal leading-relaxed px-2">
            Expertalkz Global Solutions LLP is a registered LLP in India. All training programs and
            content are subject to availability. Placement support does not guarantee employment.
          </p>
          <p className="font-bold text-white text-xs">
            © 2020–{new Date().getFullYear()} Expertalkz Global Solutions LLP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
