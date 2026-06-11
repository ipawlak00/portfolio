import React from "react";
import { whyMeCards } from "../data";

export default function WhyMe() {
  return (
    <div className="why-me-section w-full max-w-[1400px] mt-24">
      <h2 className="timeline-title mb-16 text-center text-[40px] md:text-[56px] font-black uppercase text-white tracking-tight drop-shadow-sm font-sans">
        Dlaczego ja?
      </h2>

      <div className="why-cards-container flex flex-row flex-wrap gap-10 w-full justify-center px-4 box-border">
        {whyMeCards.map((card) => (
          <div 
            key={card.number} 
            className="why-card relative bg-white/25 hover:bg-white/45 p-10 rounded-[30px] border border-white/40 flex flex-col justify-between max-w-[420px] min-w-[300px] flex-1 box-border shadow-md transition-all duration-400 hover:-translate-y-2 hover:shadow-xl hover:border-white/70"
            style={{ backdropFilter: "blur(30px)" }}
          >
            <div>
              <div className="why-number text-[60px] font-sans font-black text-[#1e293b]/10 leading-none mb-[-30px] select-none">
                {card.number}
              </div>
              <h3 className="font-sans font-black text-[#1e293b] text-[24px] mb-[15px] z-10 relative tracking-tight leading-snug">
                {card.title}
              </h3>
              <p className="font-sans font-semibold text-[#0f172a] text-[16px] leading-[1.6]">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
