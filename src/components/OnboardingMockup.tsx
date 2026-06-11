import React, { useState, useRef, useEffect } from "react";
import { 
  Monitor, Smartphone, Users, Briefcase, Car, Laptop, 
  Calendar, Mail, Folder, LayoutDashboard, CheckCircle, 
  Clock, Plus, Edit2, Save, X, Phone, User, Settings, AlertCircle, FileText, CheckSquare, Trash2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface OnboardingMockupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EmployeeNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "Nowy" | "W trakcie" | "Zakończony";
  email: string;
  phone: string;
  startDate?: string;
  carId?: string;
  laptopId?: string;
  notes?: EmployeeNote[];
  docs?: { id: string, name: string, type: string }[];
}

interface Asset {
  id: string;
  type: "Car" | "Laptop";
  model: string;
  identifier: string;
  status: "Dostępny" | "W użyciu" | "Serwis";
  assignedTo?: string;
}

interface KanbanTask {
  id: string;
  title: string;
  assignee: string;
  status: "todo" | "in-progress" | "done";
}

const INITIAL_EMPLOYEES: Employee[] = [
  { id: "e1", name: "Anna Kowalska", role: "UX Designer", department: "Design", status: "W trakcie", email: "anna.k@company.com", phone: "500-111-222", laptopId: "l1", startDate: "2026-06-01", docs: [] },
  { id: "e2", name: "Piotr Nowak", role: "Frontend Dev", department: "IT", status: "Zakończony", email: "piotr.n@company.com", phone: "600-333-444", laptopId: "l2", carId: "c1", startDate: "2026-01-15", docs: [{ id: "doc1", name: "Umowa_UoP.pdf", type: "pdf" }] },
  { id: "e3", name: "Marek Zając", role: "Sales Rep", department: "Sprzedaż", status: "Nowy", email: "marek.z@company.com", phone: "700-555-666", startDate: "2026-07-01", docs: [] },
  { id: "e4", name: "Katarzyna Lis", role: "HR Manager", department: "HR", status: "W trakcie", email: "katarzyna.l@company.com", phone: "800-123-456", laptopId: "l4", carId: "c2", startDate: "2026-05-15", docs: [] },
  { id: "e5", name: "Jan Wieczorek", role: "Backend Dev", department: "IT", status: "Nowy", email: "jan.w@company.com", phone: "900-234-567", startDate: "2026-08-01", docs: [] },
  { id: "e6", name: "Ewa Wiśniewska", role: "Marketing Specialist", department: "Marketing", status: "Zakończony", email: "ewa.w@company.com", phone: "600-987-654", laptopId: "l5", startDate: "2025-11-01", docs: [{ id: "doc2", name: "Protokol_Wydania_Laptop.pdf", type: "pdf" }] },
];

const INITIAL_ASSETS: Asset[] = [
  { id: "c1", type: "Car", model: "Toyota Corolla", identifier: "WA 12345", status: "W użyciu", assignedTo: "e2" },
  { id: "c2", type: "Car", model: "Skoda Octavia", identifier: "WA 54321", status: "W użyciu", assignedTo: "e4" },
  { id: "c3", type: "Car", model: "Ford Focus", identifier: "WA 99999", status: "Serwis" },
  { id: "c4", type: "Car", model: "Volkswagen Golf", identifier: "WA 11111", status: "Dostępny" },
  { id: "c5", type: "Car", model: "Kia Ceed", identifier: "WA 22222", status: "Dostępny" },
  { id: "c6", type: "Car", model: "Toyota Yaris", identifier: "WA 33333", status: "Dostępny" },
  { id: "l1", type: "Laptop", model: "MacBook Pro 14", identifier: "MBP-01", status: "W użyciu", assignedTo: "e1" },
  { id: "l2", type: "Laptop", model: "Dell XPS 15", identifier: "DEL-02", status: "W użyciu", assignedTo: "e2" },
  { id: "l3", type: "Laptop", model: "Lenovo ThinkPad", identifier: "LEN-03", status: "Dostępny" },
  { id: "l4", type: "Laptop", model: "MacBook Air", identifier: "MBA-01", status: "W użyciu", assignedTo: "e4" },
  { id: "l5", type: "Laptop", model: "MacBook Pro 16", identifier: "MBP-02", status: "W użyciu", assignedTo: "e6" },
  { id: "l6", type: "Laptop", model: "Dell Latitude", identifier: "DEL-03", status: "Dostępny" },
  { id: "l7", type: "Laptop", model: "HP EliteBook", identifier: "HP-01", status: "Dostępny" },
];

