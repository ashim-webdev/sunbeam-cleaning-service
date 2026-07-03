import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"
import EmployeeLoginModal from './EmployeeLoginModel';



const navLinks = ['Home', 'About', 'Services', 'Booking form', 'Testimonials' ];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`glass rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'shadow-soft' : 'shadow-card'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className='w-25'>
              <img
                src='/sunbeamLogo.svg'
                loading='lazy'
                alt='Logo'
              />
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="nav-link text-sm font-500 text-slate-600 hover:text-brand-500 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          <div className='hidden md:flex justify-center items-center gap-4'>
            {/* Sign In */}
            <div className="hidden md:flex items-center gap-3 shadow-darkSM rounded-sm">
              <button
                onClick={() => setShowEmployeeModal(true)}
                className="cursor-pointer text-black text-sm font-600 px-5 py-1.5 rounded-sm hover:opacity-90 transition-all duration-300 hover:scale-103 active:scale-95"
              >
                Sign In
              </button>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="btn-shine gradient-bg text-white text-sm font-600 px-5 py-2.5 rounded-xl shadow-blue hover:opacity-90 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-brand-100 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ duration: 0.5 }}
              className="md:hidden mt-2 glass rounded-2xl p-4 shadow-float"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="px-4 py-2.5 rounded-xl text-sm font-500 text-slate-700 hover:bg-brand-100 hover:text-blue-600 transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}
                <div className='w-full flex flex-col justify-center items-center gap-2'>
                  {/* Sign In */}
                  <div className="w-full flex items-center gap-3 shadow-darkSM rounded-xl">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowEmployeeModal(true);
                      }}
                      className="cursor-pointer w-full text-center text-black text-sm font-600 px-5 py-2.5 rounded-xl hover:opacity-90 transition-all duration-300"
                    >
                      Sign In
                    </button>
                  </div>

                  {/* CTA */}
                  <div className="w-full flex items-center gap-3">
                    <a
                      href="#contact"
                      className="w-full btn-shine text-center gradient-bg text-white text-sm font-600 px-5 py-2.5 rounded-xl shadow-blue hover:opacity-90 transition-all duration-300 hover:scale-103 active:scale-95"
                      onClick={() => setMenuOpen(false)}
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EmployeeLoginModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
      />
    </nav>
  );
}
