/**
 * ================================================================================================
 * ENTERPRISE HR SYSTEM - BACKEND (SIMULATED)
 * ================================================================================================
 */

const ID_ARKUSZA = "1_UzqaHzRQOUvbeq8hto5aKCAZ-Ikcri21ShJuUV7ccM"; 

const NAZWA_ARKUSZA_PRZEDLUZANIE = "Przedłużanie umów";
const NAZWA_ARKUSZA_RAPORT = "Raport";
const PREFIX_ARKUSZA_TYGODNIOWEGO = "Tydz."; 

const KOL_PRZEDL_IMIE = 0;       
const KOL_PRZEDL_DATA_START = 1; 
const KOL_PRZEDL_ONBOARDING = 2; 
const KOL_PRZEDL_GODZINY = 3;    
const KOL_PRZEDL_DNI = 4;        
const KOL_PRZEDL_AKTUALNA = 5;   
const KOL_PRZEDL_L4 = 6;         
const KOL_PRZEDL_NN = 7;         
const KOL_PRZEDL_TRYB = 8;       
const KOL_PRZEDL_POCZATEK = 9;   
const KOL_PRZEDL_KONIEC = 10;    
const KOL_PRZEDL_STATUS = 11;    
const KOL_PRZEDL_LICZNIK_TYG = 12;  
const KOL_PRZEDL_LICZNIK_2TYG = 13; 

const KOL_TYDZIEN_IMIE = 1;         
const KOL_TYDZIEN_START = 2;        
const KOL_TYDZIEN_KONIEC = 3;       
const KOL_TYDZIEN_ZATRUDNIENIE = 7; 


function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Enterprise HR System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function safeStr(val, fallback = "-") {
  if (val instanceof Error) return fallback;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return fallback;
    return Utilities.formatDate(val, Session.getScriptTimeZone(), "dd.MM.yyyy");
  }
  if (val === null || val === undefined || val === "") return fallback;
  return String(val).trim();
}

function safeNum(val) {
  if (val instanceof Error) return 0;
  let n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function toTitleCase(str) { 
  if (!str) return "";
  return str.toLowerCase().split(/\s+/).map(word => {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function parsePlDate(dateVal) {
    if (!dateVal) return null;
    if (dateVal instanceof Date) return dateVal;
    if (typeof dateVal === 'string') {
        if (dateVal.includes('-')) {
            let parts = dateVal.split('-');
            if (parts[0].length === 4) {
                return new Date(parts[0], parts[1]-1, parts[2]);
            }
        } else if (dateVal.includes('.')) {
            let parts = dateVal.split('.');
            if (parts.length === 3) {
                let y = parts[2].length === 2 ? "20" + parts[2] : parts[2];
                return new Date(y, parts[1]-1, parts[0]);
            }
        }
    }
    return null;
}

function normalizeName(str) {
  if(!str) return "";
  let s = String(str).toLowerCase().replace(/-/g, ' ');
  const map = {'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z'};
  s = s.replace(/[ąćęłńóśźż]/g, c => map[c]);
  return s.replace(/\s+/g, ' ').trim();
}

function isSamePerson(n1, n2) {
    if(!n1 || !n2) return false;
    let norm1 = normalizeName(n1);
    let norm2 = normalizeName(n2);
    if (norm1 === norm2) return true;
    
    let w1 = norm1.split(/\s+/).sort();
    let w2 = norm2.split(/\s+/).sort();
    if (w1.join(' ') === w2.join(' ')) return true;

    if (w1.length > 0 && w1.length === w2.length) {
        let matches = 0;
        for(let i=0; i<w1.length; i++) {
            if (w1[i] === w2[i] || w1[i].startsWith(w2[i]) || w2[i].startsWith(w1[i])) matches++;
        }
        if (matches === w1.length) return true;
    }
    return false;
}

// =========================================================
// ZAAWANSOWANY PARSER RAPORTU ABSENCJI
// =========================================================
function pobierzStatystykiZRaportu(daneRaport) {
    if (!daneRaport || daneRaport.length < 2) return [];
    
    const naglowki = daneRaport[0].map(h => String(h).toLowerCase().trim());
    const findCol = (slowa) => naglowki.findIndex(h => slowa.some(kw => h.includes(kw)));
    
    let kNazw = findCol(["nazwisk"]);
    let kImie = findCol(["imię", "imie"]);
    kNazw = kNazw !== -1 ? kNazw : 2; 
    kImie = kImie !== -1 ? kImie : 3;

    let kGodz = findCol(["suma godzin"]);
    if (kGodz === -1) kGodz = findCol(["godziny zwykłe"]);
    if (kGodz === -1) kGodz = 10;

    let kL4_cols = [];
    let kNN_cols = [];
    
    naglowki.forEach((h, idx) => {
        if (h.includes("chorob") || h.includes("l4") || h.includes("zwolnieni")) kL4_cols.push(idx);
        if (h.includes("nieusprawiedliwion") || h.includes(" nn") || h === "nn") kNN_cols.push(idx);
    });

    if (kL4_cols.length === 0) kL4_cols = [11];
    if (kNN_cols.length === 0) kNN_cols = [14];

    let wpisy = [];
    for (let i = 1; i < daneRaport.length; i++) {
        const r = daneRaport[i];
        if (r[kNazw]) {
          const checkHeader = String(r[kNazw]).toLowerCase().trim();
          if (checkHeader.includes("nazwisk") || checkHeader === "imię" || checkHeader === "imie") continue;

          const pelneImie = String(r[kNazw]).trim() + " " + String(r[kImie] || "").trim();
          
          let godz = parseFloat(String(r[kGodz]).replace(',', '.')) || 0;
          let l4 = 0;
          kL4_cols.forEach(idx => { l4 += (parseFloat(String(r[idx]).replace(',', '.')) || 0); });
          
          let nn = 0;
          kNN_cols.forEach(idx => { nn += (parseFloat(String(r[idx]).replace(',', '.')) || 0); });

          wpisy.push({ imie: pelneImie, godz: godz, l4: l4, nn: nn });
        }
    }
    return wpisy;
}

// =========================================================
// MODUŁ KART I PRZEPUSTEK
// =========================================================
function pobierzKartyServer() {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let sheet = ss.getSheetByName("Karty");
    if(!sheet) {
        sheet = ss.insertSheet("Karty");
        sheet.appendRow(["Nr Wewnętrzny", "Imię i nazwisko", "Numer Karty", "Dział", "Aktywacja", "Zwrot"]);
    }
    
    const data = sheet.getDataRange().getValues();
    let lista = [];
    let stats = { wydane: 0, oddane: 0, maxKadrowy: 0 };
    
    for(let i=1; i<data.length; i++) {
        const kadrowy = safeStr(data[i][0], ""); 
        const imie = safeStr(data[i][1], "");   
        if(!imie || imie === "-") continue;
        
        const karta = safeStr(data[i][2], "");   
        const dzial = safeStr(data[i][3], "");   
        const zwrot = safeStr(data[i][5], "");     
        
        let numKad = parseInt(kadrowy);
        if(!isNaN(numKad) && numKad > stats.maxKadrowy) {
            stats.maxKadrowy = numKad;
        }

        const isOddana = (zwrot !== "" && zwrot !== "-");
        
        if(isOddana) stats.oddane++;
        else stats.wydane++;
        
        lista.push({ 
            id: "karta_" + i, 
            kadrowy: kadrowy,
            imie: imie, 
            nrKarty: karta, 
            dzial: dzial,
            status: isOddana ? "Oddana" : "Wydana"
        });
    }
    
    return { lista: lista, stats: stats };
  } catch(e) { throw new Error(e.message); }
}

function zapiszKarteServer(dane) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let sheet = ss.getSheetByName("Karty");
    const pelneImie = toTitleCase(dane.imie.trim());
    const data = sheet.getDataRange().getValues();
    
    let valAktywacja = dane.status === "Wydana" ? "Aktywowana" : "";
    let valZwrot = dane.status === "Oddana" ? "Tak" : ""; 

    if (dane.stareImie) {
        for(let i=1; i<data.length; i++) {
            if(String(data[i][1]).trim() === dane.stareImie) { 
                sheet.getRange(i+1, 1).setValue(dane.kadrowy);
                sheet.getRange(i+1, 2).setValue(pelneImie);
                sheet.getRange(i+1, 3).setValue(dane.nrKarty);
                sheet.getRange(i+1, 4).setValue(dane.dzial);
                sheet.getRange(i+1, 5).setValue(valAktywacja);
                sheet.getRange(i+1, 6).setValue(valZwrot);
                return "Zaktualizowano dane karty!";
            }
        }
    }
    
    sheet.appendRow([dane.kadrowy, pelneImie, dane.nrKarty, dane.dzial, valAktywacja, valZwrot]);
    return "Przypisano nową kartę i dodano do bazy!";
  } catch(e) { throw new Error(e.message); }
}

function usunKarteServer(kadrowy, imie) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    const sheet = ss.getSheetByName("Karty");
    if (!sheet) throw new Error("Nie znaleziono arkusza 'Karty'.");
    
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim() === String(kadrowy).trim() && String(data[i][1]).trim() === String(imie).trim()) {
        sheet.deleteRow(i + 1);
        return "Karta usunięta z systemu pomyślnie.";
      }
    }
    throw new Error("Nie znaleziono pracownika na liście Kart.");
  } catch (e) {
    throw new Error(e.message);
  }
}

