import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import WhatsAppButton from '../components/common/WhatsAppButton';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-background-dark px-10 py-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-white">
               <span className="material-symbols-outlined !text-[24px] text-primary">school</span> {/*yet not updated*/}
                <span className="font-bold text-lg">ExpertTalkz</span>
              </div>
              <p className="text-sm text-[#9dabb9]">Empowering learners worldwide with the best content.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white mb-1">Company</h4>
              <Link to="/about" className="text-sm text-[#9dabb9] hover:underline">About Us</Link>
              <Link to="/contact" className="text-sm text-[#9dabb9] hover:underline">Contact</Link>
            </div>
          </div>
          <div className="mt-12 text-center text-xs text-slate-500 dark:text-[#9dabb9]">
             © 2026 ExpertTalkz Inc. All rights reserved.
          </div>
        </div>
      </footer>
      
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
