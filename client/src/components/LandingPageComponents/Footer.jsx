import { Sparkles, ArrowRight, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";



export function CtaBanner() {
  return (
    <section id="contact" className="font-serif pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative gradient-bg rounded-[2.5rem] overflow-hidden p-14 text-center shadow-blue">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/8 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
          <div className="absolute top-1/2 right-24 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-7">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-600 text-white">Reach out to us today!</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-800 text-white mb-5 leading-tight tracking-tight">
              Ready for a Spotless Home?
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Whether it's a one-time deep clean or regular maintenance, our professional team delivers exceptional results tailored to your needs. Give us a call or fill the booking form above today and enjoy a cleaner, healthier space.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+2347037189416"
                className="flex items-center gap-3 bg-white text-brand-600 font-700 px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-float whitespace-nowrap"
              >
                <div className='animate-UpDown'>
                  <Phone className="w-5 h-5" />
                </div>
                +234 703 718 9416
              </a>
              <a
                href="#booking form"
                className="btn-shine flex items-center gap-2.5 bg-white/15 backdrop-blur border-2 border-white/40 text-white font-700 px-8 py-4 rounded-2xl hover:bg-white/25 transition-all duration-300 whitespace-nowrap"
              >
                Booking form
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}






export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="blog" className="relative bg-slate-950 text-slate-100 overflow-hidden">
      
      <div className="h-[1px] bg-white/10 max-w-7xl mx-auto mb-3" />

      {/* 2. CORE FOOTER INFO BLOCK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="footer-links-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8" id="footer-links-grid">
          
          {/* COL 1: LOGO & ABOUT */}
          <div className="flex flex-col gap-6" id="footer-brand-column">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className='w-45 bg-white mb-2 pt-2.5 pb-4 px-6 rounded-full shadow-lightSM'>
                <img 
                  src='/sunbeamLogo.svg'
                  loading='lazy'
                  alt='Logo'
                />
              </span>
            </div>
            
            <p className=" text-slate-400 text-xs font-semibold leading-relaxed max-w-xs">
              Elite residential and corporate standard detailing. Setting the global benchmark for sanitary clarity and architectural care.
            </p>

            {/* Social rows */}
            <div className="flex items-center gap-3 text-slate-400" id="footer-social-row">
              <a href="https://www.facebook.com/share/1BYD4chhVR/" aria-label="SunBeam Facebook Link" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                <Facebook className="w-4 h-4" />
              </a>

              <a href="#" aria-label="SunBeam WhatsApp Link" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COL 2: CORE SERVICES */}
          <div className="flex flex-col gap-4 lg:pl-12" id="footer-services-column">
            <h4 className=" font-extrabold text-sm text-white tracking-wide uppercase">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400 font-semibold" id="footer-services-links">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#booking form" className="hover:text-white transition-colors">Booking form</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            </div>
          </div>

          {/* COL 3: COVERAGE AREA */}
          <div className="flex flex-col gap-4" id="footer-coverage-column">
            <h4 className=" font-extrabold text-sm text-white tracking-wide uppercase">
              Coverage Locations
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400 font-semibold" id="footer-coverage-links">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              Asokoro, ABJ</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" /> Maitama, ABJ</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" /> Wuse, ABJ</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" /> Gwarinpa, ABJ</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" /> Jabi, ABJ</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              Lugbe, ABJ
              <span className='ml-2'>etc...</span>
              </span>
            </div>
          </div>

          {/* COL 4: DISPATCH CONTACT */}
          <div className="flex flex-col gap-4" id="footer-contact-column">
            <h4 className=" font-extrabold text-sm text-white tracking-wide uppercase">
              Client Concierge
            </h4>
            <div className="flex flex-col gap-4 text-xs text-slate-400 font-semibold" id="footer-contact-details">
              <a href="tel:+2347037189416" className="flex items-center gap-2 hover:text-white transition-colors">
                <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-brand-500 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>+234 703 718 9416</span>
              </a>

              <a href="mailto:sunbeamcleaningservices022@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-brand-500 shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>sunbeamcleaningservices022@gmail.com</span>
              </a>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-brand-500 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>Sahara, Majia plaza gwarimpa, Abuja.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. CAPABILITIES BAR */}
      <div className="bg-slate-1000 py-6 border-t border-white/5 -mt-8" id="footer-bottom-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-mono uppercase font-bold" id="footer-bottom-flex">
          <span>&copy; {currentYear} SunBeam Agency. All Rights Reserved.</span>

          <div className="flex items-center gap-4 relative">

            <Popover className="relative">
              <PopoverButton className="hover:text-slate-300 transition-colors cursor-pointer outline-none">
                Privacy Guard
              </PopoverButton>

              <PopoverPanel
                className="absolute bottom-8 -left-2"
              >
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className='w-80 z-50 rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl'
                  >
                    <h4 className="text-white font-bold mb-2 text-sm">
                      Privacy Guard
                    </h4>

                    <p className="text-slate-300 text-xs leading-relaxed normal-case">
                      Your privacy matters to us. Information submitted through our booking
                      forms, contact forms, or communication channels is used solely for
                      scheduling cleaning services, responding to inquiries, and improving
                      customer experience.

                      <br /><br />

                      SunBeam Cleaning Services does not sell, rent, or share personal
                      information with third parties for marketing purposes. All customer
                      information is handled securely and accessed only when necessary to
                      provide our services.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </PopoverPanel>
            </Popover>

            <span>&bull;</span>

            <Popover className="relative">
              <PopoverButton className="hover:text-slate-300 transition-colors cursor-pointer outline-none">
                Satisfaction Promise
              </PopoverButton>

              <PopoverPanel className="absolute bottom-8 -right-24">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className='w-80 z-50 rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl'
                  >
                    <h4 className="text-white font-bold mb-2 text-sm">
                      SATISFACTION PROMISE
                    </h4>

                    <p className="text-slate-300 text-xs leading-relaxed normal-case">
                      Customer satisfaction is our priority. If you are not completely satisfied with a cleaning service, please contact us within 24 hours of your appointment. We will review the issue and work with you to find a suitable resolution.

                      <br /><br />

                      Our goal is to provide reliable, professional, and trustworthy cleaning services every time.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </PopoverPanel>
            </Popover>

            <span>&bull;</span>

            <Popover className="relative">
              <PopoverButton className="hover:text-slate-300 transition-colors cursor-pointer outline-none">
                Service Terms
              </PopoverButton>

              <PopoverPanel className="absolute bottom-8 -right-2">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className='w-80 z-50 rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl'
                  >
                    <h4 className="text-white font-bold mb-2 text-sm">
                      Service Terms
                    </h4>

                    <p className="text-slate-300 text-xs leading-relaxed normal-case">
                      By booking a cleaning service through our website, you agree to provide
                      accurate contact and appointment information.

                      <br /><br />

                      Service availability, scheduling, and pricing may vary depending on
                      property size, location, and cleaning requirements. Our team strives
                      to deliver exceptional cleaning results while maintaining the highest
                      standards of professionalism and customer care.

                      <br /><br />

                      Continued use of our services constitutes acceptance of these terms.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </PopoverPanel>
            </Popover>

          </div>

        </div>
      </div>

    </footer>
  );
}