function pobierzKandydatowZKartServer(nazwaMiesiaca) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    const sheetKarty = ss.getSheetByName("Karty");
    if(!sheetKarty) return [];
    
    const dataK = sheetKarty.getDataRange().getValues();
    const aktywneKarty = [];
    
    for(let i=1; i<dataK.length; i++) {
       const kadrowy = String(dataK[i][0]).trim(); 
       const imie = String(dataK[i][1]).trim();    
       const dzial = String(dataK[i][3]).trim();   
       const zwrot = String(dataK[i][5]).trim();   
       
       const isOddana = (zwrot !== "" && zwrot !== "-");
       
       if(imie && !isOddana) {
           let numKad = parseInt(kadrowy) || 0;
           aktywneKarty.push({ imie: imie, kadrowy: kadrowy, dzial: dzial, numKad: numKad });
       }
    }
    
    aktywneKarty.sort((a, b) => b.numKad - a.numKad);

    let sheetMsc = ss.getSheetByName(nazwaMiesiaca) || ss.getSheets().find(s => s.getName().toLowerCase().includes(nazwaMiesiaca.toLowerCase()));
    const obecni = new Set();
    if(sheetMsc) {
       const dataMsc = sheetMsc.getDataRange().getValues();
       for(let i=1; i<dataMsc.length; i++) {
           if(dataMsc[i][1]) obecni.add(normalizeName(String(dataMsc[i][1])));
       }
    }
    
    return aktywneKarty.filter(k => !obecni.has(normalizeName(k.imie)));
  } catch(e) { throw new Error(e.message); }
}

function pobierzDostepneMiesiace() {
  const ss = SpreadsheetApp.openById(ID_ARKUSZA);
  const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
  let dostepne = [];
  ss.getSheets().forEach(s => {
    let n = s.getName();
    if (months.some(m => n.toLowerCase().includes(m.toLowerCase()))) dostepne.push(n);
  });
  return dostepne.reverse(); 
}

function pobierzEwidencjeMiesiaca(nazwaMiesiaca) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let sheet = ss.getSheetByName(nazwaMiesiaca) || ss.getSheets().find(s => s.getName().toLowerCase().includes(nazwaMiesiaca.toLowerCase()));
    if (!sheet) throw new Error("Brak arkusza dla: " + nazwaMiesiaca);

    const sheetGlowne = ss.getSheetByName("Przedłużanie umów");
    const dataGlowne = sheetGlowne.getDataRange().getValues();
    const startDates = new Map();
    for(let i=1; i<dataGlowne.length; i++) {
        if(dataGlowne[i][0]) startDates.set(normalizeName(String(dataGlowne[i][0])), dataGlowne[i][1]); 
    }

    const miesiaceNazwy = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
    let wytypowanyMsc = -1; let wytypowanyRok = new Date().getFullYear();
    miesiaceNazwy.forEach((m, idx) => { if(nazwaMiesiaca.toLowerCase().includes(m)) wytypowanyMsc = idx; });
    const matchRok = nazwaMiesiaca.match(/\d{4}/);
    if(matchRok) wytypowanyRok = parseInt(matchRok[0]);

    const lastRow = Math.max(sheet.getLastRow(), 1);
    const lastCol = Math.max(sheet.getLastColumn(), 15);
    const data = sheet.getRange(1, 1, lastRow, lastCol).getValues(); 
    
    let lista = [];
    let stats = { wszyscy: 0, nowi: 0, rotujacy: 0 };
    const dzisiaj = new Date(); dzisiaj.setHours(0,0,0,0);

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const imie = safeStr(row[1], ""); 
      if (!imie || imie === "-") continue;

      let rotacja = safeStr(row[12], ""); 
      let rotacjaPrzeszla = false;

      if (rotacja && rotacja !== "-") {
          let parts = rotacja.split('.');
          if(parts.length === 3) {
              let rotDate = new Date(parts[2], parts[1]-1, parts[0]);
              if (rotDate < dzisiaj) rotacjaPrzeszla = true; 
              if (rotDate.getMonth() === wytypowanyMsc && rotDate.getFullYear() === wytypowanyRok) stats.rotujacy++;
          }
      }

      if (!rotacjaPrzeszla) stats.wszyscy++;

      let sDate = startDates.get(normalizeName(imie));
      if (sDate instanceof Date && wytypowanyMsc !== -1) {
          if (sDate.getMonth() === wytypowanyMsc && sDate.getFullYear() === wytypowanyRok) stats.nowi++;
      }

      lista.push({
        id: "miesiac_row_" + i,
        imie: imie,
        sap: safeStr(row[2], ""), 
        dzial: safeStr(row[3], ""), 
        telefon: safeStr(row[4], ""), 
        brygada: safeStr(row[5], ""), 
        dataRotacji: rotacja,
        dataStartuRaw: sDate instanceof Date ? Utilities.formatDate(sDate, Session.getScriptTimeZone(), "yyyy-MM-dd") : "",
        dataStartuFormat: safeStr(sDate)
      });
    }

    return { miesiac: sheet.getName(), pracownicy: lista, stats: stats };
  } catch (e) { throw new Error(e.message); }
}

function dodajNowyMiesiacServer(obecnyMsc, nowyMsc) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    if (ss.getSheetByName(nowyMsc)) throw new Error("Arkusz o takiej nazwie już istnieje!");
    
    const sourceSheet = ss.getSheetByName(obecnyMsc);
    if (!sourceSheet) throw new Error("Nie znaleziono obecnego arkusza do skopiowania.");

    const newSheet = sourceSheet.copyTo(ss);
    newSheet.setName(nowyMsc);
    ss.setActiveSheet(newSheet);
    ss.moveActiveSheet(1);

    const miesiaceNazwy = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
    let mscIdx = new Date().getMonth();
    let rok = new Date().getFullYear();
    
    miesiaceNazwy.forEach((m, idx) => { 
        if(nowyMsc.toLowerCase().includes(m)) mscIdx = idx; 
    });
    
    const matchRok = nowyMsc.match(/\d{4}/);
    if(matchRok) rok = parseInt(matchRok[0]);
    
    let startNowegoMiesiaca = new Date(rok, mscIdx, 1);
    startNowegoMiesiaca.setHours(0, 0, 0, 0);

    const data = newSheet.getDataRange().getValues();
    let usunietych = 0;

    for (let i = data.length - 1; i >= 1; i--) {
        let imie = String(data[i][1]).trim();
        if(imie === "" || imie.toLowerCase().includes("legenda") || imie.toLowerCase().includes("zatrudnieni") || imie.toLowerCase().includes("świadectwa")) {
            continue; 
        }

        let rot = data[i][12];
        
        if (rot && String(rot) !== "-") {
             let rotDate = parsePlDate(rot);
             if (rotDate) {
                 rotDate.setHours(0, 0, 0, 0);
                 if (rotDate < startNowegoMiesiaca) {
                     newSheet.deleteRow(i + 1);
                     usunietych++;
                 }
             }
        }
    }

    const lastRowPoUsunieciu = newSheet.getLastRow();
    const lastCol = newSheet.getLastColumn();
    
    if (lastRowPoUsunieciu > 1 && lastCol >= 15) {
        newSheet.getRange(2, 15, lastRowPoUsunieciu - 1, lastCol - 14).clearContent();
    }

    return `Utworzono arkusz ${nowyMsc}. Usunięto ${usunietych} zrotowanych pracowników. Godziny z poprzedniego miesiąca zostały wyzerowane.`;
  } catch (e) { throw new Error(e.message); }
}

