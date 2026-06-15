import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ContractMockupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContractMockup({ isOpen, onClose }: ContractMockupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[990] bg-gradient-to-br from-[#f2f8fc] to-[#e6f2fd] text-slate-800 flex flex-col font-sans overflow-hidden">

      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-white/50 hover:bg-white text-slate-800 font-bold p-3 rounded-full transition-all z-50 cursor-pointer shadow-md border border-slate-300"
        title="Zamknij"
      >
        <X className="w-6 h-6" />
      </button>

      {/* WORKSPACE AREA */}
      <div className="flex-grow flex flex-col p-4 md:p-8 gap-6 overflow-y-auto w-full max-w-7xl mx-auto pt-16 relative z-10">
        <div className="lg:hidden flex items-start gap-2 self-center max-w-[520px] bg-[#1e293b]/90 text-white text-[13px] font-semibold px-4 py-2.5 rounded-2xl shadow-lg border border-white/20 text-center backdrop-blur-sm">
          <span>Ta aplikacja jest zaprojektowana na komputer, najlepiej otworzyć ją na większym ekranie.</span>
        </div>
        <div className="flex-grow flex rounded-3xl border border-slate-200 shadow-2xl min-h-[640px] xl:min-h-[720px] overflow-hidden relative">
          <iframe
              src="contract.html?v=3"
              className="w-full h-full border-0 absolute inset-0"
              title="Enterprise HR System Preview"
          />
        </div>
      </div>
    </div>
  );
}
