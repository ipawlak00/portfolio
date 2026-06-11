import React, { useState, useEffect, useRef } from "react";
import { BarChart3, Calculator, ListOrdered, Users, CheckCircle2, Battery, Zap, ShieldCheck, X } from "lucide-react";

interface Client {
  id: string;
  name: string;
  ind: string;
  nip: string;
  contact: string;
  email: string;
  phone: string;
  region: string;
}

interface Order {
  id: number;
  clientId: string;
  clientName: string;
  cat: "hw" | "sf" | "wd" | "su";
  rev: number;
  status: "Zrealizowane" | "W realizacji" | "Oczekuje na płatność" | "Odrzucone";
  dateStr: string;
  shortDate: string;
  salesperson: string;
}

interface DailyRecord {
  dateObj: Date;
  dateStr: string;
  shortDate: string;
  orders: number;
  realized: number;
  rejected: number;
  revenue: number;
  prevOrders: number;
  prevRevenue: number;
  ordersList: Order[];
  isToday: boolean;
}

interface CrmMockupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrmMockup({ isOpen, onClose }: CrmMockupProps) {
  // ----------------------------------------------------
  // Mock Data & Seed
  // ----------------------------------------------------
  const catNames = {
    hw: "Fotowoltaika (Panele)",
    sf: "Licencje Monitoringu SaaS",
    wd: "Montaż i Przyłącze",
    su: "Serwis i Wsparcie Tech"
  };

  const initialClients: Client[] = [
    { id: "c1", name: "Helios Energy Sp. z o.o.", ind: "Produkcja", nip: "525-244-12-89", contact: "Mariusz Wiśniewski", email: "m.wisniewski@helios.pl", phone: "+48 501 102 203", region: "Północ" },
    { id: "c2", name: "EkoVolt Solutions", ind: "Rolnictwo", nip: "676-981-44-11", contact: "Anna Nowak-Kowalska", email: "onboarding@ekovolt.pl", phone: "+48 602 203 304", region: "Południe" },
    { id: "c3", name: "SunTech Gliwice", ind: "Usługi", nip: "951-404-50-60", contact: "Piotr Zając", email: "p.zajac@suntech.pl", phone: "+48 703 304 405", region: "Zachód" },
    { id: "c4", name: "Polka-Solar Fabryka", ind: "Przemysł", nip: "118-202-30-40", contact: "Jacek Szymański", email: "j.szymanski@polkasolar.pl", phone: "+48 888 123 456", region: "Wschód" },
  ];

  const salespeople = ["Kamil Wiśniewski", "Marek Podolski", "Karolina Mazur", "Tomasz Zieliński"];

  const [clients, setClients] = useState<Client[]>(initialClients);
  const [allData, setAllData] = useState<DailyRecord[]>([]);
  const [globalOrders, setGlobalOrders] = useState<Order[]>([]);
  const [currentFilteredData, setCurrentFilteredData] = useState<DailyRecord[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  
  // App layouts / state
  const [mobileLayout, setMobileLayout] = useState<"phone" | "dash">("phone");
  const [currentPhoneTab, setCurrentPhoneTab] = useState<"kpi" | "orders" | "clients" | "calc">("kpi");
  const [selectedPhoneOrderId, setSelectedPhoneOrderId] = useState<number | null>(null);
  const [selectedPhoneClientId, setSelectedPhoneClientId] = useState<string | null>(null);
  const [dashboardTab, setDashboardTab] = useState<"realization" | "orders">("realization");
  const [selectedDashboardCategory, setSelectedDashboardCategory] = useState<"hw" | "sf" | "wd" | "su" | null>(null);
  
  // Region & Metric Filter in B2B Panel
  const [selectedRegion, setSelectedRegion] = useState<string>("Wszystkie");
  const [perfMetric, setPerfMetric] = useState<"revenue" | "orders">("revenue");

  // Notifications
  const [logs, setLogs] = useState<string[]>([
    "Inicjalizacja systemu synchronizacji Looker Studio...",
    "Połączono z bazą danych AppSheets Live.",
    "Baza klientów zaimportowana pomyślnie."
  ]);

  // Form States
  const [formOrders, setFormOrders] = useState<string>("");
  const [formRejected, setFormRejected] = useState<string>("");
  const [formRevenue, setFormRevenue] = useState<string>("");

  // New Order Modal
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderClientId, setNewOrderClientId] = useState("");
  const [newOrderCat, setNewOrderCat] = useState<"hw" | "sf" | "wd" | "su">("hw");
  const [newOrderRev, setNewOrderRev] = useState("");
  const [newOrderSalesperson, setNewOrderSalesperson] = useState("");
  const [newOrderStatus, setNewOrderStatus] = useState<Order["status"]>("Zrealizowane");

  // Pricing calculator state
  const [calcCapacity, setCalcCapacity] = useState<number>(10); // kWp
  const [calcBattery, setCalcBattery] = useState<boolean>(true);
  const [calcInverter, setCalcInverter] = useState<string>("Huawei Hybrid 10KTL");
  const [calcPanels, setCalcPanels] = useState<string>("Jinko 430W Black Frame");
  const [calcService, setCalcService] = useState<boolean>(true);
  const [calcDiscount, setCalcDiscount] = useState<number>(5); // percent
  const [calcClientName, setCalcClientName] = useState<string>("");

  // UI flashing state on updates
  const [flashUpdate, setFlashUpdate] = useState(false);

  // Time for status bars
  const [timeStr, setTimeStr] = useState("12:45");

  useEffect(() => {
    const t = new Date();
    setTimeStr(t.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }));
    
    // Seed historic records
    let orderIdCounter = 4001;
    const records: DailyRecord[] = [];
    let initialGlobalOrdersList: Order[] = [];
    
    const startBaseDate = new Date(2026, 4, 21); // Set around May 2026
    const catKeys: ("hw" | "sf" | "wd" | "su")[] = ["hw", "sf", "wd", "su"];
    
    // 15 days of historical data
    for (let i = 14; i >= 1; i--) {
      let d = new Date(startBaseDate);
      d.setDate(d.getDate() - i);
      let dateStr = d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
      let shortDate = d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
      
      let dailyOrdersCount = Math.floor(Math.random() * 5) + 3; // 3-7 orders
      let rejected = Math.floor(Math.random() * 2);
      let realized = dailyOrdersCount - rejected;
      let revenue = 0;
      let dailyOrders: Order[] = [];
      
      for (let j = 0; j < realized; j++) {
        let c = initialClients[Math.floor(Math.random() * initialClients.length)];
        let cat = catKeys[Math.floor(Math.random() * catKeys.length)];
        let salesperson = salespeople[Math.floor(Math.random() * salespeople.length)];
        let val = Math.floor(Math.random() * 32000) + 12000;
        
        let o: Order = {
          id: orderIdCounter++,
          clientId: c.id,
          clientName: c.name,
          cat: cat,
          rev: val,
          status: "Zrealizowane",
          dateStr: dateStr,
          shortDate: shortDate,
          salesperson: salesperson
        };
        dailyOrders.push(o);
        initialGlobalOrdersList.push(o);
        revenue += val;
      }

      for (let j = 0; j < rejected; j++) {
        let c = initialClients[Math.floor(Math.random() * initialClients.length)];
        let cat = catKeys[Math.floor(Math.random() * catKeys.length)];
        let salesperson = salespeople[Math.floor(Math.random() * salespeople.length)];
        
        let o: Order = {
          id: orderIdCounter++,
          clientId: c.id,
          clientName: c.name,
          cat: cat,
          rev: 0,
          status: "Odrzucone",
          dateStr: dateStr,
          shortDate: shortDate,
          salesperson: salesperson
        };
        dailyOrders.push(o);
        initialGlobalOrdersList.push(o);
      }
      
      records.push({
        dateObj: d,
        dateStr: dateStr,
        shortDate: shortDate,
        orders: dailyOrdersCount,
        realized: realized,
        rejected: rejected,
        revenue: revenue,
        prevOrders: Math.floor(Math.random() * 4) + 4,
        prevRevenue: Math.floor(Math.random() * 80000) + 40000,
        ordersList: dailyOrders,
        isToday: false
      });
    }

