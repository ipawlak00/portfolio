import React from "react";

interface AboutMeProps {
  isVisible: boolean;
}

export default function AboutMe({ isVisible }: AboutMeProps) {
  return (
    <div
      id="about-me-container"
      className={isVisible ? "visible" : ""}
    >
      <div id="about-me-content">
        <b>
          Kim jestem?<br />
          <br />
        </b>
        Jestem Izabelą. Analizuję dane, układam procesy i buduję narzędzia, które
        porządkują chaos operacyjny. Tworzę rozwiązania od pomysłu po wdrożenie:
        mapuję procesy, projektuję, automatyzuję i upraszczam to, co skomplikowane.
        Łączę analityczne myślenie z praktycznym budowaniem, a wiedzę
        psychologiczną wykorzystuję, żeby narzędzia naprawdę służyły ludziom.
      </div>
    </div>
  );
}
