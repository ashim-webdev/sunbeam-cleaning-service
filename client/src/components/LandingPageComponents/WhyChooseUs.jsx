import { CheckCircle2, ArrowRight, Clock, HeartHandshake, Leaf, Shield } from 'lucide-react';

const bullets = [
  { icon: Shield, text: 'All cleaners are background-checked & insured' },
  { icon: Clock, text: 'Flexible scheduling — mornings, evenings, weekends' },
  { icon: Leaf, text: 'Only EPA-certified eco-friendly products used' },
  { icon: HeartHandshake, text: '100% satisfaction guarantee on every clean' },
  { icon: CheckCircle2, text: 'Real-time booking & dedicated account manager' },
  { icon: CheckCircle2, text: 'Pet-safe, child-safe cleaning solutions' },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-brand-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-600 text-brand-600">The PureShine Difference</span>
            </div>
            <h2 className="text-5xl font-800 tracking-tight text-slate-900 mb-6 leading-tight">
              Why Thousands{' '}
              <span className="gradient-text">Choose Us</span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-10 max-w-lg">
              We're not just a cleaning company — we're your trusted partner in maintaining a healthy, beautiful living environment. Here's what sets PureShine apart from the rest.
            </p>

            <div className="grid gap-4 mb-10">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-soft">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <b.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-600 text-slate-700">{b.text}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="btn-shine inline-flex items-center gap-2.5 gradient-bg text-white font-700 px-7 py-4 rounded-2xl shadow-blue hover:opacity-90 transition-all"
            >
              Start Cleaning Today
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Asymmetric image grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Tall left image */}
              <div className="row-span-2 rounded-[2rem] overflow-hidden shadow-float h-[480px]">
                <img
                  src="https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Cleaning professional"
                  loading='lazy'
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Top right */}
              <div className="rounded-[1.5rem] overflow-hidden shadow-card h-[228px]">
                <img
                  src="https://images.pexels.com/photos/4107112/pexels-photo-4107112.jpeg?auto=compress&cs=tinysrgb&w=500"
                  alt="Clean kitchen"
                  loading='lazy'
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom right */}
              <div className="rounded-[1.5rem] overflow-hidden shadow-card h-[228px]">
                <img
                  src="https://images.pexels.com/photos/6195083/pexels-photo-6195083.jpeg?auto=compress&cs=tinysrgb&w=500"
                  alt="Cleaning bathroom"
                  loading='lazy'
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating trust badge */}
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl px-6 py-4 shadow-float float-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-800 text-slate-900">Fully Insured</div>
                  <div className="text-xs text-slate-500 font-500">& Bonded Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
