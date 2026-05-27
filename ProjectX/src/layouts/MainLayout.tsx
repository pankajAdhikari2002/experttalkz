import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
      
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
