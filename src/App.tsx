import React, { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import AboutMe from "./components/AboutMe";
import TimelineSection from "./components/TimelineSection";
import SkillsNetwork from "./components/SkillsNetwork";
import ProcessFlow from "./components/ProcessFlow";
import CtaFooter from "./components/CtaFooter";
import CrmMockup from "./components/CrmMockup";
import OnboardingMockup from "./components/OnboardingMockup";
import ScheduleMockup from "./components/ScheduleMockup";
import HrMockup from "./components/HrMockup";
import { ContractMockup } from "./components/ContractMockup";
import PlanningMockup from "./components/PlanningMockup";

export default function App() {
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const [isCrmMockupOpen, setIsCrmMockupOpen] = useState(false);
  const [isOnboardingMockupOpen, setIsOnboardingMockupOpen] = useState(false);
  const [isScheduleMockupOpen, setIsScheduleMockupOpen] = useState(false);
  const [isHrMockupOpen, setIsHrMockupOpen] = useState(false);
  const [isContractMockupOpen, setIsContractMockupOpen] = useState(false);
  const [isPlanningMockupOpen, setIsPlanningMockupOpen] = useState(false);
  const [copiedHeaderPhone, setCopiedHeaderPhone] = useState(false);
  const [copiedHeaderEmail, setCopiedHeaderEmail] = useState(false);

  const toggleAbout = () => {
    setIsAboutVisible(!isAboutVisible);
  };

  const scrollToTimeline = () => {
    setIsTimelineVisible(true);
    setTimeout(() => {
      const timeline = document.getElementById("timeline-target");
      if (timeline) {
        timeline.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleCopyHeaderPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("733555826").then(() => {
      setCopiedHeaderPhone(true);
      setTimeout(() => setCopiedHeaderPhone(false), 2000);
    });
  };

  const handleCopyHeaderEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("ipawlak000@gmail.com").then(() => {
      setCopiedHeaderEmail(true);
      setTimeout(() => setCopiedHeaderEmail(false), 2000);
    });
  };

  return (
    <div className="font-sans min-h-screen w-full relative overflow-x-hidden flex flex-col items-center select-none">
      
      {/* 1. FIXED BACKGROUND LAYERS (Opal flowing mesh + high fidelity film grain) */}
      <div className="background-fixed-layer" />
      <div className="glass-overlay-fixed" />

      {/* 2. CHIEF VALUE MAIN WRAPPER */}
      <div className="main-wrapper w-full max-w-[1600px] px-6 lg:px-[80px] py-[60px] box-border z-10 flex flex-col items-center min-h-screen">
        
        {/* HEADER NAVIGATION ROW */}
        <div className="header-row relative z-30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 lg:gap-20 mb-16 lg:mb-[80px] w-full">
          <div className="flex flex-col shrink-0">
            <h1 className="main-title text-left text-4xl sm:text-6xl md:text-[80px] font-sans font-black tracking-tighter m-0 bg-clip-text">
              IZABELA PAWLAK
            </h1>
            <p className="text-left text-[#1e293b]/75 font-sans font-semibold text-sm sm:text-base md:text-lg mt-2 md:mt-3 max-w-[640px]">
              Analizuję dane, układam procesy i buduję narzędzia, które porządkują chaos operacyjny.
            </p>
          </div>
          
          <div className="contact-icons flex flex-wrap gap-[20px] md:gap-[30px] items-center w-full lg:w-auto mt-4 lg:mt-0 justify-start lg:justify-end">
            {/* LinkedIn Icon with raw SVG */}
            <a 
              href="https://www.linkedin.com/in/izabelacode/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="icon-wrapper w-[60px] h-[60px] rounded-full border border-white/50 hover:border-white flex items-center justify-center transition-all bg-white/20 hover:bg-white/50 hover:-translate-y-1 hover:scale-110" 
              title="Mój profil LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="w-[26px] h-[26px] fill-[#1e293b]">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Phone Icon with raw SVG & Hover dropdown */}
            <div className="icon-wrapper group relative w-[60px] h-[60px] rounded-full border border-white/50 hover:border-white flex items-center justify-center transition-all bg-white/20 hover:bg-white/50 hover:-translate-y-1 hover:scale-110 cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-[26px] h-[26px] fill-[#1e293b]">
                <path d="M18.48 22.926c-2.748 0-5.397-1.104-7.807-3.292-2.411-2.189-4.321-4.739-5.666-7.585-1.346-2.846-2.028-5.719-2.028-8.539 0-1.282.353-2.316 1.05-3.073.712-.773 1.737-1.201 3.048-1.201.295 0 .584.025.864.075l.178.031c.884.155 1.583.743 1.968 1.656l1.246 2.946c.334.791.241 1.688-.249 2.399-.187.271-.428.531-.715.772l-.371.312c-.221.185-.316.48-.236.756.24.819.78 1.833 1.604 3.014 1.01 1.447 2.057 2.502 3.111 3.136.262.158.591.135.83-.058l.386-.312c.328-.265.612-.486.845-.658.746-.549 1.706-.667 2.56-.316l3.155 1.299c.846.348 1.402 1.056 1.564 1.996l.03.176c.05.289.076.588.076.889 0 1.341-.42 2.391-1.249 3.119-.757.665-1.745 1.002-3.031 1.002z" />
              </svg>
              
              <div className="dropdown-menu absolute top-[80px] right-[-30px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-[-15px] transition-all duration-300 bg-white/95 backdrop-blur-md border border-white/60 p-[15px] rounded-[15px] shadow-2xl z-[100] w-max">
                <div className="dropdown-item flex items-center justify-between gap-5 bg-[#eef2f5]/60 hover:bg-[#dce6f0]/80 transition-colors p-[10px_15px] rounded-[10px]">
                  <span className="text-[#0f172a] font-sans font-black text-[15px]">733 555 826</span>
                  <button 
                    className="copy-btn bg-[#1e293b] hover:bg-[#0f172a] text-white font-sans font-black text-[12px] uppercase py-1.5 px-3.5 id-btn rounded-[20px] transition-all duration-200 cursor-pointer"
                    onClick={handleCopyHeaderPhone}
                    style={{ backgroundColor: copiedHeaderPhone ? "#10b981" : "" }}
                  >
                    {copiedHeaderPhone ? "Skopiowano!" : "Kopiuj"}
                  </button>
                </div>
              </div>
            </div>

            {/* Mail Icon with raw SVG & Hover dropdown */}
            <div className="icon-wrapper group relative w-[60px] h-[60px] rounded-full border border-white/50 hover:border-white flex items-center justify-center transition-all bg-white/20 hover:bg-white/50 hover:-translate-y-1 hover:scale-110 cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-[26px] h-[26px] fill-[#1e293b]">
                <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
              </svg>

              <div className="dropdown-menu absolute top-[80px] right-[-30px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-[-15px] transition-all duration-300 bg-white/95 backdrop-blur-md border border-white/60 p-[15px] rounded-[15px] shadow-2xl z-[100] w-max">
                <div className="dropdown-item flex items-center justify-between gap-5 bg-[#eef2f5]/60 hover:bg-[#dce6f0]/80 transition-colors p-[10px_15px] rounded-[10px]">
                  <span className="text-[#0f172a] font-sans font-black text-[15px]">ipawlak000@gmail.com</span>
                  <button 
                    className="copy-btn bg-[#1e293b] hover:bg-[#0f172a] text-white font-sans font-black text-[12px] uppercase py-1.5 px-3.5 id-btn rounded-[20px] transition-all duration-200 cursor-pointer"
                    onClick={handleCopyHeaderEmail}
                    style={{ backgroundColor: copiedHeaderEmail ? "#10b981" : "" }}
                  >
                    {copiedHeaderEmail ? "Skopiowano!" : "Kopiuj"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE/BIOGRAPHY LAYOUT ROW */}
        <div className="content-row relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-10 w-full mb-12">
          {/* Frosted interactive card on left */}
          <ProfileCard 
            onToggleAbout={toggleAbout} 
            onScrollToTimeline={scrollToTimeline} 
          />

          {/* Dynamic Spacer Arrow (Blinds and blinks dynamically when "KIM JESTEM?" is active) */}
          <div 
            className="arrow-container hidden lg:flex items-center justify-center h-[480px] w-[100px] transition-all duration-300"
            style={{
              visibility: isAboutVisible ? "visible" : "hidden"
            }}
          >
            <div className="arrow-icon text-[70px] text-white select-none pointer-events-none drop-shadow-md">
              ➔
            </div>
          </div>

          {/* About Me content display container */}
          <AboutMe isVisible={isAboutVisible} />
        </div>

        {/* INTERACTIVE EXPERIENCE TIMELINE SECTION */}
        {isTimelineVisible && (
          <TimelineSection 
            isVisible={isTimelineVisible} 
            onOpenCrmMockup={() => setIsCrmMockupOpen(true)} 
            onOpenOnboardingMockup={() => setIsOnboardingMockupOpen(true)}
            onOpenScheduleMockup={() => setIsScheduleMockupOpen(true)}
            onOpenHrMockup={() => setIsHrMockupOpen(true)}
            onOpenContractMockup={() => setIsContractMockupOpen(true)}
            onOpenPlanningMockup={() => setIsPlanningMockupOpen(true)}
          />
        )}

        {/* RADIAL SKILLS MIND MAP SECTION */}
        {isTimelineVisible && <SkillsNetwork />}

        {/* PROCESS FLOW METHODOLOGY SECTION */}
        {isTimelineVisible && <ProcessFlow />}

        {/* CALL TO ACTION BOTTOM CARD (zawiera teraz skrócone "Dlaczego ja?") */}
        {isTimelineVisible && <CtaFooter />}

        {/* MOCKUP INTERACTIVE FULLSCREEN MODALS */}
        {isCrmMockupOpen && <CrmMockup isOpen={isCrmMockupOpen} onClose={() => setIsCrmMockupOpen(false)} />}
        {isOnboardingMockupOpen && <OnboardingMockup isOpen={isOnboardingMockupOpen} onClose={() => setIsOnboardingMockupOpen(false)} />}
        {isScheduleMockupOpen && <ScheduleMockup isOpen={isScheduleMockupOpen} onClose={() => setIsScheduleMockupOpen(false)} />}
        {isHrMockupOpen && <HrMockup isOpen={isHrMockupOpen} onClose={() => setIsHrMockupOpen(false)} />}
        {isContractMockupOpen && <ContractMockup isOpen={isContractMockupOpen} onClose={() => setIsContractMockupOpen(false)} />}
        {isPlanningMockupOpen && <PlanningMockup isOpen={isPlanningMockupOpen} onClose={() => setIsPlanningMockupOpen(false)} />}

      </div>
    </div>
  );
}
