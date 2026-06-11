import { Play, Star, ArrowRight, CheckCircle2, Droplets, Wind, ShieldCheck } from 'lucide-react';
import img1 from "../../img/blackWoman1.jpg"
import img2 from "../../img/blackWoman2.webp"
import img3 from "../../img/blackMan2.jpg"
import img4 from "../../img/blackMen1.jpg"


const avatars = [
  img1,
  img2,
  img4,
  img3,
];

export default function Hero() {
  return (
    <section id="home" className="relative pt-36 pb-20 overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-brand-100/60 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-brand-200/30 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT COLUMN */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
              <span className="text-sm font-600 text-brand-600">#1 Trusted Cleaning Service</span>
            </div>

            {/* Headline */}
            <h1 className="text-[62px] leading-[1.08] font-800 tracking-tight text-slate-900 mb-6">
              We Make Your{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Home Shine</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C60 4 160 1 298 6"
                    stroke="#6FA9FF"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              <br />
              Like Never Before
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md">
              Professional, eco-friendly cleaning services tailored to your schedule.
              Trusted by over 4,000 happy homes and businesses across the country.
            </p>

            {/* Trust bullets */}
            <div className="flex flex-col gap-3 mb-10">
              {['100% Satisfaction Guarantee', 'Eco-Friendly Products', 'Same-Day Availability'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <span className="text-sm font-500 text-slate-600">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-5 mb-12">
              <a
                href="#contact"
                className="btn-shine gradient-bg text-white font-700 px-8 py-4 rounded-2xl shadow-blue hover:opacity-90 transition-all duration-300 flex items-center gap-2.5 text-base"
              >
                Book
                <span className='hidden sm:inline -ml-1'>A</span>
                <span className='hidden sm:inline -ml-1'> Cleaning</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <button className="group flex items-center gap-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full glass-blue border-2 border-brand-300 flex items-center justify-center transition-all group-hover:border-brand-400 group-hover:shadow-blue">
                    <Play className="w-5 h-5 text-brand-500 translate-x-0.5" fill="currentColor" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-brand-300 animate-ping opacity-30" />
                </div>
                <div>
                  <div className="text-sm font-700 text-slate-800">Watch Video</div>
                  <div className="text-xs text-slate-400">2 min overview</div>
                </div>
              </button>
            </div>

            {/* Avatars + rating */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-500 font-500">
                  <span className="text-slate-800 font-700">4.9/5</span> from 1200+ reviews
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – 3D Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Main illustration frame */}
            <div className="relative w-full max-w-[520px]">
              {/* Hero image */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-float float-1">
                <img
                  src="https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Professional cleaning service"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-600/20 to-transparent" />
              </div>

              {/* Floating stat card – top left */}
              <div className="absolute sm:-left-10 -left-5 top-10 glass rounded-2xl px-5 py-4 shadow-float float-2 min-w-[160px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-800 text-slate-900">4K+</div>
                    <div className="text-xs text-slate-500 font-500">Happy Clients</div>
                  </div>
                </div>
              </div>

              {/* Floating stat card – bottom right */}
              <div className="absolute sm:-right-8 -right-4 bottom-14 glass rounded-2xl px-5 py-4 shadow-float float-3 min-w-[170px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xl font-800 text-slate-900">100%</div>
                    <div className="text-xs text-slate-500 font-500">Eco-Friendly</div>
                  </div>
                </div>
              </div>

              {/* Floating rating pill – bottom left */}
              <div className="absolute sm:-left-6 -left-4 bottom-28 glass rounded-2xl px-4 py-3 shadow-float float-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                  </div>
                  <div>
                    <div className="text-base font-800 text-slate-900">4.9</div>
                    <div className="text-xs text-slate-500 font-500">Rating</div>
                  </div>
                </div>
              </div>

              {/* Top-right speed card */}
              <div className="absolute sm:-right-6 -right-4 top-12 glass rounded-2xl px-4 py-3 shadow-float float-2 min-w-[150px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center">
                    <Wind className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-800 text-slate-900">Same Day</div>
                    <div className="text-xs text-slate-500 font-500">Service</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
