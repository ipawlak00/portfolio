/**
 * ================================================================================================
 * ENTERPRISE HR SYSTEM
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


function safeStr(val, fallback = "-") {
  if (val instanceof Error) return fallback;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return fallback;
    return new Date(val).toLocaleDateString('pl-PL');
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

// MOCK DATA STORE
let MOCK_DATA = {
  "Karty": [
    [
      "Nr Wewnętrzny",
      "Imię i nazwisko",
      "Numer Karty",
      "Dział",
      "Aktywacja",
      "Zwrot"
    ],
    [
      "5801",
      "Piotr Nowak",
      "1007",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5802",
      "Jan Wiśniewski",
      "1014",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5803",
      "Katarzyna Wójcik",
      "1021",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5804",
      "Michał Kowalczyk",
      "1028",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5805",
      "Agnieszka Kaczmarek",
      "1035",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5806",
      "Tomasz Zieliński",
      "1042",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5807",
      "Magdalena Szymańska",
      "1049",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5808",
      "Krzysztof Dąbrowski",
      "1056",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5809",
      "Barbara Kozłowski",
      "1063",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5810",
      "Marek Jankowski",
      "1070",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5811",
      "Ewa Mazur",
      "1077",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5812",
      "Grzegorz Kwiatkowski",
      "1084",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5813",
      "Krystyna Krawczyk",
      "1091",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5814",
      "Wojciech Kaczmarczyk",
      "1098",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5815",
      "Elżbieta Kowalska",
      "1105",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5816",
      "Anna Nowak",
      "1112",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5817",
      "Piotr Wiśniewski",
      "1119",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5818",
      "Jan Wójcik",
      "1126",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5819",
      "Katarzyna Kowalczyk",
      "1133",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5820",
      "Michał Kaczmarek",
      "1140",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5821",
      "Agnieszka Zieliński",
      "1147",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5822",
      "Tomasz Szymańska",
      "1154",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5823",
      "Magdalena Dąbrowski",
      "1161",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5824",
      "Krzysztof Kozłowski",
      "1168",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5825",
      "Barbara Jankowski",
      "1175",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5826",
      "Marek Mazur",
      "1182",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5827",
      "Ewa Kwiatkowski",
      "1189",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5828",
      "Grzegorz Krawczyk",
      "1196",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5829",
      "Krystyna Kaczmarczyk",
      "1203",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5830",
      "Wojciech Kowalska",
      "1210",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5831",
      "Elżbieta Nowak",
      "1217",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5832",
      "Anna Wiśniewski",
      "1224",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5833",
      "Piotr Wójcik",
      "1231",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5834",
      "Jan Kowalczyk",
      "1238",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5835",
      "Katarzyna Kaczmarek",
      "1245",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5836",
      "Michał Zieliński",
      "1252",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5837",
      "Agnieszka Szymańska",
      "1259",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5838",
      "Tomasz Dąbrowski",
      "1266",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5839",
      "Magdalena Kozłowski",
      "1273",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5840",
      "Krzysztof Jankowski",
      "1280",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5841",
      "Barbara Mazur",
      "1287",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5842",
      "Marek Kwiatkowski",
      "1294",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5843",
      "Ewa Krawczyk",
      "1301",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5844",
      "Grzegorz Kaczmarczyk",
      "1308",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5845",
      "Krystyna Kowalska",
      "1315",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5846",
      "Wojciech Nowak",
      "1322",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5847",
      "Elżbieta Wiśniewski",
      "1329",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5848",
      "Anna Wójcik",
      "1336",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5849",
      "Piotr Kowalczyk",
      "1343",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5850",
      "Jan Kaczmarek",
      "1350",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5851",
      "Katarzyna Zieliński",
      "1357",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5852",
      "Michał Szymańska",
      "1364",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5853",
      "Agnieszka Dąbrowski",
      "1371",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5854",
      "Tomasz Kozłowski",
      "1378",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5855",
      "Magdalena Jankowski",
      "1385",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ],
    [
      "5856",
      "Krzysztof Mazur",
      "1392",
      "Magazyn",
      "Aktywowana",
      ""
    ],
    [
      "5857",
      "Barbara Kwiatkowski",
      "1399",
      "Jakość",
      "Aktywowana",
      ""
    ],
    [
      "5858",
      "Marek Krawczyk",
      "1406",
      "Montaż",
      "Aktywowana",
      ""
    ],
    [
      "5859",
      "Ewa Kaczmarczyk",
      "1413",
      "Pakowanie",
      "Aktywowana",
      ""
    ],
    [
      "5860",
      "Grzegorz Kowalska",
      "1420",
      "Produkcja",
      "Aktywowana",
      "Tak"
    ]
  ],
  "Czerwiec 2026": [
    [
      "Lp",
      "Imię i Nazwisko",
      "SAP",
      "Dział",
      "Telefon",
      "Brygada",
      "Puste1",
      "Puste2",
      "Puste3",
      "Puste4",
      "Puste5",
      "Puste6",
      "Data Rotacji",
      "Puste8",
      "Puste9"
    ],
    [
      "1",
      "Piotr Nowak",
      "10000001",
      "Magazyn",
      "50000001",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "2",
      "Jan Wiśniewski",
      "10000002",
      "Jakość",
      "50000002",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "3",
      "Katarzyna Wójcik",
      "10000003",
      "Montaż",
      "50000003",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "4",
      "Michał Kowalczyk",
      "10000004",
      "Pakowanie",
      "50000004",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "5",
      "Agnieszka Kaczmarek",
      "10000005",
      "Produkcja",
      "50000005",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "6",
      "Tomasz Zieliński",
      "10000006",
      "Magazyn",
      "50000006",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "7",
      "Magdalena Szymańska",
      "10000007",
      "Jakość",
      "50000007",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "8",
      "Krzysztof Dąbrowski",
      "10000008",
      "Montaż",
      "50000008",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "9",
      "Barbara Kozłowski",
      "10000009",
      "Pakowanie",
      "50000009",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "10",
      "Marek Jankowski",
      "10000010",
      "Produkcja",
      "50000010",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "15.06.2026",
      "",
      ""
    ],
    [
      "11",
      "Ewa Mazur",
      "10000011",
      "Magazyn",
      "50000011",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "12",
      "Grzegorz Kwiatkowski",
      "10000012",
      "Jakość",
      "50000012",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "13",
      "Krystyna Krawczyk",
      "10000013",
      "Montaż",
      "50000013",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "14",
      "Wojciech Kaczmarczyk",
      "10000014",
      "Pakowanie",
      "50000014",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "15",
      "Elżbieta Kowalska",
      "10000015",
      "Produkcja",
      "50000015",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "16",
      "Anna Nowak",
      "10000016",
      "Magazyn",
      "50000016",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "17",
      "Piotr Wiśniewski",
      "10000017",
      "Jakość",
      "50000017",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "18",
      "Jan Wójcik",
      "10000018",
      "Montaż",
      "50000018",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "19",
      "Katarzyna Kowalczyk",
      "10000019",
      "Pakowanie",
      "50000019",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "20",
      "Michał Kaczmarek",
      "10000020",
      "Produkcja",
      "50000020",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "15.06.2026",
      "",
      ""
    ],
    [
      "21",
      "Agnieszka Zieliński",
      "10000021",
      "Magazyn",
      "50000021",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "22",
      "Tomasz Szymańska",
      "10000022",
      "Jakość",
      "50000022",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "23",
      "Magdalena Dąbrowski",
      "10000023",
      "Montaż",
      "50000023",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "24",
      "Krzysztof Kozłowski",
      "10000024",
      "Pakowanie",
      "50000024",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "25",
      "Barbara Jankowski",
      "10000025",
      "Produkcja",
      "50000025",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "26",
      "Marek Mazur",
      "10000026",
      "Magazyn",
      "50000026",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "27",
      "Ewa Kwiatkowski",
      "10000027",
      "Jakość",
      "50000027",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "28",
      "Grzegorz Krawczyk",
      "10000028",
      "Montaż",
      "50000028",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "29",
      "Krystyna Kaczmarczyk",
      "10000029",
      "Pakowanie",
      "50000029",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "30",
      "Wojciech Kowalska",
      "10000030",
      "Produkcja",
      "50000030",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "15.06.2026",
      "",
      ""
    ],
    [
      "31",
      "Elżbieta Nowak",
      "10000031",
      "Magazyn",
      "50000031",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "32",
      "Anna Wiśniewski",
      "10000032",
      "Jakość",
      "50000032",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "33",
      "Piotr Wójcik",
      "10000033",
      "Montaż",
      "50000033",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "34",
      "Jan Kowalczyk",
      "10000034",
      "Pakowanie",
      "50000034",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "35",
      "Katarzyna Kaczmarek",
      "10000035",
      "Produkcja",
      "50000035",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "36",
      "Michał Zieliński",
      "10000036",
      "Magazyn",
      "50000036",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "37",
      "Agnieszka Szymańska",
      "10000037",
      "Jakość",
      "50000037",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "38",
      "Tomasz Dąbrowski",
      "10000038",
      "Montaż",
      "50000038",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "39",
      "Magdalena Kozłowski",
      "10000039",
      "Pakowanie",
      "50000039",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "40",
      "Krzysztof Jankowski",
      "10000040",
      "Produkcja",
      "50000040",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "15.06.2026",
      "",
      ""
    ],
    [
      "41",
      "Barbara Mazur",
      "10000041",
      "Magazyn",
      "50000041",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "42",
      "Marek Kwiatkowski",
      "10000042",
      "Jakość",
      "50000042",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "43",
      "Ewa Krawczyk",
      "10000043",
      "Montaż",
      "50000043",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "44",
      "Grzegorz Kaczmarczyk",
      "10000044",
      "Pakowanie",
      "50000044",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "45",
      "Krystyna Kowalska",
      "10000045",
      "Produkcja",
      "50000045",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "46",
      "Wojciech Nowak",
      "10000046",
      "Magazyn",
      "50000046",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "47",
      "Elżbieta Wiśniewski",
      "10000047",
      "Jakość",
      "50000047",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "48",
      "Anna Wójcik",
      "10000048",
      "Montaż",
      "50000048",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "49",
      "Piotr Kowalczyk",
      "10000049",
      "Pakowanie",
      "50000049",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "50",
      "Jan Kaczmarek",
      "10000050",
      "Produkcja",
      "50000050",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "15.06.2026",
      "",
      ""
    ],
    [
      "51",
      "Katarzyna Zieliński",
      "10000051",
      "Magazyn",
      "50000051",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "52",
      "Michał Szymańska",
      "10000052",
      "Jakość",
      "50000052",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "53",
      "Agnieszka Dąbrowski",
      "10000053",
      "Montaż",
      "50000053",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "54",
      "Tomasz Kozłowski",
      "10000054",
      "Pakowanie",
      "50000054",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "55",
      "Magdalena Jankowski",
      "10000055",
      "Produkcja",
      "50000055",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "56",
      "Krzysztof Mazur",
      "10000056",
      "Magazyn",
      "50000056",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "57",
      "Barbara Kwiatkowski",
      "10000057",
      "Jakość",
      "50000057",
      "Zmiana B",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "58",
      "Marek Krawczyk",
      "10000058",
      "Montaż",
      "50000058",
      "Zmiana C",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "59",
      "Ewa Kaczmarczyk",
      "10000059",
      "Pakowanie",
      "50000059",
      "Weekendowa",
      "",
      "",
      "",
      "",
      "",
      "",
      "-",
      "",
      ""
    ],
    [
      "60",
      "Grzegorz Kowalska",
      "10000060",
      "Produkcja",
      "50000060",
      "Zmiana A",
      "",
      "",
      "",
      "",
      "",
      "",
      "15.06.2026",
      "",
      ""
    ]
  ],
  "Przedłużanie umów": [
    [
      "Pracownik",
      "Data Zatrudnienia",
      "Etap Onboardingu",
      "Suma Godzin",
      "Przeliczone Dni",
      "Aktualna Umowa",
      "L4",
      "NN",
      "Propozycja Systemu",
      "Data Od",
      "Data Do",
      "Status Akcji",
      "Tryb",
      "KolejnaUmowa",
      "Poprzednia"
    ],
    [
      "Piotr Nowak",
      "2026-06-02",
      "Po 1 spotkaniu",
      "159",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-02",
      "2026-06-16",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Jan Wiśniewski",
      "2026-06-03",
      "Po 2 spotkaniu",
      "158",
      "18",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-03",
      "2026-06-17",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Katarzyna Wójcik",
      "2026-06-04",
      "Nie dotyczy",
      "157",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-04",
      "2026-06-18",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Michał Kowalczyk",
      "2026-06-05",
      "Przed spotkaniem",
      "156",
      "19",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-05",
      "2026-06-19",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Agnieszka Kaczmarek",
      "2026-06-06",
      "Po 1 spotkaniu",
      "155",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-06",
      "2026-06-20",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Tomasz Zieliński",
      "2026-06-07",
      "Po 2 spotkaniu",
      "154",
      "20",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-07",
      "2026-06-21",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Magdalena Szymańska",
      "2026-06-08",
      "Nie dotyczy",
      "153",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-08",
      "2026-06-22",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Krzysztof Dąbrowski",
      "2026-06-09",
      "Przed spotkaniem",
      "152",
      "18",
      "Tygodniowa",
      "1",
      "0",
      "Tygodniowa",
      "2026-06-09",
      "2026-06-23",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Barbara Kozłowski",
      "2026-06-10",
      "Po 1 spotkaniu",
      "151",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-10",
      "2026-06-24",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Marek Jankowski",
      "2026-06-11",
      "Po 2 spotkaniu",
      "150",
      "19",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-11",
      "2026-06-25",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Ewa Mazur",
      "2026-06-12",
      "Nie dotyczy",
      "149",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-12",
      "2026-06-26",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Grzegorz Kwiatkowski",
      "2026-06-13",
      "Przed spotkaniem",
      "148",
      "20",
      "Tygodniowa",
      "0",
      "1",
      "Tygodniowa",
      "2026-06-13",
      "2026-06-27",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Krystyna Krawczyk",
      "2026-06-14",
      "Po 1 spotkaniu",
      "147",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-14",
      "2026-06-28",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Wojciech Kaczmarczyk",
      "2026-06-15",
      "Po 2 spotkaniu",
      "146",
      "18",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-15",
      "2026-06-29",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Elżbieta Kowalska",
      "2026-06-16",
      "Nie dotyczy",
      "145",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-01",
      "2026-06-15",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Anna Nowak",
      "2026-06-17",
      "Przed spotkaniem",
      "144",
      "19",
      "Tygodniowa",
      "1",
      "0",
      "Tygodniowa",
      "2026-06-02",
      "2026-06-16",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Piotr Wiśniewski",
      "2026-06-18",
      "Po 1 spotkaniu",
      "143",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-03",
      "2026-06-17",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Jan Wójcik",
      "2026-06-19",
      "Po 2 spotkaniu",
      "142",
      "20",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-04",
      "2026-06-18",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Katarzyna Kowalczyk",
      "2026-06-20",
      "Nie dotyczy",
      "141",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-05",
      "2026-06-19",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Michał Kaczmarek",
      "2026-06-21",
      "Przed spotkaniem",
      "160",
      "18",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-06",
      "2026-06-20",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Agnieszka Zieliński",
      "2026-06-22",
      "Po 1 spotkaniu",
      "159",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-07",
      "2026-06-21",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Tomasz Szymańska",
      "2026-06-23",
      "Po 2 spotkaniu",
      "158",
      "19",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-08",
      "2026-06-22",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Magdalena Dąbrowski",
      "2026-06-24",
      "Nie dotyczy",
      "157",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-09",
      "2026-06-23",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Krzysztof Kozłowski",
      "2026-06-25",
      "Przed spotkaniem",
      "156",
      "20",
      "Tygodniowa",
      "1",
      "1",
      "Tygodniowa",
      "2026-06-10",
      "2026-06-24",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Barbara Jankowski",
      "2026-06-26",
      "Po 1 spotkaniu",
      "155",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-11",
      "2026-06-25",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Marek Mazur",
      "2026-06-27",
      "Po 2 spotkaniu",
      "154",
      "18",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-12",
      "2026-06-26",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Ewa Kwiatkowski",
      "2026-06-28",
      "Nie dotyczy",
      "153",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-13",
      "2026-06-27",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Grzegorz Krawczyk",
      "2026-06-01",
      "Przed spotkaniem",
      "152",
      "19",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-14",
      "2026-06-28",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Krystyna Kaczmarczyk",
      "2026-06-02",
      "Po 1 spotkaniu",
      "151",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-15",
      "2026-06-29",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Wojciech Kowalska",
      "2026-06-03",
      "Po 2 spotkaniu",
      "150",
      "20",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-01",
      "2026-06-15",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Elżbieta Nowak",
      "2026-06-04",
      "Nie dotyczy",
      "149",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-02",
      "2026-06-16",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Anna Wiśniewski",
      "2026-06-05",
      "Przed spotkaniem",
      "148",
      "18",
      "Tygodniowa",
      "1",
      "0",
      "Tygodniowa",
      "2026-06-03",
      "2026-06-17",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Piotr Wójcik",
      "2026-06-06",
      "Po 1 spotkaniu",
      "147",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-04",
      "2026-06-18",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Jan Kowalczyk",
      "2026-06-07",
      "Po 2 spotkaniu",
      "146",
      "19",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-05",
      "2026-06-19",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Katarzyna Kaczmarek",
      "2026-06-08",
      "Nie dotyczy",
      "145",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-06",
      "2026-06-20",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Michał Zieliński",
      "2026-06-09",
      "Przed spotkaniem",
      "144",
      "20",
      "Tygodniowa",
      "0",
      "1",
      "Tygodniowa",
      "2026-06-07",
      "2026-06-21",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Agnieszka Szymańska",
      "2026-06-10",
      "Po 1 spotkaniu",
      "143",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-08",
      "2026-06-22",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Tomasz Dąbrowski",
      "2026-06-11",
      "Po 2 spotkaniu",
      "142",
      "18",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-09",
      "2026-06-23",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Magdalena Kozłowski",
      "2026-06-12",
      "Nie dotyczy",
      "141",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-10",
      "2026-06-24",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Krzysztof Jankowski",
      "2026-06-13",
      "Przed spotkaniem",
      "160",
      "19",
      "Tygodniowa",
      "1",
      "0",
      "Tygodniowa",
      "2026-06-11",
      "2026-06-25",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Barbara Mazur",
      "2026-06-14",
      "Po 1 spotkaniu",
      "159",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-12",
      "2026-06-26",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Marek Kwiatkowski",
      "2026-06-15",
      "Po 2 spotkaniu",
      "158",
      "20",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-13",
      "2026-06-27",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Ewa Krawczyk",
      "2026-06-16",
      "Nie dotyczy",
      "157",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-14",
      "2026-06-28",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Grzegorz Kaczmarczyk",
      "2026-06-17",
      "Przed spotkaniem",
      "156",
      "18",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-15",
      "2026-06-29",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Krystyna Kowalska",
      "2026-06-18",
      "Po 1 spotkaniu",
      "155",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-01",
      "2026-06-15",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Wojciech Nowak",
      "2026-06-19",
      "Po 2 spotkaniu",
      "154",
      "19",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-02",
      "2026-06-16",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Elżbieta Wiśniewski",
      "2026-06-20",
      "Nie dotyczy",
      "153",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-03",
      "2026-06-17",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Anna Wójcik",
      "2026-06-21",
      "Przed spotkaniem",
      "152",
      "20",
      "Tygodniowa",
      "1",
      "1",
      "Tygodniowa",
      "2026-06-04",
      "2026-06-18",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Piotr Kowalczyk",
      "2026-06-22",
      "Po 1 spotkaniu",
      "151",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-05",
      "2026-06-19",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Jan Kaczmarek",
      "2026-06-23",
      "Po 2 spotkaniu",
      "150",
      "18",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-06",
      "2026-06-20",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Katarzyna Zieliński",
      "2026-06-24",
      "Nie dotyczy",
      "149",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-07",
      "2026-06-21",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Michał Szymańska",
      "2026-06-25",
      "Przed spotkaniem",
      "148",
      "19",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-08",
      "2026-06-22",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Agnieszka Dąbrowski",
      "2026-06-26",
      "Po 1 spotkaniu",
      "147",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-09",
      "2026-06-23",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Tomasz Kozłowski",
      "2026-06-27",
      "Po 2 spotkaniu",
      "146",
      "20",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-10",
      "2026-06-24",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Magdalena Jankowski",
      "2026-06-28",
      "Nie dotyczy",
      "145",
      "19",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-11",
      "2026-06-25",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Krzysztof Mazur",
      "2026-06-01",
      "Przed spotkaniem",
      "144",
      "18",
      "Tygodniowa",
      "1",
      "0",
      "Tygodniowa",
      "2026-06-12",
      "2026-06-26",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Barbara Kwiatkowski",
      "2026-06-02",
      "Po 1 spotkaniu",
      "143",
      "20",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-13",
      "2026-06-27",
      "Wystawić",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Marek Krawczyk",
      "2026-06-03",
      "Po 2 spotkaniu",
      "142",
      "19",
      "Tygodniowa",
      "0",
      "0",
      "Tygodniowa",
      "2026-06-14",
      "2026-06-28",
      "Aktualna",
      "Tygodniowa",
      "",
      ""
    ],
    [
      "Ewa Kaczmarczyk",
      "2026-06-04",
      "Nie dotyczy",
      "141",
      "18",
      "Miesięczna",
      "0",
      "0",
      "Miesięczna",
      "2026-06-15",
      "2026-06-29",
      "Aktualna",
      "Miesięczna",
      "",
      ""
    ],
    [
      "Grzegorz Kowalska",
      "2026-06-05",
      "Przed spotkaniem",
      "160",
      "20",
      "Tygodniowa",
      "0",
      "1",
      "Tygodniowa",
      "2026-06-01",
      "2026-06-15",
      "Wystawić",
      "Tygodniowa",
      "",
      ""
    ]
  ],
  "Raport": [
    [
      "Nazwisko i Imię",
      "Suma Godzin",
      "L4",
      "NN"
    ],
    [
      "Piotr Nowak",
      "159",
      "0",
      "0"
    ],
    [
      "Jan Wiśniewski",
      "158",
      "0",
      "0"
    ],
    [
      "Katarzyna Wójcik",
      "157",
      "0",
      "0"
    ],
    [
      "Michał Kowalczyk",
      "156",
      "0",
      "0"
    ],
    [
      "Agnieszka Kaczmarek",
      "155",
      "0",
      "0"
    ],
    [
      "Tomasz Zieliński",
      "154",
      "0",
      "0"
    ],
    [
      "Magdalena Szymańska",
      "153",
      "0",
      "0"
    ],
    [
      "Krzysztof Dąbrowski",
      "152",
      "1",
      "0"
    ],
    [
      "Barbara Kozłowski",
      "151",
      "0",
      "0"
    ],
    [
      "Marek Jankowski",
      "150",
      "0",
      "0"
    ],
    [
      "Ewa Mazur",
      "149",
      "0",
      "0"
    ],
    [
      "Grzegorz Kwiatkowski",
      "148",
      "0",
      "1"
    ],
    [
      "Krystyna Krawczyk",
      "147",
      "0",
      "0"
    ],
    [
      "Wojciech Kaczmarczyk",
      "146",
      "0",
      "0"
    ],
    [
      "Elżbieta Kowalska",
      "145",
      "0",
      "0"
    ],
    [
      "Anna Nowak",
      "144",
      "1",
      "0"
    ],
    [
      "Piotr Wiśniewski",
      "143",
      "0",
      "0"
    ],
    [
      "Jan Wójcik",
      "142",
      "0",
      "0"
    ],
    [
      "Katarzyna Kowalczyk",
      "141",
      "0",
      "0"
    ],
    [
      "Michał Kaczmarek",
      "160",
      "0",
      "0"
    ],
    [
      "Agnieszka Zieliński",
      "159",
      "0",
      "0"
    ],
    [
      "Tomasz Szymańska",
      "158",
      "0",
      "0"
    ],
    [
      "Magdalena Dąbrowski",
      "157",
      "0",
      "0"
    ],
    [
      "Krzysztof Kozłowski",
      "156",
      "1",
      "1"
    ],
    [
      "Barbara Jankowski",
      "155",
      "0",
      "0"
    ],
    [
      "Marek Mazur",
      "154",
      "0",
      "0"
    ],
    [
      "Ewa Kwiatkowski",
      "153",
      "0",
      "0"
    ],
    [
      "Grzegorz Krawczyk",
      "152",
      "0",
      "0"
    ],
    [
      "Krystyna Kaczmarczyk",
      "151",
      "0",
      "0"
    ],
    [
      "Wojciech Kowalska",
      "150",
      "0",
      "0"
    ],
    [
      "Elżbieta Nowak",
      "149",
      "0",
      "0"
    ],
    [
      "Anna Wiśniewski",
      "148",
      "1",
      "0"
    ],
    [
      "Piotr Wójcik",
      "147",
      "0",
      "0"
    ],
    [
      "Jan Kowalczyk",
      "146",
      "0",
      "0"
    ],
    [
      "Katarzyna Kaczmarek",
      "145",
      "0",
      "0"
    ],
    [
      "Michał Zieliński",
      "144",
      "0",
      "1"
    ],
    [
      "Agnieszka Szymańska",
      "143",
      "0",
      "0"
    ],
    [
      "Tomasz Dąbrowski",
      "142",
      "0",
      "0"
    ],
    [
      "Magdalena Kozłowski",
      "141",
      "0",
      "0"
    ],
    [
      "Krzysztof Jankowski",
      "160",
      "1",
      "0"
    ],
    [
      "Barbara Mazur",
      "159",
      "0",
      "0"
    ],
    [
      "Marek Kwiatkowski",
      "158",
      "0",
      "0"
    ],
    [
      "Ewa Krawczyk",
      "157",
      "0",
      "0"
    ],
    [
      "Grzegorz Kaczmarczyk",
      "156",
      "0",
      "0"
    ],
    [
      "Krystyna Kowalska",
      "155",
      "0",
      "0"
    ],
    [
      "Wojciech Nowak",
      "154",
      "0",
      "0"
    ],
    [
      "Elżbieta Wiśniewski",
      "153",
      "0",
      "0"
    ],
    [
      "Anna Wójcik",
      "152",
      "1",
      "1"
    ],
    [
      "Piotr Kowalczyk",
      "151",
      "0",
      "0"
    ],
    [
      "Jan Kaczmarek",
      "150",
      "0",
      "0"
    ],
    [
      "Katarzyna Zieliński",
      "149",
      "0",
      "0"
    ],
    [
      "Michał Szymańska",
      "148",
      "0",
      "0"
    ],
    [
      "Agnieszka Dąbrowski",
      "147",
      "0",
      "0"
    ],
    [
      "Tomasz Kozłowski",
      "146",
      "0",
      "0"
    ],
    [
      "Magdalena Jankowski",
      "145",
      "0",
      "0"
    ],
    [
      "Krzysztof Mazur",
      "144",
      "1",
      "0"
    ],
    [
      "Barbara Kwiatkowski",
      "143",
      "0",
      "0"
    ],
    [
      "Marek Krawczyk",
      "142",
      "0",
      "0"
    ],
    [
      "Ewa Kaczmarczyk",
      "141",
      "0",
      "0"
    ],
    [
      "Grzegorz Kowalska",
      "160",
      "0",
      "1"
    ]
  ],
  "Tydz. 24": [
    [
      "SAP",
      "Imię i Nazwisko",
      "Data Od",
      "Data Do",
      "Stanowisko",
      "MPK",
      "Osoba",
      "Data Zatrudnienia",
      "Notatki"
    ],
    [
      "10000001",
      "Piotr Nowak",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-02",
      ""
    ],
    [
      "10000002",
      "Jan Wiśniewski",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-03",
      ""
    ],
    [
      "10000003",
      "Katarzyna Wójcik",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-04",
      ""
    ],
    [
      "10000004",
      "Michał Kowalczyk",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-05",
      ""
    ],
    [
      "10000005",
      "Agnieszka Kaczmarek",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-06",
      ""
    ],
    [
      "10000006",
      "Tomasz Zieliński",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-07",
      ""
    ],
    [
      "10000007",
      "Magdalena Szymańska",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-08",
      "Polecam"
    ],
    [
      "10000008",
      "Krzysztof Dąbrowski",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-09",
      ""
    ],
    [
      "10000009",
      "Barbara Kozłowski",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-10",
      ""
    ],
    [
      "10000010",
      "Marek Jankowski",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-11",
      ""
    ],
    [
      "10000011",
      "Ewa Mazur",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-12",
      ""
    ],
    [
      "10000012",
      "Grzegorz Kwiatkowski",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-13",
      ""
    ],
    [
      "10000013",
      "Krystyna Krawczyk",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-14",
      ""
    ],
    [
      "10000014",
      "Wojciech Kaczmarczyk",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-15",
      "Polecam"
    ],
    [
      "10000015",
      "Elżbieta Kowalska",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-16",
      ""
    ],
    [
      "10000016",
      "Anna Nowak",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-17",
      ""
    ],
    [
      "10000017",
      "Piotr Wiśniewski",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-18",
      ""
    ],
    [
      "10000018",
      "Jan Wójcik",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-19",
      ""
    ],
    [
      "10000019",
      "Katarzyna Kowalczyk",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-20",
      ""
    ],
    [
      "10000020",
      "Michał Kaczmarek",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-21",
      ""
    ],
    [
      "10000021",
      "Agnieszka Zieliński",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-22",
      "Polecam"
    ],
    [
      "10000022",
      "Tomasz Szymańska",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-23",
      ""
    ],
    [
      "10000023",
      "Magdalena Dąbrowski",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-24",
      ""
    ],
    [
      "10000024",
      "Krzysztof Kozłowski",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-25",
      ""
    ],
    [
      "10000025",
      "Barbara Jankowski",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-26",
      ""
    ],
    [
      "10000026",
      "Marek Mazur",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-27",
      ""
    ],
    [
      "10000027",
      "Ewa Kwiatkowski",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-28",
      ""
    ],
    [
      "10000028",
      "Grzegorz Krawczyk",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-01",
      "Polecam"
    ],
    [
      "10000029",
      "Krystyna Kaczmarczyk",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-02",
      ""
    ],
    [
      "10000030",
      "Wojciech Kowalska",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-03",
      ""
    ],
    [
      "10000031",
      "Elżbieta Nowak",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-04",
      ""
    ],
    [
      "10000032",
      "Anna Wiśniewski",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-05",
      ""
    ],
    [
      "10000033",
      "Piotr Wójcik",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-06",
      ""
    ],
    [
      "10000034",
      "Jan Kowalczyk",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-07",
      ""
    ],
    [
      "10000035",
      "Katarzyna Kaczmarek",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-08",
      "Polecam"
    ],
    [
      "10000036",
      "Michał Zieliński",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-09",
      ""
    ],
    [
      "10000037",
      "Agnieszka Szymańska",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-10",
      ""
    ],
    [
      "10000038",
      "Tomasz Dąbrowski",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-11",
      ""
    ],
    [
      "10000039",
      "Magdalena Kozłowski",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-12",
      ""
    ],
    [
      "10000040",
      "Krzysztof Jankowski",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-13",
      ""
    ],
    [
      "10000041",
      "Barbara Mazur",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-14",
      ""
    ],
    [
      "10000042",
      "Marek Kwiatkowski",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-15",
      "Polecam"
    ],
    [
      "10000043",
      "Ewa Krawczyk",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-16",
      ""
    ],
    [
      "10000044",
      "Grzegorz Kaczmarczyk",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-17",
      ""
    ],
    [
      "10000045",
      "Krystyna Kowalska",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-18",
      ""
    ],
    [
      "10000046",
      "Wojciech Nowak",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-19",
      ""
    ],
    [
      "10000047",
      "Elżbieta Wiśniewski",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-20",
      ""
    ],
    [
      "10000048",
      "Anna Wójcik",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-21",
      ""
    ],
    [
      "10000049",
      "Piotr Kowalczyk",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-22",
      "Polecam"
    ],
    [
      "10000050",
      "Jan Kaczmarek",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-23",
      ""
    ],
    [
      "10000051",
      "Katarzyna Zieliński",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-24",
      ""
    ],
    [
      "10000052",
      "Michał Szymańska",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-25",
      ""
    ],
    [
      "10000053",
      "Agnieszka Dąbrowski",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-26",
      ""
    ],
    [
      "10000054",
      "Tomasz Kozłowski",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-27",
      ""
    ],
    [
      "10000055",
      "Magdalena Jankowski",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-28",
      ""
    ],
    [
      "10000056",
      "Krzysztof Mazur",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-01",
      "Polecam"
    ],
    [
      "10000057",
      "Barbara Kwiatkowski",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-02",
      ""
    ],
    [
      "10000058",
      "Marek Krawczyk",
      "2026-06-01",
      "2026-06-30",
      "Młodszy Operator",
      "",
      "",
      "2026-06-03",
      ""
    ],
    [
      "10000059",
      "Ewa Kaczmarczyk",
      "2026-06-01",
      "2026-06-30",
      "Starszy Operator",
      "",
      "",
      "2026-06-04",
      ""
    ],
    [
      "10000060",
      "Grzegorz Kowalska",
      "2026-06-01",
      "2026-06-30",
      "Operator",
      "",
      "",
      "2026-06-05",
      ""
    ]
  ]
};


let MOCK_KARTY_SZUFLADA = ["1775", "1223", "1512", "1255", "340", "1683", "1724", "1766", "1678"];

function runMock(fnName, args=[]) {
  try {
    let res = window.googleHandlers[fnName].apply(null, args);
    return { error: null, result: JSON.parse(JSON.stringify(res || null)) };
  } catch(e) {
    return { error: e.message, result: null };
  }
}

window.googleHandlers = {
  pobierzWszystkoNaStart: (force, m) => {
    return {
      version: "1",
      wybranyMiesiac: "Czerwiec 2026",
      miesiace: ["Czerwiec 2026"],
      ewidencja: {
        stats: { iloscPT_val: 120, nowi_val: 5, rotujacy_val: 3, kobiety_val: 60, mezczyzni_val: 60 },
        pracownicy: [
  {
    "id": 1,
    "nazwisko": "Nowak Piotr",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "Nowy",
    "etat": "1/1",
    "telefon": "50000001",
    "startRaw": 1682812800000,
    "sapId": "10000001",
    "startData": "02.06.2026",
    "kluczyk": "101",
    "karta": "1007"
  },
  {
    "id": 2,
    "nazwisko": "Wiśniewski Jan",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "Nowy",
    "etat": "1/1",
    "telefon": "50000002",
    "startRaw": 1682726400000,
    "sapId": "10000002",
    "startData": "05.06.2026",
    "kluczyk": "102",
    "karta": "1014"
  },
  {
    "id": 3,
    "nazwisko": "Wójcik Katarzyna",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "Nowy",
    "etat": "1/1",
    "telefon": "50000003",
    "startRaw": 1682640000000,
    "sapId": "10000003",
    "startData": "09.06.2026",
    "kluczyk": "103",
    "karta": "1021"
  },
  {
    "id": 4,
    "nazwisko": "Kowalczyk Michał",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "Nowy",
    "etat": "1/1",
    "telefon": "50000004",
    "startRaw": 1682553600000,
    "sapId": "10000004",
    "startData": "12.06.2026",
    "kluczyk": "104",
    "karta": "1028"
  },
  {
    "id": 5,
    "nazwisko": "Kaczmarek Agnieszka",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "Nowy",
    "etat": "1/1",
    "telefon": "50000005",
    "startRaw": 1682467200000,
    "sapId": "10000005",
    "startData": "15.06.2026",
    "kluczyk": "105",
    "karta": "1035"
  },
  {
    "id": 6,
    "nazwisko": "Zieliński Tomasz",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "Rotuje",
    "etat": "1/1",
    "telefon": "50000006",
    "startRaw": 1682380800000,
    "sapId": "10000006",
    "startData": "01.07.2023",
    "kluczyk": "106",
    "karta": "1042",
    "dataRotacji": "22.06.2026",
    "powodRotacji": "Koniec umowy",
    "dataRotacjiRaw": "2026-06-22"
  },
  {
    "id": 7,
    "nazwisko": "Szymańska Magdalena",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "Rotuje",
    "etat": "1/1",
    "telefon": "50000007",
    "startRaw": 1682294400000,
    "sapId": "10000007",
    "startData": "01.08.2023",
    "kluczyk": "107",
    "karta": "1049",
    "dataRotacji": "25.06.2026",
    "powodRotacji": "Rezygnacja własna",
    "dataRotacjiRaw": "2026-06-25"
  },
  {
    "id": 8,
    "nazwisko": "Dąbrowski Krzysztof",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "Rotuje",
    "etat": "1/1",
    "telefon": "50000008",
    "startRaw": 1682208000000,
    "sapId": "10000008",
    "startData": "01.09.2023",
    "kluczyk": "108",
    "karta": "1056",
    "dataRotacji": "29.06.2026",
    "powodRotacji": "Przejście do innego projektu",
    "dataRotacjiRaw": "2026-06-29"
  },
  {
    "id": 9,
    "nazwisko": "Kozłowski Barbara",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000009",
    "startRaw": 1682121600000,
    "sapId": "10000009",
    "startData": "01.10.2023",
    "kluczyk": "109",
    "karta": "1063"
  },
  {
    "id": 10,
    "nazwisko": "Jankowski Marek",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000010",
    "startRaw": 1682035200000,
    "sapId": "10000010",
    "startData": "01.11.2023",
    "kluczyk": "110",
    "karta": "1070"
  },
  {
    "id": 11,
    "nazwisko": "Mazur Ewa",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000011",
    "startRaw": 1681948800000,
    "sapId": "10000011",
    "startData": "01.12.2023",
    "kluczyk": "111",
    "karta": "1077"
  },
  {
    "id": 12,
    "nazwisko": "Kwiatkowski Grzegorz",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000012",
    "startRaw": 1681862400000,
    "sapId": "10000012",
    "startData": "01.01.2023",
    "kluczyk": "112",
    "karta": "1084"
  },
  {
    "id": 13,
    "nazwisko": "Krawczyk Krystyna",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000013",
    "startRaw": 1681776000000,
    "sapId": "10000013",
    "startData": "01.02.2023",
    "kluczyk": "113",
    "karta": "1091"
  },
  {
    "id": 14,
    "nazwisko": "Kaczmarczyk Wojciech",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000014",
    "startRaw": 1681689600000,
    "sapId": "10000014",
    "startData": "01.03.2023",
    "kluczyk": "114",
    "karta": "1098"
  },
  {
    "id": 15,
    "nazwisko": "Kowalska Elżbieta",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000015",
    "startRaw": 1681603200000,
    "sapId": "10000015",
    "startData": "01.04.2023",
    "kluczyk": "115",
    "karta": "1105"
  },
  {
    "id": 16,
    "nazwisko": "Nowak Anna",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000016",
    "startRaw": 1681516800000,
    "sapId": "10000016",
    "startData": "01.05.2023",
    "kluczyk": "116",
    "karta": "1112"
  },
  {
    "id": 17,
    "nazwisko": "Wiśniewski Piotr",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000017",
    "startRaw": 1681430400000,
    "sapId": "10000017",
    "startData": "01.06.2023",
    "kluczyk": "117",
    "karta": "1119"
  },
  {
    "id": 18,
    "nazwisko": "Wójcik Jan",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000018",
    "startRaw": 1681344000000,
    "sapId": "10000018",
    "startData": "01.07.2023",
    "kluczyk": "118",
    "karta": "1126"
  },
  {
    "id": 19,
    "nazwisko": "Kowalczyk Katarzyna",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000019",
    "startRaw": 1681257600000,
    "sapId": "10000019",
    "startData": "01.08.2023",
    "kluczyk": "119",
    "karta": "1133"
  },
  {
    "id": 20,
    "nazwisko": "Kaczmarek Michał",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000020",
    "startRaw": 1681171200000,
    "sapId": "10000020",
    "startData": "01.09.2023",
    "kluczyk": "120",
    "karta": "1140"
  },
  {
    "id": 21,
    "nazwisko": "Zieliński Agnieszka",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000021",
    "startRaw": 1681084800000,
    "sapId": "10000021",
    "startData": "01.10.2023",
    "kluczyk": "121",
    "karta": "1147"
  },
  {
    "id": 22,
    "nazwisko": "Szymańska Tomasz",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000022",
    "startRaw": 1680998400000,
    "sapId": "10000022",
    "startData": "01.11.2023",
    "kluczyk": "122",
    "karta": "1154"
  },
  {
    "id": 23,
    "nazwisko": "Dąbrowski Magdalena",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000023",
    "startRaw": 1680912000000,
    "sapId": "10000023",
    "startData": "01.12.2023",
    "kluczyk": "123",
    "karta": "1161"
  },
  {
    "id": 24,
    "nazwisko": "Kozłowski Krzysztof",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000024",
    "startRaw": 1680825600000,
    "sapId": "10000024",
    "startData": "01.01.2023",
    "kluczyk": "124",
    "karta": "1168"
  },
  {
    "id": 25,
    "nazwisko": "Jankowski Barbara",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000025",
    "startRaw": 1680739200000,
    "sapId": "10000025",
    "startData": "01.02.2023",
    "kluczyk": "125",
    "karta": "1175"
  },
  {
    "id": 26,
    "nazwisko": "Mazur Marek",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000026",
    "startRaw": 1680652800000,
    "sapId": "10000026",
    "startData": "01.03.2023",
    "kluczyk": "126",
    "karta": "1182"
  },
  {
    "id": 27,
    "nazwisko": "Kwiatkowski Ewa",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000027",
    "startRaw": 1680566400000,
    "sapId": "10000027",
    "startData": "01.04.2023",
    "kluczyk": "127",
    "karta": "1189"
  },
  {
    "id": 28,
    "nazwisko": "Krawczyk Grzegorz",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000028",
    "startRaw": 1680480000000,
    "sapId": "10000028",
    "startData": "01.05.2023",
    "kluczyk": "128",
    "karta": "1196"
  },
  {
    "id": 29,
    "nazwisko": "Kaczmarczyk Krystyna",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000029",
    "startRaw": 1680393600000,
    "sapId": "10000029",
    "startData": "01.06.2023",
    "kluczyk": "129",
    "karta": "1203"
  },
  {
    "id": 30,
    "nazwisko": "Kowalska Wojciech",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000030",
    "startRaw": 1680307200000,
    "sapId": "10000030",
    "startData": "01.07.2023",
    "kluczyk": "130",
    "karta": "1210"
  },
  {
    "id": 31,
    "nazwisko": "Nowak Elżbieta",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000031",
    "startRaw": 1680220800000,
    "sapId": "10000031",
    "startData": "01.08.2023",
    "kluczyk": "131",
    "karta": "1217"
  },
  {
    "id": 32,
    "nazwisko": "Wiśniewski Anna",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000032",
    "startRaw": 1680134400000,
    "sapId": "10000032",
    "startData": "01.09.2023",
    "kluczyk": "132",
    "karta": "1224"
  },
  {
    "id": 33,
    "nazwisko": "Wójcik Piotr",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000033",
    "startRaw": 1680048000000,
    "sapId": "10000033",
    "startData": "01.10.2023",
    "kluczyk": "133",
    "karta": "1231"
  },
  {
    "id": 34,
    "nazwisko": "Kowalczyk Jan",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000034",
    "startRaw": 1679961600000,
    "sapId": "10000034",
    "startData": "01.11.2023",
    "kluczyk": "134",
    "karta": "1238"
  },
  {
    "id": 35,
    "nazwisko": "Kaczmarek Katarzyna",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000035",
    "startRaw": 1679875200000,
    "sapId": "10000035",
    "startData": "01.12.2023",
    "kluczyk": "135",
    "karta": "1245"
  },
  {
    "id": 36,
    "nazwisko": "Zieliński Michał",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000036",
    "startRaw": 1679788800000,
    "sapId": "10000036",
    "startData": "01.01.2023",
    "kluczyk": "136",
    "karta": "1252"
  },
  {
    "id": 37,
    "nazwisko": "Szymańska Agnieszka",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000037",
    "startRaw": 1679702400000,
    "sapId": "10000037",
    "startData": "01.02.2023",
    "kluczyk": "137",
    "karta": "1259"
  },
  {
    "id": 38,
    "nazwisko": "Dąbrowski Tomasz",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000038",
    "startRaw": 1679616000000,
    "sapId": "10000038",
    "startData": "01.03.2023",
    "kluczyk": "138",
    "karta": "1266"
  },
  {
    "id": 39,
    "nazwisko": "Kozłowski Magdalena",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000039",
    "startRaw": 1679529600000,
    "sapId": "10000039",
    "startData": "01.04.2023",
    "kluczyk": "139",
    "karta": "1273"
  },
  {
    "id": 40,
    "nazwisko": "Jankowski Krzysztof",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000040",
    "startRaw": 1679443200000,
    "sapId": "10000040",
    "startData": "01.05.2023",
    "kluczyk": "140",
    "karta": "1280"
  },
  {
    "id": 41,
    "nazwisko": "Mazur Barbara",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000041",
    "startRaw": 1679356800000,
    "sapId": "10000041",
    "startData": "01.06.2023",
    "kluczyk": "141",
    "karta": "1287"
  },
  {
    "id": 42,
    "nazwisko": "Kwiatkowski Marek",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000042",
    "startRaw": 1679270400000,
    "sapId": "10000042",
    "startData": "01.07.2023",
    "kluczyk": "142",
    "karta": "1294"
  },
  {
    "id": 43,
    "nazwisko": "Krawczyk Ewa",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000043",
    "startRaw": 1679184000000,
    "sapId": "10000043",
    "startData": "01.08.2023",
    "kluczyk": "143",
    "karta": "1301"
  },
  {
    "id": 44,
    "nazwisko": "Kaczmarczyk Grzegorz",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000044",
    "startRaw": 1679097600000,
    "sapId": "10000044",
    "startData": "01.09.2023",
    "kluczyk": "144",
    "karta": "1308"
  },
  {
    "id": 45,
    "nazwisko": "Kowalska Krystyna",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000045",
    "startRaw": 1679011200000,
    "sapId": "10000045",
    "startData": "01.10.2023",
    "kluczyk": "145",
    "karta": "1315"
  },
  {
    "id": 46,
    "nazwisko": "Nowak Wojciech",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000046",
    "startRaw": 1678924800000,
    "sapId": "10000046",
    "startData": "01.11.2023",
    "kluczyk": "146",
    "karta": "1322"
  },
  {
    "id": 47,
    "nazwisko": "Wiśniewski Elżbieta",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000047",
    "startRaw": 1678838400000,
    "sapId": "10000047",
    "startData": "01.12.2023",
    "kluczyk": "147",
    "karta": "1329"
  },
  {
    "id": 48,
    "nazwisko": "Wójcik Anna",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000048",
    "startRaw": 1678752000000,
    "sapId": "10000048",
    "startData": "01.01.2023",
    "kluczyk": "148",
    "karta": "1336"
  },
  {
    "id": 49,
    "nazwisko": "Kowalczyk Piotr",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000049",
    "startRaw": 1678665600000,
    "sapId": "10000049",
    "startData": "01.02.2023",
    "kluczyk": "149",
    "karta": "1343"
  },
  {
    "id": 50,
    "nazwisko": "Kaczmarek Jan",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000050",
    "startRaw": 1678579200000,
    "sapId": "10000050",
    "startData": "01.03.2023",
    "kluczyk": "150",
    "karta": "1350"
  },
  {
    "id": 51,
    "nazwisko": "Zieliński Katarzyna",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000051",
    "startRaw": 1678492800000,
    "sapId": "10000051",
    "startData": "01.04.2023",
    "kluczyk": "151",
    "karta": "1357"
  },
  {
    "id": 52,
    "nazwisko": "Szymańska Michał",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000052",
    "startRaw": 1678406400000,
    "sapId": "10000052",
    "startData": "01.05.2023",
    "kluczyk": "152",
    "karta": "1364"
  },
  {
    "id": 53,
    "nazwisko": "Dąbrowski Agnieszka",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000053",
    "startRaw": 1678320000000,
    "sapId": "10000053",
    "startData": "01.06.2023",
    "kluczyk": "153",
    "karta": "1371"
  },
  {
    "id": 54,
    "nazwisko": "Kozłowski Tomasz",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000054",
    "startRaw": 1678233600000,
    "sapId": "10000054",
    "startData": "01.07.2023",
    "kluczyk": "154",
    "karta": "1378"
  },
  {
    "id": 55,
    "nazwisko": "Jankowski Magdalena",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000055",
    "startRaw": 1678147200000,
    "sapId": "10000055",
    "startData": "01.08.2023",
    "kluczyk": "155",
    "karta": "1385"
  },
  {
    "id": 56,
    "nazwisko": "Mazur Krzysztof",
    "dzial": "Magazyn",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000056",
    "startRaw": 1678060800000,
    "sapId": "10000056",
    "startData": "01.09.2023",
    "kluczyk": "156",
    "karta": "1392"
  },
  {
    "id": 57,
    "nazwisko": "Kwiatkowski Barbara",
    "dzial": "Jakość",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000057",
    "startRaw": 1677974400000,
    "sapId": "10000057",
    "startData": "01.10.2023",
    "kluczyk": "157",
    "karta": "1399"
  },
  {
    "id": 58,
    "nazwisko": "Krawczyk Marek",
    "dzial": "Montaż",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000058",
    "startRaw": 1677888000000,
    "sapId": "10000058",
    "startData": "01.11.2023",
    "kluczyk": "158",
    "karta": "1406"
  },
  {
    "id": 59,
    "nazwisko": "Kaczmarczyk Ewa",
    "dzial": "Pakowanie",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000059",
    "startRaw": 1677801600000,
    "sapId": "10000059",
    "startData": "01.12.2023",
    "kluczyk": "159",
    "karta": "1413"
  },
  {
    "id": 60,
    "nazwisko": "Kowalska Grzegorz",
    "dzial": "Produkcja",
    "lokalizacja": "Zakład Produkcyjny A",
    "stanowisko": "PT",
    "status": "OK",
    "etat": "1/1",
    "telefon": "50000060",
    "startRaw": 1677715200000,
    "sapId": "10000060",
    "startData": "01.01.2023",
    "kluczyk": "160",
    "karta": "1420"
  }
]
      },
      planowanie: {
  "stats": {
    "dniTotal": 21,
    "dniRem": 8,
    "godzRem": 64
  },
  "lista": [
    {
      "bilans": "99,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000001",
      "dzial": "Magazyn",
      "pozostaly": 35
    },
    {
      "bilans": "98,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000002",
      "dzial": "Jakość",
      "pozostaly": 34
    },
    {
      "bilans": "97,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000003",
      "dzial": "Montaż",
      "pozostaly": 33
    },
    {
      "bilans": "96,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000004",
      "dzial": "Pakowanie",
      "pozostaly": 32
    },
    {
      "bilans": "95,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000005",
      "dzial": "Produkcja",
      "pozostaly": 31
    },
    {
      "bilans": "94,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000006",
      "dzial": "Magazyn",
      "pozostaly": 30
    },
    {
      "bilans": "93,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000007",
      "dzial": "Jakość",
      "pozostaly": 29
    },
    {
      "bilans": "92,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000008",
      "dzial": "Montaż",
      "pozostaly": 28
    },
    {
      "bilans": "91,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000009",
      "dzial": "Pakowanie",
      "pozostaly": 27
    },
    {
      "bilans": "90,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000010",
      "dzial": "Produkcja",
      "pozostaly": 26
    },
    {
      "bilans": "89,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000011",
      "dzial": "Magazyn",
      "pozostaly": 25
    },
    {
      "bilans": "88,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000012",
      "dzial": "Jakość",
      "pozostaly": 24
    },
    {
      "bilans": "87,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000013",
      "dzial": "Montaż",
      "pozostaly": 23
    },
    {
      "bilans": "86,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000014",
      "dzial": "Pakowanie",
      "pozostaly": 22
    },
    {
      "bilans": "85,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000015",
      "dzial": "Produkcja",
      "pozostaly": 21
    },
    {
      "bilans": "84,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000016",
      "dzial": "Magazyn",
      "pozostaly": 20
    },
    {
      "bilans": "83,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000017",
      "dzial": "Jakość",
      "pozostaly": 19
    },
    {
      "bilans": "82,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000018",
      "dzial": "Montaż",
      "pozostaly": 18
    },
    {
      "bilans": "81,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000019",
      "dzial": "Pakowanie",
      "pozostaly": 17
    },
    {
      "bilans": "80,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000020",
      "dzial": "Produkcja",
      "pozostaly": 16
    },
    {
      "bilans": "79,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000021",
      "dzial": "Magazyn",
      "pozostaly": 15
    },
    {
      "bilans": "78,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000022",
      "dzial": "Jakość",
      "pozostaly": 14
    },
    {
      "bilans": "77,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000023",
      "dzial": "Montaż",
      "pozostaly": 13
    },
    {
      "bilans": "76,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000024",
      "dzial": "Pakowanie",
      "pozostaly": 12
    },
    {
      "bilans": "75,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000025",
      "dzial": "Produkcja",
      "pozostaly": 11
    },
    {
      "bilans": "74,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000026",
      "dzial": "Magazyn",
      "pozostaly": 10
    },
    {
      "bilans": "73,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000027",
      "dzial": "Jakość",
      "pozostaly": 9
    },
    {
      "bilans": "72,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000028",
      "dzial": "Montaż",
      "pozostaly": 8
    },
    {
      "bilans": "71,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000029",
      "dzial": "Pakowanie",
      "pozostaly": 7
    },
    {
      "bilans": "70,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000030",
      "dzial": "Produkcja",
      "pozostaly": 6
    },
    {
      "bilans": "69,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000031",
      "dzial": "Magazyn",
      "pozostaly": 5
    },
    {
      "bilans": "68,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000032",
      "dzial": "Jakość",
      "pozostaly": 4
    },
    {
      "bilans": "67,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000033",
      "dzial": "Montaż",
      "pozostaly": 3
    },
    {
      "bilans": "66,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000034",
      "dzial": "Pakowanie",
      "pozostaly": 2
    },
    {
      "bilans": "65,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000035",
      "dzial": "Produkcja",
      "pozostaly": 1
    },
    {
      "bilans": "64,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000036",
      "dzial": "Magazyn",
      "pozostaly": 0
    },
    {
      "bilans": "63,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000037",
      "dzial": "Jakość",
      "pozostaly": 40
    },
    {
      "bilans": "62,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000038",
      "dzial": "Montaż",
      "pozostaly": 39
    },
    {
      "bilans": "61,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000039",
      "dzial": "Pakowanie",
      "pozostaly": 38
    },
    {
      "bilans": "60,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000040",
      "dzial": "Produkcja",
      "pozostaly": 37
    },
    {
      "bilans": "59,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000041",
      "dzial": "Magazyn",
      "pozostaly": 36
    },
    {
      "bilans": "58,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000042",
      "dzial": "Jakość",
      "pozostaly": 35
    },
    {
      "bilans": "57,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000043",
      "dzial": "Montaż",
      "pozostaly": 34
    },
    {
      "bilans": "56,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000044",
      "dzial": "Pakowanie",
      "pozostaly": 33
    },
    {
      "bilans": "55,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000045",
      "dzial": "Produkcja",
      "pozostaly": 32
    },
    {
      "bilans": "54,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000046",
      "dzial": "Magazyn",
      "pozostaly": 31
    },
    {
      "bilans": "53,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000047",
      "dzial": "Jakość",
      "pozostaly": 30
    },
    {
      "bilans": "52,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000048",
      "dzial": "Montaż",
      "pozostaly": 29
    },
    {
      "bilans": "51,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000049",
      "dzial": "Pakowanie",
      "pozostaly": 28
    },
    {
      "bilans": "50,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000050",
      "dzial": "Produkcja",
      "pozostaly": 27
    },
    {
      "bilans": "49,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000051",
      "dzial": "Magazyn",
      "pozostaly": 26
    },
    {
      "bilans": "48,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000052",
      "dzial": "Jakość",
      "pozostaly": 25
    },
    {
      "bilans": "47,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000053",
      "dzial": "Montaż",
      "pozostaly": 24
    },
    {
      "bilans": "46,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000054",
      "dzial": "Pakowanie",
      "pozostaly": 23
    },
    {
      "bilans": "45,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000055",
      "dzial": "Produkcja",
      "pozostaly": 22
    },
    {
      "bilans": "44,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000056",
      "dzial": "Magazyn",
      "pozostaly": 21
    },
    {
      "bilans": "43,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000057",
      "dzial": "Jakość",
      "pozostaly": 20
    },
    {
      "bilans": "42,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000058",
      "dzial": "Montaż",
      "pozostaly": 19
    },
    {
      "bilans": "41,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000059",
      "dzial": "Pakowanie",
      "pozostaly": 18
    },
    {
      "bilans": "40,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000060",
      "dzial": "Produkcja",
      "pozostaly": 17
    }
  ]
},
      szafki: {}
    };
  },
  pobierzDaneLimitow: () => { return {"lista": [{"nazwisko": "Nowak Piotr", "sap": "10000001", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "01.06.2026", "status": "URGENT", "rawMonth": 5}, {"nazwisko": "Wiśniewski Jan", "sap": "10000002", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "08.06.2026", "status": "URGENT", "rawMonth": 5}, {"nazwisko": "Wójcik Katarzyna", "sap": "10000003", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "15.06.2026", "status": "URGENT", "rawMonth": 5}, {"nazwisko": "Kowalczyk Michał", "sap": "10000004", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "22.06.2026", "status": "URGENT", "rawMonth": 5}, {"nazwisko": "Kaczmarek Agnieszka", "sap": "10000005", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "02.07.2026", "status": "WARNING", "rawMonth": 6}, {"nazwisko": "Zieliński Tomasz", "sap": "10000006", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "09.07.2026", "status": "WARNING", "rawMonth": 6}, {"nazwisko": "Szymańska Magdalena", "sap": "10000007", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "16.07.2026", "status": "WARNING", "rawMonth": 6}, {"nazwisko": "Dąbrowski Krzysztof", "sap": "10000008", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "23.07.2026", "status": "WARNING", "rawMonth": 6}, {"nazwisko": "Kozłowski Barbara", "sap": "10000009", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "03.07.2026", "status": "WARNING", "rawMonth": 6}, {"nazwisko": "Jankowski Marek", "sap": "10000010", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "10.07.2026", "status": "WARNING", "rawMonth": 6}, {"nazwisko": "Mazur Ewa", "sap": "10000011", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "17.08.2026", "status": "OK", "rawMonth": 7}, {"nazwisko": "Kwiatkowski Grzegorz", "sap": "10000012", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "24.09.2026", "status": "OK", "rawMonth": 8}, {"nazwisko": "Krawczyk Krystyna", "sap": "10000013", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "04.10.2026", "status": "OK", "rawMonth": 9}, {"nazwisko": "Kaczmarczyk Wojciech", "sap": "10000014", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "11.11.2026", "status": "OK", "rawMonth": 10}, {"nazwisko": "Kowalska Elżbieta", "sap": "10000015", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "18.12.2026", "status": "OK", "rawMonth": 11}, {"nazwisko": "Nowak Anna", "sap": "10000016", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "25.01.2027", "status": "OK", "rawMonth": 0}, {"nazwisko": "Wiśniewski Piotr", "sap": "10000017", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "05.02.2027", "status": "OK", "rawMonth": 1}, {"nazwisko": "Wójcik Jan", "sap": "10000018", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "12.08.2026", "status": "OK", "rawMonth": 7}, {"nazwisko": "Kowalczyk Katarzyna", "sap": "10000019", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "19.09.2026", "status": "OK", "rawMonth": 8}, {"nazwisko": "Kaczmarek Michał", "sap": "10000020", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "26.10.2026", "status": "OK", "rawMonth": 9}, {"nazwisko": "Zieliński Agnieszka", "sap": "10000021", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "06.11.2026", "status": "OK", "rawMonth": 10}, {"nazwisko": "Szymańska Tomasz", "sap": "10000022", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "13.12.2026", "status": "OK", "rawMonth": 11}, {"nazwisko": "Dąbrowski Magdalena", "sap": "10000023", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "20.01.2027", "status": "OK", "rawMonth": 0}, {"nazwisko": "Kozłowski Krzysztof", "sap": "10000024", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "27.02.2027", "status": "OK", "rawMonth": 1}, {"nazwisko": "Jankowski Barbara", "sap": "10000025", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "07.08.2026", "status": "OK", "rawMonth": 7}, {"nazwisko": "Mazur Marek", "sap": "10000026", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "14.09.2026", "status": "OK", "rawMonth": 8}, {"nazwisko": "Kwiatkowski Ewa", "sap": "10000027", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "21.10.2026", "status": "OK", "rawMonth": 9}, {"nazwisko": "Krawczyk Grzegorz", "sap": "10000028", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "01.11.2026", "status": "OK", "rawMonth": 10}, {"nazwisko": "Kaczmarczyk Krystyna", "sap": "10000029", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "08.12.2026", "status": "OK", "rawMonth": 11}, {"nazwisko": "Kowalska Wojciech", "sap": "10000030", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "15.01.2027", "status": "OK", "rawMonth": 0}, {"nazwisko": "Nowak Elżbieta", "sap": "10000031", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "22.02.2027", "status": "OK", "rawMonth": 1}, {"nazwisko": "Wiśniewski Anna", "sap": "10000032", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "02.08.2026", "status": "OK", "rawMonth": 7}, {"nazwisko": "Wójcik Piotr", "sap": "10000033", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "09.09.2026", "status": "OK", "rawMonth": 8}, {"nazwisko": "Kowalczyk Jan", "sap": "10000034", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "16.10.2026", "status": "OK", "rawMonth": 9}, {"nazwisko": "Kaczmarek Katarzyna", "sap": "10000035", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "23.11.2026", "status": "OK", "rawMonth": 10}, {"nazwisko": "Zieliński Michał", "sap": "10000036", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "03.12.2026", "status": "OK", "rawMonth": 11}, {"nazwisko": "Szymańska Agnieszka", "sap": "10000037", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "10.01.2027", "status": "OK", "rawMonth": 0}, {"nazwisko": "Dąbrowski Tomasz", "sap": "10000038", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "17.02.2027", "status": "OK", "rawMonth": 1}, {"nazwisko": "Kozłowski Magdalena", "sap": "10000039", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "24.08.2026", "status": "OK", "rawMonth": 7}, {"nazwisko": "Jankowski Krzysztof", "sap": "10000040", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "04.09.2026", "status": "OK", "rawMonth": 8}, {"nazwisko": "Mazur Barbara", "sap": "10000041", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "11.10.2026", "status": "OK", "rawMonth": 9}, {"nazwisko": "Kwiatkowski Marek", "sap": "10000042", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "18.11.2026", "status": "OK", "rawMonth": 10}, {"nazwisko": "Krawczyk Ewa", "sap": "10000043", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "25.12.2026", "status": "OK", "rawMonth": 11}, {"nazwisko": "Kaczmarczyk Grzegorz", "sap": "10000044", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "05.01.2027", "status": "OK", "rawMonth": 0}, {"nazwisko": "Kowalska Krystyna", "sap": "10000045", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "12.02.2027", "status": "OK", "rawMonth": 1}, {"nazwisko": "Nowak Wojciech", "sap": "10000046", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "19.08.2026", "status": "OK", "rawMonth": 7}, {"nazwisko": "Wiśniewski Elżbieta", "sap": "10000047", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "26.09.2026", "status": "OK", "rawMonth": 8}, {"nazwisko": "Wójcik Anna", "sap": "10000048", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "06.10.2026", "status": "OK", "rawMonth": 9}, {"nazwisko": "Kowalczyk Piotr", "sap": "10000049", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "13.11.2026", "status": "OK", "rawMonth": 10}, {"nazwisko": "Kaczmarek Jan", "sap": "10000050", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "20.12.2026", "status": "OK", "rawMonth": 11}, {"nazwisko": "Zieliński Katarzyna", "sap": "10000051", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "27.01.2027", "status": "OK", "rawMonth": 0}, {"nazwisko": "Szymańska Michał", "sap": "10000052", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "07.02.2027", "status": "OK", "rawMonth": 1}, {"nazwisko": "Dąbrowski Agnieszka", "sap": "10000053", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "14.08.2026", "status": "OK", "rawMonth": 7}, {"nazwisko": "Kozłowski Tomasz", "sap": "10000054", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "21.09.2026", "status": "OK", "rawMonth": 8}, {"nazwisko": "Jankowski Magdalena", "sap": "10000055", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "01.10.2026", "status": "OK", "rawMonth": 9}, {"nazwisko": "Mazur Krzysztof", "sap": "10000056", "dzial": "Magazyn", "lok": "Zakład Produkcyjny A", "data": "08.11.2026", "status": "OK", "rawMonth": 10}, {"nazwisko": "Kwiatkowski Barbara", "sap": "10000057", "dzial": "Jakość", "lok": "Zakład Produkcyjny A", "data": "15.12.2026", "status": "OK", "rawMonth": 11}, {"nazwisko": "Krawczyk Marek", "sap": "10000058", "dzial": "Montaż", "lok": "Zakład Produkcyjny A", "data": "22.01.2027", "status": "OK", "rawMonth": 0}, {"nazwisko": "Kaczmarczyk Ewa", "sap": "10000059", "dzial": "Pakowanie", "lok": "Zakład Produkcyjny A", "data": "02.02.2027", "status": "OK", "rawMonth": 1}, {"nazwisko": "Kowalska Grzegorz", "sap": "10000060", "dzial": "Produkcja", "lok": "Zakład Produkcyjny A", "data": "09.08.2026", "status": "OK", "rawMonth": 7}]}; },
  pobierzDaneSzafek: () => { return {"stats": {"total": 65, "zajete": 56, "wolne": 9}, "wolne": ["113", "126", "139", "152", "161", "162", "163", "164", "165"], "bezSzafki": [{"nazwisko": "Krawczyk Krystyna", "sap": "10000013", "dzial": "Montaż"}, {"nazwisko": "Mazur Marek", "sap": "10000026", "dzial": "Magazyn"}, {"nazwisko": "Kozłowski Magdalena", "sap": "10000039", "dzial": "Pakowanie"}, {"nazwisko": "Szymańska Michał", "sap": "10000052", "dzial": "Jakość"}], "zajete": [{"nr": "101", "pracownik": {"nazwisko": "Nowak Piotr", "sap": "10000001", "dzial": "Magazyn", "karta": "1007"}}, {"nr": "102", "pracownik": {"nazwisko": "Wiśniewski Jan", "sap": "10000002", "dzial": "Jakość", "karta": "1014"}}, {"nr": "103", "pracownik": {"nazwisko": "Wójcik Katarzyna", "sap": "10000003", "dzial": "Montaż", "karta": "1021"}}, {"nr": "104", "pracownik": {"nazwisko": "Kowalczyk Michał", "sap": "10000004", "dzial": "Pakowanie", "karta": "1028"}}, {"nr": "105", "pracownik": {"nazwisko": "Kaczmarek Agnieszka", "sap": "10000005", "dzial": "Produkcja", "karta": "1035"}}, {"nr": "106", "pracownik": {"nazwisko": "Zieliński Tomasz", "sap": "10000006", "dzial": "Magazyn", "karta": "1042"}}, {"nr": "107", "pracownik": {"nazwisko": "Szymańska Magdalena", "sap": "10000007", "dzial": "Jakość", "karta": "1049"}}, {"nr": "108", "pracownik": {"nazwisko": "Dąbrowski Krzysztof", "sap": "10000008", "dzial": "Montaż", "karta": "1056"}}, {"nr": "109", "pracownik": {"nazwisko": "Kozłowski Barbara", "sap": "10000009", "dzial": "Pakowanie", "karta": "1063"}}, {"nr": "110", "pracownik": {"nazwisko": "Jankowski Marek", "sap": "10000010", "dzial": "Produkcja", "karta": "1070"}}, {"nr": "111", "pracownik": {"nazwisko": "Mazur Ewa", "sap": "10000011", "dzial": "Magazyn", "karta": "1077"}}, {"nr": "112", "pracownik": {"nazwisko": "Kwiatkowski Grzegorz", "sap": "10000012", "dzial": "Jakość", "karta": "1084"}}, {"nr": "114", "pracownik": {"nazwisko": "Kaczmarczyk Wojciech", "sap": "10000014", "dzial": "Pakowanie", "karta": "1098"}}, {"nr": "115", "pracownik": {"nazwisko": "Kowalska Elżbieta", "sap": "10000015", "dzial": "Produkcja", "karta": "1105"}}, {"nr": "116", "pracownik": {"nazwisko": "Nowak Anna", "sap": "10000016", "dzial": "Magazyn", "karta": "1112"}}, {"nr": "117", "pracownik": {"nazwisko": "Wiśniewski Piotr", "sap": "10000017", "dzial": "Jakość", "karta": "1119"}}, {"nr": "118", "pracownik": {"nazwisko": "Wójcik Jan", "sap": "10000018", "dzial": "Montaż", "karta": "1126"}}, {"nr": "119", "pracownik": {"nazwisko": "Kowalczyk Katarzyna", "sap": "10000019", "dzial": "Pakowanie", "karta": "1133"}}, {"nr": "120", "pracownik": {"nazwisko": "Kaczmarek Michał", "sap": "10000020", "dzial": "Produkcja", "karta": "1140"}}, {"nr": "121", "pracownik": {"nazwisko": "Zieliński Agnieszka", "sap": "10000021", "dzial": "Magazyn", "karta": "1147"}}, {"nr": "122", "pracownik": {"nazwisko": "Szymańska Tomasz", "sap": "10000022", "dzial": "Jakość", "karta": "1154"}}, {"nr": "123", "pracownik": {"nazwisko": "Dąbrowski Magdalena", "sap": "10000023", "dzial": "Montaż", "karta": "1161"}}, {"nr": "124", "pracownik": {"nazwisko": "Kozłowski Krzysztof", "sap": "10000024", "dzial": "Pakowanie", "karta": "1168"}}, {"nr": "125", "pracownik": {"nazwisko": "Jankowski Barbara", "sap": "10000025", "dzial": "Produkcja", "karta": "1175"}}, {"nr": "127", "pracownik": {"nazwisko": "Kwiatkowski Ewa", "sap": "10000027", "dzial": "Jakość", "karta": "1189"}}, {"nr": "128", "pracownik": {"nazwisko": "Krawczyk Grzegorz", "sap": "10000028", "dzial": "Montaż", "karta": "1196"}}, {"nr": "129", "pracownik": {"nazwisko": "Kaczmarczyk Krystyna", "sap": "10000029", "dzial": "Pakowanie", "karta": "1203"}}, {"nr": "130", "pracownik": {"nazwisko": "Kowalska Wojciech", "sap": "10000030", "dzial": "Produkcja", "karta": "1210"}}, {"nr": "131", "pracownik": {"nazwisko": "Nowak Elżbieta", "sap": "10000031", "dzial": "Magazyn", "karta": "1217"}}, {"nr": "132", "pracownik": {"nazwisko": "Wiśniewski Anna", "sap": "10000032", "dzial": "Jakość", "karta": "1224"}}, {"nr": "133", "pracownik": {"nazwisko": "Wójcik Piotr", "sap": "10000033", "dzial": "Montaż", "karta": "1231"}}, {"nr": "134", "pracownik": {"nazwisko": "Kowalczyk Jan", "sap": "10000034", "dzial": "Pakowanie", "karta": "1238"}}, {"nr": "135", "pracownik": {"nazwisko": "Kaczmarek Katarzyna", "sap": "10000035", "dzial": "Produkcja", "karta": "1245"}}, {"nr": "136", "pracownik": {"nazwisko": "Zieliński Michał", "sap": "10000036", "dzial": "Magazyn", "karta": "1252"}}, {"nr": "137", "pracownik": {"nazwisko": "Szymańska Agnieszka", "sap": "10000037", "dzial": "Jakość", "karta": "1259"}}, {"nr": "138", "pracownik": {"nazwisko": "Dąbrowski Tomasz", "sap": "10000038", "dzial": "Montaż", "karta": "1266"}}, {"nr": "140", "pracownik": {"nazwisko": "Jankowski Krzysztof", "sap": "10000040", "dzial": "Produkcja", "karta": "1280"}}, {"nr": "141", "pracownik": {"nazwisko": "Mazur Barbara", "sap": "10000041", "dzial": "Magazyn", "karta": "1287"}}, {"nr": "142", "pracownik": {"nazwisko": "Kwiatkowski Marek", "sap": "10000042", "dzial": "Jakość", "karta": "1294"}}, {"nr": "143", "pracownik": {"nazwisko": "Krawczyk Ewa", "sap": "10000043", "dzial": "Montaż", "karta": "1301"}}, {"nr": "144", "pracownik": {"nazwisko": "Kaczmarczyk Grzegorz", "sap": "10000044", "dzial": "Pakowanie", "karta": "1308"}}, {"nr": "145", "pracownik": {"nazwisko": "Kowalska Krystyna", "sap": "10000045", "dzial": "Produkcja", "karta": "1315"}}, {"nr": "146", "pracownik": {"nazwisko": "Nowak Wojciech", "sap": "10000046", "dzial": "Magazyn", "karta": "1322"}}, {"nr": "147", "pracownik": {"nazwisko": "Wiśniewski Elżbieta", "sap": "10000047", "dzial": "Jakość", "karta": "1329"}}, {"nr": "148", "pracownik": {"nazwisko": "Wójcik Anna", "sap": "10000048", "dzial": "Montaż", "karta": "1336"}}, {"nr": "149", "pracownik": {"nazwisko": "Kowalczyk Piotr", "sap": "10000049", "dzial": "Pakowanie", "karta": "1343"}}, {"nr": "150", "pracownik": {"nazwisko": "Kaczmarek Jan", "sap": "10000050", "dzial": "Produkcja", "karta": "1350"}}, {"nr": "151", "pracownik": {"nazwisko": "Zieliński Katarzyna", "sap": "10000051", "dzial": "Magazyn", "karta": "1357"}}, {"nr": "153", "pracownik": {"nazwisko": "Dąbrowski Agnieszka", "sap": "10000053", "dzial": "Montaż", "karta": "1371"}}, {"nr": "154", "pracownik": {"nazwisko": "Kozłowski Tomasz", "sap": "10000054", "dzial": "Pakowanie", "karta": "1378"}}, {"nr": "155", "pracownik": {"nazwisko": "Jankowski Magdalena", "sap": "10000055", "dzial": "Produkcja", "karta": "1385"}}, {"nr": "156", "pracownik": {"nazwisko": "Mazur Krzysztof", "sap": "10000056", "dzial": "Magazyn", "karta": "1392"}}, {"nr": "157", "pracownik": {"nazwisko": "Kwiatkowski Barbara", "sap": "10000057", "dzial": "Jakość", "karta": "1399"}}, {"nr": "158", "pracownik": {"nazwisko": "Krawczyk Marek", "sap": "10000058", "dzial": "Montaż", "karta": "1406"}}, {"nr": "159", "pracownik": {"nazwisko": "Kaczmarczyk Ewa", "sap": "10000059", "dzial": "Pakowanie", "karta": "1413"}}, {"nr": "160", "pracownik": {"nazwisko": "Kowalska Grzegorz", "sap": "10000060", "dzial": "Produkcja", "karta": "1420"}}], "pracownicy": [{"nazwisko": "Nowak Piotr", "sap": "10000001", "dzial": "Magazyn"}, {"nazwisko": "Wiśniewski Jan", "sap": "10000002", "dzial": "Jakość"}, {"nazwisko": "Wójcik Katarzyna", "sap": "10000003", "dzial": "Montaż"}, {"nazwisko": "Kowalczyk Michał", "sap": "10000004", "dzial": "Pakowanie"}, {"nazwisko": "Kaczmarek Agnieszka", "sap": "10000005", "dzial": "Produkcja"}, {"nazwisko": "Zieliński Tomasz", "sap": "10000006", "dzial": "Magazyn"}, {"nazwisko": "Szymańska Magdalena", "sap": "10000007", "dzial": "Jakość"}, {"nazwisko": "Dąbrowski Krzysztof", "sap": "10000008", "dzial": "Montaż"}, {"nazwisko": "Kozłowski Barbara", "sap": "10000009", "dzial": "Pakowanie"}, {"nazwisko": "Jankowski Marek", "sap": "10000010", "dzial": "Produkcja"}, {"nazwisko": "Mazur Ewa", "sap": "10000011", "dzial": "Magazyn"}, {"nazwisko": "Kwiatkowski Grzegorz", "sap": "10000012", "dzial": "Jakość"}, {"nazwisko": "Krawczyk Krystyna", "sap": "10000013", "dzial": "Montaż"}, {"nazwisko": "Kaczmarczyk Wojciech", "sap": "10000014", "dzial": "Pakowanie"}, {"nazwisko": "Kowalska Elżbieta", "sap": "10000015", "dzial": "Produkcja"}, {"nazwisko": "Nowak Anna", "sap": "10000016", "dzial": "Magazyn"}, {"nazwisko": "Wiśniewski Piotr", "sap": "10000017", "dzial": "Jakość"}, {"nazwisko": "Wójcik Jan", "sap": "10000018", "dzial": "Montaż"}, {"nazwisko": "Kowalczyk Katarzyna", "sap": "10000019", "dzial": "Pakowanie"}, {"nazwisko": "Kaczmarek Michał", "sap": "10000020", "dzial": "Produkcja"}, {"nazwisko": "Zieliński Agnieszka", "sap": "10000021", "dzial": "Magazyn"}, {"nazwisko": "Szymańska Tomasz", "sap": "10000022", "dzial": "Jakość"}, {"nazwisko": "Dąbrowski Magdalena", "sap": "10000023", "dzial": "Montaż"}, {"nazwisko": "Kozłowski Krzysztof", "sap": "10000024", "dzial": "Pakowanie"}, {"nazwisko": "Jankowski Barbara", "sap": "10000025", "dzial": "Produkcja"}, {"nazwisko": "Mazur Marek", "sap": "10000026", "dzial": "Magazyn"}, {"nazwisko": "Kwiatkowski Ewa", "sap": "10000027", "dzial": "Jakość"}, {"nazwisko": "Krawczyk Grzegorz", "sap": "10000028", "dzial": "Montaż"}, {"nazwisko": "Kaczmarczyk Krystyna", "sap": "10000029", "dzial": "Pakowanie"}, {"nazwisko": "Kowalska Wojciech", "sap": "10000030", "dzial": "Produkcja"}, {"nazwisko": "Nowak Elżbieta", "sap": "10000031", "dzial": "Magazyn"}, {"nazwisko": "Wiśniewski Anna", "sap": "10000032", "dzial": "Jakość"}, {"nazwisko": "Wójcik Piotr", "sap": "10000033", "dzial": "Montaż"}, {"nazwisko": "Kowalczyk Jan", "sap": "10000034", "dzial": "Pakowanie"}, {"nazwisko": "Kaczmarek Katarzyna", "sap": "10000035", "dzial": "Produkcja"}, {"nazwisko": "Zieliński Michał", "sap": "10000036", "dzial": "Magazyn"}, {"nazwisko": "Szymańska Agnieszka", "sap": "10000037", "dzial": "Jakość"}, {"nazwisko": "Dąbrowski Tomasz", "sap": "10000038", "dzial": "Montaż"}, {"nazwisko": "Kozłowski Magdalena", "sap": "10000039", "dzial": "Pakowanie"}, {"nazwisko": "Jankowski Krzysztof", "sap": "10000040", "dzial": "Produkcja"}, {"nazwisko": "Mazur Barbara", "sap": "10000041", "dzial": "Magazyn"}, {"nazwisko": "Kwiatkowski Marek", "sap": "10000042", "dzial": "Jakość"}, {"nazwisko": "Krawczyk Ewa", "sap": "10000043", "dzial": "Montaż"}, {"nazwisko": "Kaczmarczyk Grzegorz", "sap": "10000044", "dzial": "Pakowanie"}, {"nazwisko": "Kowalska Krystyna", "sap": "10000045", "dzial": "Produkcja"}, {"nazwisko": "Nowak Wojciech", "sap": "10000046", "dzial": "Magazyn"}, {"nazwisko": "Wiśniewski Elżbieta", "sap": "10000047", "dzial": "Jakość"}, {"nazwisko": "Wójcik Anna", "sap": "10000048", "dzial": "Montaż"}, {"nazwisko": "Kowalczyk Piotr", "sap": "10000049", "dzial": "Pakowanie"}, {"nazwisko": "Kaczmarek Jan", "sap": "10000050", "dzial": "Produkcja"}, {"nazwisko": "Zieliński Katarzyna", "sap": "10000051", "dzial": "Magazyn"}, {"nazwisko": "Szymańska Michał", "sap": "10000052", "dzial": "Jakość"}, {"nazwisko": "Dąbrowski Agnieszka", "sap": "10000053", "dzial": "Montaż"}, {"nazwisko": "Kozłowski Tomasz", "sap": "10000054", "dzial": "Pakowanie"}, {"nazwisko": "Jankowski Magdalena", "sap": "10000055", "dzial": "Produkcja"}, {"nazwisko": "Mazur Krzysztof", "sap": "10000056", "dzial": "Magazyn"}, {"nazwisko": "Kwiatkowski Barbara", "sap": "10000057", "dzial": "Jakość"}, {"nazwisko": "Krawczyk Marek", "sap": "10000058", "dzial": "Montaż"}, {"nazwisko": "Kaczmarczyk Ewa", "sap": "10000059", "dzial": "Pakowanie"}, {"nazwisko": "Kowalska Grzegorz", "sap": "10000060", "dzial": "Produkcja"}] }; },
  pobierzDanePlanowaniaDlaTrybu: () => { return {
  "stats": {
    "dniTotal": 21,
    "dniRem": 8,
    "godzRem": 64
  },
  "lista": [
    {
      "bilans": "99,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000001",
      "dzial": "Magazyn",
      "pozostaly": 35
    },
    {
      "bilans": "98,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000002",
      "dzial": "Jakość",
      "pozostaly": 34
    },
    {
      "bilans": "97,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000003",
      "dzial": "Montaż",
      "pozostaly": 33
    },
    {
      "bilans": "96,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000004",
      "dzial": "Pakowanie",
      "pozostaly": 32
    },
    {
      "bilans": "95,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000005",
      "dzial": "Produkcja",
      "pozostaly": 31
    },
    {
      "bilans": "94,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000006",
      "dzial": "Magazyn",
      "pozostaly": 30
    },
    {
      "bilans": "93,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000007",
      "dzial": "Jakość",
      "pozostaly": 29
    },
    {
      "bilans": "92,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000008",
      "dzial": "Montaż",
      "pozostaly": 28
    },
    {
      "bilans": "91,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000009",
      "dzial": "Pakowanie",
      "pozostaly": 27
    },
    {
      "bilans": "90,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000010",
      "dzial": "Produkcja",
      "pozostaly": 26
    },
    {
      "bilans": "89,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000011",
      "dzial": "Magazyn",
      "pozostaly": 25
    },
    {
      "bilans": "88,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000012",
      "dzial": "Jakość",
      "pozostaly": 24
    },
    {
      "bilans": "87,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000013",
      "dzial": "Montaż",
      "pozostaly": 23
    },
    {
      "bilans": "86,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000014",
      "dzial": "Pakowanie",
      "pozostaly": 22
    },
    {
      "bilans": "85,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000015",
      "dzial": "Produkcja",
      "pozostaly": 21
    },
    {
      "bilans": "84,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000016",
      "dzial": "Magazyn",
      "pozostaly": 20
    },
    {
      "bilans": "83,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000017",
      "dzial": "Jakość",
      "pozostaly": 19
    },
    {
      "bilans": "82,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000018",
      "dzial": "Montaż",
      "pozostaly": 18
    },
    {
      "bilans": "81,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000019",
      "dzial": "Pakowanie",
      "pozostaly": 17
    },
    {
      "bilans": "80,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000020",
      "dzial": "Produkcja",
      "pozostaly": 16
    },
    {
      "bilans": "79,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000021",
      "dzial": "Magazyn",
      "pozostaly": 15
    },
    {
      "bilans": "78,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000022",
      "dzial": "Jakość",
      "pozostaly": 14
    },
    {
      "bilans": "77,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000023",
      "dzial": "Montaż",
      "pozostaly": 13
    },
    {
      "bilans": "76,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000024",
      "dzial": "Pakowanie",
      "pozostaly": 12
    },
    {
      "bilans": "75,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000025",
      "dzial": "Produkcja",
      "pozostaly": 11
    },
    {
      "bilans": "74,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000026",
      "dzial": "Magazyn",
      "pozostaly": 10
    },
    {
      "bilans": "73,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000027",
      "dzial": "Jakość",
      "pozostaly": 9
    },
    {
      "bilans": "72,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000028",
      "dzial": "Montaż",
      "pozostaly": 8
    },
    {
      "bilans": "71,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000029",
      "dzial": "Pakowanie",
      "pozostaly": 7
    },
    {
      "bilans": "70,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000030",
      "dzial": "Produkcja",
      "pozostaly": 6
    },
    {
      "bilans": "69,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000031",
      "dzial": "Magazyn",
      "pozostaly": 5
    },
    {
      "bilans": "68,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000032",
      "dzial": "Jakość",
      "pozostaly": 4
    },
    {
      "bilans": "67,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000033",
      "dzial": "Montaż",
      "pozostaly": 3
    },
    {
      "bilans": "66,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000034",
      "dzial": "Pakowanie",
      "pozostaly": 2
    },
    {
      "bilans": "65,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000035",
      "dzial": "Produkcja",
      "pozostaly": 1
    },
    {
      "bilans": "64,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000036",
      "dzial": "Magazyn",
      "pozostaly": 0
    },
    {
      "bilans": "63,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000037",
      "dzial": "Jakość",
      "pozostaly": 40
    },
    {
      "bilans": "62,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000038",
      "dzial": "Montaż",
      "pozostaly": 39
    },
    {
      "bilans": "61,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000039",
      "dzial": "Pakowanie",
      "pozostaly": 38
    },
    {
      "bilans": "60,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000040",
      "dzial": "Produkcja",
      "pozostaly": 37
    },
    {
      "bilans": "59,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000041",
      "dzial": "Magazyn",
      "pozostaly": 36
    },
    {
      "bilans": "58,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000042",
      "dzial": "Jakość",
      "pozostaly": 35
    },
    {
      "bilans": "57,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000043",
      "dzial": "Montaż",
      "pozostaly": 34
    },
    {
      "bilans": "56,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000044",
      "dzial": "Pakowanie",
      "pozostaly": 33
    },
    {
      "bilans": "55,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000045",
      "dzial": "Produkcja",
      "pozostaly": 32
    },
    {
      "bilans": "54,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000046",
      "dzial": "Magazyn",
      "pozostaly": 31
    },
    {
      "bilans": "53,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000047",
      "dzial": "Jakość",
      "pozostaly": 30
    },
    {
      "bilans": "52,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000048",
      "dzial": "Montaż",
      "pozostaly": 29
    },
    {
      "bilans": "51,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000049",
      "dzial": "Pakowanie",
      "pozostaly": 28
    },
    {
      "bilans": "50,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000050",
      "dzial": "Produkcja",
      "pozostaly": 27
    },
    {
      "bilans": "49,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Nowak",
      "imie": "Piotr",
      "sapId": "10000051",
      "dzial": "Magazyn",
      "pozostaly": 26
    },
    {
      "bilans": "48,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wiśniewski",
      "imie": "Jan",
      "sapId": "10000052",
      "dzial": "Jakość",
      "pozostaly": 25
    },
    {
      "bilans": "47,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Wójcik",
      "imie": "Katarzyna",
      "sapId": "10000053",
      "dzial": "Montaż",
      "pozostaly": 24
    },
    {
      "bilans": "46,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalczyk",
      "imie": "Michał",
      "sapId": "10000054",
      "dzial": "Pakowanie",
      "pozostaly": 23
    },
    {
      "bilans": "45,50",
      "nadgodziny": "5,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kaczmarek",
      "imie": "Agnieszka",
      "sapId": "10000055",
      "dzial": "Produkcja",
      "pozostaly": 22
    },
    {
      "bilans": "44,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Zieliński",
      "imie": "Tomasz",
      "sapId": "10000056",
      "dzial": "Magazyn",
      "pozostaly": 21
    },
    {
      "bilans": "43,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Szymańska",
      "imie": "Magdalena",
      "sapId": "10000057",
      "dzial": "Jakość",
      "pozostaly": 20
    },
    {
      "bilans": "42,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Dąbrowski",
      "imie": "Krzysztof",
      "sapId": "10000058",
      "dzial": "Montaż",
      "pozostaly": 19
    },
    {
      "bilans": "41,50",
      "nadgodziny": "",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kozłowski",
      "imie": "Barbara",
      "sapId": "10000059",
      "dzial": "Pakowanie",
      "pozostaly": 18
    },
    {
      "bilans": "40,50",
      "nadgodziny": "0,0",
      "etat": "1/1",
      "bg": "#ffffff",
      "nazwisko": "Kowalska",
      "imie": "Anna",
      "sapId": "10000060",
      "dzial": "Produkcja",
      "pozostaly": 17
    }
  ]
}; },
  pobierzDaneRaportu: () => { return [["10000001", "Nowak Piotr", 1180, 0, 0, 8, 0, 0, 80], ["10000002", "Wiśniewski Jan", 1180, 0, 16, 0, 24, 0, 40], ["10000003", "Wójcik Katarzyna", 1240, 0, 0, 0, 24, 8, 40], ["10000004", "Kowalczyk Michał", 1400, 0, 16, 16, 0, 0, 160], ["10000005", "Kaczmarek Agnieszka", 1320, 40, 0, 0, 8, 0, 104], ["10000006", "Zieliński Tomasz", 1280, 0, 0, 0, 0, 0, 40], ["10000007", "Szymańska Magdalena", 1320, 40, 0, 8, 0, 8, 120], ["10000008", "Dąbrowski Krzysztof", 1400, 0, 0, 0, 24, 0, 0], ["10000009", "Kozłowski Barbara", 1400, 40, 0, 0, 0, 0, 0], ["10000010", "Jankowski Marek", 1280, 40, 0, 0, 0, 0, 120], ["10000011", "Mazur Ewa", 1320, 8, 16, 8, 0, 0, 104], ["10000012", "Kwiatkowski Grzegorz", 1280, 24, 0, 0, 24, 8, 80], ["10000013", "Krawczyk Krystyna", 1400, 24, 0, 0, 8, 0, 104], ["10000014", "Kaczmarczyk Wojciech", 1180, 24, 8, 0, 0, 0, 80], ["10000015", "Kowalska Elżbieta", 1440, 0, 0, 16, 0, 0, 80], ["10000016", "Nowak Anna", 1400, 24, 0, 0, 8, 0, 0], ["10000017", "Wiśniewski Piotr", 1360, 0, 0, 0, 0, 8, 160], ["10000018", "Wójcik Jan", 1400, 0, 16, 16, 24, 0, 104], ["10000019", "Kowalczyk Katarzyna", 1280, 0, 8, 16, 0, 0, 40], ["10000020", "Kaczmarek Michał", 1280, 24, 0, 16, 24, 0, 120], ["10000021", "Zieliński Agnieszka", 1360, 16, 0, 8, 24, 0, 0], ["10000022", "Szymańska Tomasz", 1180, 0, 16, 8, 0, 0, 104], ["10000023", "Dąbrowski Magdalena", 1360, 0, 0, 0, 0, 8, 80], ["10000024", "Kozłowski Krzysztof", 1400, 0, 16, 8, 24, 8, 80], ["10000025", "Jankowski Barbara", 1280, 0, 0, 0, 24, 0, 120], ["10000026", "Mazur Marek", 1240, 0, 0, 8, 0, 0, 80], ["10000027", "Kwiatkowski Ewa", 1400, 0, 0, 16, 0, 8, 80], ["10000028", "Krawczyk Grzegorz", 1280, 24, 0, 0, 0, 8, 160], ["10000029", "Kaczmarczyk Krystyna", 1360, 0, 8, 0, 0, 0, 0], ["10000030", "Kowalska Wojciech", 1180, 0, 0, 16, 0, 0, 80], ["10000031", "Nowak Elżbieta", 1240, 0, 0, 0, 24, 0, 40], ["10000032", "Wiśniewski Anna", 1240, 24, 16, 0, 0, 0, 40], ["10000033", "Wójcik Piotr", 1440, 0, 0, 0, 0, 8, 120], ["10000034", "Kowalczyk Jan", 1280, 16, 0, 16, 0, 0, 120], ["10000035", "Kaczmarek Katarzyna", 1280, 0, 0, 16, 0, 0, 120], ["10000036", "Zieliński Michał", 1360, 40, 16, 0, 0, 0, 120], ["10000037", "Szymańska Agnieszka", 1180, 0, 0, 0, 0, 0, 160], ["10000038", "Dąbrowski Tomasz", 1360, 0, 0, 0, 0, 0, 80], ["10000039", "Kozłowski Magdalena", 1440, 0, 0, 0, 0, 8, 160], ["10000040", "Jankowski Krzysztof", 1440, 0, 0, 0, 0, 0, 120], ["10000041", "Mazur Barbara", 1360, 0, 0, 0, 0, 0, 40], ["10000042", "Kwiatkowski Marek", 1360, 0, 0, 8, 8, 8, 0], ["10000043", "Krawczyk Ewa", 1440, 16, 16, 16, 0, 0, 104], ["10000044", "Kaczmarczyk Grzegorz", 1280, 0, 8, 0, 0, 0, 40], ["10000045", "Kowalska Krystyna", 1400, 8, 8, 0, 0, 8, 40], ["10000046", "Nowak Wojciech", 1440, 0, 0, 0, 0, 0, 40], ["10000047", "Wiśniewski Elżbieta", 1400, 0, 8, 0, 24, 0, 120], ["10000048", "Wójcik Anna", 1180, 16, 8, 8, 0, 0, 0], ["10000049", "Kowalczyk Piotr", 1180, 0, 0, 8, 8, 0, 0], ["10000050", "Kaczmarek Jan", 1180, 0, 0, 8, 0, 0, 120], ["10000051", "Zieliński Katarzyna", 1400, 16, 0, 0, 24, 0, 160], ["10000052", "Szymańska Michał", 1320, 0, 0, 0, 0, 0, 104], ["10000053", "Dąbrowski Agnieszka", 1280, 8, 8, 8, 24, 8, 160], ["10000054", "Kozłowski Tomasz", 1240, 24, 8, 8, 0, 0, 104], ["10000055", "Jankowski Magdalena", 1240, 0, 16, 0, 0, 0, 160], ["10000056", "Mazur Krzysztof", 1280, 24, 0, 0, 0, 8, 120], ["10000057", "Kwiatkowski Barbara", 1320, 40, 0, 0, 8, 0, 40], ["10000058", "Krawczyk Marek", 1240, 0, 0, 8, 0, 8, 120], ["10000059", "Kaczmarczyk Ewa", 1400, 24, 0, 0, 0, 0, 0], ["10000060", "Kowalska Grzegorz", 1280, 16, 0, 8, 24, 8, 80]]; },
  sprawdzSync: () => { return null; },
  zapiszPracownika: () => { return "OK"; },
  usunPracownikaBaza: () => { return "OK"; },
  zapiszSzafkeIKarte: () => { return "OK"; },
  zwolnijSzafke: () => { return "OK"; },
  wgrajDaneZExcela: () => { return { totalLimitG: 12000, trybAktualny: "BIEZACY", dniOsiagnalne: 21, matrix: [["","",1,2],["Nowak Piotr","10000001",1,2],["Wiśniewski Jan","10000002",1,2],["Wójcik Katarzyna","10000003",1,2],["Kowalczyk Michał","10000004",1,2],["Kaczmarek Agnieszka","10000005",1,2],["Zieliński Tomasz","10000006",1,2],["Szymańska Magdalena","10000007",1,2],["Dąbrowski Krzysztof","10000008",1,2],["Kozłowski Barbara","10000009",1,2],["Jankowski Marek","10000010",1,2],["Mazur Ewa","10000011",1,2],["Kwiatkowski Grzegorz","10000012",1,2],["Krawczyk Krystyna","10000013",1,2],["Kaczmarczyk Wojciech","10000014",1,2],["Kowalska Elżbieta","10000015",1,2],["Nowak Anna","10000016",1,2],["Wiśniewski Piotr","10000017",1,2],["Wójcik Jan","10000018",1,2],["Kowalczyk Katarzyna","10000019",1,2],["Kaczmarek Michał","10000020",1,2],["Zieliński Agnieszka","10000021",1,2],["Szymańska Tomasz","10000022",1,2],["Dąbrowski Magdalena","10000023",1,2],["Kozłowski Krzysztof","10000024",1,2],["Jankowski Barbara","10000025",1,2],["Mazur Marek","10000026",1,2],["Kwiatkowski Ewa","10000027",1,2],["Krawczyk Grzegorz","10000028",1,2],["Kaczmarczyk Krystyna","10000029",1,2],["Kowalska Wojciech","10000030",1,2],["Nowak Elżbieta","10000031",1,2],["Wiśniewski Anna","10000032",1,2],["Wójcik Piotr","10000033",1,2],["Kowalczyk Jan","10000034",1,2],["Kaczmarek Katarzyna","10000035",1,2],["Zieliński Michał","10000036",1,2],["Szymańska Agnieszka","10000037",1,2],["Dąbrowski Tomasz","10000038",1,2],["Kozłowski Magdalena","10000039",1,2],["Jankowski Krzysztof","10000040",1,2],["Mazur Barbara","10000041",1,2],["Kwiatkowski Marek","10000042",1,2],["Krawczyk Ewa","10000043",1,2],["Kaczmarczyk Grzegorz","10000044",1,2],["Kowalska Krystyna","10000045",1,2],["Nowak Wojciech","10000046",1,2],["Wiśniewski Elżbieta","10000047",1,2],["Wójcik Anna","10000048",1,2],["Kowalczyk Piotr","10000049",1,2],["Kaczmarek Jan","10000050",1,2],["Zieliński Katarzyna","10000051",1,2],["Szymańska Michał","10000052",1,2],["Dąbrowski Agnieszka","10000053",1,2],["Kozłowski Tomasz","10000054",1,2],["Jankowski Magdalena","10000055",1,2],["Mazur Krzysztof","10000056",1,2],["Kwiatkowski Barbara","10000057",1,2],["Krawczyk Marek","10000058",1,2],["Kaczmarczyk Ewa","10000059",1,2],["Kowalska Grzegorz","10000060",1,2]] }; },

  pobierzKartyServer: () => {
    const data = MOCK_DATA["Karty"];
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
  },

  pobierzKartySzufladaServer: () => {
    return MOCK_KARTY_SZUFLADA;
  },
  
  zapiszKartySzufladaServer: (noweKarty) => {
    MOCK_KARTY_SZUFLADA = noweKarty;
    return "Zaktualizowano listę kart w biurze.";
  },

  pobierzDostepneMiesiace: () => {
    return ["Czerwiec 2026"];
  },

  pobierzEwidencjeMiesiaca: (nazwaMiesiaca) => {
    const data = MOCK_DATA[nazwaMiesiaca] || [];
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
              if (rotDate.getMonth() === dzisiaj.getMonth() && rotDate.getFullYear() === dzisiaj.getFullYear()) stats.rotujacy++;
          }
      }

      if (!rotacjaPrzeszla) stats.wszyscy++;

      lista.push({
        id: "miesiac_row_" + i,
        imie: imie,
        sap: safeStr(row[2], ""), 
        dzial: safeStr(row[3], ""), 
        telefon: safeStr(row[4], ""), 
        brygada: safeStr(row[5], ""), 
        dataRotacji: rotacja,
        dataStartuRaw: "2026-06-01",
        dataStartuFormat: "01.05.2026"
      });
    }
    return { miesiac: nazwaMiesiaca, pracownicy: lista, stats: stats };
  },

  pobierzBazePracownikow: () => {
    const data = MOCK_DATA["Przedłużanie umów"] || [];
    let wszyscy = 0, wOnboardingu = 0, wdrozeni = 0;
    let lista = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const imie = safeStr(row[0], "");
      if (!imie || imie === "-") continue; 

      wszyscy++;
      const statusOnboardingu = safeStr(row[2], "Nie dotyczy");
      const stLower = statusOnboardingu.toLowerCase();
      
      if (stLower === "nie dotyczy" || statusOnboardingu === "-" || stLower.includes("po 2")) {
          wdrozeni++;
      } else {
          wOnboardingu++;
      }

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
        trwajacaOd: safeStr(row[9]),
        trwajacaDo: safeStr(row[10]),
        koniecUmowyRaw: new Date(safeStr(row[10])).getTime() || 0,
        statusAkcji: safeStr(row[11]),
        historia: { tyg: [], dwaTyg: [], mies: [] },
        notatki: ""
      });
    }
    return { statystyki: { wszyscy, wOnboardingu, wdrozeni }, lista };
  },

  zapiszDateRotacjiServer: (imie, dataStr, nazwaMiesiaca) => {
    let sheet = MOCK_DATA[nazwaMiesiaca];
    if(!sheet) return "Error";
    let valToSet = "";
    if (dataStr) {
       const [y, m, d] = dataStr.split('-');
       valToSet = `${d}.${m}.${y}`;
    }
    for (let i = 1; i < sheet.length; i++) {
      if (isSamePerson(String(sheet[i][1]), imie)) {
        sheet[i][12] = valToSet;
        return valToSet ? "Zapisano datę rotacji!" : "Usunięto datę rotacji (Pracownik zostaje).";
      }
    }
    return "OK";
  },

  zapiszKarteServer: (dane) => {
    let sheet = MOCK_DATA["Karty"];
    const pelneImie = toTitleCase(dane.imie.trim());
    let valAktywacja = dane.status === "Wydana" ? "Aktywowana" : "";
    let valZwrot = dane.status === "Oddana" ? "Tak" : ""; 

    if (dane.stareImie) {
        for(let i=1; i<sheet.length; i++) {
            if(String(sheet[i][1]).trim() === dane.stareImie) { 
                sheet[i] = [dane.kadrowy, pelneImie, dane.nrKarty, dane.dzial, valAktywacja, valZwrot];
                return "Zaktualizowano dane karty!";
            }
        }
    }
    sheet.push([dane.kadrowy, pelneImie, dane.nrKarty, dane.dzial, valAktywacja, valZwrot]);
    return "Przypisano nową kartę i dodano do bazy!";
  },

  usunKarteServer: (kadrowy, imie) => {
    let sheet = MOCK_DATA["Karty"];
    for (let i = sheet.length - 1; i >= 1; i--) {
      if (String(sheet[i][0]).trim() === String(kadrowy).trim() && String(sheet[i][1]).trim() === String(imie).trim()) {
        sheet.splice(i, 1);
        return "Karta usunięta z systemu pomyślnie.";
      }
    }
    return "OK";
  },

  zmienStatusOnboardinguServer: (imie, nowyStatus) => {
    let sheet = MOCK_DATA["Przedłużanie umów"];
    for (let i = 1; i < sheet.length; i++) {
      if (isSamePerson(String(sheet[i][0]), imie)) {
        sheet[i][2] = nowyStatus;
        return "OK";
      }
    }
    return "OK";
  },
  
  dodajNotatkeUmowyServer: (imie, tresc) => {
    return "Zapisano notatkę w mocku";
  },
  
  edytujPracownikaMiesiacServer: (stareImie, dane, nazwaMiesiaca) => {
    return "Edytowano pracownika";
  },
  
  dodajPracownikaMiesiacServer: (dane, nazwaMiesiaca) => {
    return "Dodano pracownika";
  },
  
  dodajDoNajnowszegoTygodniaServer: (dane) => {
    return "Dodano do tygodnia";
  },
  
  wgrajRaportIAktualizuj: (dane) => { return "Wgrano raport"; },
  synchronizujPelnySystemServer: () => { return "Zsynchronizowano system z mockiem"; },
  usunPracownikaZBazyUmowServer: (imie) => { return "Usunięto pracownika z umów"; },
  wystawZbiorczoIGenerujTydzienServer: (k) => { return "Wystawiono nowy tydzień w mocku"; },
  edytujTrwajacaUmoweServer: (i, o, d) => { return "Edytowano umowę"; },
  dodajZbiorczoDoAktualnegoTygodniaServer: (k) => { return "Dodano zbiorczo"; },
  przywrocPracownikaServer: (i, d, m, k) => { return "Przywrócono pracownika do systemu"; }
};

function makeRunner() {
  // Each access to google.script.run returns a fresh runner so concurrent
  // call chains keep their own success/failure handlers (no shared-state race).
  const runner = {
    _success: null,
    _failure: null,
    withSuccessHandler: function(cb) { this._success = cb; return this; },
    withFailureHandler: function(cb) { this._failure = cb; return this; }
  };
  Object.keys(window.googleHandlers).forEach(m => {
    runner[m] = function(...args) {
      const ok = this._success, fail = this._failure;
      setTimeout(() => {
        const res = runMock(m, args);
        if (res.error && fail) fail(new Error(res.error));
        else if (!res.error && ok) ok(res.result);
      }, 150);
    };
  });
  return runner;
}

window.google = {
  script: {
    get run() { return makeRunner(); }
  }
};
