import React, { useState } from "react";
import { projectsData } from "../data";

interface TimelineSectionProps {
  isVisible: boolean;
  onOpenCrmMockup: () => void;
  onOpenOnboardingMockup: () => void;
  onOpenScheduleMockup: () => void;
  onOpenHrMockup: () => void;
  onOpenContractMockup: () => void;
}

export default function TimelineSection({ isVisible, onOpenCrmMockup, onOpenOnboardingMockup, onOpenScheduleMockup, onOpenHrMockup, onOpenContractMockup }: TimelineSectionProps) {
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(-1);

  const handleSelectNode = (index: number) => {
    if (currentNodeIndex === index) {
      setCurrentNodeIndex(-1);
    } else {
      setCurrentNodeIndex(index);
    }
  };

  const prevNode = () => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex(currentNodeIndex - 1);
    }
  };

  const nextNode = () => {
    if (currentNodeIndex < projectsData.length - 1) {
      setCurrentNodeIndex(currentNodeIndex + 1);
    }
  };

  return (
    <div 
      className={`timeline-section ${isVisible ? "visible" : ""} px-4 relative`} 
      id="timeline-target"
    >
      <h2 className="timeline-title mb-16 text-center text-[40px] md:text-[56px] font-black uppercase text-white tracking-tight drop-shadow-sm font-sans">
        Moje Projekty
      </h2>

      {/* TRACK 1 (Nodes 0, 1, 2) */}
      <div className="horizontal-track-container relative w-full h-[120px] mb-12 border-box">
        <div className="track-line absolute top-1/2 left-0 right-0 h-2 rounded-[4px] bg-white/40 -translate-y-1/2"></div>
        
        <div className="nodes-container absolute top-1/2 -translate-y-1/2 w-full flex justify-around px-5 box-border">
          {projectsData.slice(0, 3).map((proj) => {
            const isActive = proj.id === currentNodeIndex;
            return (
              <button
                key={proj.id}
                onClick={() => handleSelectNode(proj.id)}
                className={`node flex flex-col items-center group transition-transform duration-300 w-[30%] md:w-[25%] focus:outline-none cursor-pointer ${
                  isActive ? "active scale-110" : ""
                }`}
              >
                <div
                  className={`node-dot w-[26px] h-[26px] rounded-full transition-all duration-[350ms] ${
                    isActive
                      ? "bg-[#1e293b]"
                      : "bg-white"
                  }`}
                  style={{ boxShadow: "0 0 20px #fff" }}
                />
                <div className="node-label font-sans font-black text-[#1e293b] text-[11px] md:text-[13px] uppercase bg-white/60 hover:bg-white/80 transition-colors py-2 px-3 rounded-[10px] text-center backdrop-blur-[5px] mt-3 leading-snug break-words max-w-full">
                  {proj.shortLabel.split("<br>").map((l, i) => (
                    <React.Fragment key={i}>
                      {l}
                      {i < proj.shortLabel.split("<br>").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TRACK 2 (Nodes 3, 4, 5) */}
      <div className="horizontal-track-container relative w-full h-[120px] mb-16 border-box">
        <div className="track-line absolute top-1/2 left-0 right-0 h-2 rounded-[4px] bg-white/40 -translate-y-1/2"></div>

        <div className="nodes-container absolute top-1/2 -translate-y-1/2 w-full flex justify-around px-5 box-border">
          {projectsData.slice(3, 6).map((proj) => {
            const isActive = proj.id === currentNodeIndex;
            return (
              <button
                key={proj.id}
                onClick={() => handleSelectNode(proj.id)}
                className={`node flex flex-col items-center group transition-transform duration-300 w-[30%] md:w-[25%] focus:outline-none cursor-pointer ${
                  isActive ? "active scale-110" : ""
                }`}
              >
                <div
                  className={`node-dot w-[26px] h-[26px] rounded-full transition-all duration-[350ms] ${
                    isActive
                      ? "bg-[#1e293b]"
                      : "bg-white"
                  }`}
                  style={{ boxShadow: "0 0 20px #fff" }}
                />
                <div className="node-label font-sans font-black text-[#1e293b] text-[11px] md:text-[13px] uppercase bg-white/60 hover:bg-white/80 transition-colors py-2 px-3 rounded-[10px] text-center backdrop-blur-[5px] mt-3 leading-snug break-words max-w-full">
                  {proj.shortLabel.split("<br>").map((l, i) => (
                    <React.Fragment key={i}>
                      {l}
                      {i < proj.shortLabel.split("<br>").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILS EXPANDED CARD */}
      <div 
        id="details-card" 
        className={`details-expanded-card mx-auto ${
          currentNodeIndex !== -1 ? "open" : ""
        }`}
        style={{
          transition: "max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, padding 0.6s ease"
        }}
      >
        {currentNodeIndex !== -1 && (
          <div>
            <div className="details-header flex items-center justify-between mb-6 pb-2 border-b border-[#1e293b]/10">
              <button 
                id="prev-arrow" 
                onClick={prevNode}
                className="nav-arrow text-[32px] text-[#1e293b] font-sans font-black hover:scale-110 focus:outline-none focus:ring-0 cursor-pointer select-none"
                style={{ visibility: currentNodeIndex > 0 ? "visible" : "hidden" }}
              >
                ❮
              </button>
              <h3 id="details-title" className="details-title font-sans font-black text-[#1e293b] text-[24px] md:text-[32px] text-center flex-grow">
                {projectsData[currentNodeIndex].title}
              </h3>
              <button 
                id="next-arrow" 
                onClick={nextNode}
                className="nav-arrow text-[32px] text-[#1e293b] font-sans font-black hover:scale-110 focus:outline-none focus:ring-0 cursor-pointer select-none"
                style={{ visibility: currentNodeIndex < projectsData.length - 1 ? "visible" : "hidden" }}
              >
                ❯
              </button>
            </div>

            <div 
              id="details-text" 
              className="details-text font-medium font-sans text-[#0f172a] text-[16px] md:text-[21px] leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: projectsData[currentNodeIndex].text }}
            />

            <div className="details-action-container flex justify-center mt-10">
              {currentNodeIndex === 0 ? (
                <button 
                  onClick={onOpenCrmMockup}
                  className="action-btn inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-sans font-black text-[16px] uppercase tracking-wide px-8 py-4 rounded-[30px] transition-all hover:scale-[1.05] shadow-lg hover:shadow-xl duration-300 cursor-pointer border-none"
                >
                  SPRAWDŹ JAK TO DZIAŁA
                </button>
              ) : currentNodeIndex === 1 ? (
                <button 
                  onClick={onOpenOnboardingMockup}
                  className="action-btn inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-sans font-black text-[16px] uppercase tracking-wide px-8 py-4 rounded-[30px] transition-all hover:scale-[1.05] shadow-lg hover:shadow-xl duration-300 cursor-pointer border-none"
                >
                  SPRAWDŹ JAK TO DZIAŁA
                </button>
              ) : currentNodeIndex === 2 ? (
                <button 
                  onClick={onOpenScheduleMockup}
                  className="action-btn inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-sans font-black text-[16px] uppercase tracking-wide px-8 py-4 rounded-[30px] transition-all hover:scale-[1.05] shadow-lg hover:shadow-xl duration-300 cursor-pointer border-none"
                >
                  SPRAWDŹ JAK TO DZIAŁA
                </button>
              ) : currentNodeIndex === 3 ? (
                <button 
                  onClick={onOpenHrMockup}
                  className="action-btn inline-flex items-center gap-2 bg-gradient-to-r from-[#0d254c] to-[#1a3a6d] hover:from-[#1a3a6d] hover:to-[#0d254c] text-white font-sans font-black text-[16px] uppercase tracking-wide px-8 py-4 rounded-[30px] transition-all hover:scale-[1.05] shadow-lg hover:shadow-xl duration-300 cursor-pointer border-none"
                >
                  SPRAWDŹ JAK TO DZIAŁA
                </button>
              ) : currentNodeIndex === 4 ? (
                <button 
                  onClick={onOpenContractMockup}
                  className="action-btn inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans font-black text-[16px] uppercase tracking-wide px-8 py-4 rounded-[30px] transition-all hover:scale-[1.05] shadow-lg hover:shadow-xl duration-300 cursor-pointer border-none"
                >
                  SPRAWDŹ JAK TO DZIAŁA
                </button>
              ) : (
                <a 
                  id="details-link-btn" 
                  href={projectsData[currentNodeIndex].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn inline-flex items-center gap-2 bg-[#1e293b] hover:bg-[#0f172a] text-white font-sans font-black text-[16px] uppercase tracking-wide px-8 py-4 rounded-[30px] transition-all hover:scale-[1.05] shadow-lg hover:shadow-xl duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current">
                    <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z" />
                  </svg>
                  PRZEKLIKAJ TO SAM
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
