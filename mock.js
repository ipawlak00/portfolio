const MOCK_DZIALY = ["Dział A", "Dział B", "Dział C", "Montaż", "Kontrola Jakości", "Magazyn", "Pakowanie"];

const MOCK_PRACOWNICY = [];
const FIRST_NAMES = ["Anna", "Piotr", "Jan", "Katarzyna", "Michał", "Agnieszka", "Tomasz", "Magdalena", "Krzysztof", "Barbara", "Marek", "Ewa", "Grzegorz", "Krystyna", "Wojciech", "Elżbieta"];
const LAST_NAMES = ["Kowalska", "Nowak", "Wiśniewski", "Wójcik", "Kowalczyk", "Kaczmarek", "Zieliński", "Szymańska", "Dąbrowski", "Kozłowski", "Jankowski", "Mazur", "Kwiatkowski", "Krawczyk", "Kaczmarczyk"];
const STANOWISKA = ["PP", "PT", "OW", "PP", "PP"];

for (let i = 0; i < 100; i++) {
  MOCK_PRACOWNICY.push({
    id: (100001 + i).toString(),
    imieNazwisko: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    telefon: `500123${(100 + i).toString()}`,
    stanowisko: STANOWISKA[i % STANOWISKA.length],
    dzial: MOCK_DZIALY[i % MOCK_DZIALY.length],
    grupa: i % 5 === 0 ? "Pon-Pt" : "4-brygady",
    etat: "1"
  });
}

const MOCK_ZAMOWIENIA = [];
const MOCK_PRZYPISANIA = [];

// Populate data for May 2026
const DAYS_IN_MAY_2026 = 31;
for (let day = 1; day <= DAYS_IN_MAY_2026; day++) {
    const formattedDate = `2026-05-${String(day).padStart(2, '0')}`;
    
    // Add demand
    MOCK_DZIALY.forEach(dzial => {
        if (Math.random() > 0.3) {
            ["I", "II", "III"].forEach(zmiana => {
                if (Math.random() > 0.4) {
                    MOCK_ZAMOWIENIA.push({
                        uid: Math.random().toString(36).substr(2, 9),
                        dataPlanu: formattedDate,
                        data: formattedDate,
                        dzial: dzial,
                        zmiana: zmiana,
                        stanowisko: "PP",
                        wartosc: Math.floor(Math.random() * 3) + 1,
                        czyDomowienie: false
                    });
                }
            });
        }
    });

    // Add assignments
    MOCK_PRACOWNICY.forEach(pracownik => {
        // Assume working 5 days a week randomly
        if (Math.random() > 0.286) { // ~5/7 days
            MOCK_PRZYPISANIA.push({
                data: formattedDate,
                dzial: pracownik.dzial,
                id: pracownik.id,
                stanowisko: pracownik.stanowisko,
                zmiana: ["I", "II", "III"][Math.floor(Math.random() * 3)]
            });
        }
    });
}

window.google = {
  script: {
    run: {
      withSuccessHandler: function(callback) {
        const proxyContext = {
          withFailureHandler: function() { return proxyContext; },
          pobierzDaneStartowe: function() { 
            setTimeout(() => callback({
              success:true, 
              dzialy: MOCK_DZIALY, 
              zamowienia: MOCK_ZAMOWIENIA, 
              pracownicy: MOCK_PRACOWNICY, 
              przypisania: MOCK_PRZYPISANIA
            }), 200); 
          },
          zapiszPojedynczeZamowienie: function(payload) { setTimeout(() => callback({success:true}), 100); },
          usunZamowienieDB: function(payload) { setTimeout(() => callback({success:true}), 100); },
          zapiszPracownikaDB: function(p) { setTimeout(() => callback({success:true}), 100); },
          usunPracownikaDB: function(id) { setTimeout(() => callback({success:true}), 100); },
          zapiszWszystkiePrzypisaniaDB: function(arr) { setTimeout(() => callback({success:true}), 100); },
          dodajNowyDzialDB: function(dzial) { setTimeout(() => callback({success:true}), 100); },
          edytujZamowienieDB: function(stary, nowy) { setTimeout(() => callback({success:true}), 100); }
        };
        return proxyContext;
      }
    }
  }
};
