import React from "react";

interface ProfileCardProps {
  onToggleAbout: () => void;
  onScrollToTimeline: () => void;
}

export default function ProfileCard({ onToggleAbout, onScrollToTimeline }: ProfileCardProps) {
  return (
    <div
      id="profile-glass-card"
      className="frosted-glass-card"
    >
      <div className="profile-pic-container">
        <img 
          src="profile.jpeg" 
          alt="Izabela" 
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="button-group">
        <button 
          id="btn-toggle-about"
          onClick={onToggleAbout}
          className="main-button w-full focus:outline-none"
        >
          KIM JESTEM?
        </button>
        
        <button 
          id="btn-scroll-timeline"
          onClick={onScrollToTimeline}
          className="main-button w-full focus:outline-none"
        >
          MOJE PROJEKTY
        </button>
      </div>
    </div>
  );
}
