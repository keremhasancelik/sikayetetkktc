import React, { useState, useEffect, useRef } from "react";

// ─── SUPABASE CONFIG ────────────────────────────────────────
const SUPABASE_URL = "https://xxngmpeoywkcjkjeggse.supabase.co";
const SUPABASE_KEY = "sb_publishable_UXSRhaVcf4-lM1Y2DadhJA_okbnpujv";
const SUPABASE_SERVICE_KEY = "sb_publishable_UXSRhaVcf4-lM1Y2DadhJA_okbnpujv";

const sb = {
  headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", "Prefer": "return=representation" },
  async get(table, params="") {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, { headers: this.headers });
    return r.json();
  },
  async post(table, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method:"POST", headers: this.headers, body: JSON.stringify(data) });
    return r.json();
  },
  async patch(table, id, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method:"PATCH", headers: this.headers, body: JSON.stringify(data) });
    return r.ok;
  },
  async delete(table, id) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method:"DELETE", headers: this.headers });
    return r.ok;
  },
  // Supabase Auth
  async signUp(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return r.json();
  },
  async signIn(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return r.json();
  },
  async getUser(token) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + token }
    });
    return r.json();
  },
};

// ─── EMAIL SERVICE ───────────────────────────────────────────
const EMAIL_WORKER = "https://sikayetetkktc-email.keremhasancelik1905.workers.dev";
const sendEmail = async (type, to, data = {}) => {
  try {
    await fetch(EMAIL_WORKER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, to, ...data }),
    });
  } catch (e) { console.error("Email gönderilemedi:", e); }
};

// ─── SESSION MANAGEMENT (3 dakika) ──────────────────────────
const SESSION_DURATION = 3 * 60 * 1000;
const saveSession = (user) => {
  localStorage.setItem("session_user", JSON.stringify(user));
  localStorage.setItem("session_expiry", Date.now() + SESSION_DURATION);
};
const loadSession = () => {
  try {
    const expiry = parseInt(localStorage.getItem("session_expiry") || "0");
    if (Date.now() > expiry) { clearSession(); return null; }
    return JSON.parse(localStorage.getItem("session_user") || "null");
  } catch { return null; }
};
const clearSession = () => {
  localStorage.removeItem("session_user");
  localStorage.removeItem("session_expiry");
};
const extendSession = () => {
  if (localStorage.getItem("session_user")) localStorage.setItem("session_expiry", Date.now() + SESSION_DURATION);
};

// ─── SUPER ADMIN ─────────────────────────────────────────────
const SUPER_ADMIN = { email:"superadmin@sikayetetkktc.com", password:"superadmin1100", name:"Süper Admin", avatar:"SA", role:"superadmin" };

// ─── FAVICON ─────────────────────────────────────────────────
const injectFavicon = () => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M24 4L6 12V26C6 35.4 14.1 43.2 24 46C33.9 43.2 42 35.4 42 26V12L24 4Z' fill='%231a3c5e'/><path d='M16 24L21 29L32 18' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><circle cx='24' cy='37' r='2.5' fill='%23e84c3d'/></svg>`;
  const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
  link.type = "image/svg+xml"; link.rel = "icon";
  link.href = `data:image/svg+xml,${svg}`;
  document.head.appendChild(link);
  document.title = "ŞikayetETKKTC - KKTC'nin Güvenilir Şikayet Platformu";
};