const INITIAL_TASKS: KanbanTask[] = [
  { id: "t1", title: "Założenie konta Google", assignee: "e1", status: "done" },
  { id: "t2", title: "Wydanie sprzętu IT", assignee: "e1", status: "in-progress" },
  { id: "t3", title: "Szkolenie BHP", assignee: "e3", status: "todo" },
  { id: "t4", title: "Wydanie auta służbowego", assignee: "e3", status: "todo" },
  { id: "t5", title: "Dostęp do CRM", assignee: "e5", status: "todo" },
  { id: "t6", title: "Spotkanie z liderem", assignee: "e4", status: "in-progress" },
  { id: "t7", title: "Wydanie karty wejściowej", assignee: "e5", status: "todo" },
  { id: "t8", title: "Zapoznanie z procedurami", assignee: "e1", status: "done" },
  { id: "t9", title: "Szkolenie RODO", assignee: "e3", status: "in-progress" },
  { id: "t10", title: "Konfiguracja VPN", assignee: "e4", status: "done" },
  { id: "t11", title: "Konto w Slack", assignee: "e5", status: "todo" },
  { id: "t12", title: "Ustalenie celów rocznych", assignee: "e6", status: "done" },
];

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function OnboardingMockup({ isOpen, onClose }: OnboardingMockupProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"dash" | "emp" | "kanban" | "fleet" | "it">("dash");
  const [mobileTab, setMobileTab] = useState<"emp" | "kanban" | "fleet" | "it">("emp");
  
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  
  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Task edit state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskEditForm, setTaskEditForm] = useState<Partial<KanbanTask>>({});
  
  // Desktop Edit / Add state
  const [desktopEditingEmpId, setDesktopEditingEmpId] = useState<string | null>(null);
  const [isDesktopAdding, setIsDesktopAdding] = useState(false);
  const [desktopEditForm, setDesktopEditForm] = useState<Partial<Employee>>({});

  // Mobile Edit state
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Employee>>({});

  // Asset Profile state
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Action Modal state
  const [activeActionModal, setActiveActionModal] = useState<'contract' | 'protocol' | 'calendar' | 'email' | null>(null);
  const [actionForm, setActionForm] = useState<any>({});
  const [selectedDoc, setSelectedDoc] = useState<{name: string, type: string} | null>(null);

  if (!isOpen) return null;

  const handleEditChange = (field: keyof Employee, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const startEdit = (emp: Employee) => {
    setEditingEmpId(emp.id);
    setEditForm(emp);
  };

  const handleDesktopEditChange = (field: keyof Employee, value: string) => {
    setDesktopEditForm(prev => ({ ...prev, [field]: value }));
  };

  const saveDesktopForm = () => {
    let empId = isDesktopAdding ? `e${Date.now()}` : desktopEditingEmpId!;

    if (isDesktopAdding) {
      const newEmp: Employee = {
        id: empId,
        name: desktopEditForm.name || "Nowy Pracownik",
        role: desktopEditForm.role || "-",
        department: desktopEditForm.department || "Ogólny",
        status: "Nowy",
        email: desktopEditForm.email || "",
        phone: desktopEditForm.phone || "",
        laptopId: desktopEditForm.laptopId,
        carId: desktopEditForm.carId,
        notes: desktopEditForm.notes
      };
      setEmployees(prev => [...prev, newEmp]);
      setIsDesktopAdding(false);
    } else if (desktopEditingEmpId) {
      setEmployees(prev => prev.map(e => e.id === desktopEditingEmpId ? { ...e, ...desktopEditForm } as Employee : e));
      setDesktopEditingEmpId(null);
    }

    if (desktopEditForm.laptopId !== undefined) {
      assignAsset(empId, desktopEditForm.laptopId, "Laptop");
    }
    if (desktopEditForm.carId !== undefined) {
      assignAsset(empId, desktopEditForm.carId, "Car");
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const assignAsset = (empId: string, assetId: string, type: "Car" | "Laptop") => {
    if (!empId) {
      // Unassign this specific asset
      setAssets(prev => prev.map(a => a.id === assetId ? { ...a, assignedTo: undefined, status: "Dostępny" } : a));
      setEmployees(prev => prev.map(e => {
        if (type === "Car" && e.carId === assetId) return { ...e, carId: undefined };
        if (type === "Laptop" && e.laptopId === assetId) return { ...e, laptopId: undefined };
        return e;
      }));
      return;
    }

    // 1. Update asset
    setAssets(prev => prev.map(a => {
      // free up Old asset if exist for this employee
      if (a.assignedTo === empId && a.type === type && a.id !== assetId) return { ...a, assignedTo: undefined, status: "Dostępny" };
      // assign new asset
      if (a.id === assetId) return { ...a, assignedTo: empId, status: "W użyciu" };
      return a;
    }));
    // 2. update employee
    setEmployees(prev => prev.map(e => {
      if (e.id === empId) {
        return { ...e, [type === "Car" ? "carId" : "laptopId"]: assetId };
      }
      return e;
    }));
  };

  const updateAssetStatus = (assetId: string, status: Asset["status"]) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        // Automatically unassign if set to Serwis or Dostępny? 
        // Typically Serwis might mean still assigned, let's just change status
        return { ...a, status };
      }
      return a;
    }));
  };

  const saveEdit = () => {
    if (editingEmpId) {
      setEmployees(prev => prev.map(e => e.id === editingEmpId ? { ...e, ...editForm } as Employee : e));
      if (editForm.laptopId !== undefined) {
        assignAsset(editingEmpId, editForm.laptopId, "Laptop");
      }
      if (editForm.carId !== undefined) {
        assignAsset(editingEmpId, editForm.carId, "Car");
      }
    }
    setEditingEmpId(null);
  };
  
  const getAssetDetails = (id?: string) => assets.find(a => a.id === id);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#f2f8fc] to-[#e6f2fd] backdrop-blur-md font-sans flex flex-col overflow-hidden">
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 bg-white/50 hover:bg-white text-slate-800 font-bold p-3 rounded-full transition-all z-50 cursor-pointer shadow-md border border-slate-300"
        title="Zamknij"
      >
        <X className="w-6 h-6" />
      </button>

      {/* WORKSPACE AREA */}
      <div className="flex-grow flex flex-col p-4 md:p-8 gap-6 overflow-y-auto w-full max-w-7xl mx-auto pt-16 relative z-10">
        
        {/* VIEW TOGGLES */}
        <div className="flex justify-center flex-shrink-0">
          <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1">
            <button 
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${deviceMode === "desktop" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <Monitor className="w-4 h-4" /> WERSJA DESKTOPOWA
            </button>
            <button 
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${deviceMode === "mobile" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <Smartphone className="w-4 h-4" /> WERSJA MOBILNA
            </button>
          </div>
        </div>

        {/* =========================================
            DESKTOP MODE
        ========================================= */}
        {deviceMode === "desktop" && (
          <div className="flex-grow flex bg-slate-50 rounded-3xl border border-slate-200 shadow-2xl min-h-[640px] xl:min-h-[720px] overflow-hidden">
            {/* SIDEBAR */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 flex-shrink-0">
              <div className="mb-8 px-2">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Onboarding App</div>
                <div className="space-y-1">
                  <button onClick={() => setActiveTab("dash")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "dash" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </button>
                  <button onClick={() => setActiveTab("emp")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "emp" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
                    <Users className="w-5 h-5" /> Kadry & Pracownicy
                  </button>
                  <button onClick={() => setActiveTab("kanban")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "kanban" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
                    <CheckSquare className="w-5 h-5" /> Tablica Zadań
                  </button>
                  <button onClick={() => setActiveTab("fleet")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "fleet" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
                    <Car className="w-5 h-5" /> Flota Pojazdów
                  </button>
                  <button onClick={() => setActiveTab("it")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "it" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
                    <Laptop className="w-5 h-5" /> Sprzęt IT
                  </button>
                </div>
              </div>

              <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Izabela Pawlak</div>
                  <div className="text-[10px] text-slate-500 font-medium">Head of HR</div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-grow p-6 overflow-y-auto">
              
              {/* DASHBOARD TAB */}
              {activeTab === "dash" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-800">Dzień dobry, Izabela</h2>
                  
                  {/* KPI CARDS */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">PROCESY ONBOARDING</p>
                        <h3 className="text-3xl font-black text-indigo-600">{employees.filter(e => e.status !== "Zakończony").length}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">AUTA WE FLOCIE</p>
                        <h3 className="text-3xl font-black text-blue-600">{assets.filter(a => a.type === "Car").length}</h3>
                        <p className="text-[10px] font-medium text-slate-400 mt-1">Dostępne: {assets.filter(a => a.type === "Car" && a.status === "Dostępny").length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Car className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">SPRZĘT IT</p>
                        <h3 className="text-3xl font-black text-emerald-600">{assets.filter(a => a.type === "Laptop").length}</h3>
                        <p className="text-[10px] font-medium text-slate-400 mt-1">Dostępne: {assets.filter(a => a.type === "Laptop" && a.status === "Dostępny").length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Laptop className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* CHARTS */}
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Status zadań (Kanban)</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={[
                                { name: 'Do zrobienia', value: tasks.filter(t => t.status === "todo").length },
                                { name: 'W trakcie', value: tasks.filter(t => t.status === "in-progress").length },
                                { name: 'Wykonane', value: tasks.filter(t => t.status === "done").length }
                              ]} 
                              cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value"
                            >
                              {[0, 1, 2].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Alokacja urządzeń</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Dostępne', Auta: assets.filter(a => a.type === "Car" && a.status === "Dostępny").length, Laptopy: assets.filter(a => a.type === "Laptop" && a.status === "Dostępny").length },
                            { name: 'W użyciu', Auta: assets.filter(a => a.type === "Car" && a.status === "W użyciu").length, Laptopy: assets.filter(a => a.type === "Laptop" && a.status === "W użyciu").length },
                            { name: 'Serwis', Auta: assets.filter(a => a.type === "Car" && a.status === "Serwis").length, Laptopy: assets.filter(a => a.type === "Laptop" && a.status === "Serwis").length }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Legend />
                            <Bar dataKey="Auta" fill={COLORS[1]} radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="Laptopy" fill={COLORS[2]} radius={[4, 4, 0, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EMPLOYEES TAB */}
              {activeTab === "emp" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800">Kadry i Pracownicy</h2>
                    {!isDesktopAdding && !desktopEditingEmpId && (
                      <button 
                        onClick={() => {
                          setDesktopEditForm({});
                          setIsDesktopAdding(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm transition-all shadow-sm"
                      >
                        <Plus className="w-4 h-4" /> Dodaj Pracownika
                      </button>
                    )}
                  </div>

                  {(isDesktopAdding || desktopEditingEmpId) ? (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-2xl">
                      <div className="flex items-center gap-2 mb-6 text-indigo-700 border-b border-indigo-100 pb-3">
                        <Edit2 className="w-5 h-5" /> 
                        <span className="font-black text-lg">
                          {isDesktopAdding ? "Nowy Pracownik" : "Edycja Danych"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Imię i Nazwisko</label>
                          <input 
                            value={desktopEditForm.name || ""} 
                            onChange={(e) => handleDesktopEditChange("name", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Dział</label>
                          <input 
                            value={desktopEditForm.department || ""} 
                            onChange={(e) => handleDesktopEditChange("department", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Stanowisko</label>
                          <input 
                            value={desktopEditForm.role || ""} 
                            onChange={(e) => handleDesktopEditChange("role", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                          <input 
                            value={desktopEditForm.email || ""} 
                            onChange={(e) => handleDesktopEditChange("email", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Telefon</label>
                          <input 
                            value={desktopEditForm.phone || ""} 
                            onChange={(e) => handleDesktopEditChange("phone", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                      </div>

                      {/* Asygnowanie Urządzeń */}
                      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Sprzęt IT (Laptop)</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500"
                            value={desktopEditForm.laptopId || ""}
                            onChange={(e) => handleDesktopEditChange("laptopId", e.target.value)}
                          >
                            <option value="">-- Brak --</option>
                            {assets.filter(a => a.type === "Laptop" && (a.status === "Dostępny" || a.id === desktopEditForm.laptopId)).map(l => (
                              <option key={l.id} value={l.id}>{l.model} ({l.identifier})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Pojazd (Auto)</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500"
                            value={desktopEditForm.carId || ""}
                            onChange={(e) => handleDesktopEditChange("carId", e.target.value)}
                          >
                            <option value="">-- Brak --</option>
                            {assets.filter(a => a.type === "Car" && (a.status === "Dostępny" || a.id === desktopEditForm.carId)).map(c => (
                              <option key={c.id} value={c.id}>{c.model} ({c.identifier})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Data Rozpoczęcia</label>
                          <input 
                            type="datetime-local"
                            value={desktopEditForm.startDate || ""} 
                            onChange={(e) => handleDesktopEditChange("startDate", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                      </div>

                      {/* Dokumenty i Akcje */}
                      {!isDesktopAdding && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Dokumenty i Automatyzacje</label>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => { setActiveActionModal('contract'); setActionForm({ type: 'UoP', period: 'Nieokreślony' }); }}
                              className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs uppercase rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> Generuj Umowę (PDF)
                            </button>
                            <button 
                              onClick={() => { setActiveActionModal('protocol'); setActionForm({ type: 'Laptop' }); }}
                              className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs uppercase rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> Protokół Sprzętu (PDF)
                            </button>
                            <button 
                              onClick={() => { setActiveActionModal('calendar'); setActionForm({ title: 'Onboarding - Spotkanie' }); }}
                              className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs uppercase rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
                            >
                              <Calendar className="w-3 h-3" /> Umów Spotkanie (G-Calendar)
                            </button>
                            <button 
                              onClick={() => { setActiveActionModal('email'); setActionForm({ subject: 'Witamy na pokładzie!' }); }}
                              className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs uppercase rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" /> Nowa Wiadomość (Gmail)
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Notatki */}
                      {!isDesktopAdding && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Notatki / Komentarze</label>
                          <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                            {(desktopEditForm.notes || []).length === 0 && (
                              <div className="text-xs text-slate-400 italic">Brak notatek.</div>
                            )}
                            {(desktopEditForm.notes || []).map(note => (
                              <div key={note.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-slate-700">{note.author}</span>
                                  <span className="text-[10px] text-slate-400">{note.timestamp}</span>
                                </div>
                                <div className="text-sm text-slate-600">{note.text}</div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input 
                              id="newNoteInput"
                              placeholder="Dodaj nową notatkę..."
                              className="flex-grow bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" 
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const text = e.currentTarget.value;
                                  if (text.trim()) {
                                    const newNote = { id: Date.now().toString(), text, author: "Izabela Pawlak", timestamp: new Date().toLocaleTimeString("pl-PL", {hour: '2-digit', minute:'2-digit'}) };
                                    setDesktopEditForm(prev => ({...prev, notes: [...(prev.notes || []), newNote]}));
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}
                            />
                            <button 
                              onClick={() => {
                                const input = document.getElementById('newNoteInput') as HTMLInputElement;
                                if (input && input.value.trim()) {
                                  const newNote = { id: Date.now().toString(), text: input.value, author: "Izabela Pawlak", timestamp: new Date().toLocaleTimeString("pl-PL", {hour: '2-digit', minute:'2-digit'}) };
                                  setDesktopEditForm(prev => ({...prev, notes: [...(prev.notes || []), newNote]}));
                                  input.value = '';
                                }
                              }}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-colors"
                            >
                              Dodaj
                            </button>
                          </div>
                          
                          {/* Dokumenty Podgląd (Desktop) */}
                          <div className="mt-4 pt-4 border-t border-slate-100">
                             <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Wygenerowane Dokumenty</label>
                             <div className="flex flex-wrap gap-3">
                               {(!desktopEditForm.docs || desktopEditForm.docs.length === 0) && (
                                 <div className="text-xs text-slate-400">Brak dokumentów.</div>
                               )}
                               {desktopEditForm.docs?.map(doc => (
                                 <div 
                                   key={doc.id}
                                   onClick={() => setSelectedDoc(doc)}
                                   className="border border-slate-200 bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all w-24 h-24 text-center"
                                 >
                                   <FileText className="w-8 h-8 text-rose-500 mb-2" />
                                   <div className="text-[9px] font-bold text-slate-700 truncate w-full">{doc.name}</div>
                                 </div>
                               ))}
                             </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100">
                        <button 
                          onClick={() => {
                            setIsDesktopAdding(false);
                            setDesktopEditingEmpId(null);
                          }}
                          className="px-6 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-sm rounded-xl transition-all"
                        >
                          Anuluj
                        </button>
                        <button 
                          onClick={saveDesktopForm}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md"
                        >
                          <Save className="w-4 h-4" /> Zapisz
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Imię i Nazwisko</th>
                            <th className="p-4">Dział / Rola</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Sprzęt & Flota</th>
                            <th className="p-4 text-right">Akcje</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map(emp => (
                            <tr 
                              key={emp.id} 
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                              onClick={() => {
                                setDesktopEditForm(emp);
                                setDesktopEditingEmpId(emp.id);
                              }}
                            >
                              <td className="p-4">
                                <div className="font-bold text-slate-800">{emp.name}</div>
                                <div className="text-xs text-slate-500">{emp.email} | {emp.phone}</div>
                              </td>
                              <td className="p-4">
                                <div className="font-semibold text-slate-700">{emp.department}</div>
                                <div className="text-xs text-slate-500">{emp.role}</div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  emp.status === "Nowy" ? "bg-amber-100 text-amber-700" :
                                  emp.status === "W trakcie" ? "bg-blue-100 text-blue-700" :
                                  "bg-emerald-100 text-emerald-700"
                                }`}>
                                  {emp.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  {/* Car tag */}
                                  {emp.carId ? (
                                    <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-bold" title={getAssetDetails(emp.carId)?.model}>
                                      <Car className="w-3 h-3 text-blue-600" /> {getAssetDetails(emp.carId)?.identifier}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 bg-slate-50 text-slate-400 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold">
                                      <Car className="w-3 h-3 opacity-50" /> Brak
                                    </div>
                                  )}
                                  {/* Laptop tag */}
                                  {emp.laptopId ? (
                                    <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-bold" title={getAssetDetails(emp.laptopId)?.model}>
                                      <Laptop className="w-3 h-3 text-emerald-600" /> {getAssetDetails(emp.laptopId)?.identifier}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 bg-slate-50 text-slate-400 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold">
                                      <Laptop className="w-3 h-3 opacity-50" /> Brak
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* KANBAN TAB */}
              {activeTab === "kanban" && (
                <div className="space-y-6 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                      <CheckSquare className="text-indigo-600" />
                      Tablica Zadań Onboardingowych
                    </h2>
                    <button 
                      onClick={() => {
                        setEditingTaskId("new");
                        setTaskEditForm({ status: "todo", title: "Nowe zadanie" });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Dodaj Zadanie
                    </button>
                  </div>

                  {editingTaskId && (
                    <div className="bg-white p-4 rounded-xl shadow-md border border-indigo-100 flex gap-4 items-end mb-4 animate-[fadeIn_0.2s_ease-out]">
                      <div className="flex-grow">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tytuł zadania</label>
                        <input 
                          autoFocus
                          value={taskEditForm.title || ""} 
                          onChange={e => setTaskEditForm({...taskEditForm, title: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" 
                        />
                      </div>
                      <div className="w-48">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Przypisany</label>
                        <select 
                          value={taskEditForm.assignee || ""} 
                          onChange={e => setTaskEditForm({...taskEditForm, assignee: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500"
                        >
                          <option value="">-- Wybierz --</option>
                          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                      </div>
                      <div className="w-40">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</label>
                        <select 
                          value={taskEditForm.status || "todo"} 
                          onChange={e => setTaskEditForm({...taskEditForm, status: e.target.value as any})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500"
                        >
                          <option value="todo">Do zrobienia</option>
                          <option value="in-progress">W trakcie</option>
                          <option value="done">Gotowe</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => {
                          if (editingTaskId === "new") {
                            setTasks([...tasks, { ...taskEditForm, id: `t${Date.now()}` } as KanbanTask]);
                          } else {
                            setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, ...taskEditForm } as KanbanTask : t));
                          }
                          setEditingTaskId(null);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 text-sm transition-all"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingTaskId(null)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold py-2.5 px-3 rounded-lg flex items-center gap-2 text-sm transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow pb-10 min-h-[400px]">
                    
                    {/* COLUMNS */}
                    {([
                      { id: 'todo', title: 'Do zrobienia', color: 'border-l-red-400', headerBadge: 'bg-red-100 text-red-700' },
                      { id: 'in-progress', title: 'W trakcie', color: 'border-l-amber-400', headerBadge: 'bg-amber-100 text-amber-700' },
                      { id: 'done', title: 'Gotowe', color: 'border-l-emerald-400 opacity-70 hover:opacity-100 transition-opacity', headerBadge: 'bg-emerald-100 text-emerald-700' }
                    ] as const).map(column => (
                      
                      <div 
                        key={column.id} 
                        className="bg-slate-100 rounded-2xl p-4 flex flex-col transition-colors border border-transparent"
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-indigo-300", "bg-indigo-50/50"); }}
                        onDragLeave={(e) => e.currentTarget.classList.remove("border-indigo-300", "bg-indigo-50/50")}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove("border-indigo-300", "bg-indigo-50/50");
                          if (draggedTaskId) {
                            updateTaskStatus(draggedTaskId, column.id);
                            setDraggedTaskId(null);
                          }
                        }}
                      >
                        <h3 className="font-bold text-slate-600 mb-4 uppercase tracking-widest text-xs flex justify-between">
                          <span>{column.title}</span>
                          <span className={`px-2 py-0.5 rounded-full ${column.headerBadge}`}>
                            {tasks.filter(t => t.status === column.id).length}
                          </span>
                        </h3>
                        <div className="space-y-3 flex-grow overflow-y-auto">
                          {tasks.filter(t => t.status === column.id).map(task => (
                            <div 
                              key={task.id} 
                              draggable
                              onDragStart={(e) => {
                                setDraggedTaskId(task.id);
                                e.currentTarget.classList.add("opacity-50");
                              }}
                              onDragEnd={(e) => e.currentTarget.classList.remove("opacity-50")}
                              className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer border-slate-200 border-l-4 ${column.color} relative group`}
                              onClick={() => {
                                setEditingTaskId(task.id);
                                setTaskEditForm(task);
                              }}
                            >
                              <div className="font-bold text-slate-800 text-sm mb-2 pr-8">{task.title}</div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded inline-block">
                                  {employees.find(e => e.id === task.assignee)?.name || "Brak"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    ))}
                  </div>
                </div>
              )}

              {/* FLEET TAB */}
              {activeTab === "fleet" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800">Flota Pojazdów</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.filter(a => a.type === "Car").map(car => (
                      <div key={car.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              <Car className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-black text-slate-800">{car.model}</div>
                              <div className="text-xs font-mono text-slate-500 bg-slate-100 inline-block px-2 py-0.5 mt-1 rounded">{car.identifier}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <select 
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase border-none outline-none appearance-none cursor-pointer ${
                              car.status === "Dostępny" ? "bg-emerald-100 text-emerald-700" :
                              car.status === "W użyciu" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}
                            value={car.status}
                            onChange={(e) => updateAssetStatus(car.id, e.target.value as any)}
                          >
                            <option value="Dostępny" className="bg-white text-slate-800">DOSTĘPNY</option>
                            <option value="W użyciu" className="bg-white text-slate-800">W UŻYCIU</option>
                            <option value="Serwis" className="bg-white text-slate-800">SERWIS</option>
                          </select>
                        </div>
                        <div className="border-t border-slate-100 pt-4">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Przypisany pracownik</label>
                            <button 
                              onClick={() => { setSelectedAssetId(car.id); }}
                              className="text-[9px] uppercase font-bold text-blue-600 hover:text-blue-800"
                            >
                              Profil Pojazdu &rarr;
                            </button>
                          </div>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                            value={car.assignedTo || ""}
                            onChange={(e) => assignAsset(e.target.value, car.id, "Car")}
                          >
                            <option value="">-- Bez przydziału --</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IT EQUIPMENT TAB */}
              {activeTab === "it" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800">Sprzęt IT</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.filter(a => a.type === "Laptop").map(laptop => (
                      <div key={laptop.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <Laptop className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-black text-slate-800">{laptop.model}</div>
                              <div className="text-xs font-mono text-slate-500 bg-slate-100 inline-block px-2 py-0.5 mt-1 rounded">{laptop.identifier}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <select 
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase border-none outline-none appearance-none cursor-pointer ${
                              laptop.status === "Dostępny" ? "bg-emerald-100 text-emerald-700" :
                              laptop.status === "W użyciu" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}
                            value={laptop.status}
                            onChange={(e) => updateAssetStatus(laptop.id, e.target.value as any)}
                          >
                            <option value="Dostępny" className="bg-white text-slate-800">DOSTĘPNY</option>
                            <option value="W użyciu" className="bg-white text-slate-800">W UŻYCIU</option>
                            <option value="Serwis" className="bg-white text-slate-800">SERWIS</option>
                          </select>
                        </div>
                        <div className="border-t border-slate-100 pt-4">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Przypisany pracownik</label>
                            <button 
                              onClick={() => { setSelectedAssetId(laptop.id); }}
                              className="text-[9px] uppercase font-bold text-emerald-600 hover:text-emerald-800"
                            >
                              Profil Sprzętu &rarr;
                            </button>
                          </div>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
                            value={laptop.assignedTo || ""}
                            onChange={(e) => assignAsset(e.target.value, laptop.id, "Laptop")}
                          >
                            <option value="">-- Bez przydziału --</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* =========================================
            MOBILE/PHONE MODE (EDITABLE)
        ========================================= */}
        {deviceMode === "mobile" && (
          <div className="flex-grow flex items-center justify-center pt-8 pb-8">
            
            <div className="relative w-[340px] h-[640px] bg-slate-100 rounded-[44px] p-2.5 border-[4px] border-slate-300 shadow-2xl shrink-0 overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 flex justify-center z-50 pointer-events-none mt-2">
                <div className="w-[120px] h-[30px] bg-black rounded-b-2xl flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
                </div>
              </div>

              {/* Inner Screen */}
              <div className="w-full h-full bg-slate-50 rounded-[38px] flex flex-col relative overflow-hidden">
                
                {/* STATUS BAR */}
                <div className="h-12 bg-white flex justify-between items-end px-6 pb-2 shrink-0">
                  <span className="text-[12px] font-bold text-slate-800">12:30</span>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-slate-800">
                    <span>5G</span>
                  </div>
                </div>

                {/* APP HEADER */}
                <div className="bg-white border-b border-slate-200 p-4 shrink-0 shadow-sm z-10 flex flex-col items-center justify-center">
                  <h3 className="font-black text-slate-800 text-lg">
                    {mobileTab === "emp" && "Baza Pracowników"}
                    {mobileTab === "kanban" && "Zadania Onboarding"}
                    {mobileTab === "fleet" && "Flota Pojazdów"}
                    {mobileTab === "it" && "Sprzęt IT"}
                  </h3>
                </div>

                {/* APP BODY (LIST OR EDIT) */}
                <div className="flex-grow p-4 overflow-y-auto space-y-3 pb-6 relative z-0">
                  {mobileTab === "emp" && !editingEmpId && (
                    // LIST
                    employees.map(emp => (
                      <div key={emp.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => startEdit(emp)}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-black text-slate-800 text-sm">{emp.name}</div>
                            <div className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{emp.role}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" /> {emp.phone}
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
                             {/* Car tag */}
                             {emp.carId ? (
                                  <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded text-[9px] font-bold" title={getAssetDetails(emp.carId)?.model}>
                                    <Car className="w-3 h-3 text-blue-600" /> {getAssetDetails(emp.carId)?.identifier}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 bg-slate-50 text-slate-400 border border-slate-200 px-2 py-1 rounded text-[9px] font-bold">
                                    <Car className="w-3 h-3 opacity-50" /> Brak
                                  </div>
                                )}
                                {/* Laptop tag */}
                                {emp.laptopId ? (
                                  <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded text-[9px] font-bold" title={getAssetDetails(emp.laptopId)?.model}>
                                    <Laptop className="w-3 h-3 text-emerald-600" /> {getAssetDetails(emp.laptopId)?.identifier}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 bg-slate-50 text-slate-400 border border-slate-200 px-2 py-1 rounded text-[9px] font-bold">
                                    <Laptop className="w-3 h-3 opacity-50" /> Brak
                                  </div>
                                )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {mobileTab === "emp" && editingEmpId && (
                    // EDIT FORM
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-200 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-4 text-indigo-700 border-b border-indigo-100 pb-2">
                        <Edit2 className="w-5 h-5" /> <span className="font-black text-sm">Edycja Danych</span>
                      </div>
                      
                      <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Imię i Nazwisko</label>
                          <input 
                            value={editForm.name || ""} 
                            onChange={(e) => handleEditChange("name", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Stanowisko</label>
                          <input 
                            value={editForm.role || ""} 
                            onChange={(e) => handleEditChange("role", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Telefon</label>
                          <input 
                            value={editForm.phone || ""} 
                            onChange={(e) => handleEditChange("phone", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                          <input 
                            value={editForm.email || ""} 
                            onChange={(e) => handleEditChange("email", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Sprzęt IT (Laptop)</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500"
                            value={editForm.laptopId || ""}
                            onChange={(e) => handleEditChange("laptopId", e.target.value)}
                          >
                            <option value="">-- Brak --</option>
                            {assets.filter(a => a.type === "Laptop" && (a.status === "Dostępny" || a.id === editForm.laptopId)).map(l => (
                              <option key={l.id} value={l.id}>{l.model}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Pojazd (Auto)</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mt-1 outline-none focus:border-indigo-500"
                            value={editForm.carId || ""}
                            onChange={(e) => handleEditChange("carId", e.target.value)}
                          >
                            <option value="">-- Brak --</option>
                            {assets.filter(a => a.type === "Car" && (a.status === "Dostępny" || a.id === editForm.carId)).map(c => (
                              <option key={c.id} value={c.id}>{c.model}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Data Rozpoczęcia</label>
                          <input 
                            type="datetime-local"
                            value={editForm.startDate || ""} 
                            onChange={(e) => handleEditChange("startDate", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold mt-1 outline-none focus:border-indigo-500" 
                          />
                        </div>

                        {/* Mobile Actions */}
                        <div className="pt-4 border-t border-slate-100">
                          <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Dokumenty i Akcje</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => { setActiveActionModal('contract'); setActionForm({ type: 'UoP', period: 'Nieokreślony' }); }}
                              className="px-2 py-2 bg-rose-50 text-rose-700 font-bold text-[9px] uppercase rounded-lg border border-rose-200 flex items-center justify-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> Umowa (PDF)
                            </button>
                            <button 
                              onClick={() => { setActiveActionModal('protocol'); setActionForm({ type: 'Laptop' }); }}
                              className="px-2 py-2 bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase rounded-lg border border-emerald-200 flex items-center justify-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> Protokół (PDF)
                            </button>
                            <button 
                              onClick={() => { setActiveActionModal('calendar'); setActionForm({ title: 'Onboarding - Spotkanie' }); }}
                              className="px-2 py-2 bg-blue-50 text-blue-700 font-bold text-[9px] uppercase rounded-lg border border-blue-200 flex items-center justify-center gap-1"
                            >
                              <Calendar className="w-3 h-3" /> Kalendarz
                            </button>
                            <button 
                              onClick={() => { setActiveActionModal('email'); setActionForm({ subject: 'Witamy na pokładzie!' }); }}
                              className="px-2 py-2 bg-slate-100 text-slate-700 font-bold text-[9px] uppercase rounded-lg border border-slate-200 flex items-center justify-center gap-1"
                            >
                              <Mail className="w-3 h-3" /> E-mail
                            </button>
                          </div>
                        </div>

                        {/* Mobile Notes */}
                        <div className="pt-2 border-t border-slate-100">
                          <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Notatki / Czat HR</label>
                          <div className="space-y-2 mb-2">
                            {(editForm.notes || []).length === 0 && (
                              <div className="text-[10px] text-slate-400 italic">Brak notatek.</div>
                            )}
                            {(editForm.notes || []).map(note => (
                              <div key={note.id} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-slate-700">{note.author}</span>
                                  <span className="text-[9px] text-slate-400">{note.timestamp}</span>
                                </div>
                                <div className="text-[11px] text-slate-600">{note.text}</div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-1">
                            <input 
                              id="mobileNewNoteInput"
                              placeholder="Notatka..."
                              className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500" 
                            />
                            <button 
                              onClick={() => {
                                const input = document.getElementById('mobileNewNoteInput') as HTMLInputElement;
                                if (input && input.value.trim()) {
                                  const newNote = { id: Date.now().toString(), text: input.value, author: "Izabela Pawlak", timestamp: new Date().toLocaleTimeString("pl-PL", {hour: '2-digit', minute:'2-digit'}) };
                                  setEditForm(prev => ({...prev, notes: [...(prev.notes || []), newNote]}));
                                  input.value = '';
                                }
                              }}
                              className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold text-[10px] uppercase rounded-lg"
                            >
                              Dodaj
                            </button>
                          </div>
                          
                          {/* Dokumenty Podgląd (Mobile) */}
                          <div className="mt-4 pt-3 border-t border-slate-100">
                             <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Dokumenty</label>
                             <div className="flex flex-wrap gap-2">
                               {(!editForm.docs || editForm.docs.length === 0) && (
                                 <div className="text-[9px] text-slate-400">Brak.</div>
                               )}
                               {editForm.docs?.map(doc => (
                                 <div 
                                   key={doc.id}
                                   onClick={() => setSelectedDoc(doc)}
                                   className="border border-slate-200 bg-white p-2 rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer w-16 h-16 text-center"
                                 >
                                   <FileText className="w-5 h-5 text-rose-500 mb-1" />
                                   <div className="text-[7px] font-bold text-slate-700 truncate w-full">{doc.name}</div>
                                 </div>
                               ))}
                             </div>
                          </div>
                        </div>

                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                        <button 
                          onClick={() => setEditingEmpId(null)}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
                        >
                          ANULUJ
                        </button>
                        <button 
                          onClick={saveEdit}
                          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex justify-center items-center gap-1 transition-colors shadow-md"
                        >
                          <Save className="w-4 h-4" /> ZAPISZ
                        </button>
                      </div>
                    </div>
                  )}

                  {mobileTab === "kanban" && (
                    <div className="space-y-4">
                      {tasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 cursor-pointer hover:shadow-md transition-shadow ${task.status === 'todo' ? 'border-l-red-400' : task.status === 'in-progress' ? 'border-l-amber-400' : 'border-l-emerald-400 opacity-60'}`}
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setTaskEditForm(task);
                          }}
                        >
                          <div className="font-bold text-slate-800 text-sm mb-2">{task.title}</div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-slate-500 font-medium">Dla: {employees.find(e => e.id === task.assignee)?.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                              value={task.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateTaskStatus(task.id, e.target.value as any);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="todo">Rozpoczęte (To do)</option>
                              <option value="in-progress">W trakcie</option>
                              <option value="done">Zakończone</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {mobileTab === "fleet" && (
                    <div className="space-y-4">
                      {assets.filter(a => a.type === "Car").map(car => (
                        <div key={car.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-slate-800 text-sm flex items-center gap-1">
                              <Car className="w-4 h-4 text-blue-600" /> {car.model}
                            </span>
                            <select 
                              className={`max-w-28 px-2 py-0.5 rounded text-[9px] font-bold uppercase border-none outline-none appearance-none cursor-pointer ${
                                car.status === "Dostępny" ? "bg-emerald-100 text-emerald-700" :
                                car.status === "W użyciu" ? "bg-amber-100 text-amber-700" :
                                "bg-red-100 text-red-700"
                              }`}
                              value={car.status}
                              onChange={(e) => updateAssetStatus(car.id, e.target.value as any)}
                            >
                              <option value="Dostępny" className="bg-white text-slate-800">DOSTĘPNY</option>
                              <option value="W użyciu" className="bg-white text-slate-800">W UŻYCIU</option>
                              <option value="Serwis" className="bg-white text-slate-800">SERWIS</option>
                            </select>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mb-3">{car.identifier}</div>
                          
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                            value={car.assignedTo || ""}
                            onChange={(e) => assignAsset(e.target.value, car.id, "Car")}
                          >
                            <option value="">-- Bez przydziału --</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {mobileTab === "it" && (
                    <div className="space-y-4">
                      {assets.filter(a => a.type === "Laptop").map(laptop => (
                        <div key={laptop.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-slate-800 text-sm flex items-center gap-1">
                              <Laptop className="w-4 h-4 text-emerald-600" /> {laptop.model}
                            </span>
                            <select 
                              className={`max-w-28 px-2 py-0.5 rounded text-[9px] font-bold uppercase border-none outline-none appearance-none cursor-pointer ${
                                laptop.status === "Dostępny" ? "bg-emerald-100 text-emerald-700" :
                                laptop.status === "W użyciu" ? "bg-amber-100 text-amber-700" :
                                "bg-red-100 text-red-700"
                              }`}
                              value={laptop.status}
                              onChange={(e) => updateAssetStatus(laptop.id, e.target.value as any)}
                            >
                              <option value="Dostępny" className="bg-white text-slate-800">DOSTĘPNY</option>
                              <option value="W użyciu" className="bg-white text-slate-800">W UŻYCIU</option>
                              <option value="Serwis" className="bg-white text-slate-800">SERWIS</option>
                            </select>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mb-3">{laptop.identifier}</div>
                          
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500"
                            value={laptop.assignedTo || ""}
                            onChange={(e) => assignAsset(e.target.value, laptop.id, "Laptop")}
                          >
                            <option value="">-- Bez przydziału --</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* BOTTOM TAB BAR */}
                <div className="h-16 bg-white border-t border-slate-200 shrink-0 flex justify-around items-center pb-2 z-10 px-2">
                   <button 
                    onClick={() => { setMobileTab("emp"); setEditingEmpId(null); }}
                    className={`flex flex-col items-center gap-1 transition-all flex-1 ${mobileTab === "emp" ? "text-indigo-700 scale-105" : "text-slate-400 hover:text-slate-600"}`}
                   >
                     <Users className="w-5 h-5" />
                     <span className="text-[9px] font-bold">Kadry</span>
                   </button>
                   <button 
                    onClick={() => { setMobileTab("kanban"); setEditingEmpId(null); }}
                    className={`flex flex-col items-center gap-1 transition-all flex-1 ${mobileTab === "kanban" ? "text-indigo-700 scale-105" : "text-slate-400 hover:text-slate-600"}`}
                   >
                     <CheckSquare className="w-5 h-5" />
                     <span className="text-[9px] font-bold">Zadania</span>
                   </button>
                   <button 
                    onClick={() => { setMobileTab("fleet"); setEditingEmpId(null); }}
                    className={`flex flex-col items-center gap-1 transition-all flex-1 ${mobileTab === "fleet" ? "text-indigo-700 scale-105" : "text-slate-400 hover:text-slate-600"}`}
                   >
                     <Car className="w-5 h-5" />
                     <span className="text-[9px] font-bold">Flota</span>
                   </button>
                   <button 
                    onClick={() => { setMobileTab("it"); setEditingEmpId(null); }}
                    className={`flex flex-col items-center gap-1 transition-all flex-1 ${mobileTab === "it" ? "text-indigo-700 scale-105" : "text-slate-400 hover:text-slate-600"}`}
                   >
                     <Laptop className="w-5 h-5" />
                     <span className="text-[9px] font-bold">Sprzęt</span>
                   </button>
                </div>
              </div>
            </div>
            
          </div>
        )}

      </div>

      {/* ASSET PROFILE MODAL */}
      {selectedAssetId && (() => {
        const asset = getAssetDetails(selectedAssetId);
        if (!asset) return null;
        const ownerInfo = asset.assignedTo ? employees.find(e => e.id === asset.assignedTo)?.name : "Brak przydziału";
        
        return (
          <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh]">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${asset.type === 'Car' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {asset.type === 'Car' ? <Car className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">{asset.model}</h3>
                    <div className="font-mono text-[10px] text-slate-500">{asset.identifier}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAssetId(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Obecny Posiadacz</span>
                    <span className="text-sm font-black text-slate-800 leading-tight">{ownerInfo}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Status Assetu</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      asset.status === "Dostępny" ? "bg-emerald-100 text-emerald-700" :
                      asset.status === "W użyciu" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                </div>

                {/* Simulated History */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Historia Użytkowania (Log)</h4>
                  <div className="space-y-2 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-100 z-0 pl-1">
                    <div className="relative pl-6 pb-2 z-10">
                      <div className="absolute left-1 w-2 h-2 rounded-full bg-indigo-500 top-1"></div>
                      <div className="bg-white border text-xs p-2 rounded-lg shadow-sm">
                        <div className="font-bold text-slate-700 mb-0.5">Zaktualizowano status ok 2h temu</div>
                        <div className="text-slate-500 text-[10px]">Asset odświeżony w rejestrze inwentarza (Izabela Pawlak)</div>
                      </div>
                    </div>
                    <div className="relative pl-6 pb-2 z-10">
                      <div className="absolute left-1 w-2 h-2 rounded-full bg-slate-300 top-1"></div>
                      <div className="bg-white border text-xs p-2 rounded-lg opacity-70">
                        <div className="font-bold text-slate-700 mb-0.5">Wydanie (Protokół Q3 2025)</div>
                        <div className="text-slate-500 text-[10px]">Poprzedni pracownik: R. Kowalski</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add note */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Notatki serwisowe / HR</h4>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Wpisz uwagę (np. lekko zarysowany)..."
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500" 
                    />
                    <button 
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if(input && input.value) { alert("Dodano notatkę: " + input.value); input.value = ""; }
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase rounded-lg"
                    >
                      Zapisz
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
      {/* DOC PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[3000] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-500" />
                <span className="font-mono text-xs text-slate-700">{selectedDoc.name}</span>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="w-6 h-6 flex items-center justify-center rounded-sm bg-slate-200 text-slate-600 hover:bg-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-grow bg-slate-200 flex flex-col items-center gap-6">
              {/* Fake PDF Content - MULTI-PAGE */}
              <div className="bg-white w-full max-w-lg shadow-[0_4px_15px_rgba(0,0,0,0.1)] min-h-[600px] p-10 font-serif text-sm text-slate-800 leading-relaxed relative flex flex-col">
                <div className="text-right text-[10px] text-slate-500 mb-8">
                  Data wygenerowania: {new Date().toLocaleDateString('pl-PL')}
                </div>
                
                <h1 className="text-xl font-bold text-center mb-6 uppercase tracking-wider">
                  {selectedDoc.name.includes("Umowa") ? "Umowa o Pracę" : "Protokół Zmiany Sprzętu"}
                </h1>

                {selectedDoc.name.includes("Umowa") ? (
                  <>
                    <p className="mb-4">
                      Zawarta w dniu dzisiejszym pomiędzy <strong>Firmą Transportową Sp. z o.o.</strong> z siedzibą w Warszawie, zwaną dalej <em>Pracodawcą</em>, a pracownikiem, zwanym dalej <em>Pracownikiem</em>.
                    </p>
                    <h2 className="text-md font-bold mt-6 mb-2">§ 1. Warunki zatrudnienia</h2>
                    <p className="mb-4 text-justify">
                      Pracodawca zatrudnia Pracownika na podstawie niniejszej umowy o pracę na stanowisku przypisanym w systemie na czas nieokreślony, począwszy od daty widniejącej w profilu Pracownika. Zobowiązuje się do pełnego przestrzegania wewnętrznych regulacji oraz standardów komunikacji firmy.
                    </p>
                    <h2 className="text-md font-bold mt-6 mb-2">§ 2. Czas i miejsce pracy</h2>
                    <p className="mb-4 text-justify">
                      Miejscem wykonywania pracy jest siedziba firmy lub miejsce wyznaczone przez przełożonego (obejmujące wyznaczone filie na terenie RP). Wymiar czasu pracy wynosi pełen etat. Ewidencja czasu prowadzona będzie w oparciu o system elektroniczny pracodawcy z uwzględnieniem elastycznych godzin rozpoczęcia prac.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-4">
                      Protokół sporządzony na okoliczność wydania / zdania sprzętu służbowego dla pracownika.
                    </p>
                    <h2 className="text-md font-bold mt-6 mb-2">1. Przedmiot protokołu</h2>
                    <p className="mb-4 text-justify">
                      Niniejszy dokument potwierdza przekazanie Pracownikowi urządzenia niezbędnego do wykonywania obowiązków służbowych.
                    </p>
                    <h2 className="text-md font-bold mt-6 mb-2">2. Prawa i Obowiązki</h2>
                    <p className="mb-4 text-justify">
                      Pracownik ma obowiązek chronić sprzęt przed uszkodzeniem, zniszczeniem oraz kradzieżą. W przypadku awarii należy ją zgłosić niezwłocznie do Działu IT. Zabrania się instalowania programów niezatwierdzonych.
                    </p>
                  </>
                )}
                
                {/* Page number */}
                <div className="mt-auto text-center text-slate-400 text-[10px] pt-8">
                  Strona 1 z 2
                </div>
              </div>

              {/* Page 2 for Signature if Umowa */}
              {selectedDoc.name.includes("Umowa") && (
                <div className="bg-white w-full max-w-lg shadow-[0_4px_15px_rgba(0,0,0,0.1)] min-h-[600px] p-10 font-serif text-sm text-slate-800 leading-relaxed relative flex flex-col mt-6">
                  <h2 className="text-md font-bold mb-2">§ 3. Wynagrodzenie</h2>
                  <p className="mb-4 text-justify">
                    Pracownik z tytułu wykonywanych obowiązków otrzyma wynagrodzenie zasadnicze, powiększone o ewentualne premie regulaminowe, wypłacane do dziesiątego dnia miesiąca za miesiąc poprzedni. Szczegóły dotyczące widełek ujęto w Załączniku A.
                  </p>
                  <h2 className="text-md font-bold mt-6 mb-2">§ 4. Postanowienia końcowe</h2>
                  <p className="mb-4 text-justify">
                    Wszelkie zmiany niniejszej umowy wymagają dla swej ważności zachowania formy pisemnej. W sprawach nieuregulowanych niniejszą umową mają zastosowanie powszechnie obowiązujące przepisy Kodeksu Pracy oraz innych ustaw.
                  </p>

                  <div className="mt-auto pt-16 pb-12 flex justify-between">
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-32 mb-2"></div>
                      <div className="text-[10px] uppercase font-sans">Podpis Pracodawcy</div>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-32 mb-2"></div>
                      <div className="text-[10px] uppercase font-sans">Podpis Pracownika</div>
                    </div>
                  </div>

                  <div className="mt-auto text-center text-slate-400 text-[10px] pt-8">
                    Strona 2 z 2
                  </div>
                </div>
              )}

              {/* Protocol signature is short, can be on page 1, but we put it below */}
              {!selectedDoc.name.includes("Umowa") && (
                <div className="bg-white w-full max-w-lg shadow-[0_4px_15px_rgba(0,0,0,0.1)] min-h-[400px] p-10 font-serif text-sm text-slate-800 leading-relaxed relative flex flex-col">
                   <div className="mt-16 flex justify-between">
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-32 mb-2"></div>
                      <div className="text-[10px] uppercase font-sans">Wydający (IT)</div>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-32 mb-2"></div>
                      <div className="text-[10px] uppercase font-sans">Odbierający (Pracownik)</div>
                    </div>
                  </div>
                  <div className="mt-auto text-center text-slate-400 text-[10px] pt-8">
                    Strona 2 z 2
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL OVERLAY */}
      {activeActionModal && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                  {activeActionModal === 'contract' || activeActionModal === 'protocol' ? <FileText className="w-5 h-5"/> : null}
                  {activeActionModal === 'calendar' ? <Calendar className="w-5 h-5"/> : null}
                  {activeActionModal === 'email' ? <Mail className="w-5 h-5"/> : null}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">
                    {activeActionModal === 'contract' && 'Generowanie Umowy'}
                    {activeActionModal === 'protocol' && 'Protokół Sprzętu'}
                    {activeActionModal === 'calendar' && 'Umawianie Spotkania'}
                    {activeActionModal === 'email' && 'Nowa Wiadomość'}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveActionModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-4">
              {activeActionModal === 'contract' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Rodzaj Umowy</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                        value={actionForm.type}
                        onChange={e => setActionForm({...actionForm, type: e.target.value})}
                      >
                        <option>Umowa o Pracę</option>
                        <option>B2B</option>
                        <option>Umowa Zlecenie</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Okres</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                        value={actionForm.period}
                        onChange={e => setActionForm({...actionForm, period: e.target.value})}
                      >
                        <option>Nieokreślony</option>
                        <option>Okres Próbny (3 mce)</option>
                        <option>Określony (1 rok)</option>
                      </select>
                    </div>
                  </div>
                  {/* Fake PDF preview */}
                  <div className="mt-4 border border-slate-200 bg-slate-100 rounded-xl p-4 flex flex-col items-center justify-center h-48 opacity-80">
                    <FileText className="w-12 h-12 text-slate-400 mb-2" />
                    <div className="text-xs font-bold text-slate-500">Podgląd dokumentu PDF</div>
                    <div className="text-[10px] text-slate-400">Umowa_{actionForm.type.replace(/\s/g, '_')}.pdf</div>
                  </div>
                </>
              )}

              {activeActionModal === 'protocol' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Rodzaj Sprzętu</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                        value={actionForm.type}
                        onChange={e => setActionForm({...actionForm, type: e.target.value})}
                      >
                        <option>Laptop</option>
                        <option>Telefon</option>
                        <option>Samochód</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Data Wydania</label>
                      <input 
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                        value={actionForm.date || new Date().toISOString().split('T')[0]}
                        onChange={e => setActionForm({...actionForm, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-4 border border-slate-200 bg-slate-100 rounded-xl p-4 flex flex-col items-center justify-center h-48 opacity-80">
                    <FileText className="w-12 h-12 text-slate-400 mb-2" />
                    <div className="text-xs font-bold text-slate-500">Podgląd Protokołu PDF</div>
                    <div className="text-[10px] text-slate-400">Protokol_Wydania_{actionForm.type}.pdf</div>
                  </div>
                </>
              )}

              {activeActionModal === 'calendar' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tytuł Spotkania</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500"
                      value={actionForm.title || ""}
                      onChange={e => setActionForm({...actionForm, title: e.target.value})}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Wybierz Datę</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-3">
                        <button className="text-slate-400 hover:text-indigo-600 font-bold">&lt;</button>
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-600">Czerwiec 2026</span>
                        <button className="text-slate-400 hover:text-indigo-600 font-bold">&gt;</button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => (
                          <div key={d} className="text-[9px] font-bold text-slate-400">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {[...Array(30)].map((_, i) => {
                          const day = i + 1;
                          const isSelected = actionForm.day === day;
                          return (
                            <div 
                              key={i} 
                              onClick={() => setActionForm({...actionForm, day})}
                              className={`p-1.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                                isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-100 text-slate-700'
                              }`}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Czas rozpoczęcia (Od)</label>
                      <input 
                        type="time"
                        value={actionForm.startTime || "09:00"}
                        onChange={e => setActionForm({...actionForm, startTime: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Czas zakończenia (Do)</label>
                      <input 
                        type="time"
                        value={actionForm.endTime || "10:00"}
                        onChange={e => setActionForm({...actionForm, endTime: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeActionModal === 'email' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Temat</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                      value={actionForm.subject}
                      onChange={e => setActionForm({...actionForm, subject: e.target.value})}
                    />
                  </div>
                  <div className="mt-2 flex-grow flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Treść Wiadomości</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none min-h-[150px] resize-none"
                      defaultValue="Cześć! Witamy na pokładzie. Przesyłamy najważniejsze informacje na Twój pierwszy dzień w pracy. Do zobaczenia!"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2 font-bold text-xs uppercase text-slate-500 hover:text-slate-700"
              >
                Anuluj
              </button>
              <button 
                onClick={() => {
                  let noteText = "";
                  switch(activeActionModal) {
                    case 'contract': noteText = `[Umowa] Wygenerowano: ${actionForm.type} (${actionForm.period}).`; break;
                    case 'protocol': noteText = `[Sprzęt] Protokół wygenerowany: ${actionForm.type}.`; break;
                    case 'calendar': noteText = `[Spotkanie] Zaplanowano z Google Calendar: "${actionForm.title}" w dn. Czerwiec ${actionForm.day || 1}, od ${actionForm.startTime || "09:00"} do ${actionForm.endTime || "10:00"}.`; break;
                    case 'email': noteText = `[Email] Wysłano Gmail: "${actionForm.subject}".`; break;
                  }
                  const newNote = { 
                    id: Date.now().toString(), 
                    text: noteText, 
                    author: "Izabela Pawlak", 
                    timestamp: new Date().toLocaleTimeString("pl-PL", {hour: '2-digit', minute:'2-digit'}) 
                  };

                  if (desktopEditingEmpId || isDesktopAdding) {
                    setDesktopEditForm(prev => {
                      const newDocs = [...(prev.docs || [])];
                      if (activeActionModal === 'contract') newDocs.push({ id: Date.now().toString(), name: `Umowa_${actionForm.type.replace(/\s/g, '_')}.pdf`, type: 'pdf' });
                      if (activeActionModal === 'protocol') newDocs.push({ id: Date.now().toString(), name: `Protokol_${actionForm.type}.pdf`, type: 'pdf' });
                      return {...prev, notes: [...(prev.notes || []), newNote], docs: newDocs};
                    });
                  } else if (editingEmpId) {
                    setEditForm(prev => {
                      const newDocs = [...(prev.docs || [])];
                      if (activeActionModal === 'contract') newDocs.push({ id: Date.now().toString(), name: `Umowa_${actionForm.type.replace(/\s/g, '_')}.pdf`, type: 'pdf' });
                      if (activeActionModal === 'protocol') newDocs.push({ id: Date.now().toString(), name: `Protokol_${actionForm.type}.pdf`, type: 'pdf' });
                      return {...prev, notes: [...(prev.notes || []), newNote], docs: newDocs};
                    });
                  }
                  setActiveActionModal(null);
                }}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase rounded-lg shadow-md"
              >
                Wykonaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
