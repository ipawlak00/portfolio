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
      "2026-05-02",
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
      "2026-05-03",
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
      "2026-05-04",
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
      "2026-05-05",
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
      "2026-05-06",
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
      "2026-05-07",
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
      "2026-05-08",
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
      "2026-05-09",
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
      "2026-05-10",
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
      "2026-05-11",
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
      "2026-05-12",
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
      "2026-05-13",
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
      "2026-05-14",
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
      "2026-05-15",
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
      "2026-05-16",
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
      "2026-05-17",
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
      "2026-05-18",
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
      "2026-05-19",
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
      "2026-05-20",
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
      "2026-05-21",
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
      "2026-05-22",
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
      "2026-05-23",
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
      "2026-05-24",
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
      "2026-05-25",
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
      "2026-05-26",
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
      "2026-05-27",
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
      "2026-05-28",
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
      "2026-05-01",
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
      "2026-05-02",
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
      "2026-05-03",
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
      "2026-05-04",
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
      "2026-05-05",
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
      "2026-05-06",
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
      "2026-05-07",
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
      "2026-05-08",
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
      "2026-05-09",
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
      "2026-05-10",
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
      "2026-05-11",
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
      "2026-05-12",
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
      "2026-05-13",
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
      "2026-05-14",
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
      "2026-05-15",
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
      "2026-05-16",
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
      "2026-05-17",
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
      "2026-05-18",
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
      "2026-05-19",
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
      "2026-05-20",
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
      "2026-05-21",
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
      "2026-05-22",
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
      "2026-05-23",
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
      "2026-05-24",
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
      "2026-05-25",
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
      "2026-05-26",
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
      "2026-05-27",
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
      "2026-05-28",
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
      "2026-05-01",
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
      "2026-05-02",
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
      "2026-05-03",
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
      "2026-05-04",
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
      "2026-05-05",
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
      "2026-05-02",
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
      "2026-05-03",
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
      "2026-05-04",
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
      "2026-05-05",
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
      "2026-05-06",
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
      "2026-05-07",
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
      "2026-05-08",
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
      "2026-05-09",
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
      "2026-05-10",
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
      "2026-05-11",
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
      "2026-05-12",
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
      "2026-05-13",
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
      "2026-05-14",
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
      "2026-05-15",
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
      "2026-05-16",
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
      "2026-05-17",
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
      "2026-05-18",
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
      "2026-05-19",
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
      "2026-05-20",
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
      "2026-05-21",
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
      "2026-05-22",
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
      "2026-05-23",
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
      "2026-05-24",
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
      "2026-05-25",
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
      "2026-05-26",
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
      "2026-05-27",
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
      "2026-05-28",
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
      "2026-05-01",
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
      "2026-05-02",
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
      "2026-05-03",
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
      "2026-05-04",
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
      "2026-05-05",
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
      "2026-05-06",
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
      "2026-05-07",
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
      "2026-05-08",
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
      "2026-05-09",
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
      "2026-05-10",
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
      "2026-05-11",
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
      "2026-05-12",
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
      "2026-05-13",
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
      "2026-05-14",
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
      "2026-05-15",
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
      "2026-05-16",
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
      "2026-05-17",
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
      "2026-05-18",
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
      "2026-05-19",
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
      "2026-05-20",
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
      "2026-05-21",
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
      "2026-05-22",
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
      "2026-05-23",
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
      "2026-05-24",
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
      "2026-05-25",
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
      "2026-05-26",
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
      "2026-05-27",
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
      "2026-05-28",
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
      "2026-05-01",
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
      "2026-05-02",
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
      "2026-05-03",
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
      "2026-05-04",
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
      "2026-05-05",
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
    console.error("Mock handler Error in " + fnName + ":", e);
    return { error: e.message, result: null };
  }
}

window.googleHandlers = {
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
        dataStartuRaw: "2026-05-01",
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

window.google = {
  script: {
    get run() {
      let runner = {
        _success: null,
        _failure: null,
        withSuccessHandler: function(cb) { this._success = cb; return this; },
        withFailureHandler: function(cb) { this._failure = cb; return this; }
      };
      
      const methods = Object.keys(window.googleHandlers);
      methods.forEach(m => {
        runner[m] = function(...args) {
          const successCb = this._success;
          const failureCb = this._failure;
          setTimeout(() => {
            const res = runMock(m, args);
            if (res.error && failureCb) failureCb(new Error(res.error));
            else if (!res.error && successCb) successCb(res.result);
          }, 150);
        };
      });
      return runner;
    }
  }
};
