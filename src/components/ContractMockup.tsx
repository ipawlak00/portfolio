import React, { useEffect, useState } from "react";

interface ContractMockupProps {
  onClose: () => void;
  isOpen: boolean;
}

export function ContractMockup({ onClose, isOpen }: ContractMockupProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setMounted(false), 400);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex justify-end bg-[#0f172a]/60 backdrop-blur-sm transition-opacity duration-400 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`w-full h-full bg-white shadow-2xl relative transition-transform duration-500 transform ${isOpen ? 'translate-x-[0%]' : 'translate-x-[100%]'}`}
        onClick={(e) => e.stopPropagation()} 
        style={{ width: '100vw', maxWidth: '100vw' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-6 z-[110] w-[40px] h-[40px] flex items-center justify-center bg-[#0f172a] text-white rounded-full hover:bg-red-600 transition-colors shadow-lg border-[2px] border-white/20"
          title="Zamknij"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>

        <div className="w-full h-full pt-[0px] pb-0 px-0">
            <iframe 
              src="contract.html" 
              className="w-full h-full border-none m-0 p-0 block"
              title="Contract Application"
            />
        </div>
      </div>
    </div>
  );
}
