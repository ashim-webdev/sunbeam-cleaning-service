import { useState } from 'react';
import { Sparkles, Eye, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



export const GALLERY_ITEMS = [
  {
    id: 'g1',
    category: 'residential',
    title: 'High-Ceiling Sunlit Loft',
    subtitle: 'Hardwood polishing & high-tier dusting',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600',
    size: 'large'
  },
  {
    id: 'g2',
    category: 'detail',
    title: 'Quartz Kitchen Detailing',
    subtitle: 'Sealing and anti-streak surface shine',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
    size: 'small'
  },
  {
    id: 'g3',
    category: 'commercial',
    title: 'Co-Working Lounge Lounge',
    subtitle: 'Fabric sanitizing and floor polishing',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
    size: 'small'
  },
  {
    id: 'g4',
    category: 'detail',
    title: 'Pristine Bathroom Accents',
    subtitle: 'De-scaling brass faucets & limestone',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    size: 'tall'
  },
  {
    id: 'g5',
    category: 'residential',
    title: 'Nordic Inspired Bedroom',
    subtitle: 'Under-bed HEPA treatment & linens rotation',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=600',
    size: 'small'
  },
  {
    id: 'g6',
    category: 'commercial',
    title: 'Tech Executive Suite',
    subtitle: 'Sensitive equipment hygiene & disinfection',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
    size: 'large'
  }
];





export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => filter === 'all' || item.category === filter
  );

  const filterTabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential Lofts' },
    { id: 'commercial', label: 'Corporate Suites' },
    { id: 'detail', label: 'Detail Restorations' },
  ];

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12" id="gallery-header-block">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 py-1.5 px-4 rounded-full mb-4">
            <Camera className="w-3.5 h-3.5 text-brand-600" />
            <span className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-brand-700 leading-none">
              The Polish Portfolio
            </span>
          </div>

          <h2 className="font-sans font-extrabold text-slate-900 text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight mb-4">
            Witness our signature shine.
          </h2>
          
          <p className="font-sans text-slate-500 text-sm font-semibold max-w-lg mx-auto">
            Untouched genuine client photography taken right after final overseer inspections. No simulated editing additions.
          </p>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12" id="gallery-filter-tabs">
          {filterTabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                id={`gallery-tab-button-${tab.id}`}
                onClick={() => setFilter(tab.id)}
                className={`relative px-6 py-2.5 rounded-full font-sans font-bold text-xs transition-colors cursor-pointer ${
                  active ? 'text-brand-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeGalleryIndicator"
                    className="absolute inset-0 bg-brand-50 rounded-full -z-10 border border-brand-100/55"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid layout containing cards with micro-zoom hover */}
        <div
          id="gallery-masonry"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                key={item.id}
                id={`gallery-item-${item.id}`}
                className={`relative group bg-slate-50 rounded-[28px] overflow-hidden aspect-square sm:aspect-[4/3] border border-slate-100 shadow-sm`}
              >
                {/* Photo */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" id={`overlay-${item.id}`}>
                  
                  {/* Category tag */}
                  <span className="font-mono text-[8px] font-extrabold uppercase tracking-widest text-[#9EC7FF] block mb-1">
                    {item.category.toUpperCase()} PROJECT
                  </span>

                  {/* Title */}
                  <h4 className="font-sans font-black text-white text-base tracking-tight leading-snug">
                    {item.title}
                  </h4>

                  {/* Subtitle */}
                  <p className="font-sans text-slate-350 text-xs text-slate-300 font-medium leading-none mt-1">
                    {item.subtitle}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-white uppercase tracking-wider" id={`cta-overlay-${item.id}`}>
                    <Eye className="w-3.5 h-3.5 text-[#6fa9ff]" />
                    <span>Witness absolute relief</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 font-sans font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm" id={`tab-overlay-${item.id}`}>
                  {item.category}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
