import { Star, Quote } from 'lucide-react';
import img1 from "../../img/blackWoman1.jpg"
import img2 from "../../img/blackWoman2.webp"
import img3 from "../../img/blackWoman3.jpg"
import img4 from "../../img/blackMen1.jpg"
import img5 from "../../img/blackMan2.jpg"
import img6 from "../../img/blackMan3.jpg"
import img7 from "../../img/blackMan4.jpg"
import img8 from "../../img/blackWoman5.jpg"
import img9 from "../../img/blackWoman4.webp"


const testimonials = [
  {
    name: 'Emmanuel Joseph',
    property: 'Home/House Cleaning',
    avatar: img7,
    rating: 4,
    text: 'SunBeam has completely transformed how I think about home cleaning. Their team is punctual, thorough, and incredibly professional. My house has never felt this fresh!',
  },
  {
    name: 'James Okonkwo',
    property: 'Office Cleaning',
    avatar: img6,
    rating: 5,
    text: 'We use SunBeam for our 5,000 sq ft office and the results are consistently outstanding. Reliable, detail-oriented, and worth every cent. Highly recommend!',
  },
  {
    name: 'Valerie Awiti',
    property: 'Home/House Cleaning',
    avatar: img3,
    rating: 5,
    text: "As someone who obsesses over details, I'm blown away by the level of care SunBeam brings. They treat your home like their own. Five stars every time!",
  },
  {
    name: 'Patricia Ugwu',
    property: 'Estate Management Cleaning',
    avatar: img2,
    rating: 5,
    text: 'Managing 20+ rental properties means cleanliness is critical for tenant satisfaction. SunBeam is my go-to team for turnovers. Fast, flawless, and always on time.',
  },
  {
    name: 'Olivia Thompson',
    property: 'Home/House Cleaning',
    avatar: img9,
    rating: 5,
    text: 'With three kids and two dogs, our house was chaos. SunBeam tackled every corner and the eco-friendly products give me real peace of mind. Total game changer.',
  },
  {
    name: 'Sarah Ugo',
    property: 'Renovation Cleaning',
    avatar: img8,
    rating: 5,
    text: "The seamless booking, prompt service, and impeccable results make SunBeam the only cleaning company I'd ever recommend. My go-to for years.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-brand-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-2 mb-5">
            <span className="text-sm font-600 text-brand-600">Customer Stories</span>
          </div>
          <h2 className="text-5xl font-800 tracking-tight text-slate-900 mb-5">
            Loved by{' '}
            <span className="gradient-text italic">Thousands of Clients</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Don't take our word for it, hear directly from the people we serve every day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group bg-white rounded-[2rem] p-7 shadow-soft hover:shadow-float transition-all duration-500 hover:-translate-y-1.5 border border-slate-100/80"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-700 text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400 font-500">{t.property}</div>
                  </div>
                </div>
                <div className="w-9 h-9 glass-blue rounded-xl flex items-center justify-center">
                  <Quote className="w-4 h-4 text-brand-400" />
                </div>
              </div>

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />
                ))}
              </div>

              <p className="text-slate-500 text-sm leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
