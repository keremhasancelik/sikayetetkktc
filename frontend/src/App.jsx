import React, { useState, useEffect, useRef } from "react";

// ─── SUPABASE CONFIG ────────────────────────────────────────
const SUPABASE_URL = "https://xxngmpeoywkcjkjeggse.supabase.co";
const SUPABASE_KEY = "sb_publishable_UXSRhaVcf4-lM1Y2DadhJA_okbnpujv";

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
const SESSION_DURATION = 3 * 60 * 1000; // 3 dakika
const saveSession = (user) => {
  localStorage.setItem("session_user", JSON.stringify(user));
  localStorage.setItem("session_expiry", Date.now() + SESSION_DURATION);
};
const loadSession = () => {
  try {
    const expiry = parseInt(localStorage.getItem("session_expiry") || "0");
    if (Date.now() > expiry) { clearSession(); return null; }
    const user = JSON.parse(localStorage.getItem("session_user") || "null");
    return user;
  } catch { return null; }
};
const clearSession = () => {
  localStorage.removeItem("session_user");
  localStorage.removeItem("session_expiry");
};
const extendSession = () => {
  if (localStorage.getItem("session_user")) {
    localStorage.setItem("session_expiry", Date.now() + SESSION_DURATION);
  }
};

// ─── SUPER ADMIN CONFIG ──────────────────────────────────────
const SUPER_ADMIN = {
  email: "superadmin@sikayetetkktc.com",
  password: "superadmin1100",
  name: "Süper Admin",
  avatar: "SA",
  role: "superadmin",
};

// ─── SVG LOGO & FAVICON ─────────────────────────────────────
const LogoIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L6 12V26C6 35.4 14.1 43.2 24 46C33.9 43.2 42 35.4 42 26V12L24 4Z" fill="#1a3c5e" />
    <path d="M16 24L21 29L32 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="37" r="2.5" fill="#e84c3d" />
  </svg>
);

// Favicon inject
const injectFavicon = () => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M24 4L6 12V26C6 35.4 14.1 43.2 24 46C33.9 43.2 42 35.4 42 26V12L24 4Z' fill='%231a3c5e'/><path d='M16 24L21 29L32 18' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><circle cx='24' cy='37' r='2.5' fill='%23e84c3d'/></svg>`;
  const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
  link.type = "image/svg+xml";
  link.rel = "icon";
  link.href = `data:image/svg+xml,${svg}`;
  document.head.appendChild(link);
  document.title = "ŞikayetETKKTC - KKTC'nin Güvenilir Şikayet Platformu";
};

