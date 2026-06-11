import { Check, ArrowRight, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '$49',
    period: '/clean',
    description: 'Perfect for small apartments and regular maintenance.',
    features: [
      'Up to 2 bedrooms',
      'Kitchen & bathrooms',
      'Vacuuming & mopping',
      'Dusting all surfaces',
      'Trash removal',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Standard',
    price: '$89',
    period: '/clean',
    description: 'Our most popular plan for families and larger homes.',
    features: [
      'Up to 4 bedrooms',
      'Deep kitchen clean',
      'Inside oven & fridge',
      'Window sills & blinds',
      'Laundry (fold & sort)',
      'Priority scheduling',
    ],
    cta: 'Book Now',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Premium',
    price: '$149',
    period: '/clean',
    description: 'Comprehensive whole-home deep clean for discerning clients.',
    features: [
      'Unlimited bedrooms',
      'Full deep clean',
      'Carpet shampooing',
      'Garage & basement',
      'Organizing & declutter',
      'Same-day service',
      'Dedicated cleaner',
    ],
    cta: 'Go Premium',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding" style={{ background: 'linear-gradient(135deg, #EAF5FF 0%, #F5FAFF 50%, #EAF5FF 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-2 mb-5">
            <span className="text-sm font-600 text-brand-600">Simple Pricing</span>
          </div>
          <h2 className="text-5xl font-800 tracking-tight text-slate-900 mb-5">
            Transparent Plans,{' '}
            <span className="gradient-text">Zero Surprises</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Choose the plan that fits your space and schedule. All plans include our satisfaction guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`pricing-card relative bg-white rounded-[2rem] p-8 ${
                plan.highlight
                  ? 'shadow-blue border-2 border-brand-400 scale-105 z-10'
                  : 'shadow-soft border border-slate-100'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg text-white text-xs font-700 px-5 py-1.5 rounded-full shadow-blue flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" fill="currentColor" />
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-700 mb-1.5 ${plan.highlight ? 'gradient-text' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-5xl font-800 text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 font-500 mb-2">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{plan.description}</p>
              </div>

              <div className="h-px bg-slate-100 mb-6" />

              <ul className="space-y-3.5 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'gradient-bg' : 'bg-brand-100'}`}>
                      <Check className={`w-3 h-3 ${plan.highlight ? 'text-white' : 'text-brand-500'}`} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-600 font-500">{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-700 text-sm transition-all duration-300 ${
                  plan.highlight
                    ? 'btn-shine gradient-bg text-white shadow-blue hover:opacity-90'
                    : 'bg-brand-50 text-brand-600 hover:bg-brand-100 border border-brand-200'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-10 font-500">
          All prices include supplies & equipment. Recurring discounts available — save up to 20% on weekly plans.
        </p>
      </div>
    </section>
  );
}
