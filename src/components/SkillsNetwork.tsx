import React, { useState, useEffect, useRef } from "react";
import { skillsList } from "../data";

export default function SkillsNetwork() {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const revealTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Radial positioning metrics (rounder + larger ellipse, so labels don't collide)
  const aHub = 240;
  const bHub = 150;
  const aOut = 560;
  const bOut = 440;

  // Track hover (or touch) state to start sequential reveals
  useEffect(() => {
    if (isHovered) {
      const revealNextBranch = (currentIndex: number) => {
        if (currentIndex < skillsList.length) {
          setVisibleIndexes((prev) => [...prev, currentIndex]);
          revealTimerRef.current = setTimeout(() => {
            revealNextBranch(currentIndex + 1);
          }, 350); // Slick sequential branch reveals
        }
      };
      
      const nextToReveal = visibleIndexes.length;
      revealNextBranch(nextToReveal);
    } else {
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
      }
    }
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, [isHovered]);

  const triggerEasterEgg = () => {
    const nextCount = clickCount + 1;
    if (nextCount === 3) {
      setShowEasterEgg(true);
      setClickCount(0);
      setTimeout(() => {
        setShowEasterEgg(false);
      }, 7000);
    } else {
      setClickCount(nextCount);
    }
  };

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic responsive scaling calculation
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        if (width < 640) {
          setScale(width / 1350); // Mobile scale
        } else if (width < 1024) {
          setScale(width / 1350 * 0.9); // Tablet scale
        } else {
          setScale(width / 1350 * 0.95); // Desktop standard scale
        }
      }
    };
    window.addEventListener("resize", handleResize);
    // Initial call
    setTimeout(handleResize, 100);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="skills-network-section w-full max-w-[1400px] mt-36 pb-24 flex flex-col items-center relative overflow-visible"
    >
      <h2 className="timeline-title mb-16 text-center text-[40px] md:text-[56px] font-black uppercase text-white tracking-tight drop-shadow-sm font-sans">
        Moje narzędzia i talenty
      </h2>

      {/* EASTER EGG MODAL */}
      {showEasterEgg && (
        <div 
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setShowEasterEgg(false)}
        >
          <div 
            className="bg-white/90 border border-white/60 p-10 rounded-[40px] shadow-2xl max-w-lg w-full text-center relative animate-bounce"
            style={{ backdropFilter: "blur(25px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-sans font-black text-[#1e293b] text-3xl mb-4 uppercase tracking-tight">
              [ ARCHITEKT IT ]
            </h3>
            <p className="font-sans font-medium text-[#0f172a] text-[18px] leading-relaxed mb-6">
              Gratulacje! Odblokowałeś technologiczny Easter Egg. To portfolio nie ma przed Tobą tajemnic, dokładnie tak samo jak optymalizacja procesów przed Izabelą!
            </p>
            <button 
              className="bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold px-6 py-2.5 rounded-full select-none focus:outline-none"
              onClick={() => setShowEasterEgg(false)}
            >
              SUPER!
            </button>
          </div>
        </div>
      )}

      {/* Responsive zone scaling to support all device sizes elegantly */}
      <div 
        className="w-full flex justify-center items-center overflow-visible relative"
        style={{ height: `${1000 * scale}px`, minHeight: "360px" }}
      >
        <div 
          className="network-trigger-zone select-none absolute"
          id="network-zone"
          style={{
            width: "1300px",
            height: "1000px",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center center",
            transition: "transform 0.1s ease"
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
        >
          {/* Central hub ("IZABELA") */}
          <div 
            className="central-hub"
            onClick={triggerEasterEgg}
            title="Kliknij mnie 3 razy!"
          >
            <h2>
              {showEasterEgg ? "[ ARCHITEKT IT ]" : "IZABELA"}
            </h2>
          </div>

          {/* Programmatic Radial Branches */}
          {skillsList.map((skill, i) => {
            const angle = (i / skillsList.length) * 360;
            const rad = (angle * Math.PI) / 180;

            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            // Ellipse calculations matching original CSS logic
            let startRadius = (aHub * bHub) / Math.sqrt(Math.pow(bHub * cos, 2) + Math.pow(aHub * sin, 2));
            startRadius += 5;

            const endRadius = (aOut * bOut) / Math.sqrt(Math.pow(bOut * cos, 2) + Math.pow(aOut * sin, 2));
            const length = endRadius - startRadius;

            const isVisible = visibleIndexes.includes(i);
            const isFunny = skill.includes("Humor");

            return (
              <div
                key={skill}
                className={`skill-branch ${isVisible ? "visible" : ""}`}
                style={{
                  transform: `rotate(${angle}deg)`,
                  width: `${endRadius}px`
                }}
              >
                {/* Branch line grows outwards */}
                <div 
                  className="branch-line"
                  style={{
                    left: `${startRadius}px`,
                    width: isVisible ? `${length}px` : "0px",
                  }}
                />

                {/* Branch label wrapper positioned at the end of branch */}
                <div className="branch-label-wrapper">
                  {/* Rotate backwards so text remains upright */}
                  <div 
                    className="branch-label-unrotate"
                    style={{
                      transform: `rotate(-${angle}deg)`
                    }}
                  >
                    <div className={`branch-label ${isFunny ? "label-funny" : ""}`}>
                      {skill}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
