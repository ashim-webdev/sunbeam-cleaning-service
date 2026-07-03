import { useState, useRef, useEffect } from "react";
import { Sparkles, HelpCircle } from "lucide-react";

import CleanGasCooker from "../../img/CleanGasCooker.png";
import dirtyGasCooker from "../../img/dirtyGasCooker.png";
import cleanKitchen from "../../img/cleanKitchen.png"
import dirtyKitchen from "../../img/dirtyKitchen.png"
import dirtyToilet from "../../img/dirtyToilet.png"
import cleanToilet from "../../img/cleanToilet.png"
import chairDirty from "../../img/chairDirty.jpg"
import chairClean from "../../img/chairClean.jpg"
import doorClean from "../../img/doorClean.jpg"
import doorDirty from "../../img/doorDirty.jpg"
import dirtySink from "../../img/dirtySink.png"
import cleanSink from "../../img/cleanSink.png"



const comparisons = [
  {
    before: dirtyGasCooker,
    after: CleanGasCooker,
    beforeLabel: "Before",
    afterLabel: "After",
    bottomLabel: "Greasy Gas Cooker / Restored Gas Cooker",
  },
  {
    before: dirtyKitchen,
    after: cleanKitchen,
    beforeLabel: "Before",
    afterLabel: "After",
    bottomLabel: "Dirty Kitchen / Spotless Kitchen",
  },
  {
    before: dirtyToilet,
    after: cleanToilet,
    beforeLabel: "Before",
    afterLabel: "After",
    bottomLabel: "Stained Toilet / Sanitized Toilet",
  },
  {
    before: chairDirty,
    after: chairClean,
    beforeLabel: "Before",
    afterLabel: "After",
    bottomLabel: "Dirty Upholstery / Refreshed Upholstery",
  },
  {
    before: doorDirty,
    after: doorClean,
    beforeLabel: "Before",
    afterLabel: "After",
    bottomLabel: "Dirty Door / Polished Door",
  },
  {
    before: dirtySink,
    after: cleanSink,
    beforeLabel: "Before",
    afterLabel: "After",
    bottomLabel: "Messy toilet sink / Restored & Sanitized toilet sink",
  },
];

function ComparisonSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  bottomLabel
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;

    const position = Math.max(
      0,
      Math.min(100, (x / rect.width) * 100)
    );

    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    if (e.touches?.[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchend", stopDragging);
    }

    return () => {
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 cursor-ew-resize select-none border-2 border-white"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={after}
            loading='lazy'
            alt="After cleaning"
            className="w-full h-full object-cover"
          />

          <div className="absolute top-4 right-4 bg-brand-900/80 backdrop-blur-md text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-darkSM tracking-wider">
            {afterLabel}
          </div>
        </div>

        {/* BEFORE IMAGE */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-x-0 top-0 bottom-0 min-w-full h-full aspect-video">
            <img
              src={before}
              loading='lazy'
              alt="Before cleaning"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-yellow-900/5 mix-blend-multiply opacity-40" />

            <div className="absolute top-4 left-4 bg-amber-900/80 backdrop-blur-md text-white font-bold text-xs px-3.5 py-1.5 rounded-full tracking-wider shadow-darkSM">
              {beforeLabel}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div
          className="absolute top-0 bottom-0 w-[4px] bg-white z-20 flex items-center justify-center shadow-lg shadow-black/20 -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-500 shadow-xl flex flex-col items-center justify-center gap-0.5 active:scale-110 transition-transform">
            <div className="flex gap-[2px]">
              <span className="block w-[2px] h-3 bg-brand-500 rounded" />
              <span className="block w-[2px] h-3 bg-brand-500 rounded" />
              <span className="block w-[2px] h-3 bg-brand-500 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 text-[11px] font-semibold text-slate-400">
        <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
        {bottomLabel}
      </div>
    </div>
  );
}

export default function BeforeAfterSlider() {
  return (
    <section
      className="flex flex-col items-center w-full mx-auto sm:px-20 px-4 pt-36 pb-20"
      id="before-after-component"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-2 mb-5">
          <span className="text-sm font-600 text-brand-600 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span className="font-mono text-[10px] font-bold text-brand-700 uppercase tracking-widest">
              Real Cleaning Results
            </span>
          </span>
        </div>

        <h2 className="text-5xl font-800 tracking-tight text-slate-900 mb-5">
          See The Difference,
          <span className="gradient-text italic"> Before & After</span>
        </h2>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Every transformation tells a story. Compare real cleaning
          projects and see how our professional team restores spaces
          from dirty and neglected to spotless and refreshed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full p-2">
        {comparisons.map((comparison, index) => (
          <ComparisonSlider
            key={index}
            before={comparison.before}
            after={comparison.after}
            beforeLabel={comparison.beforeLabel}
            afterLabel={comparison.afterLabel}
            bottomLabel={comparison.bottomLabel}
          />
        ))}
      </div>
    </section>
  );
}