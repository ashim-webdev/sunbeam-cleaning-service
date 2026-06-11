import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import working1 from "../../img/working1.jpg"
import working2 from "../../img/working2.jpg"
import working3 from "../../img/working3.jpg"
import working4 from "../../img/working4.jpg"
import working5 from "../../img/working5.jpg"
import working6 from "../../img/working6.jpg"
import working7 from "../../img/working7.jpg"






const stats = [
  { value: '6+', label: 'Years Experience' },
  { value: '4K+', label: 'Happy Clients' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '12+', label: 'Cities Covered' },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image collage */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[480px] h-[500px]">
              {/* Large rectangle */}
              <div className="absolute left-0 top-0 w-[58%] h-[68%] rounded-[2rem] overflow-hidden shadow-float border border-white">
                <img
                  src={working1}
                  alt="Cleaning team"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top-right rectangle */}
              <div className="absolute right-3 top-0 w-[38%] h-[44%] rounded-[1.5rem] overflow-hidden shadow-card border border-white">
                <img
                  src={working2}
                  alt="Cleaning supplies"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom-right circle */}
              <div className="absolute right-4 bottom-4 w-[44%] h-[44%] rounded-full overflow-hidden shadow-float border-4 border-white">
                <img
                  src={working3}
                  alt="Happy customer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom-left small circle */}
              <div className="absolute left-0 -bottom-5 w-[55%] h-[35%] rounded-full overflow-hidden border-4 border-white shadow-card">
                <img
                  src={working4}
                  alt="Mopping floor"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Experience badge */}
              <div
                id="collage-experience-badge"
                className="absolute top-[45%] left-[65%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-brand-900 via-slate-900 to-brand-950 text-white rounded-full p-6 w-33 h-33 flex flex-col items-center justify-center text-center shadow-2xl border-2 border-brand-300 animate-bounce-slow float-1"
              >
                {/* Glowing halo */}
                <div className="absolute -inset-1 rounded-full border animate-ping opacity-45 pointer-events-none" />
                
                <span className="font-mono text-xs font-black text-brand-300 leading-none">EST. 2019</span>
                <span className="font-sans font-black text-3xl text-white tracking-tight block my-0.5 leading-none">6+</span>
                <span className="font-sans text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-none">Years of Excellence</span>
              </div>

              {/* Floating Statistic Card 1 - Satisfaction */}
              <div
                id="floating-card-metric"
                className="glassHoverCard absolute -top-25 left-15 p-4 rounded-3xl border border-slate-100 shadow-2xl float-1 z-10 hover:-translate-y-1 transition-transform duration-300 max-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-sans font-extrabold text-[10px] text-emerald-600 uppercase tracking-widest leading-none">
                    Certified Vibe
                  </span>
                </div>
                <span className="font-sans font-black text-xl font-800 gradient-text block leading-tight">
                  99.8% Rate
                </span>
                <span className="font-sans text-[10px] font-medium text-slate-500 block leading-tight mt-0.5">
                  Monthly recurring client retention satisfaction.
                </span>
              </div>

              {/* Floating Statistic Card 2 - Homes Detailed */}
              <div
                id="floating-card-volume"
                className="glassHoverCard float-1 z-10 absolute -bottom-25 right-10 p-4 rounded-3xl border border-slate-100 shadow-2xl hover:translate-y-1 transition-transform duration-300 max-w-[190px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 fill-brand-300 text-blue-600" />
                  </div>
                  <span className="font-sans font-extrabold text-[9px] text-brand-600 uppercase tracking-widest leading-none ">
                    Sanctified Volume
                  </span>
                </div>
                <span className="font-sans font-black  text-xl font-800 gradient-text block leading-tight">
                  4k+ Spaces
                </span>
                <span className="font-sans text-[10px] font-medium text-slate-500 block leading-tight mt-0.5">
                  Meticulously polished in past years.
                </span>
              </div>

              {/* Top left */}
              <div className="absolute -top-8 -left-8 w-35 h-35 rounded-full overflow-hidden border-4 border-white shadow-card">
                <img
                  src={working5}
                  alt="Mopping floor"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom right */}
              <div className="absolute -bottom-4 -right-8 w-30 h-30 rounded-full overflow-hidden border-4 border-white shadow-card">
                <img
                  src={working6}
                  alt="Mopping floor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='mt-10'>
            <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-600 text-brand-600">Our Story</span>
            </div>
              <h2 className="text-5xl font-800 tracking-tight text-slate-900 mb-6 leading-tight">
                Let The Sunshine Into Your{' '}
                <span className="gradient-text italic">Cleanest Spaces</span>
              </h2>

              <p className="text-slate-500 leading-relaxed mb-5">
                Sunbeam was built on the belief that every space deserves exceptional care. We provide professional cleaning services designed to restore freshness, comfort, and peace of mind to homes, offices, and commercial properties.
              </p>

              <p className="text-slate-500 leading-relaxed mb-10">
                With a dedicated team, modern cleaning techniques, and a commitment to excellence, we focus on the details that make a real difference. Our mission is simple: to deliver results you can see, feel, and trust every time.
              </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-5 mb-10">
              {stats.map((s) => (
                <div key={s.label} className="bg-brand-50 rounded-2xl px-5 py-5">
                  <div className="text-3xl font-800 gradient-text mb-1">{s.value}</div>
                  <div className="text-sm text-slate-500 font-500">{s.label}</div>
                </div>
              ))}
            </div>

            <a
              href="#services"
              className="btn-shine inline-flex items-center gap-2.5 gradient-bg text-white font-700 px-7 py-4 rounded-2xl shadow-blue hover:opacity-90 transition-all"
            >
              Explore Our Services
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