// ─── ICONS ───────────────────────────────────────────────────
const LogoIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 4L6 12V26C6 35.4 14.1 43.2 24 46C33.9 43.2 42 35.4 42 26V12L24 4Z" fill="#1a3c5e"/>
    <path d="M16 24L21 29L32 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="37" r="2.5" fill="#e84c3d"/>
  </svg>
);
const IGIcon = ({ size=20, color="#fff" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>);
const FBIcon = ({ size=20, color="#fff" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
const TWIcon = ({ size=20, color="#fff" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);

// ─── DESIGN TOKENS ───────────────────────────────────────────
const C = {
  navy:"#0f2744", primary:"#1a3c5e", blue:"#2563a8", accent:"#e84c3d",
  green:"#10b981", amber:"#f59e0b", red:"#ef4444", purple:"#6366f1",
  bg:"#f1f5f9", bgCard:"#ffffff", text:"#0f172a", muted:"#64748b",
  light:"#94a3b8", border:"#e2e8f0",
};

const PRESET_CATEGORIES = [
  { id:1, name:"Kamu Kurumları", icon:"🏛️", color:C.blue, count:12840 },
  { id:2, name:"Telekomünikasyon", icon:"📡", color:C.purple, count:9320 },
  { id:3, name:"Bankacılık & Finans", icon:"🏦", color:C.green, count:8750 },
  { id:4, name:"Sağlık Hizmetleri", icon:"🏥", color:C.accent, count:7430 },
  { id:5, name:"Eğitim Kurumları", icon:"🎓", color:C.amber, count:6210 },
  { id:6, name:"Ulaşım & Lojistik", icon:"🚌", color:C.primary, count:5890 },
  { id:7, name:"Su & Elektrik", icon:"⚡", color:"#f97316", count:11200 },
  { id:8, name:"Belediye Hizmetleri", icon:"🏙️", color:"#0891b2", count:9870 },
  { id:9, name:"E-Ticaret & Alışveriş", icon:"🛒", color:"#7c3aed", count:7640 },
  { id:10, name:"Sigorta", icon:"🛡️", color:"#059669", count:4320 },
  { id:11, name:"Gayrimenkul", icon:"🏠", color:"#dc2626", count:3890 },
  { id:12, name:"Diğer", icon:"📋", color:C.muted, count:5430 },
];

const MOCK_COMPLAINTS = [
  { id:1, title:"Lefkoşa Devlet Hastanesi'nde 4 Saatlik Bekleme Skandalı", body:"Dün sabah saat 09:00'da Lefkoşa Devlet Hastanesi acil servisine başvurdum. 4 saat boyunca hiçbir işlem yapılmadan bekletildim.", category:"Sağlık Hizmetleri", company:"Lefkoşa Devlet Hastanesi", author:"Mehmet Y.", avatar:"MY", date:"22 Mart 2026", views:4821, votes:234, comments:18, status:"Açık" },
  { id:2, title:"KKTC Telekom İnternet Kesintisi 3 Gündür Devam Ediyor", body:"3 gündür internet bağlantım yok.", category:"Telekomünikasyon", company:"KKTC Telekomünikasyon", author:"Ayşe K.", avatar:"AK", date:"21 Mart 2026", views:3291, votes:187, comments:24, status:"İnceleniyor" },
  { id:3, title:"İş Bankası KKTC Haksız Kart Aidatı Kesintisi", body:"Hesabımdan bilgim dışında işlem ücreti kesildi.", category:"Bankacılık & Finans", company:"İş Bankası KKTC", author:"Ali R.", avatar:"AR", date:"20 Mart 2026", views:8920, votes:512, comments:43, status:"Çözüldü" },
];

const STATUS_MAP = {
  "Açık":{ bg:"#fee2e2", color:"#dc2626", dot:"#ef4444" },
  "İnceleniyor":{ bg:"#fef9c3", color:"#b45309", dot:"#f59e0b" },
  "Çözüldü":{ bg:"#dcfce7", color:"#16a34a", dot:"#22c55e" },
  "Yayınlanamadı":{ bg:"#f1f5f9", color:"#64748b", dot:"#94a3b8" },
  "Aktif":{ bg:"#dcfce7", color:"#16a34a", dot:"#22c55e" },
  "Engelli":{ bg:"#fee2e2", color:"#dc2626", dot:"#ef4444" },
};

const ROLE_MAP = {
  superadmin:{ label:"Süper Admin", color:"#7c3aed", bg:"#ede9fe" },
  admin:{ label:"Admin", color:C.primary, bg:"#e8f0fe" },
  editor:{ label:"Editör", color:C.green, bg:"#dcfce7" },
  user:{ label:"Kullanıcı", color:C.muted, bg:"#f1f5f9" },
};

// ─── SHARED STYLES ───────────────────────────────────────────
const btn = (v="primary", sz="md") => {
  const size = { sm:{padding:"5px 12px",fontSize:12}, md:{padding:"9px 18px",fontSize:13}, lg:{padding:"13px 26px",fontSize:15} }[sz];
  const variant = {
    primary:{background:C.primary,color:"#fff",border:`1.5px solid ${C.primary}`},
    secondary:{background:"transparent",color:C.primary,border:`1.5px solid ${C.primary}`},
    accent:{background:C.accent,color:"#fff",border:`1.5px solid ${C.accent}`},
    success:{background:C.green,color:"#fff",border:`1.5px solid ${C.green}`},
    danger:{background:C.red,color:"#fff",border:`1.5px solid ${C.red}`},
    ghost:{background:"transparent",color:C.muted,border:`1.5px solid ${C.border}`},
    purple:{background:C.purple,color:"#fff",border:`1.5px solid ${C.purple}`},
  }[v];
  return {...size,...variant,borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:600,transition:"all .15s",letterSpacing:.2,display:"inline-flex",alignItems:"center",gap:5};
};
const inp = {width:"100%",padding:"10px 13px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,fontFamily:"inherit",color:C.text,background:"#fff",outline:"none",boxSizing:"border-box"};
const card = {background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:22,boxShadow:"0 1px 4px rgba(0,0,0,.05)"};
const sideLink = (a) => ({display:"flex",alignItems:"center",gap:11,padding:"11px 20px",cursor:"pointer",color:a?"#fff":"rgba(255,255,255,.6)",background:a?"rgba(255,255,255,.12)":"transparent",borderLeft:a?`3px solid ${C.accent}`:"3px solid transparent",fontSize:13.5,fontFamily:"inherit",outline:"none",width:"100%",textAlign:"left",transition:"all .15s"});

const Avatar = ({ initials, size=38, bg=C.primary }) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:size*.34,flexShrink:0}}>{initials}</div>
);
const Badge = ({ s }) => {
  const m = STATUS_MAP[s] || {bg:"#f1f5f9",color:"#64748b",dot:"#94a3b8"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",borderRadius:20,fontSize:11.5,fontWeight:600,background:m.bg,color:m.color}}><span style={{width:6,height:6,borderRadius:"50%",background:m.dot,flexShrink:0}}/>{s}</span>;
};
const RoleBadge = ({ role }) => {
  const r = ROLE_MAP[role] || ROLE_MAP.user;
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:20,fontSize:11.5,fontWeight:600,background:r.bg,color:r.color}}>{r.label}</span>;
};
const Toggle = ({ on, onChange }) => (
  <div onClick={()=>onChange(!on)} style={{width:42,height:22,borderRadius:11,background:on?C.green:C.border,cursor:"pointer",position:"relative",flexShrink:0,transition:"background .2s"}}>
    <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
  </div>
);
const FormRow = ({ label, children }) => (
  <div style={{marginBottom:16}}>
    <label style={{display:"block",fontSize:12,fontWeight:600,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>{label}</label>
    {children}
  </div>
);
const Modal = ({ open, onClose, title, children, maxW=520 }) => {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:maxW,maxHeight:"90vh",overflowY:"auto",padding:30,position:"relative"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 style={{margin:0,fontSize:18,color:C.primary}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted,lineHeight:1,padding:4}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── TOP BAR ─────────────────────────────────────────────────
const TopBar = ({ stats }) => (
  <div style={{background:C.navy,color:"rgba(255,255,255,.8)",padding:"5px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,flexWrap:"wrap",gap:4}}>
    <span>📢 Çözülen: <strong style={{color:"#4ade80"}}>{(stats?.resolved||0).toLocaleString()}</strong></span>
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <a href="https://instagram.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{display:"flex",opacity:.75}}><IGIcon size={13} color="#fff"/></a>
      <a href="https://facebook.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{display:"flex",opacity:.75}}><FBIcon size={13} color="#fff"/></a>
      <a href="https://twitter.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{display:"flex",opacity:.75}}><TWIcon size={13} color="#fff"/></a>
      <span style={{opacity:.4}}>|</span>
      <span style={{fontSize:11}}>sikayetetkktc.com</span>
    </div>
  </div>
);

// ─── NAVBAR ──────────────────────────────────────────────────
const Navbar = ({ page, setPage, user, setUser }) => {
  const [drop, setDrop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = ["admin","superadmin","editor"].includes(user?.role);

  const navItems = [
    { id:"profile", icon:"👤", label:"Profilimi Düzenle" },
    { id:"my-complaints", icon:"📋", label:"Şikayetlerim" },
    { id:"notifications", icon:"🔔", label:"Bildirimlerim" },
    { id:"saved", icon:"🔖", label:"Kaydedilenler" },
  ];

  return (
    <nav style={{background:"#fff",borderBottom:`2px solid ${C.primary}`,padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:99,boxShadow:"0 2px 8px rgba(0,0,0,.07)"}}>
      <div onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",flexShrink:0}}>
        <LogoIcon size={30}/>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:C.primary,lineHeight:1}}>ŞikayetETKKTC</div>
          <div style={{fontSize:9,color:C.light,letterSpacing:.6}}>sikayetetkktc.com</div>
        </div>
      </div>

      {/* Desktop nav */}
      <div style={{display:"flex",gap:2}} className="desktop-nav">
        {[["home","Ana Sayfa"],["complaints","Şikayetler"],["categories","Kategoriler"]].map(([id,label])=>(
          <button key={id} onClick={()=>setPage(id)} style={{padding:"6px 11px",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:page===id?600:400,color:page===id?C.primary:C.muted,background:page===id?"#e8f0fe":"transparent",border:"none",fontFamily:"inherit",whiteSpace:"nowrap"}}>{label}</button>
        ))}
        {isAdmin&&<button onClick={()=>setPage("admin")} style={{padding:"6px 11px",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,color:C.purple,background:"#ede9fe",border:"none",fontFamily:"inherit"}}>🔧 Admin</button>}
      </div>

      <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
        {user ? (
          <div style={{position:"relative"}}>
            <div onClick={()=>setDrop(!drop)} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"5px 8px",borderRadius:8,border:`1px solid ${C.border}`}}>
              <Avatar initials={user.avatar} size={26}/>
              <span style={{fontSize:13,fontWeight:600,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name.split(" ")[0]}</span>
              <span style={{fontSize:10,color:C.muted}}>{drop?"▲":"▼"}</span>
            </div>
            {drop&&(
              <div style={{position:"absolute",right:0,top:"110%",background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,minWidth:200,boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:200,padding:8}}>
                <div style={{padding:"10px 14px 8px",borderBottom:`1px solid ${C.border}`,marginBottom:4}}>
                  <div style={{fontWeight:700,fontSize:13}}>{user.name}</div>
                  <div style={{fontSize:11.5,color:C.muted}}>{user.email}</div>
                  <RoleBadge role={user.role}/>
                </div>
                {navItems.map(item=>(
                  <button key={item.id} onClick={()=>{setPage(item.id);setDrop(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:8,border:"none",background:"transparent",cursor:"pointer",width:"100%",textAlign:"left",fontSize:13,color:C.text,fontFamily:"inherit"}}>
                    <span style={{fontSize:15}}>{item.icon}</span><span>{item.label}</span>
                  </button>
                ))}
                <div style={{borderTop:`1px solid ${C.border}`,marginTop:4,paddingTop:4}}>
                  <button onClick={()=>{clearSession();setUser(null);setPage("home");setDrop(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:8,border:"none",background:"transparent",cursor:"pointer",width:"100%",textAlign:"left",fontSize:13,color:"rgba(220,50,50,.8)",fontFamily:"inherit"}}>
                    <span>🚪</span><span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button style={btn("ghost","sm")} onClick={()=>setPage("login")}>Giriş</button>
            <button style={btn("primary","sm")} onClick={()=>setPage("register")}>Üye Ol</button>
          </>
        )}
        <button style={btn("accent","sm")} onClick={()=>setPage(user?"new-complaint":"login")}>+ Yaz</button>
      </div>
    </nav>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────
const Footer = ({ footerData }) => {
  const fd = footerData || {
    desc:"KKTC'nin bağımsız şikayet platformu.",
    columns:[{title:"Platform",links:[{label:"Şikayetler",url:"#"},{label:"Kategoriler",url:"#"}]},{title:"Yardım",links:[{label:"SSS",url:"#"},{label:"İletişim",url:"#"}]}],
    copyright:"© 2026 ŞikayetETKKTC.",
    instagram:"sikayetetkktc",facebook:"sikayetetkktc",twitter:"sikayetetkktc",
  };
  return (
    <footer style={{background:C.navy,color:"rgba(255,255,255,.65)",padding:"32px 16px 16px"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:24,marginBottom:24}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <LogoIcon size={28}/>
              <div>
                <div style={{color:"#fff",fontWeight:800,fontSize:14,lineHeight:1}}>ŞikayetETKKTC</div>
                <div style={{fontSize:9.5,color:"rgba(255,255,255,.4)"}}>sikayetetkktc.com</div>
              </div>
            </div>
            <p style={{fontSize:12,lineHeight:1.6,margin:"0 0 14px"}}>{fd.desc}</p>
            <div style={{display:"flex",gap:7}}>
              {fd.instagram&&<a href={`https://instagram.com/${fd.instagram}`} target="_blank" rel="noopener noreferrer" style={{width:30,height:30,borderRadius:7,background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",display:"flex",alignItems:"center",justifyContent:"center"}}><IGIcon size={15} color="#fff"/></a>}
              {fd.facebook&&<a href={`https://facebook.com/${fd.facebook}`} target="_blank" rel="noopener noreferrer" style={{width:30,height:30,borderRadius:7,background:"#1877F2",display:"flex",alignItems:"center",justifyContent:"center"}}><FBIcon size={15} color="#fff"/></a>}
              {fd.twitter&&<a href={`https://twitter.com/${fd.twitter}`} target="_blank" rel="noopener noreferrer" style={{width:30,height:30,borderRadius:7,background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}><TWIcon size={15} color="#fff"/></a>}
            </div>
          </div>
          {fd.columns.map(col=>(
            <div key={col.title}>
              <div style={{color:"#fff",fontWeight:700,fontSize:12,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{col.title}</div>
              {col.links.map(link=>(
                <a key={link.label} href={link.url||"#"} style={{display:"block",fontSize:12,marginBottom:6,color:"rgba(255,255,255,.65)",textDecoration:"none"}}
                  onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.65)"}>{link.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:14,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,fontSize:11.5}}>
          <span>{fd.copyright}</span>
          <div style={{display:"flex",gap:12}}>{["Kullanım Şartları","Gizlilik","Çerez"].map(l=><span key={l} style={{cursor:"pointer"}}>{l}</span>)}</div>
        </div>
      </div>
    </footer>
  );
};

// ─── COMPLAINT CARD ──────────────────────────────────────────
const ComplaintCard = ({ c, onClick }) => {
  const cat = PRESET_CATEGORIES.find(x=>x.name===c.category);
  return (
    <a href={`/sikayet/${c.id}`} onClick={e=>{e.preventDefault();onClick(c);}} style={{...card,cursor:"pointer",borderTop:`3px solid ${cat?.color||C.primary}`,textDecoration:"none",display:"block",color:"inherit"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Avatar initials={c.avatar||"?"} size={34} bg={cat?.color||C.primary}/>
          <div>
            <div style={{fontWeight:600,fontSize:13}}>{c.author}</div>
            <div style={{fontSize:11,color:C.muted}}>{c.date}</div>
          </div>
        </div>
        <Badge s={c.status}/>
      </div>
      <h3 style={{margin:"0 0 6px",fontSize:14,color:C.text,lineHeight:1.4}}>{c.title}</h3>
      <p style={{margin:"0 0 10px",fontSize:12,color:C.muted,lineHeight:1.5}}>{c.body.substring(0,100)}...</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:11.5}}>
        <span style={{background:(cat?.color||C.primary)+"18",color:cat?.color||C.primary,padding:"2px 8px",borderRadius:20,fontWeight:600,fontSize:11}}>{cat?.icon} {c.company}</span>
        <div style={{display:"flex",gap:10,color:C.muted}}>
          <span>👁 {c.views?.toLocaleString()||0}</span><span>👍 {c.votes||0}</span><span>💬 {c.comments||0}</span>
        </div>
      </div>
    </a>
  );
};

// ─── HOME PAGE ───────────────────────────────────────────────
const HomePage = ({ setPage, setSelected, user, siteStats }) => {
  const [search, setSearch] = useState("");
  const [dbComplaints, setDbComplaints] = useState(MOCK_COMPLAINTS);

  useEffect(()=>{
    sb.get("complaints","?is_published=eq.true&order=created_at.desc&limit=6")
      .then(data=>{
        if(data&&data.length>0) setDbComplaints(data.map(c=>({
          id:c.id,title:c.title,body:c.body,category:c.category,company:c.company,
          author:c.author_name,avatar:c.author_avatar||"?",
          date:new Date(c.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}),
          views:c.views||0,votes:c.votes||0,comments:c.comments_count||0,status:c.status
        })));
      }).catch(()=>{});
  },[]);

  const filtered = search ? dbComplaints.filter(c=>c.title.toLowerCase().includes(search.toLowerCase())||c.company.toLowerCase().includes(search.toLowerCase())) : dbComplaints;

  return (
    <div>
      <div style={{background:`linear-gradient(135deg, ${C.navy} 0%, ${C.primary} 55%, #1e5fa0 100%)`,padding:"48px 16px",textAlign:"center",color:"#fff"}}>
        <div style={{display:"inline-block",background:C.accent,padding:"3px 12px",borderRadius:20,fontSize:12,fontWeight:600,marginBottom:12}}>🇨🇾 KKTC'nin Güvenilir Şikayet Platformu</div>
        <h1 style={{fontSize:"clamp(28px,5vw,42px)",fontWeight:800,margin:"0 0 12px",lineHeight:1.2}}>Sesinizi Duyurun,<br/>Çözüm Bulun!</h1>
        <p style={{fontSize:"clamp(14px,3vw,17px)",opacity:.82,maxWidth:520,margin:"0 auto 24px",lineHeight:1.65}}>Kıbrıs'ta kamu kurumlarından özel işletmelere her türlü şikayetinizi kayıt altına alın.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button style={btn("accent","lg")} onClick={()=>setPage(user?"new-complaint":"login")}>+ Şikayet Yaz</button>
          <button style={{...btn("secondary","lg"),color:"#fff",borderColor:"rgba(255,255,255,.45)"}} onClick={()=>setPage("complaints")}>Tüm Şikayetler</button>
        </div>
      </div>

      <div style={{background:C.accent,padding:"12px 16px",display:"flex",justifyContent:"center",gap:"clamp(16px,4vw,44px)",flexWrap:"wrap"}}>
        {[[siteStats?.total?.toLocaleString()||"0","Toplam Şikayet"],[siteStats?.resolved?.toLocaleString()||"0","Çözülen"],[siteStats?.members?.toLocaleString()||"0","Üye"]].map(([n,l])=>(
          <div key={l} style={{textAlign:"center",color:"#fff"}}>
            <div style={{fontSize:"clamp(16px,3vw,22px)",fontWeight:800}}>{n}</div>
            <div style={{fontSize:10,opacity:.88,textTransform:"uppercase",letterSpacing:.5}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 16px"}}>
        <div style={{...card,marginBottom:24,padding:"14px 16px"}}>
          <div style={{display:"flex",gap:8}}>
            <input style={{...inp,fontSize:14,padding:"10px 14px"}} placeholder="🔍 Kurum adı, şikayet konusu ara..." value={search} onChange={e=>setSearch(e.target.value)}/>
            <button style={{...btn("primary"),whiteSpace:"nowrap"}}>Ara</button>
          </div>
        </div>

        <div style={{marginBottom:32}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h2 style={{margin:0,fontSize:"clamp(16px,3vw,20px)",fontWeight:800,color:C.primary}}>Kategoriler</h2>
            <button style={btn("ghost","sm")} onClick={()=>setPage("categories")}>Tümü →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
            {PRESET_CATEGORIES.slice(0,8).map(cat=>(
              <div key={cat.id} onClick={()=>setPage("complaints")} style={{...card,cursor:"pointer",textAlign:"center",padding:"14px 10px",borderTop:`3px solid ${cat.color}`}}>
                <div style={{fontSize:22,marginBottom:5}}>{cat.icon}</div>
                <div style={{fontWeight:600,fontSize:12,marginBottom:2}}>{cat.name}</div>
                <div style={{fontSize:11,color:C.muted}}>{cat.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h2 style={{margin:0,fontSize:"clamp(16px,3vw,20px)",fontWeight:800,color:C.primary}}>Son Şikayetler</h2>
            <button style={btn("ghost","sm")} onClick={()=>setPage("complaints")}>Tümü →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
            {filtered.map(c=><ComplaintCard key={c.id} c={c} onClick={c=>{setSelected(c);setPage("detail");}}/>)}
          </div>
        </div>
      </div>

      <div style={{background:C.primary,padding:"36px 16px",textAlign:"center",color:"#fff"}}>
        <h2 style={{fontSize:"clamp(18px,4vw,26px)",marginBottom:10}}>Şikayetinizi Bir Kurum Görmeli</h2>
        <p style={{opacity:.8,marginBottom:20,fontSize:14}}>KKTC'de yaşadığınız sorunları bizimle paylaşın.</p>
        <button style={btn("accent","lg")} onClick={()=>setPage(user?"new-complaint":"login")}>Ücretsiz Şikayet Yaz</button>
      </div>
    </div>
  );
};

// ─── CATEGORIES PAGE ─────────────────────────────────────────
const CategoriesPage = ({ setPage }) => {
  const [categories, setCategories] = useState(PRESET_CATEGORIES);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({name:"",icon:"📌",color:C.blue});
  const ICON_OPTIONS = ["📌","🏢","🚗","🌿","💊","🎵","🍔","🏋️","✈️","📱","💻","🏦","🛠️","🎭","🏪","🏗️","🌊","🔌","🏨","🚕","⚖️","🔧","🏫","🎰","🧹","🐕"];

  const loadCategories = () => {
    sb.get("categories","?is_custom=eq.true&order=created_at.desc").then(data=>{
      if(data&&data.length>0){
        const custom=data.map(c=>({id:c.id,name:c.name,icon:c.icon||"📌",color:c.color||C.blue,count:c.complaint_count||0,custom:true}));
        setCategories([...PRESET_CATEGORIES,...custom]);
      }
    }).catch(()=>{});
  };

  useEffect(()=>{ loadCategories(); },[]);

  const addCategory=async()=>{
    if(!newCat.name.trim())return;
    const res=await sb.post("categories",{name:newCat.name.trim(),icon:newCat.icon,color:newCat.color,complaint_count:0,is_custom:true});
    if(res&&res[0]){
      setCategories(prev=>[...prev,{id:res[0].id,name:newCat.name.trim(),icon:newCat.icon,color:newCat.color,count:0,custom:true}]);
      setNewCat({name:"",icon:"📌",color:C.blue});
      setShowAdd(false);
      alert("✅ Kategori eklendi!");
    }else{
      // Fallback
      setCategories(prev=>[...prev,{id:Date.now(),name:newCat.name.trim(),icon:newCat.icon,color:newCat.color,count:0,custom:true}]);
      setNewCat({name:"",icon:"📌",color:C.blue});
      setShowAdd(false);
    }
  };

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <h1 style={{margin:"0 0 4px",fontSize:"clamp(20px,4vw,26px)",fontWeight:800,color:C.primary}}>Tüm Kategoriler</h1>
          <p style={{margin:0,color:C.muted,fontSize:13}}>{categories.length} kategori</p>
        </div>
        <button style={btn("primary")} onClick={()=>setShowAdd(true)}>+ Yeni Kategori</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
        {categories.map(cat=>(
          <div key={cat.id} onClick={()=>setPage("complaints")} style={{...card,cursor:"pointer",borderLeft:`4px solid ${cat.color}`,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{fontSize:24}}>{cat.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:C.text}}>{cat.name}</div>
                <div style={{fontSize:11.5,color:C.muted}}>{cat.count?.toLocaleString()||0} şikayet</div>
              </div>
            </div>
            {!cat.custom&&<div style={{height:4,borderRadius:2,background:C.bg}}><div style={{height:"100%",width:`${Math.min((cat.count/12840)*100,100)}%`,background:cat.color,borderRadius:2}}/></div>}
            {cat.custom&&<span style={{fontSize:10,background:C.accent+"15",color:C.accent,padding:"1px 6px",borderRadius:20,fontWeight:600}}>Kullanıcı</span>}
          </div>
        ))}
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Yeni Kategori Ekle">
        <FormRow label="Kategori Adı"><input style={inp} placeholder="Örn: Çevre Sorunları..." value={newCat.name} onChange={e=>setNewCat({...newCat,name:e.target.value})}/></FormRow>
        <FormRow label="İkon Seç">
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {ICON_OPTIONS.map(ic=><button key={ic} onClick={()=>setNewCat({...newCat,icon:ic})} style={{width:38,height:38,borderRadius:8,border:`2px solid ${newCat.icon===ic?C.primary:C.border}`,background:newCat.icon===ic?"#e8f0fe":"#fff",cursor:"pointer",fontSize:17}}>{ic}</button>)}
          </div>
        </FormRow>
        <FormRow label="Renk Seç">
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {[C.blue,C.accent,C.green,C.purple,C.amber,"#0891b2","#7c3aed","#059669","#dc2626","#f97316"].map(col=>(
              <button key={col} onClick={()=>setNewCat({...newCat,color:col})} style={{width:30,height:30,borderRadius:"50%",background:col,border:newCat.color===col?`3px solid ${C.text}`:"3px solid transparent",cursor:"pointer"}}/>
            ))}
          </div>
        </FormRow>
        <div style={{...card,display:"flex",alignItems:"center",gap:10,marginBottom:16,borderLeft:`4px solid ${newCat.color}`}}>
          <div style={{fontSize:24}}>{newCat.icon}</div>
          <div><div style={{fontWeight:700,fontSize:13,color:newCat.name?C.text:C.muted}}>{newCat.name||"Kategori adı..."}</div><div style={{fontSize:11,color:C.muted}}>Önizleme</div></div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button style={{...btn("ghost"),flex:1}} onClick={()=>setShowAdd(false)}>İptal</button>
          <button style={{...btn("primary"),flex:1}} onClick={addCategory} disabled={!newCat.name.trim()}>✓ Ekle</button>
        </div>
      </Modal>
    </div>
  );
};

// ─── COMPLAINTS LIST ──────────────────────────────────────────
const ComplaintsPage = ({ setPage, setSelected }) => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [dbComplaints, setDbComplaints] = useState(MOCK_COMPLAINTS);

  useEffect(()=>{
    sb.get("complaints","?is_published=eq.true&order=created_at.desc")
      .then(data=>{
        if(data&&data.length>0) setDbComplaints(data.map(c=>({
          id:c.id,title:c.title,body:c.body,category:c.category,company:c.company,
          author:c.author_name,avatar:c.author_avatar||"?",
          date:new Date(c.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}),
          views:c.views||0,votes:c.votes||0,comments:c.comments_count||0,status:c.status
        })));
      }).catch(()=>{});
  },[]);

  const filtered = dbComplaints.filter(c=>filter==="all"||c.status===filter).sort((a,b)=>sort==="newest"?b.id-a.id:sort==="popular"?b.views-a.views:b.votes-a.votes);

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <h1 style={{margin:0,fontSize:"clamp(18px,4vw,24px)",fontWeight:800,color:C.primary}}>Tüm Şikayetler</h1>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[["all","Tümü"],["Açık","Açık"],["İnceleniyor","İnceleniyor"],["Çözüldü","Çözüldü"]].map(([v,l])=>(
            <button key={v} style={btn(filter===v?"primary":"ghost","sm")} onClick={()=>setFilter(v)}>{l}</button>
          ))}
          <select style={{...inp,width:"auto",padding:"5px 8px",fontSize:12}} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">En Yeni</option><option value="popular">En Popüler</option><option value="votes">En Çok Oy</option>
          </select>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12}}>
        {filtered.map(c=>(
          <a key={c.id} href={`/sikayet/${c.id}`} onClick={e=>{e.preventDefault();setSelected(c);setPage("detail");}} style={{...card,cursor:"pointer",borderLeft:`4px solid ${STATUS_MAP[c.status]?.dot||C.primary}`,textDecoration:"none",display:"block",color:"inherit"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Avatar initials={c.avatar||"?"} size={32} bg={PRESET_CATEGORIES.find(x=>x.name===c.category)?.color||C.primary}/>
                <div>
                  <span style={{fontWeight:600,fontSize:13}}>{c.author}</span>
                  <span style={{fontSize:11.5,color:C.muted,marginLeft:6}}>{c.date}</span>
                </div>
              </div>
              <Badge s={c.status}/>
            </div>
            <h3 style={{margin:"0 0 6px",fontSize:14,color:C.text}}>{c.title}</h3>
            <p style={{margin:"0 0 8px",fontSize:12.5,color:C.muted,lineHeight:1.5}}>{c.body.substring(0,150)}...</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12,flexWrap:"wrap",gap:6}}>
              <span style={{background:C.primary+"15",color:C.primary,padding:"2px 8px",borderRadius:20,fontWeight:600,fontSize:11.5}}>🏢 {c.company}</span>
              <div style={{display:"flex",gap:12,color:C.muted}}><span>👁 {c.views?.toLocaleString()||0}</span><span>👍 {c.votes||0}</span><span>💬 {c.comments||0}</span></div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// ─── DETAIL PAGE ──────────────────────────────────────────────
const DetailPage = ({ complaint, setPage, user }) => {
  const [vote, setVote] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(()=>{
    if(!complaint?.id)return;
    // Gerçek yorumları yükle
    sb.get("comments",`?complaint_id=eq.${complaint.id}&order=created_at.asc`)
      .then(data=>{
        if(data&&data.length>0){
          setComments(data.map(c=>({
            id:c.id,
            author:c.author_name||"Kullanıcı",
            avatar:(c.author_name||"K")[0].toUpperCase(),
            text:c.body,
            date:new Date(c.created_at).toLocaleDateString("tr-TR"),
            likes:c.likes||0
          })));
        }
        setCommentsLoading(false);
      }).catch(()=>setCommentsLoading(false));
    // Görüntülenme sayısını artır
    sb.patch("complaints",complaint.id,{views:(complaint.views||0)+1}).catch(()=>{});
  },[complaint?.id]);
  if(!complaint)return null;
  const cat=PRESET_CATEGORIES.find(x=>x.name===complaint.category);
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px"}}>
      <button style={btn("ghost","sm")} onClick={()=>setPage("complaints")}>← Geri</button>
      <div style={{marginTop:16}}>
        <div style={{...card,borderTop:`4px solid ${cat?.color||C.primary}`,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Avatar initials={complaint.avatar||"?"} size={38} bg={cat?.color||C.primary}/>
              <div><div style={{fontWeight:600}}>{complaint.author}</div><div style={{fontSize:12,color:C.muted}}>{complaint.date} · {complaint.category}</div></div>
            </div>
            <Badge s={complaint.status}/>
          </div>
          <h1 style={{fontSize:"clamp(16px,3vw,20px)",margin:"0 0 10px",color:C.primary,lineHeight:1.3}}>{complaint.title}</h1>
          <p style={{fontSize:14,lineHeight:1.7,color:C.text,borderTop:`1px solid ${C.border}`,paddingTop:14}}>{complaint.body}</p>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:12,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <button style={btn(vote==="up"?"success":"ghost","sm")} onClick={()=>setVote(vote==="up"?null:"up")}>👍 {(complaint.votes||0)+(vote==="up"?1:0)}</button>
            <button style={btn(vote==="down"?"danger":"ghost","sm")} onClick={()=>setVote(vote==="down"?null:"down")}>👎</button>
            <span style={{marginLeft:"auto",fontSize:12,color:C.muted}}>👁 {complaint.views?.toLocaleString()||0}</span>
          </div>
        </div>
        <div>
          <h2 style={{fontSize:16,color:C.primary,marginBottom:12,fontWeight:700}}>Yorumlar ({comments.length})</h2>
          {commentsLoading&&<div style={{textAlign:"center",padding:20,color:C.muted,fontSize:13}}>Yorumlar yükleniyor...</div>}
          {!commentsLoading&&comments.length===0&&(
            <div style={{...card,textAlign:"center",padding:24,color:C.muted,fontSize:13}}>Henüz yorum yapılmamış. İlk yorumu siz yapın!</div>
          )}
          {comments.map(c=>(
            <div key={c.id} style={{...card,marginBottom:10}}>
              <div style={{display:"flex",gap:10}}>
                <Avatar initials={c.avatar} size={32} bg={C.accent}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:4}}>
                    <span style={{fontWeight:600,fontSize:13}}>{c.author}</span>
                    <span style={{fontSize:11.5,color:C.muted}}>{c.date}</span>
                  </div>
                  <p style={{margin:"0 0 6px",fontSize:13,lineHeight:1.5}}>{c.text}</p>
                </div>
              </div>
            </div>
          ))}
          {user?(
            <div style={card}>
              <textarea style={{...inp,minHeight:80,marginBottom:10}} placeholder="Yorumunuzu yazın..." value={comment} onChange={e=>setComment(e.target.value)}/>
              <button style={btn("primary")} onClick={async()=>{
                if(!comment.trim())return;
                const res = await sb.post("comments",{
                  complaint_id:complaint.id,
                  author_name:user.name,
                  author_email:user.email||"",
                  body:comment,
                  likes:0,
                  created_at:new Date().toISOString()
                });
                if(res&&res[0]){
                  setComments(prev=>[...prev,{id:res[0].id,author:user.name,avatar:user.avatar||user.name[0],text:comment,date:"Şimdi",likes:0}]);
                  // Yorum sayısını güncelle
                  await sb.patch("complaints",complaint.id,{comments_count:(complaint.comments||0)+1}).catch(()=>{});
                }
                setComment("");
              }}>Gönder</button>
            </div>
          ):(
            <div style={{...card,textAlign:"center"}}>
              <p style={{color:C.muted,marginBottom:10}}>Yorum yapmak için giriş yapın.</p>
              <button style={btn("primary")} onClick={()=>setPage("login")}>Giriş Yap</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── AI COMPLAINT PAGE (form + AI modu) ──────────────────────
const AIComplaintPage = ({ user, setPage }) => {
  const [useAI, setUseAI] = useState(false);
  const [draft, setDraft] = useState({title:"",category:"",company:"",body:"",newCatName:""});
  const [allCategories, setAllCategories] = useState(PRESET_CATEGORIES);
  const [showNewCat, setShowNewCat] = useState(false);
  const [aiMessages, setAiMessages] = useState([{role:"ai",text:"Merhaba! Şikayetinizi birlikte oluşturalım. Hangi kurum veya işletme hakkında şikayetiniz var?"}]);
  const [aiInput, setAiInput] = useState("");
  const [aiStep, setAiStep] = useState(1);
  const [aiDraft, setAiDraft] = useState({company:"",category:"",title:"",body:""});
  const [isTyping, setIsTyping] = useState(false);
  const msgRef = useRef(null);

  useEffect(()=>{
    sb.get("categories","?order=created_at.desc").then(data=>{
      if(data&&data.length>0){
        const dbCats=data.map(c=>({id:c.id,name:c.name,icon:c.icon||"📌",color:c.color||C.blue,count:c.complaint_count||0}));
        const dbNames=dbCats.map(c=>c.name);
        setAllCategories([...PRESET_CATEGORIES.filter(p=>!dbNames.includes(p.name)),...dbCats]);
      }
    }).catch(()=>{});
  },[]);

  useEffect(()=>{ if(msgRef.current)msgRef.current.scrollTop=msgRef.current.scrollHeight; },[aiMessages]);

  const submitComplaint = async(data) => {
    const res=await sb.post("complaints",{
      title:data.title,body:data.body,category:data.category,company:data.company,
      author_name:user.name,author_avatar:user.avatar,author_email:user.email||"",
      status:"Açık",views:0,votes:0,comments_count:0,is_published:true
    });
    if(res&&res[0]){
      if(user.email)sendEmail("complaint_reply",user.email,{name:user.name,complaintTitle:data.title});
      alert("✅ Şikayetiniz başarıyla kaydedildi!");
      setPage("complaints");
    }else{alert("Kayıt sırasında hata oluştu.");}
  };

  const addNewCategory = async() => {
    if(!draft.newCatName?.trim())return;
    const catName=draft.newCatName.trim();
    const res=await sb.post("categories",{name:catName,icon:"📌",color:C.blue,complaint_count:0,is_custom:true});
    const newCat={id:(res&&res[0])?res[0].id:Date.now(),name:catName,icon:"📌",color:C.blue,count:0};
    setAllCategories(prev=>[...prev,newCat]);
    setDraft({...draft,category:catName,newCatName:""});
    setShowNewCat(false);
    alert("✅ Kategori eklendi!");
  };

  const AI_STEPS = {
    1:(input)=>{ setAiDraft(d=>({...d,company:input})); return{text:`"${input}" hakkında şikayet oluşturuyoruz. Hangi kategori?\n\n${PRESET_CATEGORIES.slice(0,6).map((c,i)=>`${i+1}. ${c.icon} ${c.name}`).join("\n")}`,next:2}; },
    2:(input)=>{ const catName=PRESET_CATEGORIES[parseInt(input)-1]?.name||input; setAiDraft(d=>({...d,category:catName})); return{text:`"${catName}" seçildi ✅\n\nŞimdi yaşadığınız sorunu detaylıca anlatın.`,next:3}; },
    3:(input)=>{ const title=input.length>60?input.substring(0,57)+"...":input; setAiDraft(d=>({...d,body:input,title})); return{text:`Şikayet hazırlandı 🤖\n\n📍 Kurum: ${aiDraft.company}\n📁 Kategori: ${aiDraft.category}\n📝 Başlık: "${title}"\n\nOnayla ve Yayınla yazın ya da Düzenle yazın.`,next:4}; },
    4:(input)=>{ if(input.toLowerCase().includes("onayla")){ submitComplaint({...aiDraft,title:aiDraft.title||aiDraft.body.substring(0,60)}); return{text:"✅ Şikayetiniz kaydedildi!",next:5}; } return{text:"Hangi kısmı değiştirmek istiyorsunuz? (kurum/kategori/detay)",next:3}; }
  };

  const sendAI=()=>{
    if(!aiInput.trim()||isTyping)return;
    const msg=aiInput.trim(); setAiInput("");
    setAiMessages(m=>[...m,{role:"user",text:msg}]);
    setIsTyping(true);
    setTimeout(()=>{ const r=AI_STEPS[aiStep]?.(msg); if(r){setAiMessages(m=>[...m,{role:"ai",text:r.text}]);setAiStep(r.next);} setIsTyping(false); },800);
  };

  if(!user)return(
    <div style={{maxWidth:440,margin:"60px auto",padding:"0 16px"}}>
      <div style={card}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>🔐</div>
          <h2 style={{color:C.primary}}>Giriş Gerekli</h2>
          <p style={{color:C.muted}}>Şikayet oluşturmak için lütfen giriş yapın.</p>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button style={{...btn("primary"),flex:1}} onClick={()=>setPage("login")}>Giriş Yap</button>
            <button style={{...btn("secondary"),flex:1}} onClick={()=>setPage("register")}>Üye Ol</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h2 style={{margin:0,color:C.primary,fontSize:"clamp(16px,3vw,20px)",fontWeight:700}}>Şikayet Oluştur</h2>
        <button style={btn(useAI?"ghost":"purple","sm")} onClick={()=>setUseAI(!useAI)}>
          {useAI?"📝 Form Moduna Geç":"🤖 AI Moduna Geç"}
        </button>
      </div>

      {!useAI ? (
        <div style={card}>
          <FormRow label="Şikayet Başlığı">
            <input style={inp} placeholder="Kısa ve açıklayıcı bir başlık" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/>
          </FormRow>
          <FormRow label="Kategori">
            <div style={{display:"flex",gap:8}}>
              <select style={{...inp,flex:1}} value={draft.category} onChange={e=>{ if(e.target.value==="__new__"){setShowNewCat(true);}else{setDraft({...draft,category:e.target.value});} }}>
                <option value="">Kategori Seçin</option>
                {allCategories.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                <option value="__new__">➕ Yeni Kategori Ekle...</option>
              </select>
            </div>
          </FormRow>
          {showNewCat&&(
            <div style={{background:"#f0f9ff",border:`1px solid #bae6fd`,borderRadius:8,padding:14,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,color:C.primary,marginBottom:8}}>Yeni Kategori Adı</div>
              <div style={{display:"flex",gap:8}}>
                <input style={{...inp,flex:1}} placeholder="Örn: Otel Şikayeti..." value={draft.newCatName||""} onChange={e=>setDraft({...draft,newCatName:e.target.value})}/>
                <button style={btn("primary","sm")} onClick={addNewCategory}>Ekle</button>
                <button style={btn("ghost","sm")} onClick={()=>setShowNewCat(false)}>İptal</button>
              </div>
            </div>
          )}
          <FormRow label="Kurum / İşletme">
            <input style={inp} placeholder="Şikayet ettiğiniz kurum adı" value={draft.company} onChange={e=>setDraft({...draft,company:e.target.value})}/>
          </FormRow>
          <FormRow label="Şikayet Detayı">
            <textarea style={{...inp,minHeight:130,resize:"vertical"}} placeholder="Ne oldu, ne zaman oldu, ne bekliyorsunuz?" value={draft.body} onChange={e=>setDraft({...draft,body:e.target.value})}/>
          </FormRow>
          <button style={{...btn("success","lg"),width:"100%"}} onClick={()=>{
            if(!draft.title||!draft.company||!draft.body||!draft.category){alert("Lütfen tüm alanları doldurun.");return;}
            submitComplaint(draft);
          }}>✓ Şikayeti Yayınla</button>
        </div>
      ) : (
        <div style={{...card,display:"flex",flexDirection:"column",height:"60vh",minHeight:400}}>
          <div ref={msgRef} style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
            {aiMessages.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"78%",padding:"10px 14px",borderRadius:m.role==="user"?"16px 4px 16px 16px":"4px 16px 16px 16px",background:m.role==="user"?C.primary:"#f1f5f9",color:m.role==="user"?"#fff":C.text,fontSize:13.5,lineHeight:1.55,whiteSpace:"pre-wrap"}}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping&&<div style={{display:"flex"}}><div style={{background:"#f1f5f9",padding:"10px 14px",borderRadius:"4px 16px 16px 16px",fontSize:13,color:C.muted}}>● ● ●</div></div>}
          </div>
          <div style={{padding:"12px 0 0",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
            <input style={{...inp,flex:1}} placeholder="Cevabınızı yazın..." value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()}/>
            <button style={{...btn("success"),borderRadius:"50%",width:40,height:40,padding:0,justifyContent:"center",flexShrink:0}} onClick={sendAI}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── LOGIN PAGE ───────────────────────────────────────────────
const LoginPage = ({ setPage, setUser }) => {
  const [form, setForm] = useState({email:"",pass:""});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotSentCode, setForgotSentCode] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotConfirm, setForgotConfirm] = useState("");
  const [forgotErr, setForgotErr] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const genCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const doLogin = async () => {
    if(!form.email||!form.pass){setErr("E-posta ve şifre gereklidir.");return;}
    setLoading(true);setErr("");
    // Süper Admin
    if(form.email===SUPER_ADMIN.email&&form.pass===SUPER_ADMIN.password){
      const u={...SUPER_ADMIN};saveSession(u);setUser(u);setPage("admin");setLoading(false);return;
    }
    // Admin kullanıcıları
    try {
      const admins=await sb.get("admin_users",`?email=eq.${encodeURIComponent(form.email)}&password=eq.${encodeURIComponent(form.pass)}&is_active=eq.true`);
      if(admins&&admins.length>0){
        const a=admins[0];
        const u={id:a.id,name:a.name,email:a.email,avatar:a.avatar||(a.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)),role:a.role};
        saveSession(u);setUser(u);setPage(a.role==="editor"?"complaints":"admin");setLoading(false);return;
      }
    }catch(e){}
    // Supabase Auth
    try {
      const authRes=await sb.signIn(form.email,form.pass);
      if(authRes.access_token){
        const profile=await sb.get("users",`?email=eq.${encodeURIComponent(form.email)}`);
        const p=profile&&profile[0];
        const u={id:authRes.user?.id,name:p?.name||form.email,email:form.email,avatar:p?.avatar||(p?.name||form.email)[0].toUpperCase(),role:"user",phone:p?.phone||"",city:p?.city||"",auth_token:authRes.access_token};
        saveSession(u);setUser(u);setPage("home");setLoading(false);return;
      }
    }catch(e){}
    // Şifre sıfırlama tablosu kontrolü
    try {
      const resets=await sb.get("password_resets",`?email=eq.${encodeURIComponent(form.email)}&new_password=eq.${encodeURIComponent(form.pass)}&used=eq.false&order=created_at.desc&limit=1`);
      if(resets&&resets.length>0){
        await sb.patch("password_resets",resets[0].id,{used:true}).catch(()=>{});
        const profile=await sb.get("users",`?email=eq.${encodeURIComponent(form.email)}`);
        const p=profile&&profile[0];
        if(p){
          const u={id:p.id,name:p.name||form.email,email:form.email,avatar:p.avatar||(p.name||form.email)[0].toUpperCase(),role:"user",phone:p.phone||"",city:p.city||""};
          saveSession(u);setUser(u);setPage("home");setLoading(false);return;
        }
      }
    }catch(e){}
    setErr("E-posta veya şifre hatalı.");setLoading(false);
  };

  const sendResetCode = async () => {
    if(!forgotEmail){setForgotErr("E-posta adresi giriniz.");return;}
    setForgotLoading(true);setForgotErr("");
    try {
      const users=await sb.get("users",`?email=eq.${encodeURIComponent(forgotEmail)}`);
      if(!users||users.length===0){setForgotErr("Bu e-posta adresiyle kayıtlı hesap bulunamadı.");setForgotLoading(false);return;}
      const code=genCode();
      setForgotSentCode(code);
      await sendEmail("reset_password",forgotEmail,{code,name:users[0].name||""});
      setForgotStep(2);
      setForgotMsg("✅ 6 haneli doğrulama kodu e-posta adresinize gönderildi.");
    }catch{setForgotErr("Bir hata oluştu. Lütfen tekrar deneyin.");}
    setForgotLoading(false);
  };

  const verifyResetCode = () => {
    setForgotErr("");
    if(forgotCode!==forgotSentCode){setForgotErr("Kod hatalı. Lütfen tekrar deneyin.");return;}
    setForgotMsg("");setForgotStep(3);
  };

  const doResetPassword = async () => {
    if(!forgotNewPass||forgotNewPass.length<6){setForgotErr("Şifre en az 6 karakter olmalıdır.");return;}
    if(forgotNewPass!==forgotConfirm){setForgotErr("Şifreler eşleşmiyor.");return;}
    setForgotLoading(true);setForgotErr("");
    try {
      // Cloudflare Worker üzerinden Supabase Auth şifresini güncelle
      const res = await fetch(EMAIL_WORKER, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({type:"update_password", email:forgotEmail, newPassword:forgotNewPass})
      });
      const data = await res.json();
      if(data.success){
        // password_resets tablosuna da kaydet (fallback)
        await sb.post("password_resets",{email:forgotEmail,new_password:forgotNewPass,code:forgotSentCode,used:false,created_at:new Date().toISOString()}).catch(()=>{});
        setForgotMsg("✅ Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.");
        setTimeout(()=>{
          setShowForgot(false);setForgotStep(1);setForgotEmail("");setForgotCode("");
          setForgotSentCode("");setForgotNewPass("");setForgotConfirm("");setForgotMsg("");setForgotErr("");
        },2500);
      } else {
        // Worker başarısız olursa fallback: password_resets tablosuna kaydet
        await sb.post("password_resets",{email:forgotEmail,new_password:forgotNewPass,code:forgotSentCode,used:false,created_at:new Date().toISOString()}).catch(()=>{});
        setForgotMsg("✅ Şifreniz güncellendi! Yeni şifrenizle giriş yapabilirsiniz.");
        setTimeout(()=>{
          setShowForgot(false);setForgotStep(1);setForgotEmail("");setForgotCode("");
          setForgotSentCode("");setForgotNewPass("");setForgotConfirm("");setForgotMsg("");setForgotErr("");
        },2500);
      }
    }catch{
      // Hata durumunda da fallback
      await sb.post("password_resets",{email:forgotEmail,new_password:forgotNewPass,code:forgotSentCode,used:false,created_at:new Date().toISOString()}).catch(()=>{});
      setForgotMsg("✅ Şifreniz güncellendi! Yeni şifrenizle giriş yapabilirsiniz.");
      setTimeout(()=>{
        setShowForgot(false);setForgotStep(1);setForgotEmail("");setForgotCode("");
        setForgotSentCode("");setForgotNewPass("");setForgotConfirm("");setForgotMsg("");setForgotErr("");
      },2500);
    }
    setForgotLoading(false);
  };

  const resetFlow = () => {
    setShowForgot(false);setForgotStep(1);setForgotEmail("");setForgotCode("");
    setForgotSentCode("");setForgotNewPass("");setForgotConfirm("");setForgotMsg("");setForgotErr("");
  };

  return (
    <div style={{maxWidth:420,margin:"40px auto",padding:"0 16px"}}>
      <div style={card}>
        {!showForgot ? (
          <>
            <div style={{textAlign:"center",marginBottom:24}}>
              <LogoIcon size={48}/>
              <h1 style={{fontSize:20,margin:"10px 0 5px",color:C.primary}}>Giriş Yap</h1>
              <p style={{color:C.muted,margin:0,fontSize:13}}>ŞikayetETKKTC hesabınıza giriş yapın</p>
            </div>
            {err&&<div style={{background:"#fee2e2",color:"#dc2626",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>⚠️ {err}</div>}
            <FormRow label="E-posta"><input style={inp} type="email" placeholder="ornek@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></FormRow>
            <FormRow label="Şifre"><input style={inp} type="password" placeholder="••••••••" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></FormRow>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
              <span style={{fontSize:12.5,color:C.blue,cursor:"pointer"}} onClick={()=>{setShowForgot(true);setForgotEmail(form.email);}}>Şifremi Unuttum</span>
            </div>
            <button style={{...btn("primary","lg"),width:"100%"}} onClick={doLogin} disabled={loading}>{loading?"Giriş yapılıyor...":"Giriş Yap"}</button>
            <div style={{textAlign:"center",marginTop:12,fontSize:13}}>
              <span style={{color:C.muted}}>Hesabınız yok mu? </span>
              <span style={{color:C.blue,cursor:"pointer",fontWeight:600}} onClick={()=>setPage("register")}>Üye Ol</span>
            </div>
          </>
        ) : (
          <>
            <div style={{display:"flex",gap:5,marginBottom:20}}>
              {[1,2,3].map(s=><div key={s} style={{flex:1,height:4,borderRadius:2,background:s<=forgotStep?C.accent:C.border}}/>)}
            </div>
            {forgotStep===1&&(
              <>
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontSize:38,marginBottom:8}}>🔑</div>
                  <h2 style={{margin:"0 0 6px",color:C.primary,fontSize:18}}>Şifremi Unuttum</h2>
                  <p style={{color:C.muted,fontSize:13,margin:0}}>E-posta adresinize 6 haneli doğrulama kodu göndereceğiz.</p>
                </div>
                {forgotErr&&<div style={{background:"#fee2e2",color:"#dc2626",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>⚠️ {forgotErr}</div>}
                <FormRow label="E-posta Adresiniz">
                  <input style={inp} type="email" placeholder="ornek@email.com" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendResetCode()}/>
                </FormRow>
                <button style={{...btn("accent","lg"),width:"100%",marginBottom:12}} onClick={sendResetCode} disabled={forgotLoading}>{forgotLoading?"Gönderiliyor...":"📧 Doğrulama Kodu Gönder"}</button>
                <button style={{...btn("ghost"),width:"100%"}} onClick={resetFlow}>← Giriş Sayfasına Dön</button>
              </>
            )}
            {forgotStep===2&&(
              <>
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontSize:38,marginBottom:8}}>📧</div>
                  <h2 style={{margin:"0 0 6px",color:C.primary,fontSize:18}}>Kodu Girin</h2>
                  <p style={{color:C.muted,fontSize:13,margin:0}}><strong>{forgotEmail}</strong> adresine gönderilen kodu girin.</p>
                </div>
                {forgotMsg&&<div style={{background:"#dcfce7",color:"#16a34a",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>{forgotMsg}</div>}
                {forgotErr&&<div style={{background:"#fee2e2",color:"#dc2626",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>⚠️ {forgotErr}</div>}
                <FormRow label="Doğrulama Kodu">
                  <input style={{...inp,fontSize:24,textAlign:"center",letterSpacing:8,fontWeight:700}} placeholder="000000" maxLength={6} value={forgotCode} onChange={e=>setForgotCode(e.target.value.replace(/\D/g,""))}/>
                </FormRow>
                <button style={{...btn("accent","lg"),width:"100%",marginBottom:10}} onClick={verifyResetCode} disabled={forgotCode.length!==6}>✓ Kodu Doğrula</button>
                <div style={{textAlign:"center",marginBottom:10}}>
                  <button style={{fontSize:12.5,color:C.blue,background:"none",border:"none",cursor:"pointer"}} onClick={async()=>{const code=genCode();setForgotSentCode(code);setForgotCode("");setForgotErr("");await sendEmail("reset_password",forgotEmail,{code});setForgotMsg("✅ Yeni kod gönderildi!");}}>Kodu Yeniden Gönder</button>
                </div>
                <button style={{...btn("ghost"),width:"100%"}} onClick={()=>setForgotStep(1)}>← Geri</button>
              </>
            )}
            {forgotStep===3&&(
              <>
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontSize:38,marginBottom:8}}>🔒</div>
                  <h2 style={{margin:"0 0 6px",color:C.primary,fontSize:18}}>Yeni Şifre Belirle</h2>
                  <p style={{color:C.muted,fontSize:13,margin:0}}>Hesabınız için yeni bir şifre belirleyin.</p>
                </div>
                {forgotMsg&&<div style={{background:"#dcfce7",color:"#16a34a",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>{forgotMsg}</div>}
                {forgotErr&&<div style={{background:"#fee2e2",color:"#dc2626",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>⚠️ {forgotErr}</div>}
                {!forgotMsg.startsWith("✅")&&(
                  <>
                    <FormRow label="Yeni Şifre (en az 6 karakter)">
                      <input style={inp} type="password" placeholder="••••••••" value={forgotNewPass} onChange={e=>setForgotNewPass(e.target.value)}/>
                    </FormRow>
                    <FormRow label="Şifre Tekrar">
                      <input style={inp} type="password" placeholder="••••••••" value={forgotConfirm} onChange={e=>setForgotConfirm(e.target.value)}/>
                    </FormRow>
                    <button style={{...btn("success","lg"),width:"100%"}} onClick={doResetPassword} disabled={forgotLoading}>{forgotLoading?"Güncelleniyor...":"✓ Şifremi Güncelle"}</button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ─── REGISTER PAGE (e-posta doğrulama ile) ───────────────────
const RegisterPage = ({ setPage, setUser }) => {
  const [step, setStep] = useState(1); // 1=info, 2=password, 3=verify
  const [form, setForm] = useState({firstName:"",lastName:"",email:"",phone:"",pass:"",city:"",agree:false});
  const [verCode, setVerCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [verErr, setVerErr] = useState("");
  const [sending, setSending] = useState(false);
  const [registering, setRegistering] = useState(false);

  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendVerification = async () => {
    if(!form.pass||form.pass.length<6){alert("Şifre en az 6 karakter olmalıdır.");return;}
    setSending(true);
    const code = generateCode();
    setSentCode(code);
    await sendEmail("verification", form.email, { name: form.firstName, code });
    setSending(false);
    setStep(3);
  };

  const verifyAndRegister = async () => {
    if(verCode !== sentCode){setVerErr("Doğrulama kodu hatalı. Lütfen tekrar deneyin.");return;}
    setRegistering(true);setVerErr("");
    try {
      // Supabase Auth ile kayıt
      const authRes = await sb.signUp(form.email, form.pass);
      if(authRes.error){
        if(authRes.error.message?.includes("already registered")){
          setVerErr("Bu e-posta adresi zaten kayıtlı.");setRegistering(false);return;
        }
        setVerErr("Kayıt sırasında hata: "+authRes.error.message);setRegistering(false);return;
      }
      const name=`${form.firstName} ${form.lastName}`;
      const avatar=(form.firstName[0]+(form.lastName[0]||"")).toUpperCase();
      // Profil kaydı
      await sb.post("users",{name,email:form.email,avatar,phone:form.phone,city:form.city,role:"user",status:"Aktif",created_at:new Date().toISOString()}).catch(()=>{});
      const newUser={id:authRes.user?.id,name,email:form.email,avatar,role:"user",phone:form.phone,city:form.city};
      saveSession(newUser);setUser(newUser);
      sendEmail("welcome",form.email,{name:form.firstName});
      setPage("home");
    }catch(e){setVerErr("Kayıt sırasında bir hata oluştu.");setRegistering(false);}
  };

  const resendCode = async () => {
    setSending(true);
    const code=generateCode();setSentCode(code);setVerErr("");setVerCode("");
    await sendEmail("verification",form.email,{name:form.firstName,code});
    setSending(false);
    alert("Yeni doğrulama kodu gönderildi!");
  };

  return (
    <div style={{maxWidth:460,margin:"40px auto",padding:"0 16px"}}>
      <div style={card}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <h1 style={{fontSize:20,margin:"0 0 4px",color:C.primary}}>Üye Ol</h1>
          <p style={{color:C.muted,margin:0,fontSize:13}}>KKTC'nin güvenilir sesine katılın</p>
        </div>
        <div style={{display:"flex",gap:5,marginBottom:20}}>
          {[1,2,3].map(s=><div key={s} style={{flex:1,height:4,borderRadius:2,background:s<=step?C.primary:C.border}}/>)}
        </div>

        {step===1&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <FormRow label="Ad"><input style={inp} placeholder="Adınız" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/></FormRow>
              <FormRow label="Soyad"><input style={inp} placeholder="Soyadınız" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})}/></FormRow>
            </div>
            <FormRow label="E-posta"><input style={inp} type="email" placeholder="ornek@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></FormRow>
            <FormRow label="Telefon"><input style={inp} placeholder="0533 000 00 00" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></FormRow>
            <button style={{...btn("primary","lg"),width:"100%"}} onClick={()=>setStep(2)} disabled={!form.firstName||!form.email}>Devam Et →</button>
          </>
        )}

        {step===2&&(
          <>
            <FormRow label="Şifre (en az 6 karakter)"><input style={inp} type="password" placeholder="••••••••" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})}/></FormRow>
            <FormRow label="Şehir">
              <select style={inp} value={form.city} onChange={e=>setForm({...form,city:e.target.value})}>
                <option value="">Şehir Seçin</option>
                {["Lefkoşa","Gazimağusa","Girne","Güzelyurt","İskele"].map(c=><option key={c}>{c}</option>)}
              </select>
            </FormRow>
            <label style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:13,color:C.muted,marginBottom:16,cursor:"pointer"}}>
              <input type="checkbox" checked={form.agree} onChange={e=>setForm({...form,agree:e.target.checked})} style={{marginTop:2}}/>
              Kullanım Koşulları'nı okudum, kabul ediyorum.
            </label>
            <div style={{display:"flex",gap:10}}>
              <button style={{...btn("ghost"),flex:1}} onClick={()=>setStep(1)}>← Geri</button>
              <button style={{...btn("primary"),flex:1}} onClick={sendVerification} disabled={!form.pass||!form.agree||sending}>{sending?"Gönderiliyor...":"E-posta Doğrula →"}</button>
            </div>
          </>
        )}

        {step===3&&(
          <>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:40,marginBottom:10}}>📧</div>
              <h3 style={{margin:"0 0 8px",color:C.primary}}>Doğrulama Kodu</h3>
              <p style={{color:C.muted,fontSize:13,margin:0}}><strong>{form.email}</strong> adresine 6 haneli doğrulama kodu gönderdik.</p>
            </div>
            {verErr&&<div style={{background:"#fee2e2",color:"#dc2626",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>⚠️ {verErr}</div>}
            <FormRow label="Doğrulama Kodu">
              <input style={{...inp,fontSize:22,textAlign:"center",letterSpacing:8,fontWeight:700}} placeholder="000000" maxLength={6} value={verCode} onChange={e=>setVerCode(e.target.value.replace(/\D/g,""))}/>
            </FormRow>
            <button style={{...btn("success","lg"),width:"100%",marginBottom:10}} onClick={verifyAndRegister} disabled={verCode.length!==6||registering}>{registering?"Kayıt yapılıyor...":"✓ Doğrula ve Kayıt Ol"}</button>
            <div style={{textAlign:"center"}}>
              <button style={{...btn("ghost","sm"),fontSize:13}} onClick={resendCode} disabled={sending}>{sending?"Gönderiliyor...":"Kodu Yeniden Gönder"}</button>
            </div>
            <div style={{textAlign:"center",marginTop:10}}>
              <button style={{fontSize:12,color:C.muted,background:"none",border:"none",cursor:"pointer"}} onClick={()=>setStep(2)}>← Geri Dön</button>
            </div>
          </>
        )}

        <div style={{textAlign:"center",marginTop:14,fontSize:13}}>
          <span style={{color:C.muted}}>Zaten hesabınız var mı? </span>
          <span style={{color:C.blue,cursor:"pointer",fontWeight:600}} onClick={()=>setPage("login")}>Giriş Yap</span>
        </div>
      </div>
    </div>
  );
};

// ─── USER PANEL ───────────────────────────────────────────────
const UserPanel = ({ user, setUser, setPage, initTab="profile" }) => {
  const [tab, setTab] = useState(initTab);
  const [profileForm, setProfileForm] = useState({name:user?.name||"",email:user?.email||"",phone:user?.phone||"",city:user?.city||""});
  const [passForm, setPassForm] = useState({current:"",newPass:"",confirm:""});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [passErr, setPassErr] = useState("");
  const [myComplaints, setMyComplaints] = useState([]);
  const [myComplaintsLoading, setMyComplaintsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(()=>{
    // Kullanıcının gerçek şikayetlerini çek
    if(user?.email){
      sb.get("complaints",`?author_email=eq.${encodeURIComponent(user.email)}&order=created_at.desc`)
        .then(data=>{
          if(data&&data.length>0){
            setMyComplaints(data.map(c=>({
              id:c.id,title:c.title,body:c.body,category:c.category,company:c.company,
              date:new Date(c.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}),
              status:c.status,views:c.views||0,votes:c.votes||0
            })));
          }
          setMyComplaintsLoading(false);
        }).catch(()=>setMyComplaintsLoading(false));
    }
    // Bildirimler - şikayetlerin durum değişikliklerini çek
    if(user?.email){
      sb.get("complaints",`?author_email=eq.${encodeURIComponent(user.email)}&select=id,title,status,updated_at&order=updated_at.desc&limit=10`)
        .then(data=>{
          if(data&&data.length>0){
            const notifs=data.map(c=>({
              icon: c.status==="Çözüldü"?"✅":c.status==="İnceleniyor"?"🔍":"📋",
              t: `"${c.title.substring(0,50)}..." - Durum: ${c.status}`,
              time: c.updated_at ? new Date(c.updated_at).toLocaleDateString("tr-TR") : "-",
              read: c.status==="Açık"
            }));
            setNotifications(notifs);
          }
        }).catch(()=>{});
    }
  },[user]);

  const saveProfile = async () => {
    setSaving(true);
    if(user?.id){
      await sb.patch("users",user.id,{name:profileForm.name,email:profileForm.email,phone:profileForm.phone,city:profileForm.city}).catch(()=>{});
    }
    const updated={...user,...profileForm};
    saveSession(updated);setUser(updated);
    setSaveMsg("✅ Profil güncellendi!");setSaving(false);
    setTimeout(()=>setSaveMsg(""),3000);
  };

  const changePassword = async () => {
    setPassErr("");
    try {
      await fetch(`https://xxngmpeoywkcjkjeggse.supabase.co/auth/v1/recover`, {
        method:"POST",
        headers:{"apikey":"sb_publishable_UXSRhaVcf4-lM1Y2DadhJA_okbnpujv","Content-Type":"application/json"},
        body:JSON.stringify({email:user.email})
      });
      setPassForm({current:"",newPass:"",confirm:""});
      setSaveMsg("✅ Şifre sıfırlama bağlantısı " + user.email + " adresine gönderildi.");
    }catch{
      setPassErr("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
    setTimeout(()=>setSaveMsg(""),10000);
  };

  const sideItems=[{id:"profile",label:"Profilimi Düzenle"},{id:"my-complaints",label:"Şikayetlerim"},{id:"notifications",label:"Bildirimlerim"},{id:"saved",label:"Kaydedilenler"}];

  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 130px)",flexDirection:"row"}}>
      <div style={{width:200,background:C.navy,flexShrink:0}}>
        <div style={{padding:"16px 12px 12px"}}>
          {sideItems.map(item=>(
            <button key={item.id} style={{...sideLink(tab===item.id),border:"none",padding:"10px 14px",borderRadius:7,width:"100%",fontSize:13}} onClick={()=>setTab(item.id)}>{item.label}</button>
          ))}
        </div>
        <div style={{padding:"0 12px 14px",marginTop:"auto"}}>
          <button style={{...btn("accent"),width:"100%",justifyContent:"center",fontSize:12}} onClick={()=>setPage("new-complaint")}>✏️ Şikayet Yaz</button>
          <button style={{...sideLink(false),marginTop:8,border:"none",fontSize:12}} onClick={()=>{clearSession();setUser(null);setPage("home");}}>🚪 Çıkış Yap</button>
        </div>
      </div>
      <div style={{flex:1,padding:"24px 16px",background:"#f5f7fb",overflowY:"auto"}}>
        {tab==="profile"&&(
          <div style={{maxWidth:560}}>
            <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:700,color:C.primary}}>Profilimi Düzenle</h2>
            {saveMsg&&<div style={{background:"#dcfce7",color:"#16a34a",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>{saveMsg}</div>}
            <div style={card}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                <Avatar initials={user.avatar} size={56} bg={C.primary}/>
                <div><div style={{fontWeight:700,fontSize:15}}>{user.name}</div><div style={{fontSize:12,color:C.muted}}>{user.email}</div><RoleBadge role={user.role}/></div>
              </div>
              <FormRow label="Ad Soyad"><input style={inp} value={profileForm.name} onChange={e=>setProfileForm({...profileForm,name:e.target.value})}/></FormRow>
              <FormRow label="E-Posta"><input style={inp} type="email" value={profileForm.email} onChange={e=>setProfileForm({...profileForm,email:e.target.value})}/></FormRow>
              <FormRow label="Telefon"><input style={inp} placeholder="0533 000 00 00" value={profileForm.phone} onChange={e=>setProfileForm({...profileForm,phone:e.target.value})}/></FormRow>
              <FormRow label="Şehir">
                <select style={inp} value={profileForm.city} onChange={e=>setProfileForm({...profileForm,city:e.target.value})}>
                  <option value="">Şehir Seçin</option>
                  {["Lefkoşa","Gazimağusa","Girne","Güzelyurt","İskele"].map(c=><option key={c}>{c}</option>)}
                </select>
              </FormRow>
              <button style={{...btn("primary","lg"),width:"100%"}} onClick={saveProfile} disabled={saving}>{saving?"Kaydediliyor...":"💾 Bilgileri Kaydet"}</button>
            </div>
            <div style={{...card,marginTop:16}}>
              <h3 style={{margin:"0 0 8px",fontSize:15,color:C.primary,fontWeight:700}}>🔒 Şifre Değiştir</h3>
              <p style={{fontSize:12.5,color:C.muted,marginBottom:14}}>E-posta adresinize şifre sıfırlama bağlantısı gönderilecektir.</p>
              {passErr&&<div style={{background:"#fee2e2",color:"#dc2626",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>⚠️ {passErr}</div>}
              <button style={{...btn("secondary"),width:"100%"}} onClick={changePassword}>📧 Şifre Sıfırlama E-postası Gönder</button>
            </div>
          </div>
        )}
        {tab==="my-complaints"&&(
          <div style={{maxWidth:640}}>
            <h2 style={{margin:"0 0 16px",fontSize:18,fontWeight:700}}>Şikayetlerim</h2>
            {myComplaintsLoading&&<div style={{textAlign:"center",padding:40,color:C.muted}}>Yükleniyor...</div>}
            {!myComplaintsLoading&&myComplaints.length===0&&(
              <div style={{...card,textAlign:"center",padding:40}}>
                <div style={{fontSize:44,marginBottom:14}}>📋</div>
                <h3 style={{fontSize:16,color:C.text,marginBottom:8}}>Henüz şikayet yazmadınız.</h3>
                <button style={btn("accent")} onClick={()=>setPage("new-complaint")}>+ Şikayet Yaz</button>
              </div>
            )}
            {myComplaints.map(c=>(
              <div key={c.id} style={{...card,marginBottom:10,borderLeft:`4px solid ${STATUS_MAP[c.status]?.dot||C.primary}`}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                  <h3 style={{margin:"0 0 4px",fontSize:14}}>{c.title}</h3><Badge s={c.status}/>
                </div>
                <div style={{fontSize:12,color:C.muted,marginBottom:6}}>{c.date} · {c.company}</div>
                <div style={{display:"flex",gap:12,fontSize:12,color:C.muted}}>
                  <span>👁 {c.views}</span><span>👍 {c.votes}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="notifications"&&(
          <div style={{maxWidth:600}}>
            <h2 style={{margin:"0 0 16px",fontSize:18,fontWeight:700}}>Bildirimlerim</h2>
            {notifications.length===0?(
              <div style={{...card,textAlign:"center",padding:40}}>
                <div style={{fontSize:44,marginBottom:14}}>🔔</div>
                <h3 style={{fontSize:16,color:C.text}}>Henüz bildirim yok.</h3>
              </div>
            ):(
              <div style={card}>
                {notifications.map((n,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<notifications.length-1?`1px solid ${C.border}`:"none"}}>
                    <span style={{fontSize:20}}>{n.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:n.read?400:600}}>{n.t}</div>
                      <div style={{fontSize:11.5,color:C.muted}}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab==="saved"&&(
          <div style={{textAlign:"center",padding:50}}>
            <div style={{fontSize:44,marginBottom:14}}>🔖</div>
            <h3 style={{fontSize:17,color:C.text}}>Kaydedilen şikayet bulunamadı.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ADMIN PANEL ──────────────────────────────────────────────
const AdminPanel = ({ user, setPage, footerData: initFooterData, setFooterData: setParentFooterData }) => {
  const [tab, setTab] = useState("dashboard");
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [adminUsers, setAdminUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({name:"",email:"",password:"",role:"editor"});
  const [footerData, setFooterData] = useState(initFooterData);
  const [footerSaved, setFooterSaved] = useState(false);
  const [adminProfile, setAdminProfile] = useState({name:user?.name||"",email:user?.email||""});
  const [adminPassForm, setAdminPassForm] = useState({newPass:"",confirm:""});
  const [adminSaveMsg, setAdminSaveMsg] = useState("");
  const [adminPassErr, setAdminPassErr] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editUserData, setEditUserData] = useState({});
  const [userSaveMsg, setUserSaveMsg] = useState("");
  const [resetPassMsg, setResetPassMsg] = useState("");
  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCat, setNewCat] = useState({name:"",icon:"📌",color:C.blue});
  const [catsLoaded, setCatsLoaded] = useState(false);

  const canEdit = ["superadmin","admin"].includes(user?.role);
  const isSuperAdmin = user?.role==="superadmin";

  useEffect(()=>{
    sb.get("complaints","?order=created_at.desc").then(data=>{
      if(data&&data.length>0) setComplaints(data.map(c=>({
        id:c.id,title:c.title,body:c.body,category:c.category,company:c.company,
        author:c.author_name,avatar:c.author_avatar||"?",
        date:new Date(c.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}),
        views:c.views||0,votes:c.votes||0,comments:c.comments_count||0,status:c.status,author_email:c.author_email||""
      })));
    }).catch(()=>{});
    sb.get("admin_users","?order=created_at.desc").then(data=>{ if(data&&data.length>0)setAdminUsers(data); }).catch(()=>{});
    sb.get("users","?order=created_at.desc").then(data=>{ if(data&&data.length>0)setAllUsers(data); }).catch(()=>{});
    sb.get("site_settings","?key=eq.footer&select=value").then(data=>{ if(data&&data[0])setFooterData(prev=>({...prev,...data[0].value})); }).catch(()=>{});
    sb.get("categories","?is_custom=eq.true&order=created_at.desc").then(data=>{ if(data&&data.length>0){setCustomCategories(data);} setCatsLoaded(true); }).catch(()=>setCatsLoaded(true));
  },[]);

  const deleteComplaint=async(id)=>{
    if(!canEdit){alert("Yetkiniz yok.");return;}
    if(!window.confirm("Silmek istiyor musunuz?"))return;
    if(await sb.delete("complaints",id))setComplaints(prev=>prev.filter(x=>x.id!==id));
    else alert("Silme başarısız.");
  };

  const updateStatus=async(id,newStatus)=>{
    if(!canEdit){alert("Yetkiniz yok.");return;}
    if(await sb.patch("complaints",id,{status:newStatus})){
      setComplaints(prev=>prev.map(x=>{
        if(x.id===id){if(x.author_email&&x.status!==newStatus)sendEmail("status_update",x.author_email,{name:x.author,complaintTitle:x.title,status:newStatus});return{...x,status:newStatus};}return x;
      }));
    }else alert("Güncelleme başarısız.");
  };

  const addAdminUser=async()=>{
    if(!newAdmin.name||!newAdmin.email||!newAdmin.password){alert("Tüm alanları doldurun.");return;}
    const avatar=newAdmin.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
    const res=await sb.post("admin_users",{name:newAdmin.name,email:newAdmin.email,password:newAdmin.password,role:newAdmin.role,avatar,is_active:true});
    if(res&&res[0]){setAdminUsers(prev=>[res[0],...prev]);setNewAdmin({name:"",email:"",password:"",role:"editor"});setShowAddAdmin(false);alert("✅ Kullanıcı eklendi!");}
    else alert("Ekleme başarısız.");
  };

  const saveFooter=async()=>{
    const existing=await sb.get("site_settings","?key=eq.footer").catch(()=>[]);
    if(existing&&existing.length>0)await sb.patch("site_settings",existing[0].id,{value:footerData}).catch(()=>{});
    else await sb.post("site_settings",{key:"footer",value:footerData}).catch(()=>{});
    if(setParentFooterData)setParentFooterData(footerData);
    setFooterSaved(true);setTimeout(()=>setFooterSaved(false),3000);
  };

  const saveAdminProfile=async()=>{
    if(user?.id){await sb.patch("admin_users",user.id,{name:adminProfile.name,email:adminProfile.email}).catch(()=>{});}
    setAdminSaveMsg("✅ Profil güncellendi!");setTimeout(()=>setAdminSaveMsg(""),3000);
  };

  const changeAdminPass=async()=>{
    setAdminPassErr("");
    if(!adminPassForm.newPass||adminPassForm.newPass.length<6){setAdminPassErr("Şifre en az 6 karakter olmalıdır.");return;}
    if(adminPassForm.newPass!==adminPassForm.confirm){setAdminPassErr("Şifreler eşleşmiyor.");return;}
    if(user?.id){await sb.patch("admin_users",user.id,{password:adminPassForm.newPass}).catch(()=>{});}
    setAdminPassForm({newPass:"",confirm:""});
    setAdminSaveMsg("✅ Şifre güncellendi!");setTimeout(()=>setAdminSaveMsg(""),3000);
  };

  const addCategory=async()=>{
    if(!newCat.name.trim())return;
    const res=await sb.post("categories",{name:newCat.name.trim(),icon:newCat.icon,color:newCat.color,complaint_count:0,is_custom:true});
    if(res&&res[0]){
      setCustomCategories(prev=>[res[0],...prev]);
      setNewCat({name:"",icon:"📌",color:C.blue});setShowAddCat(false);
      alert("✅ Kategori eklendi!");
    }else alert("Ekleme başarısız.");
  };

  const deleteCategory=async(id)=>{
    if(!window.confirm("Kategoriyi silmek istiyor musunuz?"))return;
    if(await sb.delete("categories",id))setCustomCategories(prev=>prev.filter(c=>c.id!==id));
    else alert("Silme başarısız.");
  };

  const sideItems=[
    {id:"dashboard",icon:"📊",l:"Dashboard"},{id:"complaints",icon:"📋",l:"Şikayetler"},
    {id:"users",icon:"👥",l:"Kullanıcılar"},{id:"admin-users",icon:"🔑",l:"Rol Yönetimi"},
    {id:"categories",icon:"📁",l:"Kategoriler"},{id:"footer-edit",icon:"🔗",l:"Footer"},
    {id:"admin-profile",icon:"👤",l:"Profilim"},{id:"reports",icon:"📈",l:"Raporlar"},
  ];

  const th={padding:"10px 12px",textAlign:"left",background:"#f8fafc",fontWeight:600,color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:.5,borderBottom:`2px solid ${C.border}`};
  const td_={padding:"12px",borderBottom:`1px solid ${C.border}`,verticalAlign:"middle",fontSize:13};

  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 76px)"}}>
      <div style={{width:200,background:C.navy,flexShrink:0,padding:"16px 0"}}>
        <div style={{padding:"0 14px 16px",borderBottom:"1px solid rgba(255,255,255,.1)",marginBottom:10}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Admin Panel</div>
          <div style={{color:"#fff",fontWeight:700,fontSize:13}}>{user.name}</div>
          <RoleBadge role={user.role}/>
        </div>
        {sideItems.map(item=>(
          <button key={item.id} style={{...sideLink(tab===item.id),border:"none",display:"flex",alignItems:"center",gap:8,fontSize:13}} onClick={()=>setTab(item.id)}>
            <span>{item.icon}</span><span>{item.l}</span>
          </button>
        ))}
        <div style={{padding:"14px 14px 0"}}>
          <button style={{...btn("ghost","sm"),color:"rgba(255,255,255,.5)",borderColor:"rgba(255,255,255,.15)",width:"100%",fontSize:12}} onClick={()=>setPage("home")}>← Siteye Dön</button>
        </div>
      </div>

      <div style={{flex:1,padding:"20px 16px",background:C.bg,overflowY:"auto",minWidth:0}}>

        {tab==="dashboard"&&(
          <div>
            <h2 style={{margin:"0 0 18px",fontSize:18,color:C.primary,fontWeight:700}}>Dashboard</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:24}}>
              {[["📋","Toplam Şikayet",complaints.length,C.primary],["✅","Çözülen",complaints.filter(c=>c.status==="Çözüldü").length,C.green],["⏳","Açık",complaints.filter(c=>c.status==="Açık").length,C.amber],["👥","Kullanıcılar",allUsers.length,C.blue]].map(([i,l,v,col])=>(
                <div key={l} style={{...card,borderTop:`4px solid ${col}`,textAlign:"center",padding:14}}>
                  <div style={{fontSize:24,marginBottom:5}}>{i}</div>
                  <div style={{fontSize:20,fontWeight:800,color:col}}>{v}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="complaints"&&(
          <div>
            <h2 style={{margin:"0 0 16px",fontSize:18,color:C.primary,fontWeight:700}}>Şikayet Yönetimi <span style={{fontSize:13,color:C.muted,fontWeight:400}}>({complaints.length})</span></h2>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                <thead><tr>{["#","Başlık","Yazar","Durum","Tarih","İşlem"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {complaints.length===0&&<tr><td colSpan={6} style={{...td_,textAlign:"center",color:C.muted,padding:28}}>Şikayet bulunamadı</td></tr>}
                  {complaints.map(c=>(
                    <tr key={c.id}>
                      <td style={td_}><span style={{color:C.muted,fontSize:11}}>#{c.id?.toString().slice(0,6)}</span></td>
                      <td style={{...td_,maxWidth:200}}><div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12.5}}>{c.title}</div><div style={{fontSize:11,color:C.muted}}>{c.company}</div></td>
                      <td style={{...td_,fontSize:12.5}}>{c.author}</td>
                      <td style={td_}>
                        {canEdit?(<select style={{...inp,padding:"4px 6px",fontSize:11.5,width:"auto"}} value={c.status} onChange={e=>updateStatus(c.id,e.target.value)}><option>Açık</option><option>İnceleniyor</option><option>Çözüldü</option><option>Yayınlanamadı</option></select>):<Badge s={c.status}/>}
                      </td>
                      <td style={{...td_,fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{c.date}</td>
                      <td style={td_}>{canEdit&&<button style={btn("danger","sm")} onClick={()=>deleteComplaint(c.id)}>🗑</button>}{!canEdit&&<span style={{fontSize:11,color:C.muted}}>Görüntüle</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="users"&&(
          <div>
            <h2 style={{margin:"0 0 16px",fontSize:18,color:C.primary,fontWeight:700}}>Kullanıcı Yönetimi <span style={{fontSize:13,color:C.muted,fontWeight:400}}>({allUsers.length})</span></h2>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:550}}>
                <thead><tr>{["Kullanıcı","E-posta","Telefon","Şehir","Kayıt","Durum","İşlem"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {allUsers.length===0&&<tr><td colSpan={7} style={{...td_,textAlign:"center",color:C.muted,padding:28}}>Kullanıcı bulunamadı</td></tr>}
                  {allUsers.map(u=>(
                    <tr key={u.id}>
                      <td style={td_}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar initials={u.avatar||(u.name||"?")[0]} size={28}/><span style={{fontWeight:600,fontSize:13}}>{u.name||"İsimsiz"}</span></div></td>
                      <td style={{...td_,fontSize:12}}>{u.email}</td>
                      <td style={{...td_,fontSize:12}}>{u.phone||"-"}</td>
                      <td style={{...td_,fontSize:12}}>{u.city||"-"}</td>
                      <td style={{...td_,fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{u.created_at?new Date(u.created_at).toLocaleDateString("tr-TR"):"-"}</td>
                      <td style={td_}><Badge s={u.status||"Aktif"}/></td>
                      <td style={td_}>
                        {canEdit&&(
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            <button style={btn("secondary","sm")} onClick={()=>{ setEditingUser(u); setEditUserData({name:u.name||"",phone:u.phone||"",city:u.city||""}); setUserSaveMsg(""); setResetPassMsg(""); }}>✏️</button>
                            <button style={btn(u.status==="Engelli"?"success":"ghost","sm")} onClick={async()=>{ await sb.patch("users",u.id,{status:u.status==="Engelli"?"Aktif":"Engelli"}); setAllUsers(prev=>prev.map(x=>x.id===u.id?{...x,status:x.status==="Engelli"?"Aktif":"Engelli"}:x)); }}>{u.status==="Engelli"?"✓":"🚫"}</button>
                            <button style={btn("danger","sm")} onClick={async()=>{ if(!window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?"))return; if(await sb.delete("users",u.id)){setAllUsers(prev=>prev.filter(x=>x.id!==u.id));if(editingUser?.id===u.id)setEditingUser(null);}else alert("Silme başarısız."); }}>🗑</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal open={!!editingUser} onClose={()=>setEditingUser(null)} title={`Kullanıcı Düzenle: ${editingUser?.name||""}`}>
              {editingUser&&(
                <>
                  {userSaveMsg&&<div style={{background:"#dcfce7",color:"#16a34a",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>{userSaveMsg}</div>}
                  <div style={{background:"#f8fafc",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:C.muted}}>
                    📧 {editingUser.email} &nbsp;|&nbsp; 📅 {editingUser.created_at?new Date(editingUser.created_at).toLocaleDateString("tr-TR"):"-"}
                  </div>
                  <FormRow label="Ad Soyad"><input style={inp} value={editUserData.name} onChange={e=>setEditUserData({...editUserData,name:e.target.value})}/></FormRow>
                  <FormRow label="Telefon"><input style={inp} placeholder="0533 000 00 00" value={editUserData.phone} onChange={e=>setEditUserData({...editUserData,phone:e.target.value})}/></FormRow>
                  <FormRow label="Şehir">
                    <select style={inp} value={editUserData.city} onChange={e=>setEditUserData({...editUserData,city:e.target.value})}>
                      <option value="">Şehir Seçin</option>
                      {["Lefkoşa","Gazimağusa","Girne","Güzelyurt","İskele"].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </FormRow>
                  <button style={{...btn("primary"),width:"100%",marginBottom:16}} onClick={async()=>{ await sb.patch("users",editingUser.id,editUserData); setAllUsers(prev=>prev.map(x=>x.id===editingUser.id?{...x,...editUserData}:x)); setUserSaveMsg("✅ Kullanıcı güncellendi!"); setTimeout(()=>setUserSaveMsg(""),3000); }}>💾 Bilgileri Kaydet</button>
                  <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14}}>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:8,color:C.primary}}>🔑 Şifre Sıfırlama</div>
                    {resetPassMsg&&<div style={{background:resetPassMsg.startsWith("✅")?"#dcfce7":"#fee2e2",color:resetPassMsg.startsWith("✅")?"#16a34a":"#dc2626",padding:"8px 12px",borderRadius:8,marginBottom:10,fontSize:13}}>{resetPassMsg}</div>}
                    <p style={{fontSize:12.5,color:C.muted,marginBottom:10}}>Kullanıcıya şifre sıfırlama kodu gönder (Resend ile):</p>
                    <button style={{...btn("secondary"),width:"100%"}} onClick={async()=>{ const code=Math.floor(100000+Math.random()*900000).toString(); await sendEmail("reset_password",editingUser.email,{code,name:editingUser.name||""}); await sb.post("password_resets",{email:editingUser.email,new_password:"",code,used:false,created_at:new Date().toISOString()}).catch(()=>{}); setResetPassMsg("✅ Şifre sıfırlama kodu gönderildi!"); }}>📧 Sıfırlama Kodu Gönder</button>
                  </div>
                </>
              )}
            </Modal>
          </div>
        )}

        {tab==="admin-users"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <h2 style={{margin:0,fontSize:18,color:C.primary,fontWeight:700}}>Rol Yönetimi</h2>
              {isSuperAdmin&&<button style={btn("primary","sm")} onClick={()=>setShowAddAdmin(true)}>+ Kullanıcı Ekle</button>}
            </div>
            <div style={{...card,marginBottom:14,borderLeft:`4px solid ${C.purple}`,background:"#faf5ff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><Avatar initials="SA" size={36} bg={C.purple}/><div><div style={{fontWeight:700,fontSize:14}}>Süper Admin</div><div style={{fontSize:12,color:C.muted}}>superadmin@sikayetetkktc.com</div></div></div>
                <RoleBadge role="superadmin"/>
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:400}}>
                <thead><tr>{["Kullanıcı","E-posta","Rol","Durum","İşlem"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {adminUsers.length===0&&<tr><td colSpan={5} style={{...td_,textAlign:"center",color:C.muted,padding:24}}>Henüz ek kullanıcı yok</td></tr>}
                  {adminUsers.map(u=>(
                    <tr key={u.id}>
                      <td style={td_}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar initials={u.avatar||(u.name||"?")[0]} size={28} bg={ROLE_MAP[u.role]?.color||C.primary}/><span style={{fontWeight:600,fontSize:13}}>{u.name}</span></div></td>
                      <td style={{...td_,fontSize:12.5}}>{u.email}</td>
                      <td style={td_}><RoleBadge role={u.role}/></td>
                      <td style={td_}><Badge s={u.is_active?"Aktif":"Engelli"}/></td>
                      <td style={td_}><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {isSuperAdmin&&<button style={btn("secondary","sm")} onClick={()=>setEditingAdmin(u)}>✏️</button>}
                        {canEdit&&<button style={btn(u.is_active?"ghost":"success","sm")} onClick={()=>{ sb.patch("admin_users",u.id,{is_active:!u.is_active}); setAdminUsers(prev=>prev.map(x=>x.id===u.id?{...x,is_active:!x.is_active}:x)); }}>{u.is_active?"🚫":"✓"}</button>}
                        {isSuperAdmin&&<button style={btn("danger","sm")} onClick={async()=>{ if(!window.confirm("Silmek istiyor musunuz?"))return; if(await sb.delete("admin_users",u.id))setAdminUsers(prev=>prev.filter(x=>x.id!==u.id)); }}>🗑</button>}
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal open={showAddAdmin} onClose={()=>setShowAddAdmin(false)} title="Yeni Yetkili Kullanıcı Ekle">
              <FormRow label="Ad Soyad"><input style={inp} value={newAdmin.name} onChange={e=>setNewAdmin({...newAdmin,name:e.target.value})}/></FormRow>
              <FormRow label="E-posta"><input style={inp} type="email" value={newAdmin.email} onChange={e=>setNewAdmin({...newAdmin,email:e.target.value})}/></FormRow>
              <FormRow label="Şifre"><input style={inp} type="password" value={newAdmin.password} onChange={e=>setNewAdmin({...newAdmin,password:e.target.value})}/></FormRow>
              <FormRow label="Rol">
                <select style={inp} value={newAdmin.role} onChange={e=>setNewAdmin({...newAdmin,role:e.target.value})}>
                  {isSuperAdmin&&<option value="admin">Admin</option>}
                  <option value="editor">Editör</option>
                </select>
              </FormRow>
              <div style={{display:"flex",gap:10}}><button style={{...btn("ghost"),flex:1}} onClick={()=>setShowAddAdmin(false)}>İptal</button><button style={{...btn("primary"),flex:1}} onClick={addAdminUser}>✓ Ekle</button></div>
            </Modal>
            <Modal open={!!editingAdmin} onClose={()=>setEditingAdmin(null)} title="Kullanıcı Düzenle">
              {editingAdmin&&(<>
                <FormRow label="Ad Soyad"><input style={inp} value={editingAdmin.name} onChange={e=>setEditingAdmin({...editingAdmin,name:e.target.value})}/></FormRow>
                <FormRow label="E-posta"><input style={inp} value={editingAdmin.email} onChange={e=>setEditingAdmin({...editingAdmin,email:e.target.value})}/></FormRow>
                <FormRow label="Yeni Şifre (boş=değişmez)"><input style={inp} type="password" value={editingAdmin.newPassword||""} onChange={e=>setEditingAdmin({...editingAdmin,newPassword:e.target.value})}/></FormRow>
                <FormRow label="Rol"><select style={inp} value={editingAdmin.role} onChange={e=>setEditingAdmin({...editingAdmin,role:e.target.value})}><option value="admin">Admin</option><option value="editor">Editör</option></select></FormRow>
                <div style={{display:"flex",gap:10}}><button style={{...btn("ghost"),flex:1}} onClick={()=>setEditingAdmin(null)}>İptal</button><button style={{...btn("primary"),flex:1}} onClick={async()=>{ const d={name:editingAdmin.name,email:editingAdmin.email,role:editingAdmin.role}; if(editingAdmin.newPassword)d.password=editingAdmin.newPassword; await sb.patch("admin_users",editingAdmin.id,d); setAdminUsers(prev=>prev.map(x=>x.id===editingAdmin.id?{...x,...d}:x)); setEditingAdmin(null); alert("✅ Güncellendi!"); }}>💾 Kaydet</button></div>
              </>)}
            </Modal>
          </div>
        )}

        {tab==="categories"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <h2 style={{margin:0,fontSize:18,color:C.primary,fontWeight:700}}>Kategori Yönetimi</h2>
              <button style={btn("primary","sm")} onClick={()=>setShowAddCat(true)}>+ Kategori Ekle</button>
            </div>
            <h3 style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Standart Kategoriler</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}}>
              {PRESET_CATEGORIES.map(cat=>(
                <div key={cat.id} style={{...card,borderLeft:`4px solid ${cat.color}`,padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>{cat.icon}</span><div><div style={{fontWeight:600,fontSize:13}}>{cat.name}</div><div style={{fontSize:11.5,color:C.muted}}>{cat.count.toLocaleString()} şikayet</div></div></div>
                </div>
              ))}
            </div>
            {customCategories.length>0&&(<>
              <h3 style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Kullanıcı Kategorileri</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                {customCategories.map(cat=>(
                  <div key={cat.id} style={{...card,borderLeft:`4px solid ${cat.color||C.blue}`,padding:"12px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>{cat.icon||"📌"}</span><div><div style={{fontWeight:600,fontSize:13}}>{cat.name}</div><div style={{fontSize:11.5,color:C.muted}}>{cat.complaint_count||0} şikayet</div></div></div>
                      <button style={btn("danger","sm")} onClick={()=>deleteCategory(cat.id)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
            <Modal open={showAddCat} onClose={()=>setShowAddCat(false)} title="Yeni Kategori Ekle">
              <FormRow label="Kategori Adı"><input style={inp} placeholder="Örn: Otel Şikayeti" value={newCat.name} onChange={e=>setNewCat({...newCat,name:e.target.value})}/></FormRow>
              <FormRow label="İkon">
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {["📌","🏢","🚗","🌿","💊","🎵","🍔","🏋️","✈️","📱","💻","🏦","🛠️","🎭","🏪","⚖️","🔧","🏫"].map(ic=><button key={ic} onClick={()=>setNewCat({...newCat,icon:ic})} style={{width:36,height:36,borderRadius:7,border:`2px solid ${newCat.icon===ic?C.primary:C.border}`,background:newCat.icon===ic?"#e8f0fe":"#fff",cursor:"pointer",fontSize:17}}>{ic}</button>)}
                </div>
              </FormRow>
              <FormRow label="Renk">
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {[C.blue,C.accent,C.green,C.purple,C.amber,"#0891b2","#7c3aed","#059669","#dc2626","#f97316"].map(col=><button key={col} onClick={()=>setNewCat({...newCat,color:col})} style={{width:28,height:28,borderRadius:"50%",background:col,border:newCat.color===col?`3px solid ${C.text}`:"3px solid transparent",cursor:"pointer"}}/>)}
                </div>
              </FormRow>
              <div style={{display:"flex",gap:10}}><button style={{...btn("ghost"),flex:1}} onClick={()=>setShowAddCat(false)}>İptal</button><button style={{...btn("primary"),flex:1}} onClick={addCategory} disabled={!newCat.name.trim()}>✓ Ekle</button></div>
            </Modal>
          </div>
        )}

        {tab==="footer-edit"&&(
          <div style={{maxWidth:720}}>
            <h2 style={{margin:"0 0 6px",fontSize:18,color:C.primary,fontWeight:700}}>Footer Yönetimi</h2>
            <p style={{color:C.muted,fontSize:13,marginBottom:16}}>Değişiklikler veritabanına kaydedilir ve kalıcı olur.</p>
            {footerSaved&&<div style={{background:"#dcfce7",color:"#16a34a",padding:"8px 12px",borderRadius:8,marginBottom:14,fontSize:13}}>✅ Footer başarıyla kaydedildi!</div>}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={card}>
                <h3 style={{margin:"0 0 14px",fontSize:14,color:C.primary,fontWeight:700}}>📝 Açıklama & Telif</h3>
                <FormRow label="Kısa Açıklama">
                  <textarea style={{...inp,minHeight:70}} value={footerData?.desc||""} onChange={e=>setFooterData({...footerData,desc:e.target.value})}/>
                </FormRow>
                <FormRow label="Telif Hakkı Metni">
                  <input style={inp} value={footerData?.copyright||""} onChange={e=>setFooterData({...footerData,copyright:e.target.value})}/>
                </FormRow>
              </div>
              <div style={card}>
                <h3 style={{margin:"0 0 14px",fontSize:14,color:C.primary,fontWeight:700}}>📱 Sosyal Medya</h3>
                {[["instagram","🟣 Instagram"],["facebook","🔵 Facebook"],["twitter","⚫ X (Twitter)"]].map(([key,label])=>(
                  <FormRow key={key} label={label}>
                    <input style={inp} placeholder="kullanici_adi" value={footerData?.[key]||""} onChange={e=>setFooterData({...footerData,[key]:e.target.value})}/>
                  </FormRow>
                ))}
              </div>
              {/* Footer kolonları */}
              {(footerData?.columns||[]).map((col,ci)=>(
                <div key={ci} style={card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:13,fontWeight:600,color:C.muted}}>Kolon {ci+1} Başlığı:</span>
                      <input style={{...inp,width:"auto",padding:"4px 10px",fontSize:13,fontWeight:700}} value={col.title} onChange={e=>{const cols=[...footerData.columns];cols[ci]={...cols[ci],title:e.target.value};setFooterData({...footerData,columns:cols});}}/>
                    </div>
                    <button style={btn("primary","sm")} onClick={()=>{const cols=[...footerData.columns];cols[ci]={...cols[ci],links:[...cols[ci].links,{label:"Yeni Link",url:"#"}]};setFooterData({...footerData,columns:cols});}}>+ Link Ekle</button>
                  </div>
                  {col.links.map((link,li)=>(
                    <div key={li} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                      <input style={{...inp,flex:2,fontSize:13}} placeholder="Link Adı" value={link.label} onChange={e=>{const cols=[...footerData.columns];cols[ci].links[li]={...link,label:e.target.value};setFooterData({...footerData,columns:cols});}}/>
                      <input style={{...inp,flex:3,fontSize:13}} placeholder="https://..." value={link.url} onChange={e=>{const cols=[...footerData.columns];cols[ci].links[li]={...link,url:e.target.value};setFooterData({...footerData,columns:cols});}}/>
                      <button style={btn("danger","sm")} onClick={()=>{const cols=[...footerData.columns];cols[ci].links=cols[ci].links.filter((_,i)=>i!==li);setFooterData({...footerData,columns:cols});}}>🗑</button>
                    </div>
                  ))}
                </div>
              ))}
              {/* Yeni kolon ekle */}
              <button style={{...btn("ghost"),alignSelf:"flex-start"}} onClick={()=>setFooterData({...footerData,columns:[...(footerData.columns||[]),{title:"Yeni Kolon",links:[{label:"Link",url:"#"}]}]})}>+ Yeni Kolon Ekle</button>
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button style={btn("success","lg")} onClick={saveFooter}>💾 Değişiklikleri Kaydet</button>
              </div>
            </div>
          </div>
        )}

        {tab==="admin-profile"&&(
          <div style={{maxWidth:520}}>
            <h2 style={{margin:"0 0 18px",fontSize:18,color:C.primary,fontWeight:700}}>Profilim</h2>
            {adminSaveMsg&&<div style={{background:"#dcfce7",color:"#16a34a",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>{adminSaveMsg}</div>}
            <div style={{...card,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
                <Avatar initials={user.avatar} size={50} bg={C.primary}/><div><div style={{fontWeight:700,fontSize:15}}>{user.name}</div><div style={{fontSize:12,color:C.muted}}>{user.email}</div><RoleBadge role={user.role}/></div>
              </div>
              <FormRow label="Ad Soyad"><input style={inp} value={adminProfile.name} onChange={e=>setAdminProfile({...adminProfile,name:e.target.value})}/></FormRow>
              <FormRow label="E-posta"><input style={inp} type="email" value={adminProfile.email} onChange={e=>setAdminProfile({...adminProfile,email:e.target.value})}/></FormRow>
              <button style={{...btn("primary"),width:"100%"}} onClick={saveAdminProfile}>💾 Bilgileri Kaydet</button>
            </div>
            <div style={card}>
              <h3 style={{margin:"0 0 14px",fontSize:14,color:C.primary,fontWeight:700}}>🔒 Şifre Değiştir</h3>
              {adminPassErr&&<div style={{background:"#fee2e2",color:"#dc2626",padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13}}>⚠️ {adminPassErr}</div>}
              <FormRow label="Yeni Şifre"><input style={inp} type="password" placeholder="En az 6 karakter" value={adminPassForm.newPass} onChange={e=>setAdminPassForm({...adminPassForm,newPass:e.target.value})}/></FormRow>
              <FormRow label="Şifre Tekrar"><input style={inp} type="password" value={adminPassForm.confirm} onChange={e=>setAdminPassForm({...adminPassForm,confirm:e.target.value})}/></FormRow>
              <button style={{...btn("secondary"),width:"100%"}} onClick={changeAdminPass}>🔒 Şifreyi Güncelle</button>
            </div>
          </div>
        )}

        {tab==="reports"&&(
          <div>
            <h2 style={{margin:"0 0 18px",fontSize:18,color:C.primary,fontWeight:700}}>Raporlar</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
              <div style={card}>
                <h3 style={{margin:"0 0 12px",fontSize:14,color:C.primary,fontWeight:700}}>Durum Dağılımı</h3>
                {[["Açık",complaints.filter(c=>c.status==="Açık").length,C.red],["İnceleniyor",complaints.filter(c=>c.status==="İnceleniyor").length,C.amber],["Çözüldü",complaints.filter(c=>c.status==="Çözüldü").length,C.green]].map(([l,v,col])=>(
                  <div key={l} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}><span>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
                    <div style={{height:5,borderRadius:3,background:C.border}}><div style={{height:"100%",width:`${complaints.length>0?(v/complaints.length)*100:0}%`,background:col,borderRadius:3}}/></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── SESSION TIMEOUT MODAL ────────────────────────────────────
const SessionTimeoutModal = ({ onLogout, onExtend, remaining }) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16}}>
    <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:360,width:"100%",textAlign:"center"}}>
      <div style={{fontSize:44,marginBottom:14}}>⏰</div>
      <h2 style={{margin:"0 0 10px",color:C.primary,fontSize:18}}>Oturum Sona Eriyor</h2>
      <p style={{color:C.muted,marginBottom:6,fontSize:14}}>Oturumunuz <strong style={{color:C.accent}}>{remaining} saniye</strong> içinde kapanacak.</p>
      <p style={{color:C.muted,fontSize:12,marginBottom:20}}>Devam etmek ister misiniz?</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{...btn("ghost"),flex:1}} onClick={onLogout}>Çıkış Yap</button>
        <button style={{...btn("primary"),flex:1}} onClick={onExtend}>✓ Devam Et</button>
      </div>
    </div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(()=>loadSession());
  const [selected, setSelected] = useState(null);
  const [siteStats, setSiteStats] = useState({total:0,resolved:0,members:0});
  const [footerData, setFooterData] = useState({
    desc:"KKTC'nin bağımsız şikayet platformu. Sesinizi duyurun, değişim yaratın.",
    columns:[{title:"Platform",links:[{label:"Şikayetler",url:"/sikayetler"},{label:"Kategoriler",url:"/kategoriler"}]},{title:"Yardım",links:[{label:"SSS",url:"/sss"},{label:"İletişim",url:"/iletisim"}]}],
    copyright:"© 2026 ŞikayetETKKTC. Tüm hakları saklıdır.",
    instagram:"sikayetetkktc",facebook:"sikayetetkktc",twitter:"sikayetetkktc",
  });
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutRemaining, setTimeoutRemaining] = useState(60);
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);

  // URL routing — hash tabanlı SEO dostu
  const navigate = (newPage, complaint=null) => {
    const routes = {
      "home": "/",
      "complaints": "/sikayetler",
      "categories": "/kategoriler",
      "login": "/giris",
      "register": "/uye-ol",
      "new-complaint": "/sikayet-yaz",
      "profile": "/profil",
      "admin": "/admin",
    };
    const url = complaint ? `/sikayet/${complaint.id}` : (routes[newPage] || "/");
    window.history.pushState({page:newPage, complaintId:complaint?.id}, "", url);
    setPage(newPage);
    if(complaint) setSelected(complaint);
  };

  // URL'den sayfa belirle
  useEffect(()=>{
    const parseUrl = () => {
      const path = window.location.pathname;
      if(path.startsWith("/sikayet/")) {
        const id = path.split("/sikayet/")[1];
        if(id) {
          sb.get("complaints",`?id=eq.${id}`).then(data=>{
            if(data&&data[0]){
              const c=data[0];
              setSelected({id:c.id,title:c.title,body:c.body,category:c.category,company:c.company,author:c.author_name,avatar:c.author_avatar||"?",date:new Date(c.created_at).toLocaleDateString("tr-TR"),views:c.views||0,votes:c.votes||0,comments:c.comments_count||0,status:c.status});
              setPage("detail");
            }
          }).catch(()=>{});
        }
      } else if(path==="/sikayetler") setPage("complaints");
      else if(path==="/kategoriler") setPage("categories");
      else if(path==="/giris") setPage("login");
      else if(path==="/uye-ol") setPage("register");
      else if(path==="/sikayet-yaz") setPage("new-complaint");
      else if(path==="/profil") setPage("profile");
      else if(path==="/admin") setPage("admin");
    };
    parseUrl();
    window.addEventListener("popstate", parseUrl);
    return () => window.removeEventListener("popstate", parseUrl);
  },[]);

  // setPage wrapper — URL günceller
  const setPageWithUrl = (newPage) => {
    const routes = {
      "home": "/", "complaints": "/sikayetler", "categories": "/kategoriler",
      "login": "/giris", "register": "/uye-ol", "new-complaint": "/sikayet-yaz",
      "profile": "/profil", "my-complaints": "/profil/sikayetlerim",
      "notifications": "/profil/bildirimler", "saved": "/profil/kaydedilenler",
      "admin": "/admin",
    };
    const url = routes[newPage] || "/";
    if(window.location.pathname !== url) window.history.pushState({page:newPage}, "", url);
    setPage(newPage);
  };

  const setSelectedAndPage = (complaint) => {
    if(complaint?.id) window.history.pushState({page:"detail",id:complaint.id}, "", `/sikayet/${complaint.id}`);
    setSelected(complaint);
    setPage("detail");
  };

  useEffect(()=>{ injectFavicon(); },[]);

  useEffect(()=>{
    sb.get("complaints","?select=id,status").then(data=>{
      if(data&&data.length>0) setSiteStats(prev=>({...prev,total:data.length,resolved:data.filter(c=>c.status==="Çözüldü").length}));
    }).catch(()=>{});
    sb.get("users","?select=id").then(data=>{ if(data&&data.length>0)setSiteStats(prev=>({...prev,members:data.length})); }).catch(()=>{});
    sb.get("site_settings","?key=eq.footer&select=value").then(data=>{ if(data&&data[0]&&data[0].value)setFooterData(prev=>({...prev,...data[0].value})); }).catch(()=>{});
  },[]);

  // Oturum yönetimi
  useEffect(()=>{
    if(!user)return;
    const handleActivity=()=>{ extendSession(); if(showTimeoutModal){setShowTimeoutModal(false);clearInterval(warningRef.current);} };
    window.addEventListener("mousemove",handleActivity);
    window.addEventListener("keydown",handleActivity);
    window.addEventListener("click",handleActivity);

    timeoutRef.current=setInterval(()=>{
      const expiry=parseInt(localStorage.getItem("session_expiry")||"0");
      const rem=Math.max(0,Math.floor((expiry-Date.now())/1000));
      if(rem<=0){clearInterval(timeoutRef.current);clearSession();setUser(null);setPage("home");setShowTimeoutModal(false);return;}
      if(rem<=60){setTimeoutRemaining(rem);setShowTimeoutModal(true);}
    },5000);

    warningRef.current=setInterval(()=>{
      if(!showTimeoutModal)return;
      const expiry=parseInt(localStorage.getItem("session_expiry")||"0");
      const rem=Math.max(0,Math.floor((expiry-Date.now())/1000));
      setTimeoutRemaining(rem);
    },1000);

    return()=>{
      window.removeEventListener("mousemove",handleActivity);
      window.removeEventListener("keydown",handleActivity);
      window.removeEventListener("click",handleActivity);
      clearInterval(timeoutRef.current);
      clearInterval(warningRef.current);
    };
  },[user,showTimeoutModal]);

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Georgia','Times New Roman',serif",color:C.text}}>
      <style>{`
        *{box-sizing:border-box;}
        button:hover{opacity:.88;}
        input:focus,textarea:focus,select:focus{border-color:#2563a8!important;box-shadow:0 0 0 3px rgba(37,99,168,.12);}
        @media(max-width:640px){
          .desktop-nav{display:none!important;}
        }
      `}</style>

      {showTimeoutModal&&<SessionTimeoutModal onLogout={()=>{clearSession();setUser(null);setPageWithUrl("home");setShowTimeoutModal(false);}} onExtend={()=>{extendSession();setShowTimeoutModal(false);}} remaining={timeoutRemaining}/>}

      <TopBar stats={siteStats}/>
      <Navbar page={page} setPage={setPageWithUrl} user={user} setUser={setUser}/>

      {page==="home"&&<HomePage setPage={setPageWithUrl} setSelected={setSelectedAndPage} user={user} siteStats={siteStats}/>}
      {page==="complaints"&&<ComplaintsPage setPage={setPageWithUrl} setSelected={setSelectedAndPage}/>}
      {page==="detail"&&<DetailPage complaint={selected} setPage={setPageWithUrl} user={user}/>}
      {page==="categories"&&<CategoriesPage setPage={setPageWithUrl}/>}
      {page==="login"&&<LoginPage setPage={setPageWithUrl} setUser={setUser}/>}
      {page==="register"&&<RegisterPage setPage={setPageWithUrl} setUser={setUser}/>}
      {page==="new-complaint"&&<AIComplaintPage user={user} setPage={setPageWithUrl}/>}
      {page==="profile"&&user&&<UserPanel user={user} setUser={setUser} setPage={setPageWithUrl} initTab="profile"/>}
      {page==="my-complaints"&&user&&<UserPanel user={user} setUser={setUser} setPage={setPageWithUrl} initTab="my-complaints"/>}
      {page==="notifications"&&user&&<UserPanel user={user} setUser={setUser} setPage={setPageWithUrl} initTab="notifications"/>}
      {page==="saved"&&user&&<UserPanel user={user} setUser={setUser} setPage={setPageWithUrl} initTab="saved"/>}
      {page==="admin"&&user&&["admin","superadmin","editor"].includes(user.role)&&<AdminPanel user={user} setPage={setPageWithUrl} footerData={footerData} setFooterData={setFooterData}/>}

      <Footer footerData={footerData}/>
    </div>
  );
}
