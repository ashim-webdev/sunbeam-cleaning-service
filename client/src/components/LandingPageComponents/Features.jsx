import { Users, Award, BadgeDollarSign } from 'lucide-react';
import { useState } from "react";




const features = [
  {
    icon: Users,
    iconBg: 'bg-brand-100',
    iconColor: 'text-brand-500',
    title: 'Expert Team',
    description:
      'All our cleaners are background-checked, trained professionals with years of experience in residential and commercial cleaning.',
    stat: '10+ Experts',
  },
  {
    icon: Award,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    title: 'Quality Service',
    description:
      'We use premium, eco-certified products and follow a rigorous 65-point checklist on every clean to guarantee spotless results.',
    stat: '65-Point Checklist',
  },
  {
    icon: BadgeDollarSign,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    title: 'Reliable Service',
    description:
      'We show up on time, communicate clearly, and deliver consistent results you can depend on. Your satisfaction is always our priority.',
    stat: 'Trusted Results',
  },
];

export default function Features() {
  const [hovered, setHovered] = useState(null);


  return (
    <section className="section-padding" id="services">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-2 mb-5">
            <span className="text-sm font-600 text-brand-600">Why We're Different</span>
          </div>
          <h2 className="text-5xl font-800 tracking-tight text-slate-900 mb-5">
            Built on Three{' '}
            <span className="gradient-text italic">Core Pillars</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Everything we do is driven by a commitment to excellence, trust, and your satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-[32px] bg-white/80 backdrop-blur-xl border shadow-soft hover:shadow-float transition-all duration-500 hover:-translate-y-1.5 border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8"
            >
              <div className={`w-16 h-16 ${f.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={`w-8 h-8 ${f.iconColor}`} />
              </div>
              <h3 className="text-xl font-700 text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm mb-6">{f.description}</p>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-8 gradient-bg rounded-full" />
                <span className="text-sm font-700 gradient-text">{f.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
