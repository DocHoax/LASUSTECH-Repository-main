import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { openMailto } from '../../lib/utils';

export const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="flex flex-col lg:pl-72 pt-16 sm:pt-20">
        <Sidebar />
        
        <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 max-w-screen-2xl mx-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 sm:py-16 px-4 sm:px-8 md:px-16 mt-16 sm:mt-24">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 md:gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-headline font-black tracking-tight uppercase mb-6">LASUSTECH Repository</h2>
            <p className="text-blue-200 max-w-md leading-relaxed">
              The official digital archive for Lagos State University of Science and Technology. Empowering students through open access to institutional knowledge and academic resources.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-tertiary uppercase tracking-widest text-xs">Quick Links</h4>
            <FooterLinks />
          </div>
          <div>
            <h4 className="font-bold mb-6 text-tertiary uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4 text-sm text-blue-100">
              <li><button type="button" onClick={() => openMailto('support@lasustech.edu.ng', 'LASUSTECH Repository Help Center')} className="hover:text-white transition-colors">Help Center</button></li>
              <li><button type="button" onClick={() => openMailto('support@lasustech.edu.ng', 'Request for LASUSTECH Repository Terms of Service')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button type="button" onClick={() => openMailto('support@lasustech.edu.ng', 'Request for LASUSTECH Repository Privacy Policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button type="button" onClick={() => openMailto('admin@lasustech.edu.ng', 'LASUSTECH Repository Contact Admin')} className="hover:text-white transition-colors">Contact Admin</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto border-t border-white/10 mt-12 sm:mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300 font-medium">
          <p>© 2024 Lagos State University of Science and Technology. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8 text-center">
            <span>Designed for Academic Excellence</span>
            <span>v2.4.0-stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FooterLinks: React.FC = () => {
  const navigate = useNavigate();
  return (
    <ul className="space-y-4 text-sm text-blue-100">
      <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button></li>
      <li><button onClick={() => navigate('/directory')} className="hover:text-white transition-colors">Faculty Directory</button></li>
      <li><button onClick={() => navigate('/search')} className="hover:text-white transition-colors">Search Archive</button></li>
      <li><button onClick={() => navigate('/upload')} className="hover:text-white transition-colors">Contribute</button></li>
    </ul>
  );
};