function dodajPracownikaMiesiacServer(dane, nazwaMiesiaca) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let sheet = ss.getSheetByName(nazwaMiesiaca) || ss.getSheets().find(s => s.getName().toLowerCase().includes(nazwaMiesiaca.toLowerCase()));
    if (!sheet) throw new Error("Brak arkusza na ten miesiąc!");

    const pelneImie = toTitleCase(dane.imie.trim());
    let dStartu = dane.dataStartu ? new Date(dane.dataStartu) : "";
    let dRotacji = dane.dataRotacji ? new Date(dane.dataRotacji) : "";

    let newRow = new Array(15).fill("");
    newRow[1] = pelneImie; 
    newRow[2] = dane.sap.trim(); 
    newRow[3] = dane.dzial.trim(); 
    newRow[4] = dane.telefon.trim(); 
    newRow[5] = dane.brygada.trim(); 
    if(dRotacji) newRow[12] = dRotacji; 

    sheet.appendRow(newRow);

    const sheetGlowne = ss.getSheetByName("Przedłużanie umów");
    if(sheetGlowne) {
       let glRow = new Array(15).fill("");
       glRow[0] = pelneImie;
       glRow[1] = dStartu; 
       glRow[2] = "Przed spotkaniem"; 
       glRow[5] = "Tygodniowa"; 
       glRow[8] = "Tygodniowa"; 
       glRow[11] = "Wystawić"; 
       sheetGlowne.appendRow(glRow);
    }

    return "Dodano pracownika do ewidencji.";
  } catch(e) { throw new Error(e.message); }
}

function edytujPracownikaMiesiacServer(stareImie, dane, nazwaMiesiaca) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let sheet = ss.getSheetByName(nazwaMiesiaca) || ss.getSheets().find(s => s.getName().toLowerCase().includes(nazwaMiesiaca.toLowerCase()));
    if (!sheet) throw new Error("Brak arkusza na ten miesiąc!");

    const pelneImie = toTitleCase(dane.imie.trim());
    let dStartu = dane.dataStartu ? new Date(dane.dataStartu) : "";
    let dRotacji = dane.dataRotacji ? new Date(dane.dataRotacji) : "";

    const dataM = sheet.getDataRange().getValues();
    for(let i = 1; i < dataM.length; i++) {
        if(isSamePerson(String(dataM[i][1]), stareImie)) {
            sheet.getRange(i+1, 2).setValue(pelneImie);
            sheet.getRange(i+1, 3).setValue(dane.sap.trim());
            sheet.getRange(i+1, 4).setValue(dane.dzial.trim());
            sheet.getRange(i+1, 5).setValue(dane.telefon.trim());
            sheet.getRange(i+1, 6).setValue(dane.brygada.trim());
            if(dRotacji) sheet.getRange(i+1, 13).setValue(dRotacji); 
            else sheet.getRange(i+1, 13).clearContent();
            break;
        }
    }

    const sheetGlowne = ss.getSheetByName("Przedłużanie umów");
    if(sheetGlowne) {
        const dataG = sheetGlowne.getDataRange().getValues();
        for(let i = 1; i < dataG.length; i++) {
            if(isSamePerson(String(dataG[i][0]), stareImie)) {
                sheetGlowne.getRange(i+1, 1).setValue(pelneImie);
                if(dStartu) sheetGlowne.getRange(i+1, 2).setValue(dStartu);
                break;
            }
        }
    }
    
    const sheetKarty = ss.getSheetByName("Karty");
    if(sheetKarty) {
        const dataK = sheetKarty.getDataRange().getValues();
        for(let i = 1; i < dataK.length; i++) {
            if(isSamePerson(String(dataK[i][1]), stareImie)) {
                sheetKarty.getRange(i+1, 2).setValue(pelneImie);
                break;
            }
        }
    }
    
    return "Dane pracownika zaktualizowane!";
  } catch(e) { throw new Error(e.message); }
}

function zapiszDateRotacjiServer(imie, dataStr, nazwaMiesiaca) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let sheet = ss.getSheetByName(nazwaMiesiaca) || ss.getSheets().find(s => s.getName().toLowerCase().includes(nazwaMiesiaca.toLowerCase()));
    if (!sheet) throw new Error("Brak arkusza na ten miesiąc!");

    const lastRow = Math.max(sheet.getLastRow(), 1);
    const lastCol = Math.max(sheet.getLastColumn(), 15);
    const data = sheet.getRange(1, 1, lastRow, lastCol).getValues(); 
    
    let valToSet = "";
    if (dataStr) {
       const [y, m, d] = dataStr.split('-');
       valToSet = new Date(y, m - 1, d);
    }

    for (let i = 1; i < data.length; i++) {
      if (isSamePerson(String(data[i][1]), imie)) {
        if(valToSet) sheet.getRange(i + 1, 13).setValue(valToSet); 
        else sheet.getRange(i + 1, 13).clearContent(); 
        return valToSet ? "Zapisano datę rotacji!" : "Usunięto datę rotacji (Pracownik zostaje).";
      }
    }
    throw new Error("Nie znaleziono pracownika w " + nazwaMiesiaca);
  } catch(e) { throw new Error(e.message); }
}

function dodajNotatkeUmowyServer(imie, tresc) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let maxTyg = -1; let latestTygSheet = null;
    ss.getSheets().forEach(s => {
       const match = s.getName().match(/Tydz\. (\d+)/);
       if(match) { const num = parseInt(match[1]); if (num > maxTyg) { maxTyg = num; latestTygSheet = s; } }
    });
    if(!latestTygSheet) throw new Error("Brak arkusza tygodniowego do zapisu notatki.");

    const data = latestTygSheet.getDataRange().getValues();
    const dzis = new Date();
    const dataStr = Utilities.formatDate(dzis, Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm");
    const nowyWpis = `[${dataStr}] ${tresc}`;

    for(let i = 1; i < data.length; i++) {
       if(isSamePerson(String(data[i][1]), imie)) {
           let obecne = String(data[i][8] || ""); 
           let doZapisu = obecne ? obecne + "\n" + nowyWpis : nowyWpis;
           latestTygSheet.getRange(i+1, 9).setValue(doZapisu);
           return "Notatka zapisana do arkusza tygodnia!";
       }
    }
    throw new Error("Nie znaleziono pracownika w najnowszym arkuszu Tygodnia.");
  } catch(e) { throw new Error(e.message); }
}

