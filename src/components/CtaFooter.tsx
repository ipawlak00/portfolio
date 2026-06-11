import React, { useState } from "react";

export default function CtaFooter() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("ipawlak000@gmail.com").then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("733555826").then(() => {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    });
  };

  return (
    <div 
      className="cta-footer-card w-full max-w-[900px] mx-auto bg-white/30 border border-white/50 p-12 hover:border-white rounded-[40px] text-center z-10 transition-all duration-400 hover:-translate-y-1 mt-24 flex flex-col items-center box-border"
      style={{
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(30px)"
      }}
    >
      <h2 className="font-sans font-black text-[#1e293b] text-3xl md:text-[42px] m-0 mb-5 tracking-tight leading-none uppercase">
        To dopiero początek tej historii...
      </h2>
      <p className="font-sans font-medium text-[#0f172a] text-[18px] md:text-[20px] leading-[1.6] max-w-2xl mx-auto mb-10">
        Zawsze szukam nowych wyzwań i przestrzeni do optymalizacji. Porozmawiajmy o tym, co możemy wspólnie zbudować!
      </p>

      <div className="cta-buttons flex flex-wrap justify-center items-center gap-5">
        
        {/* Email button with dropdown */}
        <div className="cta-btn-wrapper relative group select-none">
          <div className="cta-btn-secondary inline-flex items-center gap-2.5 bg-white/40 hover:bg-white/80 border-2 border-[#1e293b] text-[#1e293b] font-sans font-black text-[16px] uppercase tracking-wide px-8 py-4 rounded-[30px] transition-all cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current">
              <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
            </svg>
            Napisz e-mail
          </div>
          
          <div className="dropdown-menu bottom-menu absolute bottom-[calc(100%+15px)] left-1/2 -translate-x-1/2 translate-y-[15px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 bg-white/95 backdrop-blur-md rounded-[15px] p-4 border border-white/60 shadow-2xl z-[100] w-max">
            <div className="dropdown-item flex items-center justify-between gap-5 bg-[#eef2f5]/60 hover:bg-[#dce6f0]/80 transition-colors p-[10px_15px] rounded-[10px]">
              <span className="text-[#0f172a] font-sans font-black text-[15px]">ipawlak000@gmail.com</span>
              <button 
                className="copy-btn bg-[#1e293b] hover:bg-[#0f172a] text-white font-sans font-black text-[12px] uppercase py-1.5 px-3.5 rounded-[20px] transition-all duration-200 cursor-pointer"
                onClick={handleCopyEmail}
                style={{
                  backgroundColor: copiedEmail ? "#10b981" : ""
                }}
              >
                {copiedEmail ? "Skopiowano!" : "Kopiuj"}
              </button>
            </div>
          </div>
        </div>

        {/* Phone button with dropdown */}
        <div className="cta-btn-wrapper relative group select-none">
          <div className="cta-btn-primary inline-flex items-center gap-2.5 bg-[#1e293b] hover:bg-[#0f172a] hover:scale-[1.05] text-white font-sans font-black text-[16px] uppercase tracking-wide px-8 py-4 rounded-[30px] transition-all cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current">
              <path d="M18.48 22.926c-2.748 0-5.397-1.104-7.807-3.292-2.411-2.189-4.321-4.739-5.666-7.585-1.346-2.846-2.028-5.719-2.028-8.539 0-1.282.353-2.316 1.05-3.073.712-.773 1.737-1.201 3.048-1.201.295 0 .584.025.864.075l.178.031c.884.155 1.583.743 1.968 1.656l1.246 2.946c.334.791.241 1.688-.249 2.399-.187.271-.428.531-.715.772l-.371.312c-.221.185-.316.48-.236.756.24.819.78 1.833 1.604 3.014 1.01 1.447 2.057 2.502 3.111 3.136.262.158.591.135.83-.058l.386-.312c.328-.265.612-.486.845-.658.746-.549 1.706-.667 2.56-.316l3.155 1.299c.846.348 1.402 1.056 1.564 1.996l.03.176c.05.289.076.588.076.889 0 1.341-.42 2.391-1.249 3.119-.757.665-1.745 1.002-3.031 1.002z" />
            </svg>
            Zadzwoń do mnie
          </div>

          <div className="dropdown-menu bottom-menu absolute bottom-[calc(100%+15px)] left-1/2 -translate-x-1/2 translate-y-[15px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 bg-white/95 backdrop-blur-md rounded-[15px] p-4 border border-white/60 shadow-2xl z-[100] w-max">
            <div className="dropdown-item flex items-center justify-between gap-5 bg-[#eef2f5]/60 hover:bg-[#dce6f0]/80 transition-colors p-[10px_15px] rounded-[10px]">
              <span className="text-[#0f172a] font-sans font-black text-[15px]">733 555 826</span>
              <button 
                className="copy-btn bg-[#1e293b] hover:bg-[#0f172a] text-white font-sans font-black text-[12px] uppercase py-1.5 px-3.5 rounded-[20px] transition-all duration-200 cursor-pointer"
                onClick={handleCopyPhone}
                style={{
                  backgroundColor: copiedPhone ? "#10b981" : ""
                }}
              >
                {copiedPhone ? "Skopiowano!" : "Kopiuj"}
              </button>
            </div>
          </div>
        </div>

        {/* LinkedIn direct link */}
        <a 
          href="https://www.linkedin.com/in/izabelacode/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="action-btn cta-btn-secondary inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1e293b] rounded-[30px] font-sans font-black text-[16px] uppercase tracking-wide text-[#1e293b] hover:scale-[1.05] hover:bg-white/80 transition-all duration-300"
        >
          <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          Złapmy się na LinkedIn
        </a>

      </div>
    </div>
  );
}