    // Today record template
    records.push({
      dateObj: startBaseDate,
      dateStr: startBaseDate.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }),
      shortDate: startBaseDate.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" }),
      orders: 0,
      realized: 0,
      rejected: 0,
      revenue: 0,
      prevOrders: 5,
      prevRevenue: 85000,
      ordersList: [],
      isToday: true
    });

    setAllData(records);
    setGlobalOrders(initialGlobalOrdersList);
    setSelectedDateIndex(records.length - 1);
  }, []);

  // Update current filtered days
  useEffect(() => {
    if (allData.length > 0) {
      const filtered = allData.slice(Math.max(0, selectedDateIndex - 10), selectedDateIndex + 1);
      setCurrentFilteredData(filtered);
    }
  }, [allData, selectedDateIndex]);

  if (!isOpen) return null;

  // Calculators
  const priceBasePerKwp = calcPanels.includes("Trina") ? 2900 : calcPanels.includes("SunPower") ? 4200 : 3100;
  const priceInverter = calcInverter.includes("Hybrid") ? 8200 : calcInverter.includes("Fronius") ? 7500 : 5400;
  const priceBattery = calcBattery ? 16500 : 0;
  const priceService = calcService ? 1200 : 0;
  const rawSubtotal = (calcCapacity * priceBasePerKwp) + priceInverter + priceBattery + priceService;
  const discountAmount = Math.round(rawSubtotal * (calcDiscount / 100));
  const calcTotal = Math.max(0, rawSubtotal - discountAmount);

  // Auto calculated forms
  const calculatedRealized = Math.max(0, (parseInt(formOrders) || 0) - (parseInt(formRejected) || 0));

  const addLog = (msg: string) => {
    const t = new Date();
    const time = t.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 15));
  };

  // Submit report from mobile app to B2B Desktop
  const submitKpiReport = () => {
    const ords = parseInt(formOrders) || 0;
    const rejs = parseInt(formRejected) || 0;
    const rev = parseFloat(formRevenue.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;

    if (ords < 0 || rejs < 0 || ords < rejs) {
      alert("Błąd: Liczba zamówień nie może być mniejsza niż odrzuconych!");
      return;
    }

    const todayRecordIndex = allData.length - 1;
    const today = allData[todayRecordIndex];
    
    // Create actual simulated orders
    let localOrders: Order[] = [];
    const avgRev = rejs < ords ? Math.round(rev / (ords - rejs)) : 0;
    
    for (let i = 0; i < (ords - rejs); i++) {
      let c = clients[i % clients.length];
      let sol = salespeople[i % salespeople.length];
      localOrders.push({
        id: 9000 + i + Math.floor(Math.random() * 100),
        clientId: c.id,
        clientName: c.name,
        cat: "hw",
        rev: avgRev,
        status: "Zrealizowane",
        dateStr: today.dateStr,
        shortDate: today.shortDate,
        salesperson: sol
      });
    }

    for (let i = 0; i < rejs; i++) {
      let c = clients[(i + 1) % clients.length];
      let sol = salespeople[i % salespeople.length];
      localOrders.push({
        id: 9500 + i + Math.floor(Math.random() * 100),
        clientId: c.id,
        clientName: c.name,
        cat: "hw",
        rev: 0,
        status: "Odrzucone",
        dateStr: today.dateStr,
        shortDate: today.shortDate,
        salesperson: sol
      });
    }

    const updatedData = [...allData];
    updatedData[todayRecordIndex] = {
      ...today,
      orders: ords,
      realized: ords - rejs,
      rejected: rejs,
      revenue: rev,
      ordersList: localOrders,
      isToday: false // make it permanent
    };

    // Append next today record
    const nextDate = new Date(today.dateObj);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
    const nextShortDate = nextDate.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });

    updatedData.push({
      dateObj: nextDate,
      dateStr: nextDateStr,
      shortDate: nextShortDate,
      orders: 0,
      realized: 0,
      rejected: 0,
      revenue: 0,
      prevOrders: Math.floor(Math.random() * 4) + 4,
      prevRevenue: Math.floor(Math.random() * 70000) + 40000,
      ordersList: [],
      isToday: true
    });

    setAllData(updatedData);
    setGlobalOrders((prev) => [...prev, ...localOrders]);
    setSelectedDateIndex(updatedData.length - 1);
    
    // Flash dashboard
    setFlashUpdate(true);
    setTimeout(() => setFlashUpdate(false), 900);

    // Reset Form
    setFormOrders("");
    setFormRejected("");
    setFormRevenue("");

    addLog(`Wysłano raport dobowy: ${ords} zamówień, przychód: ${rev.toLocaleString("pl-PL")} PLN. Looker odświeżony.`);
    alert("Raport wysłany pomyślnie! Panel Managerski B2B został zaktualizowany w czasie rzeczywistym.");
  };

  // Pricing calculator submit
  const handleCalcSubmit = () => {
    if (!calcClientName.trim()) {
      alert("Wpisz nazwę klienta!");
      return;
    }

    // Add new client dynamically if not exists
    const clientExists = clients.find(c => c.name.toLowerCase().includes(calcClientName.toLowerCase()));
    let targetClient = clientExists;

    if (!targetClient) {
      const newId = "c" + (clients.length + 1);
      const newC: Client = {
        id: newId,
        name: calcClientName,
        ind: "Kalkulator Indywidualny",
        nip: "Brak - Oferta",
        contact: "Kontakt z kalkulacji",
        email: "oferta@" + calcClientName.toLowerCase().replace(/[\s\.]/g, "") + ".pl",
        phone: "+48 500 000 000",
        region: "Zachód"
      };
      setClients((prev) => [...prev, newC]);
      targetClient = newC;
    }

    // Add dynamic order to today
    const todayIndex = allData.length - 1;
    const today = allData[todayIndex];

    const newO: Order = {
      id: Math.floor(Math.random() * 9000) + 1000,
      clientId: targetClient.id,
      clientName: targetClient.name,
      cat: "hw",
      rev: calcTotal,
      status: "W realizacji",
      dateStr: today.dateStr,
      shortDate: today.shortDate,
      salesperson: "Kamil Wiśniewski"
    };

    const updatedData = [...allData];
    const todayOrdersList = [...today.ordersList, newO];
    const totalRevenue = todayOrdersList.reduce((sum, o) => sum + (o.status !== "Odrzucone" ? o.rev : 0), 0);
    const activeOrds = todayOrdersList.length;
    const rejs = todayOrdersList.filter(o => o.status === "Odrzucone").length;

    updatedData[todayIndex] = {
      ...today,
      orders: activeOrds,
      realized: activeOrds - rejs,
      rejected: rejs,
      revenue: totalRevenue,
      ordersList: todayOrdersList
    };

    setAllData(updatedData);
    setGlobalOrders((prev) => [...prev, newO]);
    
    setFlashUpdate(true);
    setTimeout(() => setFlashUpdate(false), 900);

    addLog(`Generowanie oferty dla ${calcClientName}: Moc ${calcCapacity}kWp -> Wartość: ${calcTotal.toLocaleString("pl-PL")} PLN.`);
    alert(`Dodano ofertę jako zamówienie 'W realizacji' dla ${targetClient.name}! Kwota: ${calcTotal.toLocaleString("pl-PL")} PLN.`);
    setCalcClientName("");
    setCurrentPhoneTab("orders");
  };

  // Add new order from modal
  const saveNewOrder = () => {
    if (!newOrderClientId || !newOrderRev) {
      alert("Proszę wypełnić wszystkie pola!");
      return;
    }

    const value = parseFloat(newOrderRev) || 0;
    const cli = clients.find(c => c.id === newOrderClientId);
    if (!cli) return;

    const todayIndex = allData.length - 1;
    const today = allData[todayIndex];

    const newO: Order = {
      id: Math.floor(Math.random() * 90000) + 10000,
      clientId: cli.id,
      clientName: cli.name,
      cat: newOrderCat,
      rev: newOrderStatus === "Odrzucone" ? 0 : value,
      status: newOrderStatus,
      dateStr: today.dateStr,
      shortDate: today.shortDate,
      salesperson: newOrderSalesperson || "Karolina Mazur"
    };

    const updatedData = [...allData];
    const updatedList = [...today.ordersList, newO];
    const totalRev = updatedList.reduce((s, o) => s + (o.status !== "Odrzucone" ? o.rev : 0), 0);
    const totalOrds = updatedList.length;
    const rejs = updatedList.filter(o => o.status === "Odrzucone").length;

    updatedData[todayIndex] = {
      ...today,
      orders: totalOrds,
      realized: totalOrds - rejs,
      rejected: rejs,
      revenue: totalRev,
      ordersList: updatedList
    };

    setAllData(updatedData);
    setGlobalOrders((prev) => [...prev, newO]);
    setShowNewOrderModal(false);

    // Flash report
    setFlashUpdate(true);
    setTimeout(() => setFlashUpdate(false), 900);

    addLog(`Dodano zamówienie ręczne dla ${cli.name} o wartości ${value.toLocaleString("pl-PL")} PLN.`);
    setNewOrderRev("");
  };

  // B2B Dashboard Calculations based on current filter state & Region
  const getDashboardAggregates = () => {
    let days = currentFilteredData;
    let computedOrders: Order[] = [];
    
    let processedDays = days.map(d => ({
      ...d, 
      orders: 0, 
      revenue: 0, 
      realized: 0, 
      rejected: 0, 
      ordersList: [] as Order[]
    }));

    days.forEach((day, idx) => {
      day.ordersList.forEach(o => {
        // Filter by region if set
        const cliInfo = clients.find(c => c.id === o.clientId);
        if (selectedRegion === "Wszystkie" || (cliInfo && cliInfo.region === selectedRegion)) {
          computedOrders.push(o);
          processedDays[idx].ordersList.push(o);
          processedDays[idx].orders += 1;
          processedDays[idx].revenue += (o.status !== "Odrzucone" ? o.rev : 0);
          if (o.status === "Odrzucone") {
            processedDays[idx].rejected += 1;
          } else {
            processedDays[idx].realized += 1;
          }
        }
      });
    });

    const totalOrders = computedOrders.length;
    const zrealizowane = computedOrders.filter(o => o.status === "Zrealizowane" || o.status === "W realizacji").length;
    const odrzucone = computedOrders.filter(o => o.status === "Odrzucone").length;
    const waiting = computedOrders.filter(o => o.status === "Oczekuje na płatność").length;
    const totalRevenue = computedOrders.reduce((sum, o) => sum + o.rev, 0);
    
    // Category division
    const catCounts = { hw: 0, sf: 0, wd: 0, su: 0 };
    const catRevenue = { hw: 0, sf: 0, wd: 0, su: 0 };
    computedOrders.forEach(o => {
      if (catCounts[o.cat] !== undefined) {
        catCounts[o.cat]++;
        catRevenue[o.cat] += o.rev;
      }
    });

    return {
      totalOrders,
      zrealizowane,
      odrzucone,
      waiting,
      totalRevenue,
      catCounts,
      catRevenue,
      computedOrders,
      processedDays
    };
  };

  const b2bStats = getDashboardAggregates();
  const activeRecord = allData[selectedDateIndex] || { shortDate: "", orders: 0, revenue: 0 };

  return (
    <div 
      className="fixed inset-0 z-[990] bg-gradient-to-br from-[#f2f8fc] to-[#e6f2fd] text-slate-800 flex flex-col font-sans overflow-hidden"
      id="crm-mockup-wrapper"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 bg-white/50 hover:bg-white text-slate-800 font-bold p-3 rounded-full transition-all z-50 cursor-pointer shadow-md border border-slate-300"
        title="Zamknij"
      >
        <X className="w-6 h-6" />
      </button>

      {/* WORKSPACE AREA */}
      <div className="flex-grow flex flex-col lg:flex-row p-4 lg:p-6 gap-6 overflow-y-auto w-full max-w-7xl mx-auto pt-16">
        
        {/* LEFT: PHONE WRAPPER & TOGGLER */}
        <div className="lg:w-[420px] flex flex-col items-center flex-shrink-0">
          <div className="flex lg:hidden bg-[#121c2d] p-1 rounded-full border border-white/10 mb-3 w-[260px] justify-between z-10">
            <button 
              onClick={() => setMobileLayout("phone")}
              className={`flex-1 text-[11px] py-1.5 rounded-full font-black uppercase text-center transition-all ${mobileLayout === "phone" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400"}`}
            >
              Aplikacja Handlowca
            </button>
            <button 
              onClick={() => setMobileLayout("dash")}
              className={`flex-1 text-[11px] py-1.5 rounded-full font-black uppercase text-center transition-all ${mobileLayout === "dash" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400"}`}
            >
              Dashboard Analityczny
            </button>
          </div>

          {/* THE HIGHEST FIDELITY PHONE FRAME */}
          <div className={`phone-device-wrap shrink-0 ${mobileLayout === "phone" ? "flex" : "hidden"} lg:flex items-center justify-center relative w-[310px] h-[640px] bg-slate-900 rounded-[50px] p-3.5 border-[4px] border-slate-700 shadow-2xl mb-12`}>
            
            {/* Phone Hardware Details */}
            <div className="absolute top-1/2 -left-1 w-1 h-12 bg-slate-800 rounded-l-md -translate-y-24"></div>
            <div className="absolute top-1/2 -left-1 w-1 h-10 bg-slate-800 rounded-l-md -translate-y-10"></div>
            <div className="absolute top-1/2 -right-1 w-1 h-16 bg-slate-800 rounded-r-md -translate-y-16"></div>

            {/* SCREEN INNER */}
            <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative text-slate-800 select-none border border-slate-300">
              
              {/* STATUS BAR WITH NOTCH */}
              <div className="h-8 bg-white border-b border-slate-100 flex-shrink-0 flex justify-between items-center px-6 relative z-50">
                <span className="text-[10px] font-bold tracking-tight">{timeStr}</span>
                {/* Dynamic Notch */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1.5 bg-black w-[90px] h-[20px] rounded-full flex items-center justify-end px-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  <span>5G</span>
                  <Battery className="w-3 h-3" />
                </div>
              </div>

              {/* HEADING PORT */}
              <div className="p-4 bg-white border-b border-[#e2e8f0] shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-[#64748b] font-black uppercase tracking-wide">Panel Handlowy CRM</div>
                  <h3 className="text-sm font-black text-[#1e293b]">
                    {currentPhoneTab === "kpi" && "Raport Dzienny"}
                    {currentPhoneTab === "orders" && "Baza Zamówień"}
                    {currentPhoneTab === "clients" && "Nasi Klienci"}
                    {currentPhoneTab === "calc" && "Kalkulator Oferty"}
                  </h3>
                </div>
                {/* Add actions depending on Tab */}
                {currentPhoneTab === "orders" && (
                  <button 
                    onClick={() => {
                      setNewOrderClientId(clients[0].id);
                      setNewOrderSalesperson("Karolina Mazur");
                      setShowNewOrderModal(true);
                    }}
                    className="w-8 h-8 rounded-full bg-[#1e293b] text-white font-black text-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    title="Dodaj Zamówienie"
                  >
                    +
                  </button>
                )}
                {currentPhoneTab === "clients" && (
                  <button 
                    onClick={() => {
                      const name = prompt("Podaj nazwę inwestora:");
                      if (name) {
                        const newC = {
                          id: "c" + Date.now(),
                          name,
                          ind: "Inne",
                          nip: "Brak",
                          contact: "M. Kowalski",
                          email: "test@domain.pl",
                          phone: "+48 000 000 000",
                          region: "Nieokreślony"
                        };
                        setClients(prev => [...prev, newC]);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-[#1e293b] text-white font-black text-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    title="Dodaj Klienta"
                  >
                    +
                  </button>
                )}
              </div>

              {/* PHONE CORE VIEWS */}
              <div className="flex-grow overflow-y-auto px-3.5 py-3 relative">
                
                {/* 1. Tab KPI (Daily Report Send) */}
                {currentPhoneTab === "kpi" && (
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">DZISIEJSZE WYNIKI</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                        Automatyczne podsumowanie Twojej dzisiejszej sprzedaży i statusu realizacji zamówień w czasie rzeczywistym.
                      </p>
                    </div>

                    {/* Historical Last Report Section */}
                    {allData.length > 0 && (
                      <div className="bg-white p-3 rounded-2xl border border-[#e2e8f0] shadow-sm">
                        <div className="text-[8px] font-black text-[#64748b] uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>Raport za dziś ({allData[allData.length - 1].dateStr})</span>
                          <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[8px]">ACTIVE</span>
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-500">Ilość zamówień:</span>
                            <span className="text-slate-800 font-bold">{b2bStats.processedDays[b2bStats.processedDays.length - 1]?.orders || 0} szt.</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-500">Zrealizowane:</span>
                            <span className="text-emerald-600 font-bold">{b2bStats.processedDays[b2bStats.processedDays.length - 1]?.realized || 0} szt.</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-500">Odrzucone:</span>
                            <span className="text-red-500 font-bold">{b2bStats.processedDays[b2bStats.processedDays.length - 1]?.rejected || 0} szt.</span>
                          </div>
                          <div className="border-t border-dashed border-slate-200 my-1"></div>
                          <div className="flex justify-between text-xs font-black">
                            <span className="text-slate-700">Wartość:</span>
                            <span className="text-emerald-600">{(b2bStats.processedDays[b2bStats.processedDays.length - 1]?.revenue || 0).toLocaleString("pl-PL")} PLN</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {allData.length > 1 && (
                      <div className="bg-white p-3 rounded-2xl border border-[#e2e8f0] shadow-sm opacity-80">
                        <div className="text-[8px] font-black text-[#64748b] uppercase tracking-widest mb-2">
                          Wczorajszy raport ({allData[allData.length - 2].dateStr})
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-500">Ilość zamówień:</span>
                            <span className="text-slate-800 font-bold">{b2bStats.processedDays[b2bStats.processedDays.length - 2]?.orders || 0} szt.</span>
                          </div>
                          <div className="flex justify-between text-xs font-black">
                            <span className="text-slate-700">Wartość:</span>
                            <span className="text-emerald-600">{(b2bStats.processedDays[b2bStats.processedDays.length - 2]?.revenue || 0).toLocaleString("pl-PL")} PLN</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Tab Orders Database */}
                {currentPhoneTab === "orders" && (
                  <div className="flex flex-col gap-2">
                    {[...globalOrders].reverse().slice(0, 15).map((o) => (
                      <div 
                        key={o.id}
                        onClick={() => setSelectedPhoneOrderId(o.id)}
                        className="bg-white p-2.5 rounded-xl border border-[#e2e8f0] hover:border-slate-400 cursor-pointer transition-all shadow-sm flex items-center justify-between"
                      >
                        <div className="max-w-[70%]">
                          <h5 className="font-bold text-xs text-[#0f172a] truncate">{o.clientName}</h5>
                          <span className="text-[9px] text-slate-500 font-medium block">{catNames[o.cat]}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold inline-block text-[8px] uppercase tracking-wide mb-1 ${
                            o.status === "Odrzucone" ? "bg-red-100 text-red-700" :
                            o.status === "W realizacji" ? "bg-amber-100 text-amber-700" :
                            "bg-emerald-100 text-emerald-700"
                          }`}>
                            {o.status}
                          </span>
                          <span className="block text-xs font-black text-slate-800">
                            {o.rev > 0 ? `${o.rev.toLocaleString("pl-PL")} PLN` : "-"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Tab Clients */}
                {currentPhoneTab === "clients" && (
                  <div className="flex flex-col gap-2">
                    {clients.map((c) => (
                      <div 
                        key={c.id}
                        onClick={() => setSelectedPhoneClientId(c.id)}
                        className="bg-white p-2.5 rounded-xl border border-[#e2e8f0] hover:border-slate-400 cursor-pointer transition-all shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-bold text-xs text-[#0f172a]">{c.name}</h5>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">{c.ind}</span>
                            <span className="text-[10px] text-slate-500">{c.region}</span>
                          </div>
                        </div>
                        <span className="text-slate-400">➔</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Tab Pricing Calculator (Enriched Feature!) */}
                {currentPhoneTab === "calc" && (
                  <div className="bg-white p-3.5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col gap-3">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-dashed pb-1">
                      Wycena Instalacji PV & Baterii
                    </div>
                    
                    <div>
                      <label className="block text-[8px] font-black text-[#475569] uppercase tracking-widest mb-1">
                        Nazwa Klienta / Inwestora
                      </label>
                      <input 
                        type="text" 
                        placeholder="Np. Bio-Rol sp. z o.o." 
                        value={calcClientName}
                        onChange={(e) => setCalcClientName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-lg text-xs font-black text-[#0f172a] focus:outline-none focus:border-cyan-500 bg-[#f8fafc]"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-black text-[#475569] uppercase tracking-widest mb-1.5 flex justify-between">
                        <span>Zapotrzebowanie Mocy (Moc PV)</span>
                        <span className="text-cyan-600 font-black">{calcCapacity} kWp</span>
                      </label>
                      <input 
                        type="range" 
                        min="3" 
                        max="50" 
                        step="1"
                        value={calcCapacity}
                        onChange={(e) => setCalcCapacity(parseInt(e.target.value))}
                        className="w-full accent-[#1e293b]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <span className="text-[8px] font-black text-[#475569] uppercase tracking-widest mb-1">Moduły PV</span>
                        <select 
                          value={calcPanels}
                          onChange={(e) => setCalcPanels(e.target.value)}
                          className="w-full text-[10px] font-bold py-2 px-1 border border-[#cbd5e1] rounded-lg bg-[#f8fafc]"
                        >
                          <option value="Jinko 430W Black Frame">Jinko 430W Black</option>
                          <option value="Trina 420W Vertex S">Trina 420W Vertex S</option>
                          <option value="SunPower 450W Maxeon">SunPower 450W Maxeon</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[8px] font-black text-[#475569] uppercase tracking-widest mb-1">Inwerter / Falownik</span>
                        <select 
                          value={calcInverter}
                          onChange={(e) => setCalcInverter(e.target.value)}
                          className="w-full text-[10px] font-bold py-2 px-1 border border-[#cbd5e1] rounded-lg bg-[#f8fafc]"
                        >
                          <option value="Huawei Hybrid 10KTL">Huawei Hybrid 10KTL</option>
                          <option value="Fronius Symo 10.0-3-M">Fronius Symo 10.0</option>
                          <option value="SMA Pro">SMA Pro</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-[#475569] uppercase tracking-widest mb-1">Magazyn Energii</span>
                        <button 
                          onClick={() => setCalcBattery(!calcBattery)}
                          className={`py-2 rounded-lg text-[10px] font-black uppercase border tracking-wider transition-all ${
                            calcBattery ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-white border-slate-300 text-slate-500"
                          }`}
                        >
                          {calcBattery ? "TAK (10 kWh)" : "BRAK"}
                        </button>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-[#475569] uppercase tracking-widest mb-1">Pakiet Serwisowy</span>
                        <button 
                          onClick={() => setCalcService(!calcService)}
                          className={`py-2 rounded-lg text-[10px] font-black uppercase border tracking-wider transition-all ${
                            calcService ? "bg-blue-50 border-blue-300 text-blue-800" : "bg-white border-slate-300 text-slate-500"
                          }`}
                        >
                          {calcService ? "TAK (Wliczony)" : "NIE"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1 flex justify-between">
                        <span>Rabat indywidualny</span>
                        <span>{calcDiscount}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        step="1"
                        value={calcDiscount}
                        onChange={(e) => setCalcDiscount(parseInt(e.target.value))}
                        className="w-full accent-[#1e293b]"
                      />
                    </div>

                    <div className="bg-[#f0f4f8] p-3 rounded-xl border border-dashed border-slate-300 text-xs">
                      <div className="flex justify-between font-semibold text-slate-600 py-0.5">
                        <span className="truncate">Panele ({calcPanels}):</span>
                        <span>{(calcCapacity * priceBasePerKwp).toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="flex justify-between font-semibold text-slate-600 py-0.5">
                        <span className="truncate">Inwerter ({calcInverter.split(" ")[0]}):</span>
                        <span>{priceInverter.toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="flex justify-between font-semibold text-slate-600 py-0.5">
                        <span>Magazyn Energii:</span>
                        <span>{priceBattery.toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="flex justify-between font-semibold text-slate-600 py-0.5">
                        <span>Pakiet Serwisowy:</span>
                        <span>{priceService.toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="flex justify-between font-semibold text-red-500 py-0.5">
                        <span>Rabat ({calcDiscount}%):</span>
                        <span>-{discountAmount.toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="border-t border-slate-300/60 my-1.5"></div>
                      <div className="flex justify-between font-black text-sm text-[#1e293b]">
                        <span>SUMA OFERTY (NETTO):</span>
                        <span className="text-emerald-700">{calcTotal.toLocaleString("pl-PL")} zł</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCalcSubmit}
                      className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md cursor-pointer text-center"
                    >
                      GENERUJ OFERTĘ I DODAJ ZAMÓWIENIE
                    </button>
                  </div>
                )}
              </div>

              {/* PHONE DETAIL SLIDING PANEL: ORDER */}
              <div className={`absolute inset-x-0 bottom-0 bg-[#f8fafc] border-t border-[#e2e8f0] rounded-t-[25px] flex flex-col z-[60] transition-transform duration-300 ${
                selectedPhoneOrderId !== null ? "translate-y-0" : "translate-y-full"
              }`} style={{ height: "70%" }}>
                {selectedPhoneOrderId !== null && (() => {
                  const o = globalOrders.find(x => x.id === selectedPhoneOrderId);
                  if (!o) return null;
                  return (
                    <div className="flex flex-col h-full p-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                        <h4 className="font-sans font-black text-[#0f172a] text-sm truncate max-w-[80%]">SZCZEGÓŁY ZAMÓWIENIA</h4>
                        <button 
                          onClick={() => setSelectedPhoneOrderId(null)}
                          className="text-slate-500 font-black hover:text-[#0f172a]"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex-grow overflow-y-auto space-y-3">
                        <div className="bg-white border rounded-xl p-3 shadow-inner">
                          <span className="text-[8px] font-bold text-[#64748b] uppercase block">Klient</span>
                          <span className="text-xs font-black text-slate-800">{o.clientName}</span>
                        </div>
                        <div className="bg-white border rounded-xl p-3 shadow-inner">
                          <span className="text-[8px] font-bold text-[#64748b] uppercase block">Typ Instalacji</span>
                          <span className="text-xs font-black text-slate-800">{catNames[o.cat]}</span>
                        </div>
                        <div className="bg-white border rounded-xl p-3 shadow-inner grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[8px] font-bold text-[#64748b] uppercase block">Handlowiec</span>
                            <span className="text-[11px] font-black text-slate-800">{o.salesperson}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-[#64748b] uppercase block">Wydział / Data</span>
                            <span className="text-[11px] font-black text-slate-800">{o.dateStr}</span>
                          </div>
                        </div>
                        <div className="bg-white border rounded-xl p-3 shadow-inner flex justify-between items-center">
                          <div>
                            <span className="text-[8px] font-bold text-[#64748b] uppercase block">Kwota prowizji/instalacji</span>
                            <span className="text-xs font-black text-emerald-600">{o.rev > 0 ? `${o.rev.toLocaleString("pl-PL")} PLN` : "0,00 zł"}</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            o.status === "Odrzucone" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                          }`}>{o.status}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const conf = window.confirm(`Czy chcesz zmienić status zamówienia ${o.id} na przeciwny?`);
                          if (conf) {
                            const updatedOrders = globalOrders.map(item => {
                              if (item.id === o.id) {
                                return {
                                  ...item,
                                  status: item.status === "Odrzucone" ? "Zrealizowane" as const : "Odrzucone" as const,
                                  rev: item.status === "Odrzucone" ? 18000 : 0
                                };
                              }
                              return item;
                            });
                            setGlobalOrders(updatedOrders);
                            // Also update daily aggregate
                            const updatedDays = allData.map(d => {
                              if (d.dateStr === o.dateStr) {
                                const list = d.ordersList.map(item => {
                                  if (item.id === o.id) {
                                    return {
                                      ...item,
                                      status: item.status === "Odrzucone" ? "Zrealizowane" as const : "Odrzucone" as const,
                                      rev: item.status === "Odrzucone" ? 18000 : 0
                                    };
                                  }
                                  return item;
                                });
                                const totalRealizedRev = list.reduce((s, oItem) => s + (oItem.status !== "Odrzucone" ? oItem.rev : 0), 0);
                                const rejs = list.filter(oItem => oItem.status === "Odrzucone").length;
                                return {
                                  ...d,
                                  ordersList: list,
                                  revenue: totalRealizedRev,
                                  rejected: rejs,
                                  realized: list.length - rejs
                                };
                              }
                              return d;
                            });
                            setAllData(updatedDays);
                            setSelectedPhoneOrderId(null);
                            addLog(`Zmieniono status zamówienia ID: ${o.id}. Looker odświeżony w czasie rzeczywistym.`);
                          }
                        }}
                        className="w-full bg-slate-200 text-[#1e293b] py-2 rounded-xl text-[10px] font-black uppercase mt-4 border border-slate-300"
                      >
                        Zmień status / Edytuj
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* PHONE DETAIL SLIDING PANEL: CLIENT */}
              <div className={`absolute inset-x-0 bottom-0 bg-[#f8fafc] border-t border-[#e2e8f0] rounded-t-[25px] flex flex-col z-[60] transition-transform duration-300 ${
                selectedPhoneClientId !== null ? "translate-y-0" : "translate-y-full"
              }`} style={{ height: "70%" }}>
                {selectedPhoneClientId !== null && (() => {
                  const c = clients.find(x => x.id === selectedPhoneClientId);
                  if (!c) return null;
                  const cOrders = globalOrders.filter(o => o.clientId === c.id);
                  return (
                    <div className="flex flex-col h-full p-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                        <h4 className="font-sans font-black text-[#0f172a] text-sm truncate max-w-[80%]">PROFIL KLIENTA B2B</h4>
                        <button 
                          onClick={() => setSelectedPhoneClientId(null)}
                          className="text-slate-500 font-black hover:text-[#0f172a]"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex-grow overflow-y-auto space-y-3 text-xs">
                        <div className="bg-white border rounded-xl p-3 shadow-inner space-y-2">
                          <div>
                            <span className="text-[8px] font-bold text-[#64748b] uppercase block">Nazwa firmy</span>
                            <span className="text-xs font-black text-slate-800">{c.name}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-[#64748b] uppercase block">NIP</span>
                            <span className="text-xs font-mono font-bold text-slate-800">{c.nip}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-[#64748b] uppercase block">Osoba Kontaktowa</span>
                            <span className="text-xs font-black text-slate-800">{c.contact}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[8px] font-bold text-[#64748b] uppercase block">Telefon</span>
                              <span className="text-[11px] font-black text-slate-800">{c.phone}</span>
                            </div>
                            <div>
                              <span className="text-[8px] font-bold text-[#64748b] uppercase block">Region</span>
                              <span className="text-[11px] font-black text-slate-800">{c.region}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order History */}
                        <div className="pt-2">
                          <h5 className="font-black text-[10px] text-[#475569] uppercase tracking-wider mb-2">HISTORIA ZLECEŃ</h5>
                          {cOrders.length === 0 ? (
                            <div className="text-center py-4 text-slate-400 font-bold bg-white border border-dashed rounded-xl">Brak dotychczasowych zleceń</div>
                          ) : (
                            <div className="space-y-1.5">
                              {cOrders.map(o => (
                                <div key={o.id} className="bg-white border rounded-lg p-2 flex justify-between items-center">
                                  <div>
                                    <span className="font-bold text-[10px] block text-slate-700">{catNames[o.cat]}</span>
                                    <span className="text-[9px] text-slate-500 font-medium">{o.dateStr}</span>
                                  </div>
                                  <span className="text-[11px] font-black text-emerald-600">
                                    {o.rev > 0 ? `${o.rev.toLocaleString("pl-PL")} zł` : "-"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* BOTTOM NAVIGATION TABS */}
              <div className="h-14 bg-white border-t border-slate-200 flex justify-around items-center px-2 flex-shrink-0 z-50">
                <button 
                  onClick={() => setCurrentPhoneTab("kpi")}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 my-1 rounded-xl transition-all ${
                    currentPhoneTab === "kpi" ? "text-slate-800 scale-105" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wide">KPI</span>
                </button>
                <button 
                  onClick={() => setCurrentPhoneTab("calc")}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 my-1 rounded-xl transition-all ${
                    currentPhoneTab === "calc" ? "text-slate-800 scale-105" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Calculator className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wide">Wycena</span>
                </button>
                <button 
                  onClick={() => setCurrentPhoneTab("orders")}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 my-1 rounded-xl transition-all ${
                    currentPhoneTab === "orders" ? "text-slate-800 scale-105" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <ListOrdered className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wide">Zamów.</span>
                </button>
                <button 
                  onClick={() => setCurrentPhoneTab("clients")}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 my-1 rounded-xl transition-all ${
                    currentPhoneTab === "clients" ? "text-slate-800 scale-105" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wide">Klienci</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT: DESKTOP MANAGERIAL DASHBOARD / ANALYTICS */}
        <div className={`flex-grow flex flex-col min-w-0 ${mobileLayout === "dash" ? "flex" : "hidden"} lg:flex lg:h-[640px] xl:h-[640px] bg-slate-50 rounded-[30px] border border-slate-200 overflow-hidden shadow-2xl`}>
          
          {/* DASHBOARD HEADER DECK */}
          <div className="bg-white border-b border-slate-200 p-4 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 flex-shrink-0">
            {/* QUICK FILTERS */}
            <div className="flex flex-wrap items-center gap-3 w-full">
              {/* Region Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1.5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-black px-1">Region:</span>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-bold py-1 px-2 rounded-lg text-slate-800"
                >
                  <option value="Wszystkie">Wszystkie</option>
                  <option value="Północ">Północ</option>
                  <option value="Południe">Południe</option>
                  <option value="Wschód">Wschód</option>
                  <option value="Zachód">Zachód</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1.5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-black px-1">Data:</span>
                <select 
                  value={selectedDateIndex}
                  onChange={(e) => setSelectedDateIndex(parseInt(e.target.value))}
                  className="bg-white border border-slate-200 text-xs font-bold py-1 px-2 rounded-lg text-slate-800"
                >
                  {allData.map((d, i) => (
                    <option key={i} value={i}>
                      {d.isToday ? `${d.dateStr} (Dziś)` : d.dateStr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tab Selector */}
              <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1 ml-auto">
                <button 
                  onClick={() => setDashboardTab("realization")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${dashboardTab === "realization" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"}`}
                >
                  Wydajność
                </button>
                <button 
                  onClick={() => setDashboardTab("orders")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${dashboardTab === "orders" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"}`}
                >
                  Struktura i Zamówienia
                </button>
              </div>
            </div>
          </div>

          {/* DASHBOARD BODY */}
          <div className="flex-grow p-4 lg:p-5 overflow-y-auto space-y-4 relative bg-slate-50">
            
            {/* METRICS ROW CARDS */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3.5 transition-all duration-300 ${flashUpdate ? "opacity-50 scale-95" : "opacity-100"}`}>
              <div className="bg-white shadow-sm border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">KONTRAKTACJA</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-black text-slate-900">{b2bStats.totalOrders}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">zleceń</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">
                  {b2bStats.zrealizowane} Zrealizowanych
                </div>
              </div>

              <div className="bg-white shadow-sm border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">ŁĄCZNY PRZYCHÓD</span>
                <div className="mt-1">
                  <span className="text-xl md:text-2xl font-black text-emerald-600">{b2bStats.totalRevenue.toLocaleString("pl-PL")} zł</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  Średnia wartość umowy: <strong className="text-slate-900">{(b2bStats.totalOrders > 0 ? Math.round(b2bStats.totalRevenue / b2bStats.totalOrders) : 0).toLocaleString("pl-PL")} zł</strong>
                </div>
              </div>

              <div className="bg-white shadow-sm border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">STRATA (REJECTED)</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-black text-red-500">{b2bStats.odrzucone}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">anulowanych</span>
                </div>
                <div className="text-[10px] text-red-500/80 font-bold mt-1">
                  Odrzucone prowizje: {((b2bStats.odrzucone / Math.max(1, b2bStats.totalOrders)) * 100).toFixed(0)}%
                </div>
              </div>

              <div className="bg-white shadow-sm border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">AKTYWNE LEADY</span>
                <div className="mt-1">
                  <span className="text-xl md:text-2xl font-black text-amber-500">{b2bStats.waiting + b2bStats.computedOrders.filter(o => o.status === "W realizacji").length}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  W realizacji/do weryfikacji
                </div>
              </div>
            </div>

            {/* TAB-CONTENT 1: REALIZATION PERFORMANCE CHART & DATA TABLE */}
            {dashboardTab === "realization" && (
              <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
                
                {/* INTERACTIVE CHART CONTAINER */}
                <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-[20px] space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800 tracking-widest">Krzywa Wydajności w Czasie</h4>
                      <p className="text-[10px] text-slate-500">Przychód (słupki) vs Poprzedni Rok / Target (czerwona linia)</p>
                    </div>

                    {/* Performance toggle */}
                    <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                      <button 
                        onClick={() => setPerfMetric("revenue")}
                        className={`text-[9px] px-2 py-1 rounded font-bold uppercase transition-all ${perfMetric === "revenue" ? "bg-cyan-600 text-white font-black" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        Przychód
                      </button>
                      <button 
                        onClick={() => setPerfMetric("orders")}
                        className={`text-[9px] px-2 py-1 rounded font-bold uppercase transition-all ${perfMetric === "orders" ? "bg-cyan-600 text-white font-black" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        Zamówienia
                      </button>
                    </div>
                  </div>

                  {/* CUSTOM DRAWN ACCURATE BAR CHART */}
                  {b2bStats.processedDays.length > 0 ? (
                    <div className="h-[180px] bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                      {/* Grid background lines */}
                      <div className="absolute inset-x-0 top-1/4 b-1 border-b border-slate-200 pointer-events-none"></div>
                      <div className="absolute inset-x-0 top-2/4 b-1 border-b border-slate-200 pointer-events-none"></div>
                      <div className="absolute inset-x-0 top-3/4 b-1 border-b border-slate-200 pointer-events-none"></div>

                      <div className="flex-grow flex items-end justify-around w-full h-full relative z-10 pt-2 pb-6">
                        {b2bStats.processedDays.map((day, idx) => {
                          const maxVal = Math.max(...b2bStats.processedDays.map(d => perfMetric === "revenue" ? d.revenue : d.orders)) || 1;
                          const barHeight = perfMetric === "revenue" ? (day.revenue / maxVal) : (day.orders / maxVal);
                          return (
                            <div key={idx} className="flex-grow flex flex-col items-center justify-end h-full group relative px-0.5">
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-white border border-slate-200 px-2 py-1 rounded-[10px] shadow-xl z-50 text-[9px] w-max select-none transition-all pointer-events-none duration-250">
                                <span className="font-bold block text-slate-500">{day.dateStr}</span>
                                <span className="font-black text-cyan-600 block">Zleceń: {day.orders}</span>
                                <span className="font-black text-emerald-600 block">Przychód: {day.revenue.toLocaleString("pl-PL")} zł</span>
                              </div>

                              <div 
                                className="w-full max-w-[24px] rounded-t-sm transition-all duration-700 bg-gradient-to-t from-cyan-600 to-emerald-400 group-hover:from-cyan-500 group-hover:to-emerald-400"
                                style={{ height: `${Math.max(4, barHeight * 100)}%` }}
                              />
                              
                              <span className="absolute bottom-[-16px] text-[8px] font-bold text-slate-500 group-hover:text-slate-800 group-hover:scale-110 transition-transform">
                                {day.shortDate}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[180px] flex items-center justify-center text-slate-500 font-bold border border-slate-200 rounded-xl">Brak danych historycznych do wykresu.</div>
                  )}
                </div>

                {/* DATA TABLE Podsumowanie tabelaryczne */}
                <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-[20px]">
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-widest mb-3">
                    Historia raportów dobowych (Ostatnie 10 dni)
                  </h4>
                  
                  <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2 px-3 font-semibold">Data</th>
                          <th className="py-2 px-3 font-semibold text-center">Ogółem zamówień</th>
                          <th className="py-2 px-3 font-semibold text-center text-emerald-600">Zrealizowane</th>
                          <th className="py-2 px-3 font-semibold text-center text-red-500">Anulowane</th>
                          <th className="py-2 px-3 font-semibold text-right">Zrealizowana Przychód</th>
                          <th className="py-2 px-3 font-semibold text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...b2bStats.processedDays].reverse().map((day, idx) => (
                          <tr 
                            key={idx} 
                            onClick={() => {
                              const dayIndex = allData.findIndex(item => item.dateStr === day.dateStr);
                              if (dayIndex !== -1) setSelectedDateIndex(dayIndex);
                            }}
                            className={`border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer ${
                              day.dateStr === activeRecord.dateStr ? "bg-slate-50" : ""
                            }`}
                          >
                            <td className="py-2 px-3 font-bold text-slate-900">{day.dateStr}</td>
                            <td className="py-2 px-3 text-center text-slate-600 font-bold">{day.orders} szt.</td>
                            <td className="py-2 px-3 text-center text-emerald-600 font-bold">{day.realized}</td>
                            <td className="py-2 px-3 text-center text-red-500 font-bold">{day.rejected}</td>
                            <td className="py-2 px-3 text-right font-black text-slate-900">
                              {day.revenue > 0 ? `${day.revenue.toLocaleString("pl-PL")} zł` : "-"}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                day.revenue > 0 ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}>
                                {day.revenue > 0 ? "Zatwierdzony" : "Pusty"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB-CONTENT 2: STRUKTURA PRODUKTÓW I DETALE */}
            {dashboardTab === "orders" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                
                {/* Product structure progress card */}
                <div className="bg-[#121c2d] border border-white/10 p-4 rounded-[20px] shadow-sm">
                  <h4 className="text-xs font-black uppercase text-white tracking-widest mb-3">Podział Rynku na Kategorie</h4>
                  
                  <div className="space-y-4">
                    {/* Cat 1: hw */}
                    <div 
                      onClick={() => setSelectedDashboardCategory(selectedDashboardCategory === "hw" ? null : "hw")}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedDashboardCategory === "hw" ? "bg-white/5 border-cyan-400 shadow-md" : "border-transparent bg-[#0c1421]/60"
                      }`}
                    >
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-white">Fotowoltaika (panele)</span>
                        <span className="font-bold text-cyan-400">{b2bStats.catCounts.hw} szt. / {b2bStats.catRevenue.hw.toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
                          style={{ width: `${b2bStats.totalOrders > 0 ? (b2bStats.catCounts.hw / b2bStats.totalOrders) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Cat 2: sf */}
                    <div 
                      onClick={() => setSelectedDashboardCategory(selectedDashboardCategory === "sf" ? null : "sf")}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedDashboardCategory === "sf" ? "bg-white/5 border-cyan-400 shadow-md" : "border-transparent bg-[#0c1421]/60"
                      }`}
                    >
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-white">Licencje Monitoringu SaaS</span>
                        <span className="font-bold text-cyan-400">{b2bStats.catCounts.sf} szt. / {b2bStats.catRevenue.sf.toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
                          style={{ width: `${b2bStats.totalOrders > 0 ? (b2bStats.catCounts.sf / b2bStats.totalOrders) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Cat 3: wd */}
                    <div 
                      onClick={() => setSelectedDashboardCategory(selectedDashboardCategory === "wd" ? null : "wd")}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedDashboardCategory === "wd" ? "bg-white/5 border-cyan-400 shadow-md" : "border-transparent bg-[#0c1421]/60"
                      }`}
                    >
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-white">Montaż i Przyłącze</span>
                        <span className="font-bold text-cyan-400">{b2bStats.catCounts.wd} szt. / {b2bStats.catRevenue.wd.toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
                          style={{ width: `${b2bStats.totalOrders > 0 ? (b2bStats.catCounts.wd / b2bStats.totalOrders) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Cat 4: su */}
                    <div 
                      onClick={() => setSelectedDashboardCategory(selectedDashboardCategory === "su" ? null : "su")}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedDashboardCategory === "su" ? "bg-white/5 border-cyan-400 shadow-md" : "border-transparent bg-[#0c1421]/60"
                      }`}
                    >
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-white">Serwis i Wsparcie Tech</span>
                        <span className="font-bold text-cyan-400">{b2bStats.catCounts.su} szt. / {b2bStats.catRevenue.su.toLocaleString("pl-PL")} zł</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
                          style={{ width: `${b2bStats.totalOrders > 0 ? (b2bStats.catCounts.su / b2bStats.totalOrders) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Order Logs in the current region / date view */}
                <div className="bg-[#121c2d] border border-white/10 p-4 rounded-[20px] xl:col-span-2 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <div>
                      <h4 className="text-xs font-black uppercase text-white tracking-widest">
                        {selectedDashboardCategory ? `Rekordy Kategorii: ${catNames[selectedDashboardCategory]}` : "Wszystkie zlecenia z tej sekcji"}
                      </h4>
                      <p className="text-[10px] text-slate-400">Możliwość filtrowania kliknięciem w lewe kategorie</p>
                    </div>

                    {selectedDashboardCategory && (
                      <button 
                        onClick={() => setSelectedDashboardCategory(null)}
                        className="text-[9px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold uppercase transition-transform hover:scale-105"
                      >
                        Reset Filtru
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-[220px]">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400">
                          <th className="py-2 font-bold select-none">ID zamówienia</th>
                          <th className="py-2 font-bold select-none">Klient B2B</th>
                          <th className="py-2 text-center font-bold select-none">Kategoria</th>
                          <th className="py-2 font-bold text-center select-none">Handlowiec</th>
                          <th className="py-2 text-right font-bold select-none">Wartość</th>
                        </tr>
                      </thead>
                      <tbody>
                        {b2bStats.computedOrders
                          .filter(item => !selectedDashboardCategory || item.cat === selectedDashboardCategory)
                          .map(item => (
                            <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-2 font-mono font-bold text-slate-400">#{item.id}</td>
                              <td className="py-2 font-black text-white">{item.clientName}</td>
                              <td className="py-2 text-center">
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                  item.cat === "hw" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                                  item.cat === "sf" ? "bg-indigo-505/10 text-indigo-400 border border-indigo-500/20" :
                                  "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                }`}>
                                  {item.cat}
                                </span>
                              </td>
                              <td className="py-2 text-center text-slate-400">{item.salesperson}</td>
                              <td className="py-2 text-right font-black text-emerald-400">
                                {item.rev > 0 ? `${item.rev.toLocaleString("pl-PL")} zł` : "-"}
                              </td>
                            </tr>
                          ))}
                        {b2bStats.computedOrders.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">Wybierz inny region lub datę z większą liczbą zleceń.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* DYNAMIC MODAL: ADD ORDER ON PHONE APP */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-[999] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121c2d] border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex justify-between items-center">
              <span>Ręczne wprowadzenie zlecenia</span>
              <button onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </h4>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Wybierz Klienta</label>
                <select 
                  value={newOrderClientId}
                  onChange={(e) => setNewOrderClientId(e.target.value)}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-2.5 py-2 text-white font-bold"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Zlecana Kategoria</label>
                <select 
                  value={newOrderCat}
                  onChange={(e) => setNewOrderCat(e.target.value as any)}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-2.5 py-2 text-white font-bold"
                >
                  <option value="hw">Fotowoltaika (panele)</option>
                  <option value="sf">Licencje Monitoringu</option>
                  <option value="wd">Montaż i Przyłącze</option>
                  <option value="su">Wsparcie i Serwis</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Wartość (zł)</label>
                  <input 
                    type="number" 
                    placeholder="Np. 23500" 
                    value={newOrderRev}
                    onChange={(e) => setNewOrderRev(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-2.5 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Handlowiec</label>
                  <select 
                    value={newOrderSalesperson}
                    onChange={(e) => setNewOrderSalesperson(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-2.5 py-2 text-white font-bold"
                  >
                    {salespeople.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status zlecenia</label>
                <select 
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value as any)}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-2.5 py-2 text-white font-bold"
                >
                  <option value="Zrealizowane">Zrealizowane</option>
                  <option value="W realizacji">W realizacji</option>
                  <option value="Oczekuje na płatność">Oczekuje na płatność</option>
                  <option value="Odrzucone">Odrzucone</option>
                </select>
              </div>

              <button 
                onClick={saveNewOrder}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-2.5 rounded-xl uppercase tracking-wider transition-all mt-4 cursor-pointer"
              >
                💾 DODAJ DO SYSTEMU (APPMARK)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