// =========================================================
// MODUŁ 2 - PRZEDŁUŻANIE UMÓW
// =========================================================
function pobierzBazePracownikow() {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    const historiaUmow = new Map();
    const arkusze = ss.getSheets();
    
    let maxTyg = -1; let latestTygSheet = null;

    arkusze.forEach(arkusz => {
      const nazwaArkusza = arkusz.getName();
      if (nazwaArkusza.startsWith("Tydz.")) {
        const match = nazwaArkusza.match(/Tydz\. (\d+)/);
        if(match) { const num = parseInt(match[1]); if (num > maxTyg) { maxTyg = num; latestTygSheet = arkusz; } }

        const daneTyg = arkusz.getDataRange().getValues();
        for (let i = 1; i < daneTyg.length; i++) {
          const imie = String(daneTyg[i][1] || "").trim();
          const klucz = normalizeName(imie);
          
          if (!imie || klucz.includes("nazwisk") || klucz === "imie") continue;
          
          const start = daneTyg[i][2];
          const koniec = daneTyg[i][3];
          
          let dStart = parsePlDate(start);
          let dKoniec = parsePlDate(koniec);
          
          if (dStart && !isNaN(dStart.getTime()) && dKoniec && !isNaN(dKoniec.getTime())) {
            const roznicaCzasu = Math.abs(dKoniec - dStart);
            const iloscDni = Math.ceil(roznicaCzasu / (1000 * 60 * 60 * 24)) + 1; 
            
            let typ = "Miesięczna";
            if (iloscDni <= 11) typ = "Tygodniowa";
            else if (iloscDni <= 20) typ = "2 Tygodniowa";
            
            if (!historiaUmow.has(klucz)) historiaUmow.set(klucz, { tyg: [], dwaTyg: [], mies: [] }); 
            
            const dataString = Utilities.formatDate(dStart, Session.getScriptTimeZone(), "dd.MM") + " - " + Utilities.formatDate(dKoniec, Session.getScriptTimeZone(), "dd.MM.yyyy");
            const historiaOsoby = historiaUmow.get(klucz);
            
            if (typ === "Tygodniowa" && !historiaOsoby.tyg.includes(dataString)) historiaOsoby.tyg.push(dataString);
            else if (typ === "2 Tygodniowa" && !historiaOsoby.dwaTyg.includes(dataString)) historiaOsoby.dwaTyg.push(dataString);
            else if (typ === "Miesięczna" && !historiaOsoby.mies.includes(dataString)) historiaOsoby.mies.push(dataString);
          }
        }
      }
    });

    const notatkiMap = new Map();
    if(latestTygSheet) {
       const dataTyg = latestTygSheet.getDataRange().getValues();
       for(let i = 1; i < dataTyg.length; i++) {
           const n = String(dataTyg[i][1]).trim();
           const klucz = normalizeName(n);
           if(!n || klucz.includes("nazwisk") || klucz === "imie") continue;
           notatkiMap.set(klucz, String(dataTyg[i][8] || "")); 
       }
    }

    const sheetGlowne = ss.getSheetByName("Przedłużanie umów");
    const data = sheetGlowne.getDataRange().getValues();
    if (data.length < 2) return { statystyki: { wszyscy: 0, wOnboardingu: 0, wdrozeni: 0 }, lista: [] };

    let wszyscy = 0, wOnboardingu = 0, wdrozeni = 0;
    let lista = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const imie = safeStr(row[0], "");
      const klucz = normalizeName(imie);
      
      if (!imie || imie === "-" || klucz.includes("nazwisk") || klucz === "imie") continue; 

      wszyscy++;
      const statusOnboardingu = safeStr(row[2], "Nie dotyczy");
      const stLower = statusOnboardingu.toLowerCase();
      
      if (stLower === "nie dotyczy" || statusOnboardingu === "-" || stLower.includes("po 2")) {
          wdrozeni++;
      } else {
          wOnboardingu++;
      }

      const historia = historiaUmow.get(klucz) || { tyg: [], dwaTyg: [], mies: [] };
      const rawKoniec = row[10] instanceof Date ? row[10].getTime() : 0; 
      const trwajacaOd = row[9] instanceof Date ? Utilities.formatDate(row[9], Session.getScriptTimeZone(), "yyyy-MM-dd") : "";
      const trwajacaDo = row[10] instanceof Date ? Utilities.formatDate(row[10], Session.getScriptTimeZone(), "yyyy-MM-dd") : "";

      lista.push({
        id: "pracownik_" + i,
        imie: imie,
        dataRozpoczecia: safeStr(row[1]),
        onboarding: statusOnboardingu,
        godziny: safeNum(row[3]),
        dni: safeNum(row[4]),
        aktualnaUmowa: safeStr(row[5]),
        l4: safeNum(row[6]),
        nn: safeNum(row[7]),
        propozycja: safeStr(row[8]),
        okresUmowy: `${safeStr(row[9])} - ${safeStr(row[10])}`,
        trwajacaOd: trwajacaOd,
        trwajacaDo: trwajacaDo,
        koniecUmowyRaw: rawKoniec,
        statusAkcji: safeStr(row[11]),
        historia: historia,
        notatki: notatkiMap.get(klucz) || ""
      });
    }

    return { statystyki: { wszyscy: wszyscy, wOnboardingu: wOnboardingu, wdrozeni: wdrozeni }, lista: lista };
  } catch (e) { throw new Error(e.message); }
}

function wgrajRaportIAktualizuj(daneRaport) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let sheetR = ss.getSheetByName("Raport");
    if (!sheetR) sheetR = ss.insertSheet("Raport");

    sheetR.clearContents();
    sheetR.getRange(1, 1, daneRaport.length, daneRaport[0].length).setValues(daneRaport);

    if (daneRaport.length < 2) return "Wgrano plik, ale jest pusty.";

    const wpisyRaportu = pobierzStatystykiZRaportu(daneRaport);

    const sheetPrzedluzanie = ss.getSheetByName("Przedłużanie umów");
    const dataP = sheetPrzedluzanie.getDataRange().getValues();
    const noweWartosci = []; 
    
    for (let i = 1; i < dataP.length; i++) {
      const row = dataP[i];
      const imieBaza = String(row[0]).trim();
      
      let s = { godz: 0, l4: 0, nn: 0 };
      
      wpisyRaportu.forEach(wpis => {
          if (isSamePerson(imieBaza, wpis.imie)) {
              s.godz += wpis.godz;
              s.l4 += wpis.l4;
              s.nn += wpis.nn;
          }
      });
      
      const przeliczDni = Math.round(s.godz / 8);
      const przeliczL4 = Math.round(s.l4 / 8);
      const przeliczNN = Math.round(s.nn / 8);

      const onboarding = String(row[2]).trim().toLowerCase();
      const currentType = String(row[5]).trim();
      const hasIssues = (przeliczL4 > 0 || przeliczNN > 0);
      let nowaPropozycja = "Tygodniowa";

      if (onboarding.includes("przed")) nowaPropozycja = "Tygodniowa";
      else if (hasIssues) nowaPropozycja = (currentType === "Miesięczna") ? "2 Tygodniowa" : "Tygodniowa";
      else if (onboarding.includes("po 1 spotkaniu")) nowaPropozycja = "2 Tygodniowa";
      else if (onboarding.includes("po 2 spotkaniu")) nowaPropozycja = "Miesięczna";
      else nowaPropozycja = (currentType === "Miesięczna" || currentType === "2 Tygodniowa") ? "Miesięczna" : "2 Tygodniowa";

      noweWartosci.push([s.godz, przeliczDni, row[5], przeliczL4, przeliczNN, nowaPropozycja, row[9], row[10], row[11]]);
    }
    
    if (noweWartosci.length > 0) {
        sheetPrzedluzanie.getRange(2, 4, noweWartosci.length, 9).setValues(noweWartosci);
    }

    return "Raport wgrany pomyślnie. Wyniki zaktualizowane.";
  } catch (e) { throw new Error(e.message); }
}

function zmienStatusOnboardinguServer(imie, nowyStatus) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    const sheet = ss.getSheetByName("Przedłużanie umów");
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (isSamePerson(String(data[i][0]), imie)) {
        sheet.getRange(i + 1, 3).setValue(nowyStatus);
        return "OK";
      }
    }
    throw new Error("Nie znaleziono pracownika.");
  } catch (e) { throw new Error(e.message); }
}

