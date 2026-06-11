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
          Jestem sobą – jestem Izabelą.
        </b>
        Tworzę procesy, wymyślam nowe rozwiązania i porządkuję chaos. Bywam
        budowniczym struktur, wizjonerem zmian i analitycznym myślicielem, a
        kiedy trzeba – skutecznym doradcą i motywatorem.
      </div>
    </div>
  );
}