const IGIcon = ({ size = 20, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const FBIcon = ({ size = 20, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const TWIcon = ({ size = 20, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ─── DESIGN TOKENS ──────────────────────────────────────────
const C = {
  navy:"#0f2744", primary:"#1a3c5e", blue:"#2563a8", accent:"#e84c3d",
  green:"#10b981", amber:"#f59e0b", red:"#ef4444", purple:"#6366f1",
  bg:"#f1f5f9", bgCard:"#ffffff", text:"#0f172a", muted:"#64748b",
  light:"#94a3b8", border:"#e2e8f0", borderMd:"#cbd5e1",
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
  { id:2, title:"KKTC Telekom İnternet Kesintisi 3 Gündür Devam Ediyor", body:"3 gündür internet bağlantım yok. Müşteri hizmetlerini 20 kez aradım, her seferinde 'teknik ekip bakıyor' dediler.", category:"Telekomünikasyon", company:"KKTC Telekomünikasyon", author:"Ayşe K.", avatar:"AK", date:"21 Mart 2026", views:3291, votes:187, comments:24, status:"İnceleniyor" },
  { id:3, title:"İş Bankası KKTC Haksız Kart Aidatı Kesintisi", body:"Hesabımdan bilgim dışında işlem ücreti kesildi.", category:"Bankacılık & Finans", company:"İş Bankası KKTC", author:"Ali R.", avatar:"AR", date:"20 Mart 2026", views:8920, votes:512, comments:43, status:"Çözüldü" },
  { id:4, title:"Gazimağusa Belediyesi Su Kesintisi Bildirimsiz Yapıldı", body:"Sabah 06:00'da su kesildi, akşam 22:00'ye kadar yoktu.", category:"Su & Elektrik", company:"Gazimağusa Belediyesi", author:"Fatma D.", avatar:"FD", date:"19 Mart 2026", views:6340, votes:389, comments:31, status:"Açık" },
  { id:5, title:"Yakın Doğu Üniversitesi Burs Ödemeleri 4 Aydır Gecikti", body:"4 aydır burs ödemesi almıyorum.", category:"Eğitim Kurumları", company:"Yakın Doğu Üniversitesi", author:"Hasan T.", avatar:"HT", date:"18 Mart 2026", views:5120, votes:276, comments:19, status:"İnceleniyor" },
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
  superadmin: { label:"Süper Admin", color:"#7c3aed", bg:"#ede9fe" },
  admin: { label:"Admin", color:C.primary, bg:"#e8f0fe" },
  editor: { label:"Editör", color:C.green, bg:"#dcfce7" },
  user: { label:"Kullanıcı", color:C.muted, bg:"#f1f5f9" },
};

// ─── SHARED STYLES ──────────────────────────────────────────
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
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",borderRadius:20,fontSize:11.5,fontWeight:600,background:m.bg,color:m.color}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:m.dot,flexShrink:0}}/>{s}
  </span>;
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

// ─── TOP BAR ────────────────────────────────────────────────
const TopBar = ({ stats }) => (
  <div style={{background:C.navy,color:"rgba(255,255,255,.8)",padding:"5px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12.5}}>
    <span>📢 Toplam çözülen şikayet: <strong style={{color:"#4ade80"}}>{(stats?.resolved||0).toLocaleString()}</strong></span>
    <div style={{display:"flex",gap:12,alignItems:"center"}}>
      <a href="https://instagram.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{display:"flex",opacity:.75}}><IGIcon size={14} color="#fff"/></a>
      <a href="https://facebook.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{display:"flex",opacity:.75}}><FBIcon size={14} color="#fff"/></a>
      <a href="https://twitter.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{display:"flex",opacity:.75}}><TWIcon size={14} color="#fff"/></a>
      <span style={{opacity:.4}}>|</span>
      <span>🌐 sikayetetkktc.com</span>
    </div>
  </div>
);

// ─── NAVBAR ─────────────────────────────────────────────────
const Navbar = ({ page, setPage, user, setUser }) => {
  const [drop, setDrop] = useState(false);
  const isAdmin = user?.role === "admin" || user?.role === "superadmin" || user?.role === "editor";

  const navItems = [
    { id:"profile", icon:"👤", label:"Profilimi Düzenle" },
    { id:"my-complaints", icon:"📋", label:"Şikayetlerim" },
    { id:"notifications", icon:"🔔", label:"Bildirimlerim" },
    { id:"saved", icon:"🔖", label:"Kaydedilenler" },
  ];

  return (
    <nav style={{background:"#fff",borderBottom:`2px solid ${C.primary}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:62,position:"sticky",top:0,zIndex:99,boxShadow:"0 2px 8px rgba(0,0,0,.07)"}}>
      <div onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
        <LogoIcon size={34}/>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:C.primary,lineHeight:1}}>ŞikayetETKKTC</div>
          <div style={{fontSize:9.5,color:C.light,letterSpacing:.8}}>sikayetetkktc.com</div>
        </div>
      </div>
      <div style={{display:"flex",gap:2}}>
        {[["home","Ana Sayfa"],["complaints","Şikayetler"],["categories","Kategoriler"]].map(([id,label])=>(
          <button key={id} onClick={()=>setPage(id)} style={{padding:"7px 13px",borderRadius:6,cursor:"pointer",fontSize:13.5,fontWeight:page===id?600:400,color:page===id?C.primary:C.muted,background:page===id?"#e8f0fe":"transparent",border:"none",fontFamily:"inherit"}}>{label}</button>
        ))}
        {isAdmin && <button onClick={()=>setPage("admin")} style={{padding:"7px 13px",borderRadius:6,cursor:"pointer",fontSize:13.5,fontWeight:600,color:C.purple,background:"#ede9fe",border:"none",fontFamily:"inherit"}}>🔧 Admin</button>}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {user ? (
          <div style={{position:"relative"}}>
            <div onClick={()=>setDrop(!drop)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"6px 10px",borderRadius:8,border:`1px solid ${C.border}`}}>
              <Avatar initials={user.avatar} size={28}/>
              <span style={{fontSize:13.5,fontWeight:600}}>{user.name.split(" ")[0]}</span>
              <span style={{fontSize:10,color:C.muted}}>{drop?"▲":"▼"}</span>
            </div>
            {drop && (
              <div style={{position:"absolute",right:0,top:"110%",background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,minWidth:220,boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:200,padding:8}}>
                <div style={{padding:"10px 14px 8px",borderBottom:`1px solid ${C.border}`,marginBottom:4}}>
                  <div style={{fontWeight:700,fontSize:14}}>{user.name}</div>
                  <div style={{fontSize:12,color:C.muted}}>{user.email}</div>
                  <RoleBadge role={user.role}/>
                </div>
                {navItems.map(item=>(
                  <button key={item.id} onClick={()=>{setPage(item.id);setDrop(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:8,border:"none",background:"transparent",cursor:"pointer",width:"100%",textAlign:"left",fontSize:13.5,color:C.text,fontFamily:"inherit"}}>
                    <span style={{fontSize:16}}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
                <div style={{borderTop:`1px solid ${C.border}`,marginTop:4,paddingTop:4}}>
                  <button onClick={()=>{clearSession();setUser(null);setPage("home");setDrop(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:8,border:"none",background:"transparent",cursor:"pointer",width:"100%",textAlign:"left",fontSize:13.5,color:"rgba(220,50,50,.8)",fontFamily:"inherit"}}>
                    <span>🚪</span><span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button style={btn("ghost","sm")} onClick={()=>setPage("login")}>Giriş Yap</button>
            <button style={btn("primary","sm")} onClick={()=>setPage("register")}>Üye Ol</button>
          </>
        )}
        <button style={btn("accent","sm")} onClick={()=>setPage(user?"new-complaint":"login")}>+ Şikayet Yaz</button>
      </div>
    </nav>
  );
};

// ─── FOOTER ─────────────────────────────────────────────────
const Footer = ({ footerData }) => {
  const fd = footerData || {
    desc:"KKTC'nin bağımsız şikayet platformu.",
    columns:[
      {title:"Platform",links:[{label:"Şikayetler",url:"#"},{label:"Kategoriler",url:"#"}]},
      {title:"Yardım",links:[{label:"SSS",url:"#"},{label:"İletişim",url:"#"}]},
    ],
    copyright:"© 2026 ŞikayetETKKTC.",
    instagram:"sikayetetkktc",facebook:"sikayetetkktc",twitter:"sikayetetkktc",
  };
  return (
    <footer style={{background:C.navy,color:"rgba(255,255,255,.65)",padding:"40px 24px 20px"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:28,marginBottom:28}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
              <LogoIcon size={32}/>
              <div>
                <div style={{color:"#fff",fontWeight:800,fontSize:15,lineHeight:1}}>ŞikayetETKKTC</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.4)",letterSpacing:.6}}>sikayetetkktc.com</div>
              </div>
            </div>
            <p style={{fontSize:12.5,lineHeight:1.65,margin:"0 0 16px"}}>{fd.desc}</p>
            <div style={{display:"flex",gap:8}}>
              {fd.instagram&&<a href={`https://instagram.com/${fd.instagram}`} target="_blank" rel="noopener noreferrer" style={{width:34,height:34,borderRadius:8,background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",display:"flex",alignItems:"center",justifyContent:"center"}}><IGIcon size={17} color="#fff"/></a>}
              {fd.facebook&&<a href={`https://facebook.com/${fd.facebook}`} target="_blank" rel="noopener noreferrer" style={{width:34,height:34,borderRadius:8,background:"#1877F2",display:"flex",alignItems:"center",justifyContent:"center"}}><FBIcon size={17} color="#fff"/></a>}
              {fd.twitter&&<a href={`https://twitter.com/${fd.twitter}`} target="_blank" rel="noopener noreferrer" style={{width:34,height:34,borderRadius:8,background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}><TWIcon size={17} color="#fff"/></a>}
            </div>
          </div>
          {fd.columns.map(col=>(
            <div key={col.title}>
              <div style={{color:"#fff",fontWeight:700,fontSize:12.5,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{col.title}</div>
              {col.links.map(link=>(
                <a key={link.label} href={link.url||"#"} style={{display:"block",fontSize:12.5,marginBottom:7,color:"rgba(255,255,255,.65)",textDecoration:"none"}}
                  onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.65)"}>{link.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:16,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,fontSize:12}}>
          <span>{fd.copyright}</span>
          <div style={{display:"flex",gap:14}}>
            {["Kullanım Şartları","Gizlilik","Çerez Politikası"].map(l=><span key={l} style={{cursor:"pointer"}}>{l}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── COMPLAINT CARD ─────────────────────────────────────────
const ComplaintCard = ({ c, onClick }) => {
  const cat = PRESET_CATEGORIES.find(x=>x.name===c.category);
  return (
    <div onClick={()=>onClick(c)} style={{...card,cursor:"pointer",borderTop:`3px solid ${cat?.color||C.primary}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <Avatar initials={c.avatar} size={36} bg={cat?.color||C.primary}/>
          <div>
            <div style={{fontWeight:600,fontSize:13.5}}>{c.author}</div>
            <div style={{fontSize:11.5,color:C.muted}}>{c.date}</div>
          </div>
        </div>
        <Badge s={c.status}/>
      </div>
      <h3 style={{margin:"0 0 7px",fontSize:14.5,color:C.text,lineHeight:1.4}}>{c.title}</h3>
      <p style={{margin:"0 0 12px",fontSize:12.5,color:C.muted,lineHeight:1.55}}>{c.body.substring(0,110)}...</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12}}>
        <span style={{background:(cat?.color||C.primary)+"18",color:cat?.color||C.primary,padding:"2px 9px",borderRadius:20,fontWeight:600,fontSize:11.5}}>{cat?.icon} {c.company}</span>
        <div style={{display:"flex",gap:12,color:C.muted}}>
          <span>👁 {c.views.toLocaleString()}</span><span>👍 {c.votes}</span><span>💬 {c.comments}</span>
        </div>
      </div>
    </div>
  );
};

// ─── HOME PAGE ──────────────────────────────────────────────
const HomePage = ({ setPage, setSelected, user, siteStats }) => {
  const [search, setSearch] = useState("");
  const [dbComplaints, setDbComplaints] = useState(MOCK_COMPLAINTS);

  useEffect(()=>{
    sb.get("complaints","?is_published=eq.true&order=created_at.desc&limit=6")
      .then(data=>{
        if(data&&data.length>0){
          setDbComplaints(data.map(c=>({
            id:c.id,title:c.title,body:c.body,category:c.category,
            company:c.company,author:c.author_name,avatar:c.author_avatar||"?",
            date:new Date(c.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}),
            views:c.views||0,votes:c.votes||0,comments:c.comments_count||0,status:c.status
          })));
        }
      }).catch(()=>{});
  },[]);

  const filtered = search ? dbComplaints.filter(c=>c.title.toLowerCase().includes(search.toLowerCase())||c.company.toLowerCase().includes(search.toLowerCase())) : dbComplaints;

  return (
    <div>
      <div style={{background:`linear-gradient(135deg, ${C.navy} 0%, ${C.primary} 55%, #1e5fa0 100%)`,padding:"60px 24px",textAlign:"center",color:"#fff"}}>
        <div style={{display:"inline-block",background:C.accent,padding:"3px 14px",borderRadius:20,fontSize:12.5,fontWeight:600,marginBottom:14,letterSpacing:.5}}>🇨🇾 KKTC'nin Güvenilir Şikayet Platformu</div>
        <h1 style={{fontSize:38,fontWeight:800,margin:"0 0 14px",lineHeight:1.2}}>Sesinizi Duyurun,<br/>Çözüm Bulun!</h1>
        <p style={{fontSize:16.5,opacity:.82,maxWidth:520,margin:"0 auto 28px",lineHeight:1.65}}>Kıbrıs'ta kamu kurumlarından özel işletmelere her türlü şikayetinizi kayıt altına alın.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button style={btn("accent","lg")} onClick={()=>setPage(user?"new-complaint":"login")}>+ Şikayet Yaz</button>
          <button style={{...btn("secondary","lg"),color:"#fff",borderColor:"rgba(255,255,255,.45)"}} onClick={()=>setPage("complaints")}>Tüm Şikayetler</button>
        </div>
      </div>

      {/* Gerçek istatistikler */}
      <div style={{background:C.accent,padding:"14px 24px",display:"flex",justifyContent:"center",gap:44,flexWrap:"wrap"}}>
        {[
          [siteStats?.total?.toLocaleString()||"0","Toplam Şikayet"],
          [siteStats?.resolved?.toLocaleString()||"0","Çözülen"],
          [siteStats?.members?.toLocaleString()||"0","Üye"],
          [siteStats?.monthly_visitors?.toLocaleString()||"0","Aylık Ziyaretçi"],
        ].map(([n,l])=>(
          <div key={l} style={{textAlign:"center",color:"#fff"}}>
            <div style={{fontSize:20,fontWeight:800}}>{n}</div>
            <div style={{fontSize:11,opacity:.88,textTransform:"uppercase",letterSpacing:.6}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"36px 24px"}}>
        <div style={{...card,marginBottom:28,padding:"16px 20px"}}>
          <div style={{display:"flex",gap:10}}>
            <input style={{...inp,fontSize:15,padding:"11px 15px"}} placeholder="🔍  Kurum adı, şikayet konusu veya kategori ara..." value={search} onChange={e=>setSearch(e.target.value)}/>
            <button style={btn("primary","lg")}>Ara</button>
          </div>
        </div>

        <div style={{marginBottom:36}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h2 style={{margin:0,fontSize:20,fontWeight:800,color:C.primary}}>Kategoriler</h2>
            <button style={btn("ghost","sm")} onClick={()=>setPage("categories")}>Tümünü Gör →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12}}>
            {PRESET_CATEGORIES.slice(0,8).map(cat=>(
              <div key={cat.id} onClick={()=>setPage("complaints")} style={{...card,cursor:"pointer",textAlign:"center",padding:"16px 12px",borderTop:`3px solid ${cat.color}`}}>
                <div style={{fontSize:24,marginBottom:6}}>{cat.icon}</div>
                <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{cat.name}</div>
                <div style={{fontSize:11.5,color:C.muted}}>{cat.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h2 style={{margin:0,fontSize:20,fontWeight:800,color:C.primary}}>Son Şikayetler</h2>
            <button style={btn("ghost","sm")} onClick={()=>setPage("complaints")}>Tümünü Gör →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
            {filtered.map(c=><ComplaintCard key={c.id} c={c} onClick={c=>{setSelected(c);setPage("detail");}}/>)}
          </div>
        </div>

        <div style={{marginTop:44}}>
          <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:800,color:C.primary}}>Neden ŞikayetETKKTC?</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:14}}>
            {[["🛡️","Güvenilir Platform","KKTC hukuku çerçevesinde, kimliğiniz korunarak."],["⚡","Hızlı Çözüm","Şikayetleriniz doğrudan ilgili kurumlarla paylaşılır."],["📊","Anlık Takip","Şikayetinizin durumunu her an takip edin."],["🔔","E-posta Bildirimi","Cevap geldiğinde anında bildirim alın."],["🤖","AI Destekli","Yapay zeka ile şikayetinizi profesyonelce oluşturun."],["👥","Topluluk","Diğer kullanıcılar şikayetinizi destekleyebilir."]].map(([i,t,d])=>(
              <div key={t} style={{...card,padding:18}}>
                <div style={{fontSize:24,marginBottom:8}}>{i}</div>
                <h3 style={{margin:"0 0 5px",fontSize:14,color:C.primary}}>{t}</h3>
                <p style={{margin:0,fontSize:12.5,color:C.muted,lineHeight:1.5}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:C.primary,padding:"44px 24px",textAlign:"center",color:"#fff"}}>
        <h2 style={{fontSize:26,marginBottom:10}}>Şikayetinizi Bir Kurum Görmeli</h2>
        <p style={{opacity:.8,marginBottom:22,fontSize:15}}>KKTC'de yaşadığınız sorunları bizimle paylaşın.</p>
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

  useEffect(()=>{
    sb.get("categories","?is_custom=eq.true&order=created_at.desc").then(data=>{
      if(data&&data.length>0){
        const custom=data.map(c=>({id:c.id,name:c.name,icon:c.icon||"📌",color:c.color||C.blue,count:c.complaint_count||0,custom:true}));
        setCategories([...PRESET_CATEGORIES,...custom]);
      }
    }).catch(()=>{});
  },[]);

  const addCategory=async()=>{
    if(!newCat.name.trim())return;
    const res=await sb.post("categories",{name:newCat.name.trim(),icon:newCat.icon,color:newCat.color,complaint_count:0,is_custom:true});
    const newId=(res&&res[0])?res[0].id:Date.now();
    setCategories(prev=>[...prev,{id:newId,...newCat,name:newCat.name.trim(),count:0,custom:true}]);
    setNewCat({name:"",icon:"📌",color:C.blue});
    setShowAdd(false);
  };

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"36px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h1 style={{margin:"0 0 4px",fontSize:26,fontWeight:800,color:C.primary}}>Tüm Kategoriler</h1>
          <p style={{margin:0,color:C.muted,fontSize:14}}>{categories.length} kategori</p>
        </div>
        <button style={btn("primary")} onClick={()=>setShowAdd(true)}>+ Yeni Kategori Ekle</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14,marginBottom:28}}>
        {categories.filter(c=>!c.custom).map(cat=>(
          <div key={cat.id} onClick={()=>setPage("complaints")} style={{...card,cursor:"pointer",borderLeft:`4px solid ${cat.color}`,padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{fontSize:26}}>{cat.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>{cat.name}</div>
                <div style={{fontSize:12,color:C.muted}}>{cat.count.toLocaleString()} şikayet</div>
              </div>
            </div>
            <div style={{height:5,borderRadius:3,background:C.bg}}>
              <div style={{height:"100%",width:`${Math.min((cat.count/12840)*100,100)}%`,background:cat.color,borderRadius:3}}/>
            </div>
          </div>
        ))}
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Yeni Kategori Ekle">
        <FormRow label="Kategori Adı">
          <input style={inp} placeholder="Örn: Çevre Sorunları..." value={newCat.name} onChange={e=>setNewCat({...newCat,name:e.target.value})}/>
        </FormRow>
        <FormRow label="İkon Seç">
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {ICON_OPTIONS.map(ic=>(
              <button key={ic} onClick={()=>setNewCat({...newCat,icon:ic})} style={{width:40,height:40,borderRadius:8,border:`2px solid ${newCat.icon===ic?C.primary:C.border}`,background:newCat.icon===ic?"#e8f0fe":"#fff",cursor:"pointer",fontSize:18}}>{ic}</button>
            ))}
          </div>
        </FormRow>
        <FormRow label="Renk Seç">
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[C.blue,C.accent,C.green,C.purple,C.amber,"#0891b2","#7c3aed","#059669","#dc2626","#f97316"].map(col=>(
              <button key={col} onClick={()=>setNewCat({...newCat,color:col})} style={{width:32,height:32,borderRadius:"50%",background:col,border:newCat.color===col?`3px solid ${C.text}`:"3px solid transparent",cursor:"pointer"}}/>
            ))}
          </div>
        </FormRow>
        <div style={{display:"flex",gap:10}}>
          <button style={{...btn("ghost"),flex:1}} onClick={()=>setShowAdd(false)}>İptal</button>
          <button style={{...btn("primary"),flex:1}} onClick={addCategory} disabled={!newCat.name.trim()}>✓ Kategori Ekle</button>
        </div>
      </Modal>
    </div>
  );
};

// ─── COMPLAINTS LIST ────────────────────────────────────────
const ComplaintsPage = ({ setPage, setSelected }) => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [dbComplaints, setDbComplaints] = useState(MOCK_COMPLAINTS);

  useEffect(()=>{
    sb.get("complaints","?is_published=eq.true&order=created_at.desc")
      .then(data=>{
        if(data&&data.length>0){
          setDbComplaints(data.map(c=>({
            id:c.id,title:c.title,body:c.body,category:c.category,
            company:c.company,author:c.author_name,avatar:c.author_avatar||"?",
            date:new Date(c.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}),
            views:c.views||0,votes:c.votes||0,comments:c.comments_count||0,status:c.status
          })));
        }
      }).catch(()=>{});
  },[]);

  const filtered = dbComplaints
    .filter(c=>filter==="all"||c.status===filter)
    .sort((a,b)=>{
      if(sort==="newest")return b.id-a.id;
      if(sort==="popular")return b.views-a.views;
      if(sort==="votes")return b.votes-a.votes;
      return b.id-a.id;
    });

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"34px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h1 style={{margin:0,fontSize:24,fontWeight:800,color:C.primary}}>Tüm Şikayetler</h1>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[["all","Tümü"],["Açık","Açık"],["İnceleniyor","İnceleniyor"],["Çözüldü","Çözüldü"]].map(([v,l])=>(
            <button key={v} style={btn(filter===v?"primary":"ghost","sm")} onClick={()=>setFilter(v)}>{l}</button>
          ))}
          <select style={{...inp,width:"auto",padding:"6px 10px",fontSize:13}} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">En Yeni</option><option value="popular">En Popüler</option><option value="votes">En Çok Oy</option>
          </select>
        </div>
      </div>
      <div style={{display:"flex",gap:22}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:14}}>
          {filtered.map(c=>(
            <div key={c.id} onClick={()=>{setSelected(c);setPage("detail");}} style={{...card,cursor:"pointer",borderLeft:`4px solid ${STATUS_MAP[c.status]?.dot||C.primary}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <Avatar initials={c.avatar} size={34} bg={PRESET_CATEGORIES.find(x=>x.name===c.category)?.color||C.primary}/>
                  <div>
                    <span style={{fontWeight:600,fontSize:13.5}}>{c.author}</span>
                    <span style={{fontSize:12,color:C.muted,marginLeft:8}}>{c.date} · {c.category}</span>
                  </div>
                </div>
                <Badge s={c.status}/>
              </div>
              <h3 style={{margin:"0 0 7px",fontSize:15,color:C.text}}>{c.title}</h3>
              <p style={{margin:"0 0 10px",fontSize:13,color:C.muted,lineHeight:1.5}}>{c.body.substring(0,170)}...</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12.5}}>
                <span style={{background:C.primary+"15",color:C.primary,padding:"2px 9px",borderRadius:20,fontWeight:600,fontSize:12}}>🏢 {c.company}</span>
                <div style={{display:"flex",gap:14,color:C.muted}}>
                  <span>👁 {c.views.toLocaleString()}</span><span>👍 {c.votes}</span><span>💬 {c.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{width:248,flexShrink:0}}>
          <div style={{...card,marginBottom:14}}>
            <h3 style={{margin:"0 0 14px",fontSize:14.5,color:C.primary,fontWeight:700}}>Kategoriler</h3>
            {PRESET_CATEGORIES.slice(0,8).map(cat=>(
              <div key={cat.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,cursor:"pointer"}}>
                <span>{cat.icon} {cat.name}</span>
                <span style={{color:C.muted,fontSize:12}}>{cat.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{...card,background:C.primary,color:"#fff"}}>
            <h3 style={{margin:"0 0 6px",fontSize:14.5}}>Şikayet Yaz</h3>
            <p style={{fontSize:12.5,opacity:.8,marginBottom:14}}>Sorununuzu bizimle paylaşın.</p>
            <button style={btn("accent")} onClick={()=>setPage("new-complaint")}>+ Oluştur</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DETAIL PAGE ────────────────────────────────────────────
const DetailPage = ({ complaint, setPage, user }) => {
  const [vote, setVote] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {id:1,author:"Kemal A.",avatar:"KA",text:"Aynı sorunu ben de yaşadım.",date:"22 Mart 2026",likes:12},
    {id:2,author:"Zeynep M.",avatar:"ZM",text:"Şikayetinizi destekliyorum.",date:"21 Mart 2026",likes:8},
  ]);
  if(!complaint)return null;
  const cat=PRESET_CATEGORIES.find(x=>x.name===complaint.category);
  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 24px"}}>
      <button style={btn("ghost","sm")} onClick={()=>setPage("complaints")}>← Tüm Şikayetler</button>
      <div style={{display:"flex",gap:22,marginTop:18}}>
        <div style={{flex:1}}>
          <div style={{...card,borderTop:`4px solid ${cat?.color||C.primary}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar initials={complaint.avatar} size={40} bg={cat?.color||C.primary}/>
                <div>
                  <div style={{fontWeight:600}}>{complaint.author}</div>
                  <div style={{fontSize:12.5,color:C.muted}}>{complaint.date} · {complaint.category}</div>
                </div>
              </div>
              <Badge s={complaint.status}/>
            </div>
            <h1 style={{fontSize:20,margin:"0 0 10px",color:C.primary,lineHeight:1.3}}>{complaint.title}</h1>
            <p style={{fontSize:14.5,lineHeight:1.7,color:C.text,borderTop:`1px solid ${C.border}`,paddingTop:16}}>{complaint.body}</p>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,marginTop:14,display:"flex",gap:10,alignItems:"center"}}>
              <button style={btn(vote==="up"?"success":"ghost","sm")} onClick={()=>setVote(vote==="up"?null:"up")}>👍 {complaint.votes+(vote==="up"?1:0)}</button>
              <button style={btn(vote==="down"?"danger":"ghost","sm")} onClick={()=>setVote(vote==="down"?null:"down")}>👎</button>
              <span style={{marginLeft:"auto",fontSize:12.5,color:C.muted}}>👁 {complaint.views.toLocaleString()}</span>
            </div>
          </div>
          <div style={{marginTop:22}}>
            <h2 style={{fontSize:17,color:C.primary,marginBottom:14,fontWeight:700}}>Yorumlar ({comments.length})</h2>
            {comments.map(c=>(
              <div key={c.id} style={{...card,marginBottom:10}}>
                <div style={{display:"flex",gap:10}}>
                  <Avatar initials={c.avatar} size={34} bg={C.accent}/>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontWeight:600,fontSize:13.5}}>{c.author}</span>
                      <span style={{fontSize:12,color:C.muted}}>{c.date}</span>
                    </div>
                    <p style={{margin:"0 0 7px",fontSize:13.5,lineHeight:1.5}}>{c.text}</p>
                    <button style={btn("ghost","sm")}>👍 {c.likes}</button>
                  </div>
                </div>
              </div>
            ))}
            {user?(
              <div style={card}>
                <textarea style={{...inp,minHeight:90,marginBottom:10}} placeholder="Yorumunuzu yazın..." value={comment} onChange={e=>setComment(e.target.value)}/>
                <button style={btn("primary")} onClick={()=>{if(comment.trim()){setComments([...comments,{id:Date.now(),author:user.name,avatar:user.avatar,text:comment,date:"Şimdi",likes:0}]);setComment("");}}}>Gönder</button>
              </div>
            ):(
              <div style={{...card,textAlign:"center"}}>
                <p style={{color:C.muted,marginBottom:10}}>Yorum yapmak için giriş yapın.</p>
                <button style={btn("primary")} onClick={()=>setPage("login")}>Giriş Yap</button>
              </div>
            )}
          </div>
        </div>
        <div style={{width:240,flexShrink:0}}>
          <div style={{...card,marginBottom:14}}>
            <h3 style={{margin:"0 0 14px",fontSize:14.5,color:C.primary,fontWeight:700}}>Durum Takibi</h3>
            {[["Açık","Yayınlandı",true],["İnceleniyor","Kurum inceliyor",complaint.status!=="Açık"],["Çözüldü","Sorun çözüldü",complaint.status==="Çözüldü"]].map(([s,d,done],i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:12,alignItems:"center"}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:done?C.green:C.border,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,flexShrink:0}}>{done?"✓":i+1}</div>
                <div><div style={{fontSize:13,fontWeight:600}}>{s}</div><div style={{fontSize:11.5,color:C.muted}}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── NEW COMPLAINT PAGE ──────────────────────────────────────
const AIComplaintPage = ({ user, setPage }) => {
  const [draft, setDraft] = useState({title:"",category:"",company:"",body:""});

  if(!user)return(
    <div style={{maxWidth:480,margin:"60px auto",padding:"0 24px"}}>
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
    <div style={{maxWidth:680,margin:"40px auto",padding:"0 24px"}}>
      <h2 style={{margin:"0 0 24px",color:C.primary,fontSize:20,fontWeight:700}}>Şikayet Formu</h2>
      <div style={card}>
        <FormRow label="Şikayet Başlığı">
          <input style={inp} placeholder="Kısa ve açıklayıcı bir başlık" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/>
        </FormRow>
        <FormRow label="Kategori">
          <select style={inp} value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}>
            <option value="">Seçin</option>
            {PRESET_CATEGORIES.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
        </FormRow>
        <FormRow label="Kurum / İşletme">
          <input style={inp} placeholder="Şikayet ettiğiniz kurum adı" value={draft.company} onChange={e=>setDraft({...draft,company:e.target.value})}/>
        </FormRow>
        <FormRow label="Şikayet Detayı">
          <textarea style={{...inp,minHeight:140,resize:"vertical"}} placeholder="Ne oldu, ne zaman oldu, ne bekliyorsunuz?" value={draft.body} onChange={e=>setDraft({...draft,body:e.target.value})}/>
        </FormRow>
        <button style={{...btn("success","lg"),width:"100%"}} onClick={async()=>{
          if(!draft.title||!draft.company||!draft.body||!draft.category){alert("Lütfen tüm alanları doldurun.");return;}
          const res=await sb.post("complaints",{
            title:draft.title,body:draft.body,category:draft.category,company:draft.company,
            author_name:user.name,author_avatar:user.avatar,author_email:user.email||"",
            status:"Açık",views:0,votes:0,comments_count:0,is_published:true
          });
          if(res&&res[0]){
            if(user.email)sendEmail("complaint_reply",user.email,{name:user.name,complaintTitle:draft.title});
            alert("✅ Şikayetiniz başarıyla kaydedildi!");
            setPage("complaints");
          }else{alert("Kayıt sırasında hata oluştu.");}
        }}>✓ Şikayeti Yayınla</button>
      </div>
    </div>
  );
};

// ─── LOGIN PAGE ──────────────────────────────────────────────
const LoginPage = ({ setPage, setUser }) => {
  const [form, setForm] = useState({email:"",pass:""});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if(!form.email||!form.pass){setErr("E-posta ve şifre gereklidir.");return;}
    setLoading(true);

    // Süper Admin kontrolü
    if(form.email===SUPER_ADMIN.email&&form.pass===SUPER_ADMIN.password){
      const u={...SUPER_ADMIN};
      saveSession(u);setUser(u);setPage("admin");setLoading(false);return;
    }

    // Supabase'den admin kullanıcıları kontrol et
    try {
      const admins = await sb.get("admin_users",`?email=eq.${form.email}&password=eq.${form.pass}&is_active=eq.true`);
      if(admins&&admins.length>0){
        const a=admins[0];
        const u={id:a.id,name:a.name,email:a.email,avatar:a.avatar||(a.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)),role:a.role};
        saveSession(u);setUser(u);setPage(a.role==="editor"?"complaints":"admin");setLoading(false);return;
      }
    } catch(e){}

    // Normal kullanıcı (demo amaçlı e-posta eşleşmesi)
    try {
      const users = await sb.get("users",`?email=eq.${form.email}&select=*`);
      if(users&&users.length>0){
        const u2=users[0];
        const u={id:u2.id,name:u2.name||u2.email,email:u2.email,avatar:u2.avatar||"U",role:"user"};
        saveSession(u);setUser(u);setPage("home");setLoading(false);return;
      }
    } catch(e){}

    setErr("E-posta veya şifre hatalı.");
    setLoading(false);
  };

  return (
    <div style={{maxWidth:440,margin:"56px auto",padding:"0 24px"}}>
      <div style={card}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <LogoIcon size={52}/>
          <h1 style={{fontSize:22,margin:"10px 0 6px",color:C.primary}}>Giriş Yap</h1>
          <p style={{color:C.muted,margin:0,fontSize:13.5}}>ŞikayetETKKTC hesabınıza giriş yapın</p>
        </div>
        {err&&<div style={{background:"#fee2e2",color:"#dc2626",padding:"9px 13px",borderRadius:8,marginBottom:14,fontSize:13}}>⚠️ {err}</div>}
        <FormRow label="E-posta"><input style={inp} type="email" placeholder="ornek@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></FormRow>
        <FormRow label="Şifre"><input style={inp} type="password" placeholder="••••••••" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></FormRow>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18}}>
          <span style={{fontSize:13,color:C.blue,cursor:"pointer"}}>Şifremi Unuttum</span>
        </div>
        <button style={{...btn("primary","lg"),width:"100%"}} onClick={doLogin} disabled={loading}>{loading?"Giriş yapılıyor...":"Giriş Yap"}</button>
        <div style={{textAlign:"center",marginTop:14,fontSize:13.5}}>
          <span style={{color:C.muted}}>Hesabınız yok mu? </span>
          <span style={{color:C.blue,cursor:"pointer",fontWeight:600}} onClick={()=>setPage("register")}>Üye Ol</span>
        </div>
      </div>
    </div>
  );
};

// ─── REGISTER PAGE ───────────────────────────────────────────
const RegisterPage = ({ setPage, setUser }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({firstName:"",lastName:"",email:"",phone:"",pass:"",city:"",agree:false});

  return (
    <div style={{maxWidth:500,margin:"56px auto",padding:"0 24px"}}>
      <div style={card}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <h1 style={{fontSize:22,margin:"0 0 5px",color:C.primary}}>Üye Ol</h1>
          <p style={{color:C.muted,margin:0,fontSize:13.5}}>KKTC'nin güvenilir sesine katılın</p>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:22}}>
          {[1,2].map(s=><div key={s} style={{flex:1,height:4,borderRadius:2,background:s<=step?C.primary:C.border}}/>)}
        </div>
        {step===1&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <FormRow label="Ad"><input style={inp} placeholder="Adınız" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/></FormRow>
            <FormRow label="Soyad"><input style={inp} placeholder="Soyadınız" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})}/></FormRow>
          </div>
          <FormRow label="E-posta"><input style={inp} type="email" placeholder="ornek@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></FormRow>
          <FormRow label="Telefon"><input style={inp} placeholder="0533 000 00 00" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></FormRow>
          <button style={{...btn("primary","lg"),width:"100%"}} onClick={()=>setStep(2)} disabled={!form.firstName||!form.email}>Devam Et →</button>
        </>}
        {step===2&&<>
          <FormRow label="Şifre"><input style={inp} type="password" placeholder="En az 8 karakter" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})}/></FormRow>
          <FormRow label="Şehir">
            <select style={inp} value={form.city} onChange={e=>setForm({...form,city:e.target.value})}>
              <option value="">Şehir Seçin</option>
              {["Lefkoşa","Gazimağusa","Girne","Güzelyurt","İskele"].map(c=><option key={c}>{c}</option>)}
            </select>
          </FormRow>
          <label style={{display:"flex",alignItems:"flex-start",gap:9,fontSize:13,color:C.muted,marginBottom:14,cursor:"pointer"}}>
            <input type="checkbox" checked={form.agree} onChange={e=>setForm({...form,agree:e.target.checked})} style={{marginTop:2}}/>
            Kullanım Koşulları'nı okudum, kabul ediyorum.
          </label>
          <div style={{display:"flex",gap:10}}>
            <button style={{...btn("ghost"),flex:1}} onClick={()=>setStep(1)}>← Geri</button>
            <button style={{...btn("success"),flex:1}} onClick={async()=>{
              const newUser={name:`${form.firstName} ${form.lastName}`,email:form.email,avatar:(form.firstName[0]+(form.lastName[0]||"")).toUpperCase(),role:"user"};
              // Supabase'e kaydet
              await sb.post("users",{name:newUser.name,email:form.email,avatar:newUser.avatar,phone:form.phone,city:form.city,role:"user",created_at:new Date().toISOString()}).catch(()=>{});
              saveSession(newUser);setUser(newUser);
              sendEmail("welcome",form.email,{name:form.firstName});
              setPage("home");
            }} disabled={!form.pass||!form.agree}>✓ Kayıt Ol</button>
          </div>
        </>}
        <div style={{textAlign:"center",marginTop:14,fontSize:13.5}}>
          <span style={{color:C.muted}}>Zaten hesabınız var mı? </span>
          <span style={{color:C.blue,cursor:"pointer",fontWeight:600}} onClick={()=>setPage("login")}>Giriş Yap</span>
        </div>
      </div>
    </div>
  );
};

// ─── USER PANEL ──────────────────────────────────────────────
const UserPanel = ({ user, setUser, setPage, initTab="profile" }) => {
  const [tab, setTab] = useState(initTab);
  const [profileForm, setProfileForm] = useState({name:user?.name||"",email:user?.email||"",phone:user?.phone||"",city:user?.city||""});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const saveProfile = async () => {
    setSaving(true);
    // Supabase'e kaydet
    if(user?.id){
      await sb.patch("users",user.id,{name:profileForm.name,email:profileForm.email,phone:profileForm.phone,city:profileForm.city}).catch(()=>{});
    }
    const updated={...user,...profileForm};
    saveSession(updated);setUser(updated);
    setSaveMsg("✅ Profil güncellendi!");
    setSaving(false);
    setTimeout(()=>setSaveMsg(""),3000);
  };

  const sideItems=[
    {id:"profile",label:"Profilimi Düzenle"},
    {id:"my-complaints",label:"Şikayetlerim"},
    {id:"notifications",label:"Bildirimlerim"},
    {id:"saved",label:"Kaydedilenler"},
  ];

  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 130px)"}}>
      <div style={{width:220,background:C.navy,flexShrink:0}}>
        <div style={{padding:"20px 16px 12px"}}>
          {sideItems.map(item=>(
            <button key={item.id} style={{...sideLink(tab===item.id),border:"none",padding:"10px 16px",borderRadius:7,width:"100%"}} onClick={()=>setTab(item.id)}>{item.label}</button>
          ))}
        </div>
        <div style={{padding:"0 16px 16px",marginTop:"auto"}}>
          <button style={{...btn("accent"),width:"100%",justifyContent:"center"}} onClick={()=>setPage("new-complaint")}>Şikayet Yaz ✏️</button>
          <button style={{...sideLink(false),marginTop:8,border:"none"}} onClick={()=>{clearSession();setUser(null);setPage("home");}}>🚪 Çıkış Yap</button>
        </div>
      </div>
      <div style={{flex:1,padding:32,background:"#f5f7fb",overflowY:"auto"}}>
        {tab==="profile"&&(
          <div style={{maxWidth:580}}>
            <h2 style={{margin:"0 0 24px",fontSize:20,fontWeight:700,color:C.primary}}>Profilimi Düzenle</h2>
            <div style={card}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,paddingBottom:20,borderBottom:`1px solid ${C.border}`}}>
                <Avatar initials={user.avatar} size={64} bg={C.primary}/>
                <div>
                  <div style={{fontWeight:700,fontSize:16}}>{user.name}</div>
                  <div style={{fontSize:13,color:C.muted}}>{user.email}</div>
                  <RoleBadge role={user.role}/>
                </div>
              </div>
              {saveMsg&&<div style={{background:"#dcfce7",color:"#16a34a",padding:"9px 13px",borderRadius:8,marginBottom:14,fontSize:13}}>{saveMsg}</div>}
              <FormRow label="Ad Soyad">
                <input style={inp} value={profileForm.name} onChange={e=>setProfileForm({...profileForm,name:e.target.value})}/>
              </FormRow>
              <FormRow label="E-Posta">
                <input style={inp} type="email" value={profileForm.email} onChange={e=>setProfileForm({...profileForm,email:e.target.value})}/>
              </FormRow>
              <FormRow label="Telefon">
                <input style={inp} placeholder="0533 000 00 00" value={profileForm.phone} onChange={e=>setProfileForm({...profileForm,phone:e.target.value})}/>
              </FormRow>
              <FormRow label="Şehir">
                <select style={inp} value={profileForm.city} onChange={e=>setProfileForm({...profileForm,city:e.target.value})}>
                  <option value="">Şehir Seçin</option>
                  {["Lefkoşa","Gazimağusa","Girne","Güzelyurt","İskele"].map(c=><option key={c}>{c}</option>)}
                </select>
              </FormRow>
              <button style={{...btn("primary","lg"),width:"100%"}} onClick={saveProfile} disabled={saving}>{saving?"Kaydediliyor...":"💾 Değişiklikleri Kaydet"}</button>
            </div>
          </div>
        )}
        {tab==="my-complaints"&&(
          <div style={{maxWidth:680}}>
            <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:700}}>Şikayetlerim</h2>
            {MOCK_COMPLAINTS.slice(0,2).map(c=>(
              <div key={c.id} style={{...card,marginTop:10,borderLeft:`4px solid ${STATUS_MAP[c.status]?.dot}`}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <h3 style={{margin:"0 0 5px",fontSize:14.5}}>{c.title}</h3>
                  <Badge s={c.status}/>
                </div>
                <div style={{fontSize:12.5,color:C.muted}}>{c.date}</div>
              </div>
            ))}
          </div>
        )}
        {tab==="notifications"&&(
          <div style={{maxWidth:680}}>
            <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:700}}>Bildirimlerim</h2>
            <div style={card}>
              {[{icon:"💬",t:"Şikayetinize yeni bir yorum yapıldı",time:"2 saat önce",read:false},{icon:"✅",t:"Şikayetiniz çözüldü olarak işaretlendi",time:"1 gün önce",read:true}].map((n,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:20}}>{n.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13.5,fontWeight:n.read?400:600}}>{n.t}</div>
                    <div style={{fontSize:12,color:C.muted}}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="saved"&&(
          <div style={{maxWidth:680,textAlign:"center",padding:60}}>
            <div style={{fontSize:48,marginBottom:16}}>🔖</div>
            <h3 style={{fontSize:18,color:C.text}}>Kaydedilen şikayet bulunamadı.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ADMIN PANEL ─────────────────────────────────────────────
const AdminPanel = ({ user, setPage, footerData: initFooterData, setFooterData: setParentFooterData }) => {
  const [tab, setTab] = useState("dashboard");
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({name:"",email:"",password:"",role:"editor",avatar:""});
  const [allUsers, setAllUsers] = useState([]);
  const [footerData, setFooterData] = useState(initFooterData);
  const [footerSaved, setFooterSaved] = useState(false);

  const canEdit = user?.role === "superadmin" || user?.role === "admin";
  const isSuperAdmin = user?.role === "superadmin";

  // Şikayetleri çek
  useEffect(()=>{
    setLoadingComplaints(true);
    sb.get("complaints","?order=created_at.desc")
      .then(data=>{
        if(data&&data.length>0){
          setComplaints(data.map(c=>({
            id:c.id,title:c.title,body:c.body,category:c.category,
            company:c.company,author:c.author_name,avatar:c.author_avatar||"?",
            date:new Date(c.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}),
            views:c.views||0,votes:c.votes||0,comments:c.comments_count||0,status:c.status,
            author_email:c.author_email||""
          })));
        }
        setLoadingComplaints(false);
      }).catch(()=>setLoadingComplaints(false));
  },[]);

  // Admin kullanıcılarını çek
  useEffect(()=>{
    sb.get("admin_users","?order=created_at.desc").then(data=>{
      if(data&&data.length>0)setAdminUsers(data);
    }).catch(()=>{});
  },[]);

  // Normal kullanıcıları çek
  useEffect(()=>{
    sb.get("users","?order=created_at.desc").then(data=>{
      if(data&&data.length>0)setAllUsers(data);
    }).catch(()=>{});
  },[]);

  // Footer'ı Supabase'den çek
  useEffect(()=>{
    sb.get("site_settings","?key=eq.footer&select=value").then(data=>{
      if(data&&data[0]&&data[0].value){
        setFooterData(prev=>({...prev,...data[0].value}));
      }
    }).catch(()=>{});
  },[]);

  const saveFooter = async () => {
    // Supabase'e kaydet
    const existing = await sb.get("site_settings","?key=eq.footer").catch(()=>[]);
    if(existing&&existing.length>0){
      await sb.patch("site_settings",existing[0].id,{value:footerData}).catch(()=>{});
    }else{
      await sb.post("site_settings",{key:"footer",value:footerData}).catch(()=>{});
    }
    if(setParentFooterData)setParentFooterData(footerData);
    setFooterSaved(true);
    setTimeout(()=>setFooterSaved(false),3000);
  };

  const deleteComplaint = async(id)=>{
    if(!canEdit){alert("Bu işlem için yetkiniz yok.");return;}
    if(!window.confirm("Bu şikayeti kalıcı olarak silmek istediğinizden emin misiniz?"))return;
    const ok=await sb.delete("complaints",id);
    if(ok)setComplaints(prev=>prev.filter(x=>x.id!==id));
    else alert("Silme işlemi başarısız.");
  };

  const updateStatus = async(id,newStatus)=>{
    if(!canEdit){alert("Bu işlem için yetkiniz yok.");return;}
    const ok=await sb.patch("complaints",id,{status:newStatus});
    if(ok){
      setComplaints(prev=>prev.map(x=>{
        if(x.id===id){
          if(x.author_email&&x.status!==newStatus){
            sendEmail("status_update",x.author_email,{name:x.author,complaintTitle:x.title,status:newStatus});
          }
          return{...x,status:newStatus};
        }
        return x;
      }));
    }else alert("Güncelleme başarısız.");
  };

  const addAdminUser = async()=>{
    if(!newAdmin.name||!newAdmin.email||!newAdmin.password){alert("Tüm alanları doldurun.");return;}
    const avatar=(newAdmin.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2));
    const res=await sb.post("admin_users",{name:newAdmin.name,email:newAdmin.email,password:newAdmin.password,role:newAdmin.role,avatar,is_active:true});
    if(res&&res[0]){
      setAdminUsers(prev=>[res[0],...prev]);
      setNewAdmin({name:"",email:"",password:"",role:"editor",avatar:""});
      setShowAddAdmin(false);
      alert("✅ Kullanıcı eklendi!");
    }else alert("Ekleme başarısız.");
  };

  const updateAdminUser = async(id,data)=>{
    const ok=await sb.patch("admin_users",id,data);
    if(ok)setAdminUsers(prev=>prev.map(x=>x.id===id?{...x,...data}:x));
    else alert("Güncelleme başarısız.");
  };

  const deleteAdminUser = async(id)=>{
    if(!isSuperAdmin){alert("Sadece Süper Admin kullanıcı silebilir.");return;}
    if(!window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?"))return;
    const ok=await sb.delete("admin_users",id);
    if(ok)setAdminUsers(prev=>prev.filter(x=>x.id!==id));
    else alert("Silme başarısız.");
  };

  const updateUserStatus = async(id,status)=>{
    const ok=await sb.patch("users",id,{status});
    if(ok)setAllUsers(prev=>prev.map(x=>x.id===id?{...x,status}:x));
  };

  const sideItems=[
    {id:"dashboard",icon:"📊",l:"Dashboard"},
    {id:"complaints",icon:"📋",l:"Şikayetler"},
    {id:"users",icon:"👥",l:"Kullanıcılar"},
    {id:"admin-users",icon:"🔑",l:"Rol Yönetimi"},
    {id:"categories",icon:"📁",l:"Kategoriler"},
    {id:"footer-edit",icon:"🔗",l:"Footer Yönetimi"},
    {id:"site-settings",icon:"⚙️",l:"Site Ayarları"},
    {id:"reports",icon:"📈",l:"Raporlar"},
  ];

  const th={padding:"11px 14px",textAlign:"left",background:"#f8fafc",fontWeight:600,color:C.muted,fontSize:11.5,textTransform:"uppercase",letterSpacing:.5,borderBottom:`2px solid ${C.border}`};
  const td_={padding:"13px 14px",borderBottom:`1px solid ${C.border}`,verticalAlign:"middle",fontSize:13.5};

  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 76px)"}}>
      <div style={{width:220,background:C.navy,flexShrink:0,padding:"20px 0"}}>
        <div style={{padding:"0 16px 18px",borderBottom:"1px solid rgba(255,255,255,.1)",marginBottom:12}}>
          <div style={{fontSize:10.5,color:"rgba(255,255,255,.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Admin Panel</div>
          <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{user.name}</div>
          <RoleBadge role={user.role}/>
        </div>
        {sideItems.map(item=>(
          <button key={item.id} style={{...sideLink(tab===item.id),border:"none",display:"flex",alignItems:"center",gap:9}} onClick={()=>setTab(item.id)}>
            <span>{item.icon}</span><span>{item.l}</span>
          </button>
        ))}
        <div style={{padding:"16px 16px 0"}}>
          <button style={{...btn("ghost","sm"),color:"rgba(255,255,255,.5)",borderColor:"rgba(255,255,255,.15)",width:"100%"}} onClick={()=>setPage("home")}>← Siteye Dön</button>
        </div>
      </div>

      <div style={{flex:1,padding:28,background:C.bg,overflowY:"auto"}}>

        {tab==="dashboard"&&(
          <div>
            <h2 style={{margin:"0 0 22px",fontSize:20,color:C.primary,fontWeight:700}}>Dashboard</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:14,marginBottom:28}}>
              {[["📋","Toplam Şikayet",complaints.length,C.primary],["✅","Çözülen",complaints.filter(c=>c.status==="Çözüldü").length,C.green],["⏳","Açık",complaints.filter(c=>c.status==="Açık").length,C.amber],["👥","Kullanıcılar",allUsers.length,C.blue]].map(([i,l,v,col])=>(
                <div key={l} style={{...card,borderTop:`4px solid ${col}`,textAlign:"center",padding:16}}>
                  <div style={{fontSize:26,marginBottom:6}}>{i}</div>
                  <div style={{fontSize:22,fontWeight:800,color:col}}>{v}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={card}>
              <h3 style={{margin:"0 0 14px",fontSize:15,color:C.primary,fontWeight:700}}>Son Şikayetler</h3>
              {complaints.slice(0,5).map(c=>(
                <div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                  <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:10}}>{c.title}</span>
                  <Badge s={c.status}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="complaints"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <h2 style={{margin:0,fontSize:20,color:C.primary,fontWeight:700}}>Şikayet Yönetimi</h2>
                {loadingComplaints&&<span style={{fontSize:12,color:C.muted}}>Yükleniyor...</span>}
                <span style={{fontSize:13,color:C.muted,background:"#f1f5f9",padding:"3px 10px",borderRadius:20}}>{complaints.length} şikayet</span>
              </div>
            </div>
            <div style={card}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["#","Başlık / Kurum","Yazar","Durum","Tarih","İşlem"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {complaints.length===0&&<tr><td colSpan={6} style={{...td_,textAlign:"center",color:C.muted,padding:32}}>Şikayet bulunamadı</td></tr>}
                  {complaints.map(c=>(
                    <tr key={c.id}>
                      <td style={td_}><span style={{color:C.muted,fontSize:12}}>#{c.id}</span></td>
                      <td style={{...td_,maxWidth:240}}>
                        <div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:13}}>{c.title}</div>
                        <div style={{fontSize:11.5,color:C.muted}}>🏢 {c.company}</div>
                      </td>
                      <td style={td_}>{c.author}</td>
                      <td style={td_}>
                        {canEdit?(
                          <select style={{...inp,padding:"4px 8px",fontSize:12,width:"auto"}} value={c.status} onChange={e=>updateStatus(c.id,e.target.value)}>
                            <option>Açık</option><option>İnceleniyor</option><option>Çözüldü</option><option>Yayınlanamadı</option>
                          </select>
                        ):<Badge s={c.status}/>}
                      </td>
                      <td style={{...td_,fontSize:12,color:C.muted}}>{c.date}</td>
                      <td style={td_}>
                        <div style={{display:"flex",gap:5}}>
                          {canEdit&&<button style={btn("danger","sm")} onClick={()=>deleteComplaint(c.id)}>🗑</button>}
                          {!canEdit&&<span style={{fontSize:12,color:C.muted}}>Sadece görüntüle</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="users"&&(
          <div>
            <h2 style={{margin:"0 0 18px",fontSize:20,color:C.primary,fontWeight:700}}>Kullanıcı Yönetimi</h2>
            <div style={card}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Kullanıcı","E-posta","Şehir","Kayıt Tarihi","Durum","İşlem"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {allUsers.length===0&&<tr><td colSpan={6} style={{...td_,textAlign:"center",color:C.muted,padding:32}}>Kullanıcı bulunamadı</td></tr>}
                  {allUsers.map(u=>(
                    <tr key={u.id}>
                      <td style={td_}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar initials={u.avatar||(u.name||"?")[0]} size={30}/><span style={{fontWeight:600}}>{u.name||"İsimsiz"}</span></div></td>
                      <td style={td_}>{u.email}</td>
                      <td style={td_}>{u.city||"-"}</td>
                      <td style={{...td_,fontSize:12,color:C.muted}}>{u.created_at?new Date(u.created_at).toLocaleDateString("tr-TR"):"-"}</td>
                      <td style={td_}><Badge s={u.status==="Engelli"?"Engelli":"Aktif"}/></td>
                      <td style={td_}>
                        {canEdit&&(
                          <div style={{display:"flex",gap:5}}>
                            <button style={btn(u.status==="Engelli"?"success":"ghost","sm")} onClick={()=>updateUserStatus(u.id,u.status==="Engelli"?"Aktif":"Engelli")}>{u.status==="Engelli"?"✓ Aç":"🚫 Engelle"}</button>
                          </div>
                        )}
                        {!canEdit&&<span style={{fontSize:12,color:C.muted}}>Sadece görüntüle</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="admin-users"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
              <div>
                <h2 style={{margin:0,fontSize:20,color:C.primary,fontWeight:700}}>Rol Yönetimi</h2>
                <p style={{margin:"4px 0 0",fontSize:13,color:C.muted}}>Süper Admin, Admin ve Editör hesaplarını yönetin</p>
              </div>
              {isSuperAdmin&&<button style={btn("primary")} onClick={()=>setShowAddAdmin(true)}>+ Yeni Kullanıcı Ekle</button>}
            </div>

            {/* Süper Admin kartı */}
            <div style={{...card,marginBottom:16,borderLeft:`4px solid ${C.purple}`,background:"#faf5ff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <Avatar initials="SA" size={40} bg={C.purple}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:15}}>Süper Admin</div>
                    <div style={{fontSize:12.5,color:C.muted}}>superadmin@sikayetetkktc.com</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <RoleBadge role="superadmin"/>
                  {isSuperAdmin&&(
                    <button style={btn("secondary","sm")} onClick={()=>setEditingAdmin({id:"superadmin",name:"Süper Admin",email:"superadmin@sikayetetkktc.com",role:"superadmin"})}>✏️ Düzenle</button>
                  )}
                </div>
              </div>
            </div>

            <div style={card}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Kullanıcı","E-posta","Rol","Durum","İşlem"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {adminUsers.length===0&&<tr><td colSpan={5} style={{...td_,textAlign:"center",color:C.muted,padding:32}}>Henüz ek kullanıcı yok</td></tr>}
                  {adminUsers.map(u=>(
                    <tr key={u.id}>
                      <td style={td_}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar initials={u.avatar||(u.name||"?")[0]} size={30} bg={ROLE_MAP[u.role]?.color||C.primary}/><span style={{fontWeight:600}}>{u.name}</span></div></td>
                      <td style={td_}>{u.email}</td>
                      <td style={td_}><RoleBadge role={u.role}/></td>
                      <td style={td_}><Badge s={u.is_active?"Aktif":"Engelli"}/></td>
                      <td style={td_}>
                        <div style={{display:"flex",gap:5}}>
                          {isSuperAdmin&&<button style={btn("secondary","sm")} onClick={()=>setEditingAdmin(u)}>✏️ Düzenle</button>}
                          {canEdit&&<button style={btn(u.is_active?"ghost":"success","sm")} onClick={()=>updateAdminUser(u.id,{is_active:!u.is_active})}>{u.is_active?"🚫":"✓"}</button>}
                          {isSuperAdmin&&<button style={btn("danger","sm")} onClick={()=>deleteAdminUser(u.id)}>🗑</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Yeni kullanıcı modalı */}
            <Modal open={showAddAdmin} onClose={()=>setShowAddAdmin(false)} title="Yeni Yetkili Kullanıcı Ekle">
              <FormRow label="Ad Soyad"><input style={inp} placeholder="Ad Soyad" value={newAdmin.name} onChange={e=>setNewAdmin({...newAdmin,name:e.target.value})}/></FormRow>
              <FormRow label="E-posta"><input style={inp} type="email" placeholder="ornek@sikayetetkktc.com" value={newAdmin.email} onChange={e=>setNewAdmin({...newAdmin,email:e.target.value})}/></FormRow>
              <FormRow label="Şifre"><input style={inp} type="password" placeholder="Güçlü bir şifre" value={newAdmin.password} onChange={e=>setNewAdmin({...newAdmin,password:e.target.value})}/></FormRow>
              <FormRow label="Rol">
                <select style={inp} value={newAdmin.role} onChange={e=>setNewAdmin({...newAdmin,role:e.target.value})}>
                  {isSuperAdmin&&<option value="admin">Admin</option>}
                  <option value="editor">Editör</option>
                </select>
              </FormRow>
              <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#0369a1",marginBottom:16}}>
                <strong>Rol Yetkileri:</strong><br/>
                Admin: Şikayet düzenleyebilir, kullanıcı engelleyebilir<br/>
                Editör: Sadece inceleyebilir, düzenleme yapamaz
              </div>
              <div style={{display:"flex",gap:10}}>
                <button style={{...btn("ghost"),flex:1}} onClick={()=>setShowAddAdmin(false)}>İptal</button>
                <button style={{...btn("primary"),flex:1}} onClick={addAdminUser}>✓ Kullanıcı Ekle</button>
              </div>
            </Modal>

            {/* Düzenleme modalı */}
            <Modal open={!!editingAdmin} onClose={()=>setEditingAdmin(null)} title="Kullanıcı Düzenle">
              {editingAdmin&&(
                <>
                  <FormRow label="Ad Soyad"><input style={inp} value={editingAdmin.name} onChange={e=>setEditingAdmin({...editingAdmin,name:e.target.value})}/></FormRow>
                  <FormRow label="E-posta"><input style={inp} value={editingAdmin.email} onChange={e=>setEditingAdmin({...editingAdmin,email:e.target.value})}/></FormRow>
                  <FormRow label="Yeni Şifre (boş bırakılırsa değişmez)"><input style={inp} type="password" placeholder="••••••••" value={editingAdmin.newPassword||""} onChange={e=>setEditingAdmin({...editingAdmin,newPassword:e.target.value})}/></FormRow>
                  {editingAdmin.id!=="superadmin"&&isSuperAdmin&&(
                    <FormRow label="Rol">
                      <select style={inp} value={editingAdmin.role} onChange={e=>setEditingAdmin({...editingAdmin,role:e.target.value})}>
                        <option value="admin">Admin</option>
                        <option value="editor">Editör</option>
                      </select>
                    </FormRow>
                  )}
                  <div style={{display:"flex",gap:10}}>
                    <button style={{...btn("ghost"),flex:1}} onClick={()=>setEditingAdmin(null)}>İptal</button>
                    <button style={{...btn("primary"),flex:1}} onClick={async()=>{
                      const updateData={name:editingAdmin.name,email:editingAdmin.email,role:editingAdmin.role};
                      if(editingAdmin.newPassword)updateData.password=editingAdmin.newPassword;
                      if(editingAdmin.id==="superadmin"){
                        alert("Süper Admin bilgileri güncellendi (geliştirici tarafından kod üzerinden değiştirilebilir).");
                      }else{
                        await updateAdminUser(editingAdmin.id,updateData);
                        alert("✅ Kullanıcı güncellendi!");
                      }
                      setEditingAdmin(null);
                    }}>💾 Kaydet</button>
                  </div>
                </>
              )}
            </Modal>
          </div>
        )}

        {tab==="categories"&&(
          <div>
            <h2 style={{margin:"0 0 18px",fontSize:20,color:C.primary,fontWeight:700}}>Kategori Yönetimi</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:13}}>
              {PRESET_CATEGORIES.map(cat=>(
                <div key={cat.id} style={{...card,borderLeft:`4px solid ${cat.color}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:24}}>{cat.icon}</span>
                    <div><div style={{fontWeight:600,fontSize:13.5}}>{cat.name}</div><div style={{fontSize:12,color:C.muted}}>{cat.count.toLocaleString()} şikayet</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="footer-edit"&&(
          <div style={{maxWidth:720}}>
            <h2 style={{margin:"0 0 6px",fontSize:20,color:C.primary,fontWeight:700}}>Footer Yönetimi</h2>
            <p style={{color:C.muted,fontSize:14,marginBottom:22}}>Değişiklikler veritabanına kaydedilir ve kalıcı olur.</p>
            {footerSaved&&<div style={{background:"#dcfce7",color:"#16a34a",padding:"10px 14px",borderRadius:8,marginBottom:16,fontSize:13}}>✅ Footer başarıyla kaydedildi!</div>}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{...card}}>
                <h3 style={{margin:"0 0 16px",fontSize:15,color:C.primary,fontWeight:700}}>📝 Açıklama & Telif</h3>
                <FormRow label="Kısa Açıklama">
                  <textarea style={{...inp,minHeight:70}} value={footerData?.desc||""} onChange={e=>setFooterData({...footerData,desc:e.target.value})}/>
                </FormRow>
                <FormRow label="Telif Hakkı Metni">
                  <input style={inp} value={footerData?.copyright||""} onChange={e=>setFooterData({...footerData,copyright:e.target.value})}/>
                </FormRow>
              </div>
              <div style={{...card}}>
                <h3 style={{margin:"0 0 16px",fontSize:15,color:C.primary,fontWeight:700}}>📱 Sosyal Medya</h3>
                {[["instagram","Instagram"],["facebook","Facebook"],["twitter","X (Twitter)"]].map(([key,label])=>(
                  <FormRow key={key} label={label}>
                    <input style={inp} placeholder="kullanici_adi" value={footerData?.[key]||""} onChange={e=>setFooterData({...footerData,[key]:e.target.value})}/>
                  </FormRow>
                ))}
              </div>
              {(footerData?.columns||[]).map((col,ci)=>(
                <div key={ci} style={{...card}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <h3 style={{margin:0,fontSize:15,color:C.primary,fontWeight:700}}>
                      🔗 Kolon: <input style={{...inp,display:"inline-block",width:"auto",padding:"3px 8px",fontSize:14,fontWeight:700}} value={col.title} onChange={e=>{const cols=[...footerData.columns];cols[ci]={...cols[ci],title:e.target.value};setFooterData({...footerData,columns:cols});}}/>
                    </h3>
                    <button style={btn("primary","sm")} onClick={()=>{const cols=[...footerData.columns];cols[ci]={...cols[ci],links:[...cols[ci].links,{label:"Yeni Link",url:"#"}]};setFooterData({...footerData,columns:cols});}}>+ Link Ekle</button>
                  </div>
                  {col.links.map((link,li)=>(
                    <div key={li} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                      <input style={{...inp,flex:2}} placeholder="Link Adı" value={link.label} onChange={e=>{const cols=[...footerData.columns];cols[ci].links[li]={...link,label:e.target.value};setFooterData({...footerData,columns:cols});}}/>
                      <input style={{...inp,flex:3}} placeholder="https://..." value={link.url} onChange={e=>{const cols=[...footerData.columns];cols[ci].links[li]={...link,url:e.target.value};setFooterData({...footerData,columns:cols});}}/>
                      <button style={btn("danger","sm")} onClick={()=>{const cols=[...footerData.columns];cols[ci].links=cols[ci].links.filter((_,i)=>i!==li);setFooterData({...footerData,columns:cols});}}>🗑</button>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button style={btn("success","lg")} onClick={saveFooter}>💾 Değişiklikleri Kaydet</button>
              </div>
            </div>
          </div>
        )}

        {tab==="site-settings"&&(
          <div style={{maxWidth:680}}>
            <h2 style={{margin:"0 0 6px",fontSize:20,color:C.primary,fontWeight:700}}>Site Ayarları</h2>
            <div style={card}>
              <h3 style={{margin:"0 0 16px",fontSize:15,color:C.primary,fontWeight:700}}>⚙️ Sistem</h3>
              {[["Yeni şikayetler admin onayı gerektirsin",0],["Yorumlar admin onayı gerektirsin",1],["Yeni üye kayıtları açık",2],["E-posta bildirimleri aktif",3]].map(([l,i])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:13.5}}>{l}</span>
                  <Toggle on={i%2===0} onChange={()=>{}}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="reports"&&(
          <div>
            <h2 style={{margin:"0 0 22px",fontSize:20,color:C.primary,fontWeight:700}}>Raporlar</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <div style={card}>
                <h3 style={{margin:"0 0 14px",fontSize:15,color:C.primary,fontWeight:700}}>Durum Dağılımı</h3>
                {[["Açık",complaints.filter(c=>c.status==="Açık").length,C.red],["İnceleniyor",complaints.filter(c=>c.status==="İnceleniyor").length,C.amber],["Çözüldü",complaints.filter(c=>c.status==="Çözüldü").length,C.green]].map(([l,v,col])=>(
                  <div key={l} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}><span>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
                    <div style={{height:6,borderRadius:3,background:C.border}}>
                      <div style={{height:"100%",width:`${complaints.length>0?(v/complaints.length)*100:0}%`,background:col,borderRadius:3}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={card}>
                <h3 style={{margin:"0 0 14px",fontSize:15,color:C.primary,fontWeight:700}}>En Çok Şikayet Alan</h3>
                {PRESET_CATEGORIES.slice(0,5).map(cat=>(
                  <div key={cat.id} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}><span>{cat.icon} {cat.name}</span><span style={{fontWeight:600}}>{cat.count.toLocaleString()}</span></div>
                    <div style={{height:5,borderRadius:3,background:C.border}}><div style={{height:"100%",width:`${(cat.count/12840)*100}%`,background:cat.color,borderRadius:3}}/></div>
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

// ─── SESSION TIMEOUT MODAL ───────────────────────────────────
const SessionTimeoutModal = ({ onLogout, onExtend, remaining }) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
    <div style={{background:"#fff",borderRadius:16,padding:32,maxWidth:380,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
      <div style={{fontSize:48,marginBottom:16}}>⏰</div>
      <h2 style={{margin:"0 0 10px",color:C.primary}}>Oturum Süresi Dolmak Üzere</h2>
      <p style={{color:C.muted,marginBottom:8}}>Oturumunuz <strong style={{color:C.accent}}>{remaining} saniye</strong> içinde otomatik kapanacak.</p>
      <p style={{color:C.muted,fontSize:13,marginBottom:24}}>Devam etmek ister misiniz?</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{...btn("ghost"),flex:1}} onClick={onLogout}>Çıkış Yap</button>
        <button style={{...btn("primary"),flex:1}} onClick={onExtend}>✓ Devam Et</button>
      </div>
    </div>
  </div>
);

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(()=>loadSession());
  const [selected, setSelected] = useState(null);
  const [siteStats, setSiteStats] = useState({total:0,resolved:0,members:0,monthly_visitors:0});
  const [footerData, setFooterData] = useState({
    desc:"KKTC'nin bağımsız şikayet platformu. Sesinizi duyurun, değişim yaratın.",
    columns:[
      {title:"Platform",links:[{label:"Şikayetler",url:"#"},{label:"Kategoriler",url:"#"},{label:"Trend100",url:"#"}]},
      {title:"Kurumlar İçin",links:[{label:"Kurumsal Hesap",url:"#"},{label:"Şikayet Yanıtla",url:"#"}]},
      {title:"Yardım",links:[{label:"SSS",url:"#"},{label:"İletişim",url:"#"}]},
    ],
    copyright:"© 2026 ŞikayetETKKTC. Tüm hakları saklıdır.",
    instagram:"sikayetetkktc",facebook:"sikayetetkktc",twitter:"sikayetetkktc",
  });
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutRemaining, setTimeoutRemaining] = useState(60);
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);

  // Favicon inject
  useEffect(()=>{ injectFavicon(); },[]);

  // Gerçek istatistikleri çek
  useEffect(()=>{
    sb.get("complaints","?select=id,status").then(data=>{
      if(data&&data.length>0){
        setSiteStats(prev=>({...prev,total:data.length,resolved:data.filter(c=>c.status==="Çözüldü").length}));
      }
    }).catch(()=>{});
    sb.get("users","?select=id").then(data=>{
      if(data&&data.length>0)setSiteStats(prev=>({...prev,members:data.length}));
    }).catch(()=>{});
    sb.get("site_settings","?key=eq.footer&select=value").then(data=>{
      if(data&&data[0]&&data[0].value)setFooterData(prev=>({...prev,...data[0].value}));
    }).catch(()=>{});
  },[]);

  // Oturum yönetimi - kullanıcı aktivitesinde uzat
  useEffect(()=>{
    if(!user)return;
    const handleActivity=()=>{ extendSession(); setShowTimeoutModal(false); clearInterval(warningRef.current); };
    window.addEventListener("mousemove",handleActivity);
    window.addEventListener("keydown",handleActivity);
    window.addEventListener("click",handleActivity);

    // Her 10 saniyede kontrol et
    timeoutRef.current=setInterval(()=>{
      const expiry=parseInt(localStorage.getItem("session_expiry")||"0");
      const remaining=Math.max(0,Math.floor((expiry-Date.now())/1000));
      if(remaining<=0){
        clearInterval(timeoutRef.current);
        clearSession();setUser(null);setPage("home");setShowTimeoutModal(false);
        alert("Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
        return;
      }
      if(remaining<=60&&!showTimeoutModal){
        setTimeoutRemaining(remaining);
        setShowTimeoutModal(true);
        warningRef.current=setInterval(()=>{
          const r=Math.max(0,Math.floor((parseInt(localStorage.getItem("session_expiry")||"0")-Date.now())/1000));
          setTimeoutRemaining(r);
          if(r<=0){clearInterval(warningRef.current);}
        },1000);
      }
    },10000);

    return()=>{
      window.removeEventListener("mousemove",handleActivity);
      window.removeEventListener("keydown",handleActivity);
      window.removeEventListener("click",handleActivity);
      clearInterval(timeoutRef.current);
      clearInterval(warningRef.current);
    };
  },[user]);

  const handleLogout=()=>{ clearSession();setUser(null);setPage("home");setShowTimeoutModal(false); };
  const handleExtend=()=>{ extendSession();setShowTimeoutModal(false);clearInterval(warningRef.current); };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Georgia','Times New Roman',serif",color:C.text}}>
      <style>{`* { box-sizing: border-box; } button:hover { opacity: .88; } input:focus, textarea:focus, select:focus { border-color: #2563a8 !important; box-shadow: 0 0 0 3px rgba(37,99,168,.12); }`}</style>

      {showTimeoutModal&&<SessionTimeoutModal onLogout={handleLogout} onExtend={handleExtend} remaining={timeoutRemaining}/>}

      <TopBar stats={siteStats}/>
      <Navbar page={page} setPage={setPage} user={user} setUser={setUser}/>

      {page==="home"&&<HomePage setPage={setPage} setSelected={setSelected} user={user} siteStats={siteStats}/>}
      {page==="complaints"&&<ComplaintsPage setPage={setPage} setSelected={setSelected}/>}
      {page==="detail"&&<DetailPage complaint={selected} setPage={setPage} user={user}/>}
      {page==="categories"&&<CategoriesPage setPage={setPage}/>}
      {page==="login"&&<LoginPage setPage={setPage} setUser={setUser}/>}
      {page==="register"&&<RegisterPage setPage={setPage} setUser={setUser}/>}
      {page==="new-complaint"&&<AIComplaintPage user={user} setPage={setPage}/>}
      {page==="profile"&&user&&<UserPanel user={user} setUser={setUser} setPage={setPage} initTab="profile"/>}
      {page==="my-complaints"&&user&&<UserPanel user={user} setUser={setUser} setPage={setPage} initTab="my-complaints"/>}
      {page==="notifications"&&user&&<UserPanel user={user} setUser={setUser} setPage={setPage} initTab="notifications"/>}
      {page==="saved"&&user&&<UserPanel user={user} setUser={setUser} setPage={setPage} initTab="saved"/>}
      {page==="admin"&&user&&(user.role==="admin"||user.role==="superadmin"||user.role==="editor")&&
        <AdminPanel user={user} setPage={setPage} footerData={footerData} setFooterData={setFooterData}/>}

      <Footer footerData={footerData}/>
    </div>
  );
}