function wystawZbiorczoIGenerujTydzienServer(kolejkaUmow) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let max = -1; let latestSheet = null;
    
    const miesiacePL = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    let latestMonthSheet = null; let maxMscVal = -1;

    ss.getSheets().forEach(s => {
      let name = s.getName();
      const match = name.match(/Tydz\. (\d+)/);
      if(match) { const num = parseInt(match[1], 10); if (num > max) { max = num; latestSheet = s; } }
      
      let p = name.split(" ");
      if(p.length === 2 && miesiacePL.includes(p[0])) {
          let val = parseInt(p[1]) * 12 + miesiacePL.indexOf(p[0]);
          if(val > maxMscVal) { maxMscVal = val; latestMonthSheet = s; }
      } else if (miesiacePL.includes(name)) {
          let val = new Date().getFullYear() * 12 + miesiacePL.indexOf(name);
          if(val > maxMscVal) { maxMscVal = val; latestMonthSheet = s; }
      }
    });

    if (!latestSheet) throw new Error("Brak arkuszy Tydz.");
    
    let rotacje = new Map();
    if (latestMonthSheet) {
        const dataMsc = latestMonthSheet.getDataRange().getValues();
        for(let i=1; i<dataMsc.length; i++) {
            let imie = normalizeName(String(dataMsc[i][1]));
            let rot = dataMsc[i][12];
            if(imie && rot && rot !== "-") {
                let parsedRot = parsePlDate(rot);
                if(parsedRot) rotacje.set(imie, parsedRot);
            }
        }
    }
    
    const prevData = latestSheet.getDataRange().getValues();
    const headersLength = prevData[0].length;
    const dict = new Map();
    
    for(let i = 1; i < prevData.length; i++) {
       const name = String(prevData[i][1]).trim();
       const klucz = normalizeName(name);
       if(!name || klucz.includes("nazwisk") || klucz === "imie") continue;
       dict.set(klucz, prevData[i]);
    }
    
    const sheetGlowne = ss.getSheetByName("Przedłużanie umów");
    const dataG = sheetGlowne.getDataRange().getValues();
    const przedluzone = [], aktualne = [];
    
    for(let i = 1; i < dataG.length; i++) {
       const row = dataG[i];
       const imie = String(row[0]).trim();
       if(!imie) continue;
       
       let klucz = normalizeName(imie);
       let status = String(row[11]).trim(); 
       let dataOd = row[9];
       let dataDo = row[10];
       let dataZatrudnienia = row[1]; 
       
       if (kolejkaUmow[imie]) {
           const [y1, m1, d1] = kolejkaUmow[imie].od.split('-');
           dataOd = new Date(y1, m1 - 1, d1);
           const [y2, m2, d2] = kolejkaUmow[imie].do.split('-');
           dataDo = new Date(y2, m2 - 1, d2);
           status = "Aktualna";

           const oldRow = dict.get(klucz) || new Array(headersLength).fill("");
           const newRow = [...oldRow]; 
           newRow[1] = imie; newRow[2] = dataOd; newRow[3] = dataDo;
           newRow[7] = formatDataGS(dataZatrudnienia);

           przedluzone.push(newRow); 

           sheetGlowne.getRange(i + 1, 10).setValue(dataOd);
           sheetGlowne.getRange(i + 1, 11).setValue(dataDo);
           sheetGlowne.getRange(i + 1, 12).clearDataValidations().setValue(status);
       } 
       else if (status === "Wystawić" || status === "Aktualna") {
           const oldRow = dict.get(klucz);
           let newRow;
           if (oldRow) {
               newRow = [...oldRow]; 
               newRow[1] = imie; 
               if(dataOd instanceof Date) newRow[2] = dataOd;
               if(dataDo instanceof Date) newRow[3] = dataDo;
               newRow[7] = formatDataGS(dataZatrudnienia);
           } else {
               newRow = new Array(headersLength).fill("");
               newRow[1] = imie; newRow[2] = dataOd; newRow[3] = dataDo;
               newRow[7] = formatDataGS(dataZatrudnienia);
           }
           aktualne.push(newRow); 
       }
    }
    
    const newSheetName = "Tydz. " + (max + 1);
    let newSheet = ss.getSheetByName(newSheetName);
    if(newSheet) ss.deleteSheet(newSheet); 
    newSheet = latestSheet.copyTo(ss);
    newSheet.setName(newSheetName);
    const lastRow = newSheet.getLastRow();
    
    if (lastRow > 2) {
        newSheet.getRange(3, 1, lastRow - 2, headersLength).clearContent().setBackground("#ffffff");
    }
    
    const finalData = [...przedluzone, ...aktualne];
    if (finalData.length > 0) {
        newSheet.getRange(3, 1, finalData.length, headersLength).setValues(finalData);
        
        const backgrounds = [];
        for (let i = 0; i < finalData.length; i++) {
            let imieNorm = normalizeName(String(finalData[i][1]));
            let start = finalData[i][2]; 
            let koniec = finalData[i][3]; 
            let zatrudnienie = finalData[i][7];
            let color = "#ffffff"; 
            
            let dStart = parsePlDate(start);
            let dKoniec = parsePlDate(koniec);
            let dZatrudnienia = parsePlDate(zatrudnienie);
            let dRotacji = rotacje.get(imieNorm);

            if (dStart && dKoniec && !isNaN(dStart.getTime()) && !isNaN(dKoniec.getTime())) {
                const diffTime = Math.abs(dKoniec - dStart);
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                
                if (days >= 25) {
                    color = "#dad8f3"; // Miesięczna (jasnofioletowy)
                } else if (days > 10 && days <= 24) {
                    color = "#f4cccc"; // Do 3 tyg (jasnoczerwony 3)
                } else {
                    color = "#ffffff"; // Tygodniowa - max 10 dni (Biały)
                }

                if (dRotacji && dRotacji >= dStart && dRotacji <= dKoniec) {
                    color = "#ffff00"; 
                } else if (dZatrudnienia && dZatrudnienia >= dStart && dZatrudnienia <= dKoniec) {
                    color = "#d9efff"; 
                }
            }
            backgrounds.push([color, color, color, color]); 
        }
        newSheet.getRange(3, 2, backgrounds.length, 4).setBackgrounds(backgrounds);
    }
    
    return `Sukces! Arkusz <b>${newSheetName}</b> jest gotowy. Wystawiono umów: <b class="text-primary">${przedluzone.length}</b>.`;
  } catch (e) { throw new Error(e.message); }
}

function usunPracownikaZBazyUmowServer(imie) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    
    let maxTyg = -1; let latestTygSheet = null;
    ss.getSheets().forEach(s => {
       const match = s.getName().match(/Tydz\. (\d+)/);
       if(match) { const num = parseInt(match[1], 10); if (num > maxTyg) { maxTyg = num; latestTygSheet = s; } }
    });
    
    if (latestTygSheet) {
        const tygData = latestTygSheet.getDataRange().getValues();
        for (let i = 1; i < tygData.length; i++) {
            const name = String(tygData[i][1]).trim();
            if (isSamePerson(name, imie)) { 
                latestTygSheet.getRange(i + 1, 2, 1, 4).setBackground("#ffff00"); 
                break;
            }
        }
    }

    const sheet = ss.getSheetByName("Przedłużanie umów");
    if (!sheet) throw new Error("Brak arkusza Przedłużanie umów.");
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (isSamePerson(String(data[i][0]), imie)) {
        sheet.deleteRow(i + 1);
        return `Pomyślnie usunięto pracownika z Ewidencji. Oznaczono na żółto w arkuszu Tygodnia.`;
      }
    }
    throw new Error("Nie znaleziono pracownika w głównej bazie.");
  } catch (e) { throw new Error(e.message); }
}

function edytujTrwajacaUmoweServer(imie, odStr, doStr) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    const sheet = ss.getSheetByName("Przedłużanie umów");
    const data = sheet.getDataRange().getValues();
    
    let [y1, m1, d1] = odStr.split('-');
    let dateOd = new Date(y1, m1 - 1, d1);
    let [y2, m2, d2] = doStr.split('-');
    let dateDo = new Date(y2, m2 - 1, d2);

    for (let i = 1; i < data.length; i++) {
      if (isSamePerson(String(data[i][0]), imie)) {
        sheet.getRange(i + 1, 10).setValue(dateOd);
        sheet.getRange(i + 1, 11).setValue(dateDo);
        return "Zaktualizowano trwającą umowę w Głównej Bazie!";
      }
    }
    throw new Error("Nie znaleziono pracownika w bazie umów.");
  } catch(e) { throw new Error(e.message); }
}

function dodajDoNajnowszegoTygodniaServer(dane) {
   try {
       const ss = SpreadsheetApp.openById(ID_ARKUSZA); 
       const sheets = ss.getSheets();
       let maxTydz = -1;
       let latestSheet = null;
       
       sheets.forEach(s => {
          let name = s.getName();
          if(name.startsWith("Tydz.")) {
             let num = parseInt(name.replace(/[^\d]/g, ''));
             if(num > maxTydz) { maxTydz = num; latestSheet = s; }
          }
       });
       
       if(latestSheet) {
           let stanowisko = "Pracownik pomocniczy produkcji";
           let dzial = String(dane.dzial).toLowerCase();
           
           if(dzial.includes("ekstruzj")) {
               stanowisko = "Pracownik pomocniczy linii ekstruzji";
           } else if(dzial.includes("magazyn")) {
               stanowisko = "Pracownik Magazynu 2";
           }
           
           let formatStart = dane.dataStartu ? dane.dataStartu.split('-').reverse().join('.') : "";

           latestSheet.appendRow([
              dane.sap,          
              dane.imie,         
              formatStart,       
              "",                
              stanowisko,        
              "",                
              "",                
              formatStart,       
              ""                 
           ]);
           
           let lastR = latestSheet.getLastRow();
           latestSheet.getRange(lastR, 1, 1, 9).setBackground("#d9efff");
       }
       return "Dodano pracownika do arkusza tygodnia.";
   } catch(e) {
       throw new Error("Błąd dodawania do tygodnia: " + e.message);
   }
}

