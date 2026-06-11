import React from "react";
import { processSteps } from "../data";

export default function ProcessFlow() {
  return (
    <div className="why-me-section w-full max-w-[1400px] mt-12 flex flex-col items-center">
      <h2 className="timeline-title mb-16 text-center text-[40px] md:text-[56px] font-black uppercase text-white tracking-tight drop-shadow-sm font-sans">
        Jak działam? (Mój proces)
      </h2>

      <div className="process-flow-container w-full max-w-[1250px] mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-4 relative px-4 box-border">
        {/* Continuous track connection line */}
        <div className="process-flow-line absolute top-[43px] left-[8%] right-[8%] h-1 bg-gradient-to-r from-white/10 via-white/80 to-white/10 rounded-[2px] hidden lg:block" />

        {processSteps.map((item) => (
          <div 
            key={item.step} 
            className="process-step relative z-10 flex flex-col items-center text-center w-full sm:max-w-xs lg:w-[22%] group"
          >
            <div className="process-icon-circle w-[90px] h-[90px] rounded-full bg-[#1e293b] border-4 border-white text-white flex items-center justify-center font-sans font-black text-[30px] shadow-lg mb-[25px] transition-all duration-400 group-hover:scale-110 group-hover:bg-[#0f172a] select-none cursor-default">
              {item.step}
            </div>

            <div 
              className="process-step-content bg-white/25 hover:bg-white/45 p-[25px] px-[20px] rounded-[25px] border border-white/50 w-full box-border shadow-sm transition-all duration-300 group-hover:-translate-y-1"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="font-sans font-black text-[#1e293b] text-[18px] uppercase m-0 mb-[10px] tracking-tight">
                {item.title}
              </h3>
              <p className="font-sans font-medium text-[#0f172a] text-[15px] leading-[1.6] m-0">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
