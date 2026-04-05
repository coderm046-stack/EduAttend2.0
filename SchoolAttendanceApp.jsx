import { useState, useEffect } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────
const INITIAL_CLASSES = [
  { id: 1, name: "Class 1-A", teacher: "Mrs. Sharma", students: ["Aarav Shah","Diya Patel","Rohan Mehta","Priya Joshi","Arjun Desai","Sneha Gupta","Kiran Verma","Ananya Singh","Dev Kapoor","Riya Nair"] },
  { id: 2, name: "Class 2-B", teacher: "Mr. Patel", students: ["Aisha Khan","Vihaan Reddy","Meera Pillai","Kabir Malhotra","Tanya Iyer","Siddharth Rao","Pooja Bhat","Rahul Mishra","Nisha Tiwari","Amit Dubey"] },
  { id: 3, name: "Class 3-C", teacher: "Ms. Iyer",  students: ["Chirag Agarwal","Simran Kaur","Yuvan Sharma","Lakshmi Nair","Harsh Jain","Anjali Gupta","Ravi Kumar","Tanvi Shah","Nikhil Verma","Shreya Bose"] },
];

const INITIAL_HOLIDAYS = [
  { date: "2025-01-14", name: "Makar Sankranti", type: "single" },
  { date: "2025-01-26", name: "Republic Day", type: "single" },
  { date: "2025-03-25", name: "Holi", type: "single" },
  { date: "2025-04-14", name: "Ambedkar Jayanti", type: "single" },
  { date: "2025-08-15", name: "Independence Day", type: "single" },
  { date: "2025-10-02", name: "Gandhi Jayanti", type: "single" },
  { date: "2025-12-25", name: "Christmas", type: "single" },
  { date: "2026-01-14", name: "Makar Sankranti", type: "single" },
  { date: "2026-01-26", name: "Republic Day", type: "single" },
];

const CREDENTIALS = {
  admin: { password: "admin123", role: "admin" },
  teacher1: { password: "teach001", role: "teacher", classId: 1 },
  teacher2: { password: "teach002", role: "teacher", classId: 2 },
  teacher3: { password: "teach003", role: "teacher", classId: 3 },
  principal: { password: "prin456", role: "principal" },
};

// ─── HELPERS ───────────────────────────────────────────────────────────────
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const isSunday = (dateStr) => new Date(dateStr).getDay() === 0;
const getDaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (dateStr) => {
  const d = new Date(dateStr+'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
};
const monthName = (m) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m];