function synchronizujPelnySystemServer() {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA); 
    
    // KROK 1: Synchronizacja ID i Stanowisk
    const sheets = ss.getSheets();
    let maxTydz = -1;
    let latestSheet = null;
    
    sheets.forEach(s => {
      let name = s.getName();
      if(name.startsWith("Tydz.")) {
        let num = parseInt(name.replace(/[^\d]/g, ''));
        if(num > maxTydz) { maxTydz = num; latestSheet = s; }
      }
    });

    if (latestSheet) {
      let mapaPracownikow = {};
      const miesiacePL = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
      let latestMonthSheet = null;
      let maxMscVal = -1;
      
      sheets.forEach(s => {
          let name = s.getName();
          let p = name.split(" ");
          if(p.length === 2 && miesiacePL.includes(p[0])) {
              let val = parseInt(p[1]) * 12 + miesiacePL.indexOf(p[0]);
              if(val > maxMscVal) { maxMscVal = val; latestMonthSheet = s; }
          } else if (miesiacePL.includes(name)) {
              let val = new Date().getFullYear() * 12 + miesiacePL.indexOf(name);
              if(val > maxMscVal) { maxMscVal = val; latestMonthSheet = s; }
          }
      });

      let rotacje = new Map();
      if (latestMonthSheet) {
        const dataMsc = latestMonthSheet.getDataRange().getValues();
        for (let i = 1; i < dataMsc.length; i++) {
          let imie = normalizeName(String(dataMsc[i][1] || "")); 
          let sap = String(dataMsc[i][2] || "").trim(); 
          let dzial = String(dataMsc[i][3] || "").trim().toLowerCase(); 
          let rot = dataMsc[i][12];
          
          if (imie && sap) {
            let stanowisko = "Pracownik pomocniczy produkcji";
            if (dzial.includes("ekstruzj")) stanowisko = "Pracownik pomocniczy linii ekstruzji";
            else if (dzial.includes("magazyn")) stanowisko = "Pracownik Magazynu 2";
            mapaPracownikow[imie] = { sap: sap, stanowisko: stanowisko };
          }
          if (imie && rot && rot !== "-") {
              let parsedRot = parsePlDate(rot);
              if(parsedRot) rotacje.set(imie, parsedRot);
          }
        }
      }

      let mapaUmow = {};
      const sheetUmowy = ss.getSheetByName(NAZWA_ARKUSZA_PRZEDLUZANIE);
      if(sheetUmowy) {
         const uData = sheetUmowy.getDataRange().getValues();
         for(let i=1; i<uData.length; i++) {
             let imie = normalizeName(String(uData[i][0] || ""));
             let dStartu = uData[i][1]; 
             let dOd = uData[i][9]; 
             let dDo = uData[i][10]; 
             if(imie) mapaUmow[imie] = { start: dStartu, od: dOd, do: dDo };
         }
      }

      const lr = latestSheet.getLastRow();
      if (lr >= 3) {
        const range = latestSheet.getRange(3, 1, lr - 2, 9);
        const dataTydz = range.getValues();
        const backgrounds = []; 

        for (let i = 0; i < dataTydz.length; i++) {
          let row = dataTydz[i];
          let imie = normalizeName(String(row[1] || ""));
          
          if(!imie || imie.includes("nazwisk") || imie === "imie") {
             backgrounds.push(["#ffffff", "#ffffff", "#ffffff", "#ffffff"]);
             continue;
          }
          
          if (mapaPracownikow[imie]) {
             row[0] = mapaPracownikow[imie].sap; 
             row[4] = mapaPracownikow[imie].stanowisko; 
          }

          if (mapaUmow[imie]) {
             if(mapaUmow[imie].od) row[2] = formatDataGS(mapaUmow[imie].od);
             if(mapaUmow[imie].do) row[3] = formatDataGS(mapaUmow[imie].do);
             if(mapaUmow[imie].start) row[7] = formatDataGS(mapaUmow[imie].start);
          }

          let start = row[2];
          let koniec = row[3];
          let zatrudnienie = row[7];
          let color = "#ffffff"; 
          
          let dStart = parsePlDate(start);
          let dKoniec = parsePlDate(koniec);
          let dZatrudnienia = parsePlDate(zatrudnienie);
          let dRotacji = rotacje.get(imie);

          if (dStart && dKoniec && !isNaN(dStart.getTime()) && !isNaN(dKoniec.getTime())) {
              const diffTime = Math.abs(dKoniec - dStart);
              const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              if (days >= 25) color = "#dad8f3"; 
              else if (days > 10 && days <= 24) color = "#f4cccc"; 

              if (dRotacji && dRotacji >= dStart && dRotacji <= dKoniec) {
                  color = "#ffff00"; 
              } else if (dZatrudnienia && dZatrudnienia >= dStart && dZatrudnienia <= dKoniec) {
                  color = "#d9efff"; 
              }
          }
          backgrounds.push([color, color, color, color]); 
        }
        range.setValues(dataTydz);
        latestSheet.getRange(3, 2, backgrounds.length, 4).setBackgrounds(backgrounds);
      }
    }

    dodajNowychPracownikowSkrypt(ss);
    aktualizujDatyZNajnowszegoTygodniaSkrypt(ss);
    aktualizujDaneZRaportuSkrypt(ss);
    aktualizujAktualnaUmowaSkrypt(ss); 
    okreslTrybUmowySkrypt(ss);        
    aktualizujStatusUmowySkrypt(ss);

    return "Zaktualizowano daty, ID, frekwencje i statusy umów.";
  } catch (e) {
    throw new Error("Błąd podczas pełnej synchronizacji: " + e.message);
  }
}

function dodajNowychPracownikowSkrypt(ss) {
  const arkuszRaport = ss.getSheetByName(NAZWA_ARKUSZA_RAPORT);
  const arkuszPrzedl = ss.getSheetByName(NAZWA_ARKUSZA_PRZEDLUZANIE);
  if (!arkuszPrzedl) return;

  const wpisyRaportu = []; 
  if (arkuszRaport) {
      const daneRaport = arkuszRaport.getDataRange().getValues();
      if (daneRaport.length > 1) {
          wpisyRaportu.push(...pobierzStatystykiZRaportu(daneRaport));
      }
  }

  const arkuszTydzien = znajdzNajnowszyTydzien(ss);
  const mapaDat = new Map();
  const usunieci = new Set(); 
  
  if (arkuszTydzien) {
    const range = arkuszTydzien.getDataRange();
    const daneTydzien = range.getValues();
    const tloTydzien = range.getBackgrounds();
    
    for (let i = 1; i < daneTydzien.length; i++) {
      if (daneTydzien[i][KOL_TYDZIEN_IMIE]) {
        const imieOryginal = String(daneTydzien[i][KOL_TYDZIEN_IMIE]).trim();
        const klucz = normalizeName(imieOryginal);
        
        if (klucz.includes("nazwisk") || klucz === "imie") continue;
        
        const bgColor = String(tloTydzien[i][KOL_TYDZIEN_IMIE]).toLowerCase();
        
        if (bgColor === '#ffff00') {
           usunieci.add(klucz);
        } else {
           mapaDat.set(klucz, {
             imieOryginal: imieOryginal,
             start: daneTydzien[i][KOL_TYDZIEN_START],
             end: daneTydzien[i][KOL_TYDZIEN_KONIEC],
             zatrudnienie: daneTydzien[i][KOL_TYDZIEN_ZATRUDNIENIE]
           });
        }
      }
    }
  }

  const lastRowPrzedl = Math.max(arkuszPrzedl.getLastRow(), 1);
  const obecni = new Set();
  if (lastRowPrzedl > 1) {
    const daneObecni = arkuszPrzedl.getRange(2, KOL_PRZEDL_IMIE + 1, lastRowPrzedl - 1, 1).getValues();
    daneObecni.forEach(r => { if(r[0]) obecni.add(normalizeName(String(r[0]))); });
  }

  const noweWiersze = [];
  
  mapaDat.forEach((d, kluczImie) => {
     if (!obecni.has(kluczImie) && !usunieci.has(kluczImie)) {
        const status = checkStatus(d.end) || "Wystawić";
        const aktualna = checkUmowaType(d.start, d.end);
        
        let rGodz = 0, rL4 = 0, rNN = 0;
        
        wpisyRaportu.forEach(wpis => {
            if (isSamePerson(d.imieOryginal, wpis.imie)) {
                rGodz += wpis.godz;
                rL4 += wpis.l4;
                rNN += wpis.nn;
            }
        });
        
        const wiersz = new Array(15).fill("");
        wiersz[KOL_PRZEDL_IMIE] = d.imieOryginal;
        wiersz[KOL_PRZEDL_DATA_START] = d.zatrudnienie || ""; 
        wiersz[KOL_PRZEDL_ONBOARDING] = "Przed spotkaniem";
        wiersz[KOL_PRZEDL_GODZINY] = rGodz;
        wiersz[KOL_PRZEDL_DNI] = Math.round(rGodz / 8);
        wiersz[KOL_PRZEDL_AKTUALNA] = aktualna;
        wiersz[KOL_PRZEDL_L4] = Math.round(rL4 / 8);
        wiersz[KOL_PRZEDL_NN] = Math.round(rL4 / 8);
        wiersz[KOL_PRZEDL_POCZATEK] = d.start || "";
        wiersz[KOL_PRZEDL_KONIEC] = d.end || "";
        wiersz[KOL_PRZEDL_STATUS] = status;
        wiersz[KOL_PRZEDL_TRYB] = "Tygodniowa";
        wiersz[KOL_PRZEDL_LICZNIK_TYG] = "";
        wiersz[KOL_PRZEDL_LICZNIK_2TYG] = "";

        noweWiersze.push(wiersz);
        obecni.add(kluczImie); 
     }
  });

  if (noweWiersze.length > 0) {
    arkuszPrzedl.getRange(lastRowPrzedl + 1, 1, noweWiersze.length, 15).setValues(noweWiersze);
  }
}

function aktualizujDatyZNajnowszegoTygodniaSkrypt(ss) {
  const arkuszTydzien = znajdzNajnowszyTydzien(ss);
  if (!arkuszTydzien) return;

  const daneTydzien = arkuszTydzien.getDataRange().getValues();
  const mapaDat = new Map();
  for (let i = 1; i < daneTydzien.length; i++) {
    if (daneTydzien[i][KOL_TYDZIEN_IMIE]) {
      const imieTyg = String(daneTydzien[i][KOL_TYDZIEN_IMIE]).trim();
      const klucz = normalizeName(imieTyg);
      
      if (klucz.includes("nazwisk") || klucz === "imie") continue;

      mapaDat.set(klucz, {
        start: daneTydzien[i][KOL_TYDZIEN_START],
        end: daneTydzien[i][KOL_TYDZIEN_KONIEC],
        zatrudnienie: daneTydzien[i][KOL_TYDZIEN_ZATRUDNIENIE]
      });
    }
  }

  const sheet = ss.getSheetByName(NAZWA_ARKUSZA_PRZEDLUZANIE);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const imie = normalizeName(String(data[i][KOL_PRZEDL_IMIE]));
    if (mapaDat.has(imie)) {
      const d = mapaDat.get(imie);
      if (!data[i][KOL_PRZEDL_DATA_START] && d.zatrudnienie) {
        sheet.getRange(i+1, KOL_PRZEDL_DATA_START + 1).setValue(d.zatrudnienie);
      }
      if (d.start && d.end) {
        sheet.getRange(i+1, KOL_PRZEDL_POCZATEK + 1).setValue(new Date(d.start));
        sheet.getRange(i+1, KOL_PRZEDL_KONIEC + 1).setValue(new Date(d.end));
      }
    }
  }
}

function aktualizujDaneZRaportuSkrypt(ss) {
  const arkuszRaport = ss.getSheetByName(NAZWA_ARKUSZA_RAPORT);
  const arkuszPrzedl = ss.getSheetByName(NAZWA_ARKUSZA_PRZEDLUZANIE);
  if (!arkuszRaport || !arkuszPrzedl) return;
  
  const daneRaport = arkuszRaport.getDataRange().getValues();
  if(daneRaport.length < 2) return;

  const wpisyRaportu = pobierzStatystykiZRaportu(daneRaport);

  const data = arkuszPrzedl.getDataRange().getValues();
  const outG = [], outD = [], outL = [], outN = [];

  for (let i = 1; i < data.length; i++) {
    const imieBaza = String(data[i][KOL_PRZEDL_IMIE]).trim();
    let s = {godz:0, l4:0, nn:0};
    
    wpisyRaportu.forEach(wpis => {
        if (isSamePerson(imieBaza, wpis.imie)) {
            s.godz += wpis.godz;
            s.l4 += wpis.l4;
            s.nn += wpis.nn;
        }
    });

    outG.push([s.godz]);
    outD.push([Math.round(s.godz/8)]);
    outL.push([Math.round(s.l4/8)]);
    outN.push([Math.round(s.nn/8)]);
  }
  
  if (outG.length > 0) {
    arkuszPrzedl.getRange(2, KOL_PRZEDL_GODZINY+1, outG.length).setValues(outG);
    arkuszPrzedl.getRange(2, KOL_PRZEDL_DNI+1, outD.length).setValues(outD);
    arkuszPrzedl.getRange(2, KOL_PRZEDL_L4+1, outL.length).setValues(outL);
    arkuszPrzedl.getRange(2, KOL_PRZEDL_NN+1, outN.length).setValues(outN);
  }
}

function aktualizujAktualnaUmowaSkrypt(ss) {
  const sheet = ss.getSheetByName(NAZWA_ARKUSZA_PRZEDLUZANIE);
  const data = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < data.length; i++) {
    out.push([checkUmowaType(data[i][KOL_PRZEDL_POCZATEK], data[i][KOL_PRZEDL_KONIEC])]);
  }
  if (out.length > 0) {
    sheet.getRange(2, KOL_PRZEDL_AKTUALNA + 1, out.length, 1).setValues(out);
  }
}

function okreslTrybUmowySkrypt(ss) {
  const sheet = ss.getSheetByName(NAZWA_ARKUSZA_PRZEDLUZANIE);
  const lastCol = Math.max(sheet.getLastColumn(), 15); 
  const data = sheet.getRange(1, 1, sheet.getLastRow(), lastCol).getValues();
  
  const outProposal = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const onboarding = String(row[KOL_PRZEDL_ONBOARDING]).trim().toLowerCase();
    const currentType = String(row[KOL_PRZEDL_AKTUALNA]).trim();
    const l4 = Number(row[KOL_PRZEDL_L4]) || 0;
    const nn = Number(row[KOL_PRZEDL_NN]) || 0;
    const hasIssues = (l4 > 0 || nn > 0);

    let countWeekly = parseInt(row[KOL_PRZEDL_LICZNIK_TYG]) || 0;
    let count2Weekly = parseInt(row[KOL_PRZEDL_LICZNIK_2TYG]) || 0;

    let proposal = "Tygodniowa"; 

    if (onboarding.includes("przed")) proposal = "Tygodniowa";
    else if (hasIssues) proposal = (currentType === "Miesięczna") ? "2 Tygodniowa" : "Tygodniowa";
    else if (onboarding.includes("po 1 spotkaniu")) proposal = "2 Tygodniowa";
    else if (onboarding.includes("po 2 spotkaniu")) proposal = "Miesięczna";
    else {
      if (currentType === "Tygodniowa") proposal = (countWeekly >= 4) ? "2 Tygodniowa" : "Tygodniowa";
      else if (currentType === "2 Tygodniowa") proposal = (count2Weekly >= 4) ? "Miesięczna" : "2 Tygodniowa";
      else if (currentType === "Miesięczna") proposal = "Miesięczna";
      else proposal = "Tygodniowa";
    }
    outProposal.push([proposal]);
  }

  if (outProposal.length > 0) {
    sheet.getRange(2, KOL_PRZEDL_TRYB + 1, outProposal.length, 1).setValues(outProposal);
  }
}

function aktualizujStatusUmowySkrypt(ss) {
  const sheet = ss.getSheetByName(NAZWA_ARKUSZA_PRZEDLUZANIE);
  const data = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < data.length; i++) {
    out.push([checkStatus(data[i][KOL_PRZEDL_KONIEC])]);
  }
  if (out.length > 0) {
    sheet.getRange(2, KOL_PRZEDL_STATUS + 1, out.length, 1).setValues(out);
  }
}