// ─── STYLES ────────────────────────────────────────────────────────────────
const S = {
  app: {
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    background: "#0F172A",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "0",
  },
  phone: {
    width: "390px",
    minHeight: "844px",
    background: "#0F172A",
    borderRadius: "44px",
    overflow: "hidden",
    boxShadow: "0 0 0 2px #334155, 0 40px 80px rgba(0,0,0,.7)",
    position: "relative",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
  },
  statusBar: {
    height: "44px",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    color: "#F8FAFC",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
  },
  screen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "linear-gradient(160deg, #0F172A 0%, #1E293B 100%)",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: "0 0 100px",
  },
  // COLORS
  accent: "#F59E0B",
  accentSoft: "rgba(245,158,11,0.15)",
  blue: "#3B82F6",
  green: "#10B981",
  red: "#EF4444",
  purple: "#A78BFA",
  pink: "#F472B6",
  // Text
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#475569",
  // Cards
  card: {
    background: "#1E293B",
    borderRadius: "20px",
    padding: "18px",
    margin: "0 16px 14px",
    border: "1px solid #334155",
  },
  cardDark: {
    background: "#0F172A",
    borderRadius: "16px",
    padding: "14px",
    border: "1px solid #1E293B",
  },
  // Inputs
  input: {
    width: "100%",
    padding: "14px 16px",
    background: "#1E293B",
    border: "1.5px solid #334155",
    borderRadius: "14px",
    color: "#F8FAFC",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  btn: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #F59E0B, #D97706)",
    border: "none",
    borderRadius: "14px",
    color: "#0F172A",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: ".3px",
    fontFamily: "inherit",
  },
  btnOutline: {
    padding: "10px 20px",
    background: "transparent",
    border: "1.5px solid #334155",
    borderRadius: "12px",
    color: "#94A3B8",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnSmall: (color="#F59E0B") => ({
    padding: "8px 16px",
    background: `rgba(${color==="green"?"16,185,129":color==="red"?"239,68,68":color==="blue"?"59,130,246":"245,158,11"},0.15)`,
    border: `1px solid rgba(${color==="green"?"16,185,129":color==="red"?"239,68,68":color==="blue"?"59,130,246":"245,158,11"},0.3)`,
    borderRadius: "10px",
    color: color==="green"?"#10B981":color==="red"?"#EF4444":color==="blue"?"#3B82F6":"#F59E0B",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  }),
  navBar: {
    position: "sticky",
    bottom: 0,
    background: "rgba(15,23,42,.97)",
    borderTop: "1px solid #334155",
    display: "flex",
    padding: "8px 0 16px",
    backdropFilter: "blur(12px)",
    flexShrink: 0,
  },
  navItem: (active) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    padding: "6px 4px",
    borderRadius: "12px",
    transition: "all .2s",
  }),
  tag: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    background: `rgba(${color==="green"?"16,185,129":color==="red"?"239,68,68":color==="amber"?"245,158,11":color==="blue"?"59,130,246":"167,139,250"},0.15)`,
    color: color==="green"?"#10B981":color==="red"?"#EF4444":color==="amber"?"#F59E0B":color==="blue"?"#3B82F6":"#A78BFA",
    border: `1px solid rgba(${color==="green"?"16,185,129":color==="red"?"239,68,68":color==="amber"?"245,158,11":color==="blue"?"59,130,246":"167,139,250"},0.25)`,
  }),
  avatar: (color) => ({
    width: "42px", height: "42px",
    borderRadius: "14px",
    background: `linear-gradient(135deg, ${color}, ${color}99)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", flexShrink: 0,
  }),
  sectionTitle: {
    color: "#94A3B8",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    padding: "20px 20px 10px",
  },
  divider: {
    height: "1px",
    background: "#1E293B",
    margin: "0 16px 14px",
  },
};

// ─── ICONS (SVG inline) ────────────────────────────────────────────────────
const Icon = {
  lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  class: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  calendar: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  eye: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  settings: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.41 14.31M4.93 4.93a10 10 0 0 0-1.41 14.31"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  holiday: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  students: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  info: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [holidays, setHolidays] = useState(INITIAL_HOLIDAYS);
  const [attendance, setAttendance] = useState({}); // { "classId_date": { studentName: true/false } }

  const isHoliday = (dateStr) => isSunday(dateStr) || holidays.some(h => h.date === dateStr);

  const handleLogin = (username, password) => {
    const cred = CREDENTIALS[username];
    if (cred && cred.password === password) {
      setSession({ username, role: cred.role, classId: cred.classId });
      return true;
    }
    return false;
  };

  const handleLogout = () => setSession(null);

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={S.phone}>
        {/* Status Bar */}
        <div style={S.statusBar}>
          <span>9:41</span>
          <span style={{ fontSize:"11px", letterSpacing:".5px" }}>◆ EduAttend</span>
          <span>📶 🔋</span>
        </div>

        <div style={S.screen}>
          {!session ? (
            <LoginScreen onLogin={handleLogin} />
          ) : session.role === "admin" ? (
            <AdminApp session={session} classes={classes} setClasses={setClasses} holidays={holidays} setHolidays={setHolidays} attendance={attendance} isHoliday={isHoliday} onLogout={handleLogout} />
          ) : session.role === "teacher" ? (
            <TeacherApp session={session} classes={classes} attendance={attendance} setAttendance={setAttendance} isHoliday={isHoliday} onLogout={handleLogout} />
          ) : (
            <PrincipalApp session={session} classes={classes} attendance={attendance} isHoliday={isHoliday} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const roleMap = {
    admin:     { label:"Admin",     icon:"🛡️", hint:"admin / admin123" },
    teacher:   { label:"Teacher",   icon:"👩‍🏫", hint:"teacher1 / teach001" },
    principal: { label:"Principal", icon:"🏫", hint:"principal / prin456" },
  };

  const handleSubmit = () => {
    if (!onLogin(username, password)) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const fillDemo = (role) => {
    if (role === "admin")     { setUsername("admin");     setPassword("admin123"); }
    if (role === "teacher")   { setUsername("teacher1");  setPassword("teach001"); }
    if (role === "principal") { setUsername("principal"); setPassword("prin456"); }
    setSelectedRole(role);
    setError("");
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto" }}>
      {/* Hero */}
      <div style={{ padding:"32px 24px 24px", textAlign:"center" }}>
        <div style={{ width:"80px", height:"80px", borderRadius:"24px", background:"linear-gradient(135deg,#F59E0B,#D97706)", margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"36px", boxShadow:"0 8px 32px rgba(245,158,11,.4)" }}>🏫</div>
        <div style={{ color:"#F8FAFC", fontSize:"26px", fontWeight:900, letterSpacing:"-.5px" }}>EduAttend</div>
        <div style={{ color:"#64748B", fontSize:"14px", marginTop:"6px" }}>School Attendance Management</div>
      </div>

      {/* Role Selector */}
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ color:"#64748B", fontSize:"12px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:"12px", textAlign:"center" }}>Select Your Role</div>
        <div style={{ display:"flex", gap:"10px" }}>
          {Object.entries(roleMap).map(([key, r]) => (
            <button key={key} onClick={() => fillDemo(key)} style={{ flex:1, padding:"14px 8px", background: selectedRole===key?"linear-gradient(135deg,rgba(245,158,11,.25),rgba(217,119,6,.15))":"rgba(30,41,59,.8)", border: selectedRole===key?"1.5px solid #F59E0B":"1.5px solid #334155", borderRadius:"16px", cursor:"pointer", transition:"all .2s", display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
              <span style={{ fontSize:"22px" }}>{r.icon}</span>
              <span style={{ color: selectedRole===key?"#F59E0B":"#94A3B8", fontSize:"12px", fontWeight:700 }}>{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:"14px" }}>
        {/* Username */}
        <div>
          <label style={{ color:"#64748B", fontSize:"12px", fontWeight:700, letterSpacing:".5px", marginBottom:"8px", display:"block" }}>USERNAME</label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#475569" }}>{Icon.user}</span>
            <input value={username} onChange={e=>{setUsername(e.target.value);setError("")}} placeholder="Enter username" style={{ ...S.input, paddingLeft:"44px" }} />
          </div>
        </div>
        {/* Password */}
        <div>
          <label style={{ color:"#64748B", fontSize:"12px", fontWeight:700, letterSpacing:".5px", marginBottom:"8px", display:"block" }}>PASSWORD</label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#475569" }}>{Icon.lock}</span>
            <input type={showPass?"text":"password"} value={password} onChange={e=>{setPassword(e.target.value);setError("")}} placeholder="Enter password" style={{ ...S.input, paddingLeft:"44px", paddingRight:"44px" }} />
            <span onClick={()=>setShowPass(!showPass)} style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", color:"#475569", cursor:"pointer" }}>{Icon.eye}</span>
          </div>
        </div>
        {error && <div style={{ color:"#EF4444", fontSize:"13px", textAlign:"center", background:"rgba(239,68,68,.1)", padding:"10px", borderRadius:"10px", border:"1px solid rgba(239,68,68,.2)" }}>⚠️ {error}</div>}
        <button onClick={handleSubmit} style={{ ...S.btn, marginTop:"4px" }}>Sign In →</button>
        <div style={{ color:"#334155", fontSize:"12px", textAlign:"center", padding:"8px" }}>Tap a role above to auto-fill demo credentials</div>
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────
function Header({ title, subtitle, onLogout, rightEl }) {
  return (
    <div style={{ padding:"16px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(15,23,42,.95)", borderBottom:"1px solid #1E293B", flexShrink:0 }}>
      <div>
        <div style={{ color:"#F8FAFC", fontSize:"20px", fontWeight:900, letterSpacing:"-.4px" }}>{title}</div>
        {subtitle && <div style={{ color:"#64748B", fontSize:"12px", marginTop:"2px" }}>{subtitle}</div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        {rightEl}
        <button onClick={onLogout} style={{ ...S.btnOutline, padding:"8px 12px", display:"flex", alignItems:"center", gap:"6px" }}>
          {Icon.logout}<span style={{ fontSize:"12px" }}>Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────
function NavBar({ items, active, onSelect }) {
  return (
    <div style={S.navBar}>
      {items.map(item => (
        <div key={item.id} onClick={() => onSelect(item.id)} style={S.navItem(active===item.id)}>
          <span style={{ color: active===item.id ? "#F59E0B" : "#475569", transition:"color .2s" }}>{item.icon}</span>
          <span style={{ fontSize:"10px", fontWeight:700, color: active===item.id ? "#F59E0B" : "#475569", letterSpacing:".3px" }}>{item.label}</span>
          {active===item.id && <div style={{ width:"4px", height:"4px", borderRadius:"2px", background:"#F59E0B" }} />}
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN APP ────────────────────────────────────────────────────────────
function AdminApp({ session, classes, setClasses, holidays, setHolidays, attendance, isHoliday, onLogout }) {
  const [tab, setTab] = useState("home");
  const navItems = [
    { id:"home", icon: Icon.home, label:"Home" },
    { id:"classes", icon: Icon.class, label:"Classes" },
    { id:"holidays", icon: Icon.holiday, label:"Holidays" },
    { id:"summary", icon: Icon.chart, label:"Summary" },
  ];
  return (
    <>
      <Header title="Admin Panel" subtitle={`Welcome, ${session.username}`} onLogout={onLogout}
        rightEl={<span style={{ ...S.tag("amber") }}>🛡️ Admin</span>} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ flex:1, overflow:"auto", paddingBottom:"80px" }}>
          {tab==="home"     && <AdminHome classes={classes} holidays={holidays} attendance={attendance} isHoliday={isHoliday} />}
          {tab==="classes"  && <AdminClasses classes={classes} setClasses={setClasses} />}
          {tab==="holidays" && <AdminHolidays holidays={holidays} setHolidays={setHolidays} />}
          {tab==="summary"  && <AdminSummary classes={classes} attendance={attendance} holidays={holidays} isHoliday={isHoliday} />}
        </div>
        <NavBar items={navItems} active={tab} onSelect={setTab} />
      </div>
    </>
  );
}

function AdminHome({ classes, holidays, attendance, isHoliday }) {
  const d = new Date();
  const year = d.getFullYear(), month = d.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  let workingDays = 0;
  for (let i=1; i<=daysInMonth; i++) {
    const ds = `${year}-${pad(month+1)}-${pad(i)}`;
    if (!isHoliday(ds)) workingDays++;
  }
  const todayStr = today();

  return (
    <div>
      {/* Date Banner */}
      <div style={{ margin:"16px 16px 0", borderRadius:"20px", background:"linear-gradient(135deg,#1E293B,#0F172A)", border:"1px solid #334155", padding:"20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"100px", height:"100px", borderRadius:"50%", background:"rgba(245,158,11,.08)" }} />
        <div style={{ color:"#64748B", fontSize:"12px", fontWeight:700, letterSpacing:"1px", marginBottom:"4px" }}>TODAY</div>
        <div style={{ color:"#F8FAFC", fontSize:"22px", fontWeight:900 }}>{fmtDate(todayStr)}</div>
        <div style={{ display:"flex", gap:"16px", marginTop:"16px" }}>
          <div style={{ flex:1, background:"rgba(245,158,11,.1)", borderRadius:"12px", padding:"12px", border:"1px solid rgba(245,158,11,.2)" }}>
            <div style={{ color:"#F59E0B", fontSize:"24px", fontWeight:900 }}>{classes.length}</div>
            <div style={{ color:"#94A3B8", fontSize:"12px", fontWeight:600 }}>Total Classes</div>
          </div>
          <div style={{ flex:1, background:"rgba(16,185,129,.1)", borderRadius:"12px", padding:"12px", border:"1px solid rgba(16,185,129,.2)" }}>
            <div style={{ color:"#10B981", fontSize:"24px", fontWeight:900 }}>{workingDays}</div>
            <div style={{ color:"#94A3B8", fontSize:"12px", fontWeight:600 }}>Working Days</div>
          </div>
          <div style={{ flex:1, background:"rgba(239,68,68,.1)", borderRadius:"12px", padding:"12px", border:"1px solid rgba(239,68,68,.2)" }}>
            <div style={{ color:"#EF4444", fontSize:"24px", fontWeight:900 }}>{holidays.length + 4}</div>
            <div style={{ color:"#94A3B8", fontSize:"12px", fontWeight:600 }}>Holidays</div>
          </div>
        </div>
      </div>

      <div style={S.sectionTitle}>CLASSES OVERVIEW</div>
      {classes.map(c => {
        const key = `${c.id}_${todayStr}`;
        const att = attendance[key];
        const filled = att ? Object.keys(att).length : 0;
        const pct = c.students.length ? Math.round((filled / c.students.length) * 100) : 0;
        return (
          <div key={c.id} style={{ ...S.card, display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ ...S.avatar("#F59E0B"), fontSize:"16px" }}>📚</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"15px" }}>{c.name}</div>
              <div style={{ color:"#64748B", fontSize:"13px", marginTop:"2px" }}>{c.teacher} · {c.students.length} students</div>
              <div style={{ marginTop:"8px", background:"#0F172A", borderRadius:"6px", height:"6px", overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:pct>75?"#10B981":pct>50?"#F59E0B":"#EF4444", borderRadius:"6px", transition:"width .5s" }} />
              </div>
            </div>
            <span style={S.tag(att?"green":"red")}>{att?`${pct}%`:"N/A"}</span>
          </div>
        );
      })}
    </div>
  );
}

function AdminClasses({ classes, setClasses }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", teacher:"", studentsRaw:"" });
  const [editId, setEditId] = useState(null);

  const save = () => {
    if (!form.name.trim()) return;
    const students = form.studentsRaw.split("\n").map(s=>s.trim()).filter(Boolean);
    if (editId) {
      setClasses(prev => prev.map(c => c.id===editId ? {...c, name:form.name, teacher:form.teacher, students} : c));
      setEditId(null);
    } else {
      setClasses(prev => [...prev, { id:Date.now(), name:form.name, teacher:form.teacher, students }]);
    }
    setForm({ name:"", teacher:"", studentsRaw:"" }); setShowForm(false);
  };

  const startEdit = (c) => {
    setForm({ name:c.name, teacher:c.teacher, studentsRaw:c.students.join("\n") });
    setEditId(c.id); setShowForm(true);
  };

  const del = (id) => setClasses(prev => prev.filter(c => c.id!==id));

  return (
    <div>
      <div style={{ padding:"16px 16px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"18px" }}>Manage Classes</div>
        <button onClick={()=>{setShowForm(!showForm);setEditId(null);setForm({name:"",teacher:"",studentsRaw:""})}} style={{ ...S.btnSmall(), display:"flex", alignItems:"center", gap:"6px" }}>{Icon.plus} New Class</button>
      </div>

      {showForm && (
        <div style={{ ...S.card, border:"1.5px solid rgba(245,158,11,.3)" }}>
          <div style={{ color:"#F59E0B", fontWeight:800, fontSize:"15px", marginBottom:"14px" }}>{editId?"Edit Class":"Create New Class"}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Class Name (e.g. Class 4-A)" style={S.input} />
            <input value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})} placeholder="Class Teacher Name" style={S.input} />
            <textarea value={form.studentsRaw} onChange={e=>setForm({...form,studentsRaw:e.target.value})} placeholder={"Student names (one per line)\nAarav Shah\nDiya Patel..."} rows={5} style={{ ...S.input, resize:"vertical" }} />
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={save} style={{ ...S.btn, flex:1 }}>💾 Save</button>
              <button onClick={()=>setShowForm(false)} style={{ ...S.btnOutline, flex:1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {classes.map(c => (
        <div key={c.id} style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ flex:1 }}>
              <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"16px" }}>{c.name}</div>
              <div style={{ color:"#64748B", fontSize:"13px", marginTop:"3px" }}>👩‍🏫 {c.teacher || "No teacher assigned"}</div>
              <div style={{ color:"#94A3B8", fontSize:"13px", marginTop:"4px" }}>👥 {c.students.length} students</div>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={()=>startEdit(c)} style={S.btnSmall("blue")}>Edit</button>
              <button onClick={()=>del(c.id)} style={S.btnSmall("red")}>{Icon.trash}</button>
            </div>
          </div>
          {c.students.length > 0 && (
            <div style={{ marginTop:"12px", display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {c.students.slice(0,5).map((s,i) => (
                <span key={i} style={{ padding:"3px 8px", background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.2)", borderRadius:"8px", color:"#93C5FD", fontSize:"11px", fontWeight:600 }}>{s}</span>
              ))}
              {c.students.length > 5 && <span style={{ padding:"3px 8px", background:"rgba(71,85,105,.3)", borderRadius:"8px", color:"#94A3B8", fontSize:"11px", fontWeight:600 }}>+{c.students.length-5} more</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminHolidays({ holidays, setHolidays }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", type:"single", date:"", startDate:"", endDate:"" });

  const addHoliday = () => {
    if (!form.name.trim()) return;
    if (form.type === "single" && form.date) {
      setHolidays(prev => [...prev, { date:form.date, name:form.name, type:"single" }]);
    } else if (form.type === "range" && form.startDate && form.endDate) {
      const entries = [];
      let d = new Date(form.startDate+'T00:00:00');
      const end = new Date(form.endDate+'T00:00:00');
      while (d <= end) {
        entries.push({ date:`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`, name:form.name, type:"range" });
        d.setDate(d.getDate()+1);
      }
      setHolidays(prev => [...prev, ...entries]);
    }
    setForm({ name:"", type:"single", date:"", startDate:"", endDate:"" });
    setShowForm(false);
  };

  const del = (idx) => setHolidays(prev => prev.filter((_,i) => i!==idx));

  const grouped = holidays.reduce((acc, h) => {
    const key = h.name + "_" + h.type;
    if (!acc[key]) acc[key] = { name:h.name, type:h.type, dates:[] };
    acc[key].dates.push(h.date);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ padding:"16px 16px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"18px" }}>Holiday Calendar</div>
        <button onClick={()=>setShowForm(!showForm)} style={{ ...S.btnSmall(), display:"flex", alignItems:"center", gap:"6px" }}>{Icon.plus} Add</button>
      </div>

      <div style={{ ...S.card, background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"20px" }}>☀️</span>
          <div>
            <div style={{ color:"#FCA5A5", fontWeight:700, fontSize:"14px" }}>Auto-Holiday Rule</div>
            <div style={{ color:"#94A3B8", fontSize:"12px", marginTop:"2px" }}>All Sundays are automatically marked as holidays. No attendance needed on Sundays.</div>
          </div>
        </div>
      </div>

      {showForm && (
        <div style={{ ...S.card, border:"1.5px solid rgba(245,158,11,.3)" }}>
          <div style={{ color:"#F59E0B", fontWeight:800, fontSize:"15px", marginBottom:"14px" }}>Add Holiday</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Holiday Name" style={S.input} />
            <div style={{ display:"flex", gap:"8px" }}>
              {["single","range"].map(t => (
                <button key={t} onClick={()=>setForm({...form,type:t})} style={{ flex:1, padding:"10px", background:form.type===t?"rgba(245,158,11,.2)":"#1E293B", border:form.type===t?"1.5px solid #F59E0B":"1.5px solid #334155", borderRadius:"12px", color:form.type===t?"#F59E0B":"#94A3B8", fontWeight:700, cursor:"pointer", fontSize:"13px", fontFamily:"inherit" }}>
                  {t==="single"?"📅 Single Day":"📆 Multi-Day"}
                </button>
              ))}
            </div>
            {form.type==="single" ? (
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={S.input} />
            ) : (
              <>
                <label style={{ color:"#64748B", fontSize:"12px" }}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} style={S.input} />
                <label style={{ color:"#64748B", fontSize:"12px" }}>End Date</label>
                <input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} style={S.input} />
              </>
            )}
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={addHoliday} style={{ ...S.btn, flex:1 }}>Add Holiday</button>
              <button onClick={()=>setShowForm(false)} style={{ ...S.btnOutline, flex:1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={S.sectionTitle}>ADDED HOLIDAYS ({holidays.length})</div>
      {Object.values(grouped).map((g, gi) => (
        <div key={gi} style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"15px" }}>{g.name}</div>
              <div style={{ color:"#64748B", fontSize:"12px", marginTop:"4px" }}>
                {g.dates.length === 1 ? fmtDate(g.dates[0]) : `${fmtDate(g.dates[0])} → ${fmtDate(g.dates[g.dates.length-1])} (${g.dates.length} days)`}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={S.tag(g.type==="range"?"purple":"amber")}>{g.type==="range"?"Multi-day":"Single"}</span>
              <button onClick={()=>{ const idx = holidays.findIndex(h=>h.name===g.name); del(idx); }} style={S.btnSmall("red")}>{Icon.trash}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminSummary({ classes, attendance, holidays, isHoliday }) {
  const d = new Date();
  const [selYear, setSelYear] = useState(d.getFullYear());
  const [selMonth, setSelMonth] = useState(d.getMonth());

  const daysInMonth = getDaysInMonth(selYear, selMonth);
  let workingDays = 0, totalHolidayDays = 0;
  for (let i=1; i<=daysInMonth; i++) {
    const ds = `${selYear}-${pad(selMonth+1)}-${pad(i)}`;
    if (isHoliday(ds)) totalHolidayDays++;
    else workingDays++;
  }

  const classStats = classes.map(c => {
    let totalPresent = 0, totalRecords = 0;
    for (let i=1; i<=daysInMonth; i++) {
      const ds = `${selYear}-${pad(selMonth+1)}-${pad(i)}`;
      if (isHoliday(ds)) continue;
      const key = `${c.id}_${ds}`;
      const att = attendance[key];
      if (att) {
        totalPresent += Object.values(att).filter(Boolean).length;
        totalRecords += c.students.length;
      }
    }
    const pct = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : null;
    return { ...c, pct, totalPresent, totalRecords };
  });

  const months = Array.from({length:12},(_,i)=>i);

  return (
    <div>
      <div style={{ padding:"16px 16px 8px" }}>
        <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"18px", marginBottom:"12px" }}>Attendance Summary</div>
        <div style={{ display:"flex", gap:"10px" }}>
          <select value={selMonth} onChange={e=>setSelMonth(+e.target.value)} style={{ ...S.input, flex:1 }}>
            {months.map(m => <option key={m} value={m}>{monthName(m)}</option>)}
          </select>
          <select value={selYear} onChange={e=>setSelYear(+e.target.value)} style={{ ...S.input, flex:1 }}>
            {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Month Stats */}
      <div style={{ display:"flex", gap:"10px", padding:"0 16px 14px" }}>
        <div style={{ flex:1, background:"rgba(16,185,129,.1)", border:"1px solid rgba(16,185,129,.2)", borderRadius:"14px", padding:"14px", textAlign:"center" }}>
          <div style={{ color:"#10B981", fontSize:"28px", fontWeight:900 }}>{workingDays}</div>
          <div style={{ color:"#94A3B8", fontSize:"12px", fontWeight:600 }}>Working Days</div>
        </div>
        <div style={{ flex:1, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", borderRadius:"14px", padding:"14px", textAlign:"center" }}>
          <div style={{ color:"#EF4444", fontSize:"28px", fontWeight:900 }}>{totalHolidayDays}</div>
          <div style={{ color:"#94A3B8", fontSize:"12px", fontWeight:600 }}>Holidays</div>
        </div>
        <div style={{ flex:1, background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.2)", borderRadius:"14px", padding:"14px", textAlign:"center" }}>
          <div style={{ color:"#3B82F6", fontSize:"28px", fontWeight:900 }}>{daysInMonth}</div>
          <div style={{ color:"#94A3B8", fontSize:"12px", fontWeight:600 }}>Total Days</div>
        </div>
      </div>

      <div style={S.sectionTitle}>CLASS-WISE ATTENDANCE ({monthName(selMonth)} {selYear})</div>
      {classStats.map(c => (
        <div key={c.id} style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
            <div>
              <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"15px" }}>{c.name}</div>
              <div style={{ color:"#64748B", fontSize:"12px", marginTop:"2px" }}>{c.teacher} · {c.students.length} students</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ color: c.pct===null?"#475569":c.pct>=75?"#10B981":c.pct>=50?"#F59E0B":"#EF4444", fontSize:"24px", fontWeight:900 }}>
                {c.pct===null ? "—" : `${c.pct}%`}
              </div>
              <div style={{ color:"#64748B", fontSize:"11px" }}>Attendance</div>
            </div>
          </div>
          <div style={{ background:"#0F172A", borderRadius:"8px", height:"8px", overflow:"hidden" }}>
            <div style={{ width:`${c.pct||0}%`, height:"100%", background: c.pct===null?"#334155":c.pct>=75?"#10B981":c.pct>=50?"#F59E0B":"#EF4444", borderRadius:"8px", transition:"width .6s" }} />
          </div>
          {c.pct !== null && <div style={{ color:"#64748B", fontSize:"12px", marginTop:"6px" }}>{c.totalPresent} present / {c.totalRecords} total student-days</div>}
          {c.pct === null && <div style={{ color:"#475569", fontSize:"12px", marginTop:"6px", fontStyle:"italic" }}>No attendance recorded yet</div>}
        </div>
      ))}
    </div>
  );
}

// ─── TEACHER APP ───────────────────────────────────────────────────────────
function TeacherApp({ session, classes, attendance, setAttendance, isHoliday, onLogout }) {
  const myClass = classes.find(c => c.id === session.classId) || classes[0];
  const [tab, setTab] = useState("today");
  const [selectedDate, setSelectedDate] = useState(today());

  const navItems = [
    { id:"today", icon: Icon.calendar, label:"Today" },
    { id:"monthly", icon: Icon.chart, label:"Monthly" },
  ];

  return (
    <>
      <Header title={myClass?.name || "Teacher"} subtitle={`${session.username} · Class Teacher`} onLogout={onLogout}
        rightEl={<span style={S.tag("blue")}>👩‍🏫 Teacher</span>} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Tab Switcher */}
        <div style={{ display:"flex", margin:"12px 16px 0", background:"#0F172A", borderRadius:"14px", padding:"4px", border:"1px solid #1E293B", flexShrink:0 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1, padding:"10px", background:tab===n.id?"linear-gradient(135deg,rgba(59,130,246,.2),rgba(59,130,246,.1))":"transparent", border:tab===n.id?"1px solid rgba(59,130,246,.4)":"1px solid transparent", borderRadius:"10px", color:tab===n.id?"#3B82F6":"#64748B", fontWeight:700, cursor:"pointer", fontSize:"14px", fontFamily:"inherit", transition:"all .2s" }}>
              {n.label}
            </button>
          ))}
        </div>
        <div style={{ flex:1, overflow:"auto", paddingBottom:"20px" }}>
          {tab==="today"   && <TeacherToday myClass={myClass} selectedDate={selectedDate} setSelectedDate={setSelectedDate} attendance={attendance} setAttendance={setAttendance} isHoliday={isHoliday} />}
          {tab==="monthly" && <TeacherMonthly myClass={myClass} attendance={attendance} isHoliday={isHoliday} />}
        </div>
      </div>
    </>
  );
}

function TeacherToday({ myClass, selectedDate, setSelectedDate, attendance, setAttendance, isHoliday }) {
  if (!myClass) return <div style={{ padding:"40px", textAlign:"center", color:"#64748B" }}>No class assigned</div>;
  const attKey = `${myClass.id}_${selectedDate}`;
  const dayAtt = attendance[attKey] || {};
  const holiday = isHoliday(selectedDate);
  const allPresent = myClass.students.length > 0 && myClass.students.every(s => dayAtt[s] === true);

  const toggle = (student) => {
    if (holiday) return;
    setAttendance(prev => {
      const key = `${myClass.id}_${selectedDate}`;
      const cur = prev[key] || {};
      return { ...prev, [key]: { ...cur, [student]: !cur[student] } };
    });
  };

  const markAll = (val) => {
    if (holiday) return;
    setAttendance(prev => {
      const cur = {};
      myClass.students.forEach(s => cur[s] = val);
      return { ...prev, [`${myClass.id}_${selectedDate}`]: cur };
    });
  };

  const presentCount = Object.values(dayAtt).filter(Boolean).length;
  const absentCount = myClass.students.length - presentCount;

  return (
    <div>
      {/* Date Picker */}
      <div style={S.card}>
        <div style={{ color:"#64748B", fontSize:"12px", fontWeight:700, letterSpacing:".5px", marginBottom:"8px" }}>SELECT DATE</div>
        <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} style={S.input} />
        <div style={{ marginTop:"10px" }}>
          {holiday ? (
            <div style={{ ...S.tag(isSunday(selectedDate)?"purple":"red"), display:"inline-flex" }}>
              {isSunday(selectedDate) ? "☀️ Sunday (Holiday)" : "🎉 Holiday — No Attendance Required"}
            </div>
          ) : (
            <div style={{ ...S.tag("green"), display:"inline-flex" }}>📋 Working Day</div>
          )}
        </div>
      </div>

      {!holiday && (
        <>
          {/* Stats */}
          <div style={{ display:"flex", gap:"10px", padding:"0 16px 14px" }}>
            <div style={{ flex:1, background:"rgba(16,185,129,.1)", border:"1px solid rgba(16,185,129,.2)", borderRadius:"14px", padding:"12px", textAlign:"center" }}>
              <div style={{ color:"#10B981", fontSize:"24px", fontWeight:900 }}>{presentCount}</div>
              <div style={{ color:"#94A3B8", fontSize:"11px", fontWeight:600 }}>Present</div>
            </div>
            <div style={{ flex:1, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", borderRadius:"14px", padding:"12px", textAlign:"center" }}>
              <div style={{ color:"#EF4444", fontSize:"24px", fontWeight:900 }}>{absentCount}</div>
              <div style={{ color:"#94A3B8", fontSize:"11px", fontWeight:600 }}>Absent</div>
            </div>
            <div style={{ flex:1, background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.2)", borderRadius:"14px", padding:"12px", textAlign:"center" }}>
              <div style={{ color:"#3B82F6", fontSize:"24px", fontWeight:900 }}>{myClass.students.length ? Math.round((presentCount/myClass.students.length)*100) : 0}%</div>
              <div style={{ color:"#94A3B8", fontSize:"11px", fontWeight:600 }}>Rate</div>
            </div>
          </div>

          {/* Mark All */}
          <div style={{ padding:"0 16px 12px", display:"flex", gap:"10px" }}>
            <button onClick={()=>markAll(true)}  style={{ ...S.btnSmall("green"), flex:1, padding:"10px" }}>✅ Mark All Present</button>
            <button onClick={()=>markAll(false)} style={{ ...S.btnSmall("red"), flex:1, padding:"10px" }}>❌ Mark All Absent</button>
          </div>

          {/* Student List */}
          <div style={S.sectionTitle}>STUDENTS ({myClass.students.length})</div>
          {myClass.students.map((student, i) => {
            const isPresent = dayAtt[student] === true;
            const isMarked = dayAtt.hasOwnProperty(student);
            return (
              <div key={i} onClick={() => toggle(student)} style={{ ...S.card, cursor:"pointer", display:"flex", alignItems:"center", gap:"14px", background: isPresent?"rgba(16,185,129,.07)":isMarked?"rgba(239,68,68,.07)":"#1E293B", border: isPresent?"1px solid rgba(16,185,129,.25)":isMarked?"1px solid rgba(239,68,68,.25)":"1px solid #334155", transition:"all .2s" }}>
                <div style={{ width:"38px", height:"38px", borderRadius:"12px", background: isPresent?"rgba(16,185,129,.2)":isMarked?"rgba(239,68,68,.2)":"#334155", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", color: isPresent?"#10B981":isMarked?"#EF4444":"#64748B", fontWeight:800, flexShrink:0 }}>
                  {isPresent ? "✓" : isMarked ? "✗" : String(i+1).padStart(2,"0")}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#F8FAFC", fontWeight:700, fontSize:"15px" }}>{student}</div>
                  <div style={{ color: isPresent?"#10B981":isMarked?"#EF4444":"#475569", fontSize:"12px", marginTop:"2px" }}>{isPresent?"Present":isMarked?"Absent":"Not marked"}</div>
                </div>
                <div style={{ width:"28px", height:"28px", borderRadius:"50%", border:`2px solid ${isPresent?"#10B981":isMarked?"#EF4444":"#334155"}`, display:"flex", alignItems:"center", justifyContent:"center", background: isPresent?"rgba(16,185,129,.2)":isMarked?"rgba(239,68,68,.2)":"transparent", transition:"all .2s" }}>
                  {isPresent && <span style={{ color:"#10B981", fontSize:"14px" }}>✓</span>}
                </div>
              </div>
            );
          })}
        </>
      )}

      {holiday && (
        <div style={{ margin:"20px 16px", background:"rgba(167,139,250,.08)", border:"1px solid rgba(167,139,250,.2)", borderRadius:"20px", padding:"30px", textAlign:"center" }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>🌴</div>
          <div style={{ color:"#A78BFA", fontWeight:800, fontSize:"18px" }}>Holiday!</div>
          <div style={{ color:"#64748B", fontSize:"14px", marginTop:"8px" }}>No attendance required on this date.</div>
        </div>
      )}
    </div>
  );
}

function TeacherMonthly({ myClass, attendance, isHoliday }) {
  const d = new Date();
  const [selYear, setSelYear] = useState(d.getFullYear());
  const [selMonth, setSelMonth] = useState(d.getMonth());
  if (!myClass) return null;

  const daysInMonth = getDaysInMonth(selYear, selMonth);
  const days = Array.from({length:daysInMonth},(_,i)=>i+1);

  return (
    <div>
      <div style={{ padding:"16px 16px 8px" }}>
        <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"18px", marginBottom:"12px" }}>Monthly View — {myClass.name}</div>
        <div style={{ display:"flex", gap:"10px" }}>
          <select value={selMonth} onChange={e=>setSelMonth(+e.target.value)} style={{ ...S.input, flex:1 }}>
            {Array.from({length:12},(_,i)=>i).map(m=><option key={m} value={m}>{monthName(m)}</option>)}
          </select>
          <select value={selYear} onChange={e=>setSelYear(+e.target.value)} style={{ ...S.input, flex:1 }}>
            {[2024,2025,2026].map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {myClass.students.map((student, si) => {
        let present=0, absent=0, holidays=0;
        days.forEach(day => {
          const ds = `${selYear}-${pad(selMonth+1)}-${pad(day)}`;
          if (isHoliday(ds)) { holidays++; return; }
          const att = attendance[`${myClass.id}_${ds}`];
          if (att && att.hasOwnProperty(student)) {
            if (att[student]) present++; else absent++;
          }
        });
        const total = present + absent;
        const pct = total > 0 ? Math.round((present/total)*100) : null;

        return (
          <div key={si} style={S.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
              <div>
                <div style={{ color:"#F8FAFC", fontWeight:700, fontSize:"14px" }}>{student}</div>
                <div style={{ color:"#64748B", fontSize:"12px", marginTop:"2px" }}>P:{present} A:{absent}</div>
              </div>
              <div style={{ color:pct===null?"#475569":pct>=75?"#10B981":pct>=50?"#F59E0B":"#EF4444", fontSize:"20px", fontWeight:900 }}>
                {pct===null?"—":`${pct}%`}
              </div>
            </div>
            {/* Mini calendar dots */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"3px" }}>
              {days.map(day => {
                const ds = `${selYear}-${pad(selMonth+1)}-${pad(day)}`;
                const isHol = isHoliday(ds);
                const att = attendance[`${myClass.id}_${ds}`];
                const isP = att && att[student]===true;
                const isA = att && att[student]===false;
                return (
                  <div key={day} title={ds} style={{ width:"16px", height:"16px", borderRadius:"4px", background: isHol?"#1E293B":isP?"#10B981":isA?"#EF4444":"#334155", border: isHol?"1px solid #1E293B":"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {isHol && <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:"#475569" }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:"12px", marginTop:"8px" }}>
              {[["🟢","Present"],["🔴","Absent"],["⬜","Holiday/Empty"]].map(([icon,label])=>(
                <span key={label} style={{ color:"#475569", fontSize:"10px" }}>{icon} {label}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PRINCIPAL APP ─────────────────────────────────────────────────────────
function PrincipalApp({ session, classes, attendance, isHoliday, onLogout }) {
  const [tab, setTab] = useState("today");
  const navItems = [
    { id:"today", icon: Icon.calendar, label:"Today" },
    { id:"monthly", icon: Icon.chart, label:"Monthly" },
  ];

  return (
    <>
      <Header title="Principal View" subtitle="All Classes Overview" onLogout={onLogout}
        rightEl={<span style={S.tag("purple")}>🏫 Principal</span>} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", margin:"12px 16px 0", background:"#0F172A", borderRadius:"14px", padding:"4px", border:"1px solid #1E293B", flexShrink:0 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1, padding:"10px", background:tab===n.id?"linear-gradient(135deg,rgba(167,139,250,.2),rgba(167,139,250,.1))":"transparent", border:tab===n.id?"1px solid rgba(167,139,250,.4)":"1px solid transparent", borderRadius:"10px", color:tab===n.id?"#A78BFA":"#64748B", fontWeight:700, cursor:"pointer", fontSize:"14px", fontFamily:"inherit", transition:"all .2s" }}>
              {n.label}
            </button>
          ))}
        </div>
        <div style={{ flex:1, overflow:"auto", paddingBottom:"20px" }}>
          {tab==="today"   && <PrincipalToday classes={classes} attendance={attendance} isHoliday={isHoliday} />}
          {tab==="monthly" && <PrincipalMonthly classes={classes} attendance={attendance} isHoliday={isHoliday} />}
        </div>
      </div>
    </>
  );
}

function PrincipalToday({ classes, attendance, isHoliday }) {
  const [selectedDate, setSelectedDate] = useState(today());
  const holiday = isHoliday(selectedDate);

  const classData = classes.map(c => {
    const attKey = `${c.id}_${selectedDate}`;
    const att = attendance[attKey] || {};
    const present = Object.values(att).filter(Boolean).length;
    const absent = c.students.length - present;
    const pct = c.students.length && Object.keys(att).length ? Math.round((present/c.students.length)*100) : null;
    return { ...c, att, present, absent, pct };
  });

  const totalStudents = classes.reduce((s,c)=>s+c.students.length,0);
  const totalPresent = classData.reduce((s,c)=>s+c.present,0);
  const overallPct = totalStudents ? Math.round((totalPresent/totalStudents)*100) : 0;

  return (
    <div>
      <div style={S.card}>
        <div style={{ color:"#64748B", fontSize:"12px", fontWeight:700, letterSpacing:".5px", marginBottom:"8px" }}>SELECT DATE</div>
        <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} style={S.input} />
        <div style={{ marginTop:"10px" }}>
          {holiday ? <div style={S.tag("red")}>🎉 Holiday</div> : <div style={S.tag("green")}>📋 Working Day</div>}
        </div>
      </div>

      {!holiday && (
        <>
          {/* Overall */}
          <div style={{ ...S.card, background:"linear-gradient(135deg,rgba(167,139,250,.12),rgba(167,139,250,.05))", border:"1px solid rgba(167,139,250,.25)" }}>
            <div style={{ color:"#C4B5FD", fontSize:"13px", fontWeight:700, marginBottom:"8px" }}>SCHOOL OVERALL — {fmtDate(selectedDate)}</div>
            <div style={{ display:"flex", gap:"12px" }}>
              <div style={{ flex:1 }}>
                <div style={{ color:"#F8FAFC", fontSize:"32px", fontWeight:900 }}>{overallPct}%</div>
                <div style={{ color:"#94A3B8", fontSize:"12px" }}>Overall Attendance</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ color:"#10B981", fontWeight:800 }}>✓ {totalPresent} Present</div>
                <div style={{ color:"#EF4444", fontWeight:800 }}>✗ {totalStudents - totalPresent} Absent</div>
                <div style={{ color:"#94A3B8", fontSize:"12px" }}>Total: {totalStudents}</div>
              </div>
            </div>
            <div style={{ background:"rgba(0,0,0,.3)", borderRadius:"8px", height:"10px", overflow:"hidden", marginTop:"12px" }}>
              <div style={{ width:`${overallPct}%`, height:"100%", background:overallPct>=75?"#10B981":overallPct>=50?"#F59E0B":"#EF4444", borderRadius:"8px" }} />
            </div>
          </div>

          <div style={S.sectionTitle}>ALL CLASSES</div>
          {classData.map(c => (
            <div key={c.id} style={S.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                <div>
                  <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"15px" }}>{c.name}</div>
                  <div style={{ color:"#64748B", fontSize:"12px", marginTop:"2px" }}>👩‍🏫 {c.teacher}</div>
                </div>
                <span style={S.tag(c.pct===null?"red":c.pct>=75?"green":c.pct>=50?"amber":"red")}>
                  {c.pct===null?"Not Filled":`${c.pct}%`}
                </span>
              </div>
              <div style={{ display:"flex", gap:"10px", marginBottom:"8px" }}>
                <div style={{ background:"rgba(16,185,129,.1)", borderRadius:"8px", padding:"6px 12px", color:"#10B981", fontWeight:700, fontSize:"13px" }}>✓ {c.present}</div>
                <div style={{ background:"rgba(239,68,68,.1)", borderRadius:"8px", padding:"6px 12px", color:"#EF4444", fontWeight:700, fontSize:"13px" }}>✗ {c.absent}</div>
                <div style={{ background:"rgba(59,130,246,.1)", borderRadius:"8px", padding:"6px 12px", color:"#3B82F6", fontWeight:700, fontSize:"13px" }}>Total {c.students.length}</div>
              </div>
              <div style={{ background:"#0F172A", borderRadius:"6px", height:"6px", overflow:"hidden" }}>
                <div style={{ width:`${c.pct||0}%`, height:"100%", background:c.pct===null?"#334155":c.pct>=75?"#10B981":c.pct>=50?"#F59E0B":"#EF4444", borderRadius:"6px" }} />
              </div>
              {/* Student detail */}
              {Object.keys(c.att).length > 0 && (
                <div style={{ marginTop:"10px", display:"flex", flexWrap:"wrap", gap:"5px" }}>
                  {c.students.map((s,i) => (
                    <span key={i} style={{ padding:"3px 8px", borderRadius:"8px", fontSize:"11px", fontWeight:600, background: c.att[s]===true?"rgba(16,185,129,.12)":c.att[s]===false?"rgba(239,68,68,.12)":"rgba(71,85,105,.2)", color: c.att[s]===true?"#10B981":c.att[s]===false?"#EF4444":"#64748B", border:`1px solid ${c.att[s]===true?"rgba(16,185,129,.25)":c.att[s]===false?"rgba(239,68,68,.25)":"rgba(71,85,105,.3)"}` }}>
                      {s.split(" ")[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {holiday && (
        <div style={{ margin:"20px 16px", background:"rgba(167,139,250,.08)", border:"1px solid rgba(167,139,250,.2)", borderRadius:"20px", padding:"30px", textAlign:"center" }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>🌴</div>
          <div style={{ color:"#A78BFA", fontWeight:800, fontSize:"18px" }}>School Holiday</div>
          <div style={{ color:"#64748B", fontSize:"14px", marginTop:"8px" }}>No attendance required on this date.</div>
        </div>
      )}
    </div>
  );
}

function PrincipalMonthly({ classes, attendance, isHoliday }) {
  const d = new Date();
  const [selYear, setSelYear] = useState(d.getFullYear());
  const [selMonth, setSelMonth] = useState(d.getMonth());
  const daysInMonth = getDaysInMonth(selYear, selMonth);
  const days = Array.from({length:daysInMonth},(_,i)=>i+1);

  let workingDays = 0;
  days.forEach(day => { if (!isHoliday(`${selYear}-${pad(selMonth+1)}-${pad(day)}`)) workingDays++; });

  const classStats = classes.map(c => {
    let totalPresent=0, totalRecords=0;
    days.forEach(day => {
      const ds = `${selYear}-${pad(selMonth+1)}-${pad(day)}`;
      if (isHoliday(ds)) return;
      const att = attendance[`${c.id}_${ds}`];
      if (att) { totalPresent += Object.values(att).filter(Boolean).length; totalRecords += c.students.length; }
    });
    const pct = totalRecords > 0 ? Math.round((totalPresent/totalRecords)*100) : null;
    return { ...c, pct, totalPresent, totalRecords };
  });

  const overallPresent = classStats.reduce((s,c)=>s+c.totalPresent,0);
  const overallRecords = classStats.reduce((s,c)=>s+c.totalRecords,0);
  const overallPct = overallRecords ? Math.round((overallPresent/overallRecords)*100) : null;

  return (
    <div>
      <div style={{ padding:"16px 16px 8px" }}>
        <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"18px", marginBottom:"12px" }}>Monthly Summary — All Classes</div>
        <div style={{ display:"flex", gap:"10px" }}>
          <select value={selMonth} onChange={e=>setSelMonth(+e.target.value)} style={{ ...S.input, flex:1 }}>
            {Array.from({length:12},(_,i)=>i).map(m=><option key={m} value={m}>{monthName(m)}</option>)}
          </select>
          <select value={selYear} onChange={e=>setSelYear(+e.target.value)} style={{ ...S.input, flex:1 }}>
            {[2024,2025,2026].map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Overall Card */}
      <div style={{ ...S.card, background:"linear-gradient(135deg,rgba(167,139,250,.15),rgba(167,139,250,.05))", border:"1px solid rgba(167,139,250,.3)" }}>
        <div style={{ color:"#C4B5FD", fontSize:"12px", fontWeight:700, letterSpacing:"1px", marginBottom:"12px" }}>SCHOOL MONTHLY OVERVIEW</div>
        <div style={{ display:"flex", gap:"10px" }}>
          {[
            { label:"Working Days", value:workingDays, color:"#10B981" },
            { label:"Overall Att.", value:overallPct!==null?`${overallPct}%`:"—", color:overallPct===null?"#475569":overallPct>=75?"#10B981":overallPct>=50?"#F59E0B":"#EF4444" },
            { label:"Classes", value:classes.length, color:"#3B82F6" },
          ].map(stat=>(
            <div key={stat.label} style={{ flex:1, background:"rgba(0,0,0,.3)", borderRadius:"12px", padding:"12px", textAlign:"center" }}>
              <div style={{ color:stat.color, fontSize:"22px", fontWeight:900 }}>{stat.value}</div>
              <div style={{ color:"#64748B", fontSize:"11px", fontWeight:600, marginTop:"2px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.sectionTitle}>CLASS-WISE MONTHLY REPORT</div>
      {classStats.map(c => (
        <div key={c.id} style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ flex:1 }}>
              <div style={{ color:"#F8FAFC", fontWeight:800, fontSize:"15px" }}>{c.name}</div>
              <div style={{ color:"#64748B", fontSize:"12px", marginTop:"2px" }}>{c.teacher} · {c.students.length} students</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:c.pct===null?"#475569":c.pct>=75?"#10B981":c.pct>=50?"#F59E0B":"#EF4444", fontSize:"28px", fontWeight:900 }}>
                {c.pct===null?"—":`${c.pct}%`}
              </div>
            </div>
          </div>
          <div style={{ background:"#0F172A", borderRadius:"8px", height:"8px", overflow:"hidden", margin:"10px 0" }}>
            <div style={{ width:`${c.pct||0}%`, height:"100%", background:c.pct===null?"#334155":c.pct>=75?"#10B981":c.pct>=50?"#F59E0B":"#EF4444", borderRadius:"8px" }} />
          </div>
          {/* Daily dots */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"3px" }}>
            {days.map(day => {
              const ds = `${selYear}-${pad(selMonth+1)}-${pad(day)}`;
              const isHol = isHoliday(ds);
              const att = attendance[`${c.id}_${ds}`];
              const present = att ? Object.values(att).filter(Boolean).length : 0;
              const pct2 = att && c.students.length ? present/c.students.length : null;
              return (
                <div key={day} title={`Day ${day}: ${isHol?"Holiday":pct2!==null?Math.round(pct2*100)+"%":"No data"}`} style={{ width:"14px", height:"14px", borderRadius:"3px", background: isHol?"#1E293B":pct2===null?"#334155":pct2>=.75?"#10B981":pct2>=.5?"#F59E0B":"#EF4444" }} />
              );
            })}
          </div>
          <div style={{ color:"#475569", fontSize:"11px", marginTop:"6px" }}>{c.totalPresent}/{c.totalRecords} student-days present</div>
        </div>
      ))}
    </div>
  );
}