function checkUmowaType(start, end) {
  if (!start || !end) return "";
  const s = new Date(start); 
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return "";
  const diffTime = Math.abs(e - s);
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  if (days <= 11) return "Tygodniowa";
  if (days <= 20) return "2 Tygodniowa"; 
  return "Miesięczna"; 
}

function checkStatus(endDate) {
  if (!endDate) return "";
  const end = new Date(endDate);
  if (isNaN(end.getTime())) return "";
  const today = new Date(); 
  today.setHours(0,0,0,0); 
  end.setHours(0,0,0,0);
  const diff = (end - today) / (1000 * 60 * 60 * 24);
  return (diff <= 2) ? "Wystawić" : "Aktualna";
}

function znajdzNajnowszyTydzien(ss) {
  const arkusze = ss.getSheets();
  let max = -1; let target = null;
  arkusze.forEach(s => {
    if (s.getName().startsWith(PREFIX_ARKUSZA_TYGODNIOWEGO)) {
      const num = parseInt(s.getName().replace(/\D/g, ''), 10);
      if (num > max) { max = num; target = s; }
    }
  });
  return target;
}

function dodajZbiorczoDoAktualnegoTygodniaServer(kolejkaUmow) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    let max = -1; let latestSheet = null;
    ss.getSheets().forEach(s => {
      let name = s.getName();
      const match = name.match(/Tydz\. (\d+)/);
      if(match) { const num = parseInt(match[1], 10); if (num > max) { max = num; latestSheet = s; } }
    });

    if (!latestSheet) throw new Error("Brak arkuszy Tydz. Nie ma do czego dodać.");

    const sheetGlowne = ss.getSheetByName("Przedłużanie umów");
    if (!sheetGlowne) throw new Error("Brak arkusza Przedłużanie umów.");
    const dataG = sheetGlowne.getDataRange().getValues();

    const prevData = latestSheet.getDataRange().getValues();
    const headersLength = prevData[0].length;
    const dictTyg = new Map();
    for(let i = 1; i < prevData.length; i++) {
       const name = String(prevData[i][1]).trim();
       const klucz = normalizeName(name);
       if(name) dictTyg.set(klucz, i + 1); 
    }

    let dodano = 0, zaktualizowano = 0;

    for(let i = 1; i < dataG.length; i++) {
       const row = dataG[i];
       const imie = String(row[0]).trim();
       if(!imie || !kolejkaUmow[imie]) continue;

       let klucz = normalizeName(imie);
       let dataZatrudnienia = row[1]; 
       const [y1, m1, d1] = kolejkaUmow[imie].od.split('-');
       const dataOd = new Date(y1, m1 - 1, d1);
       const [y2, m2, d2] = kolejkaUmow[imie].do.split('-');
       const dataDo = new Date(y2, m2 - 1, d2);

       sheetGlowne.getRange(i + 1, 10).setValue(dataOd);
       sheetGlowne.getRange(i + 1, 11).setValue(dataDo);
       sheetGlowne.getRange(i + 1, 12).clearDataValidations().setValue("Aktualna");

       if (dictTyg.has(klucz)) {
           let rIdx = dictTyg.get(klucz);
           latestSheet.getRange(rIdx, 3).setValue(dataOd); 
           latestSheet.getRange(rIdx, 4).setValue(dataDo); 
           latestSheet.getRange(rIdx, 2, 1, 3).setBackground("#d9efff"); 
           zaktualizowano++;
       } else {
           let newRow = new Array(headersLength).fill("");
           newRow[1] = imie; newRow[2] = dataOd; newRow[3] = dataDo;
           newRow[4] = "Pracownik pomocniczy produkcji"; newRow[7] = formatDataGS(dataZatrudnienia);
           latestSheet.appendRow(newRow);
           let lastRowIdx = latestSheet.getLastRow();
           latestSheet.getRange(lastRowIdx, 1, 1, headersLength).setBackground("#d9efff"); 
           dodano++;
       }
    }
    return `Gotowe! Zmodyfikowano arkusz ${latestSheet.getName()}. Dodano: ${dodano}, Zaktualizowano daty: ${zaktualizowano}.`;
  } catch (e) { throw new Error(e.message); }
}

function przywrocPracownikaServer(imie, nowaDataStartu, nazwaMiesiaca, nowyNumerKarty) {
  try {
    const ss = SpreadsheetApp.openById(ID_ARKUSZA);
    const pelneImie = toTitleCase(imie);
    const dStartu = new Date(nowaDataStartu);

    let sap = "", dzial = "", telefon = "", brygada = "";
    
    const sheetKarty = ss.getSheetByName("Karty");
    if(sheetKarty) {
        const dataK = sheetKarty.getDataRange().getValues();
        for(let i=1; i<dataK.length; i++) {
            if(isSamePerson(String(dataK[i][1]), imie)) {
                sheetKarty.getRange(i+1, 3).setValue(nowyNumerKarty);
                sheetKarty.getRange(i+1, 5).setValue("Aktywowana");
                sheetKarty.getRange(i+1, 6).setValue("");
                dzial = String(dataK[i][3]).trim();
                break;
            }
        }
    }

    const sheetUmowy = ss.getSheetByName("Przedłużanie umów");
    if(sheetUmowy) {
        let pracownikBylWUmowach = false;
        const dataU = sheetUmowy.getDataRange().getValues();
        for(let i=1; i<dataU.length; i++) {
            if(isSamePerson(String(dataU[i][0]), imie)) {
                pracownikBylWUmowach = true;
                sap = String(dataU[i][2]).trim();
                telefon = String(dataU[i][4]).trim();
                brygada = String(dataU[i][5]).trim();
                
                sheetUmowy.getRange(i+1, 2).setValue(dStartu); 
                sheetUmowy.getRange(i+1, 3).setValue("Przed spotkaniem"); 
                sheetUmowy.getRange(i+1, 4, 1, 9).setValues([["", "", "Tygodniowa", "", "", "Tygodniowa", "", "", "Wystawić"]]);
                break;
            }
        }
        if(!pracownikBylWUmowach) {
            let glRow = new Array(15).fill("");
            glRow[0] = pelneImie; glRow[1] = dStartu; glRow[2] = "Przed spotkaniem"; 
            glRow[5] = "Tygodniowa"; glRow[8] = "Tygodniowa"; glRow[11] = "Wystawić"; 
            sheetUmowy.appendRow(glRow);
        }
    }

    let sheetMsc = ss.getSheetByName(nazwaMiesiaca) || ss.getSheets().find(s => s.getName().toLowerCase().includes(nazwaMiesiaca.toLowerCase()));
    if(sheetMsc) {
        const dataM = sheetMsc.getDataRange().getValues();
        let jestWMiesiacu = false;
        for(let i=1; i<dataM.length; i++) {
            if(isSamePerson(String(dataM[i][1]), imie)) {
                sheetMsc.getRange(i+1, 13).clearContent(); 
                sap = String(dataM[i][2]).trim() || sap;
                telefon = String(dataM[i][4]).trim() || telefon;
                brygada = String(dataM[i][5]).trim() || brygada;
                jestWMiesiacu = true;
                break;
            }
        }
        if(!jestWMiesiacu) {
            let newRow = new Array(15).fill("");
            newRow[1] = pelneImie; newRow[2] = sap; newRow[3] = dzial; 
            newRow[4] = telefon; newRow[5] = brygada; 
            sheetMsc.appendRow(newRow);
        }
    }

    dodajDoNajnowszegoTygodniaServer({ sap: sap, imie: pelneImie, dataStartu: nowaDataStartu, dzial: dzial });
    return "Pomyślnie przywrócono do pracy! Przypisano kartę nr: " + nowyNumerKarty;
  } catch(e) { throw new Error(e.message); }
}

function formatDataGS(dateVal) { return dateVal instanceof Date ? Utilities.formatDate(dateVal, Session.getScriptTimeZone(), "dd.MM.yyyy") : String(dateVal).trim(); }
function pobierzKartySzufladaServer() { let k = PropertiesService.getScriptProperties().getProperty('KARTY_SZUFLADA'); return k ? JSON.parse(k) : null; }
function zapiszKartySzufladaServer(noweKarty) { PropertiesService.getScriptProperties().setProperty('KARTY_SZUFLADA', JSON.stringify(noweKarty)); return "Zaktualizowano listę kart w biurze."; }
