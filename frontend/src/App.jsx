import { useState, useEffect, useRef, useCallback } from "react";
// ─── SVG LOGO & SOCIAL ICONS ────────────────────────────────
const LogoIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L6 12V26C6 35.4 14.1 43.2 24 46C33.9 43.2 42 35.4 42 26V12L24 4Z" fill="#1a3c5e" />
    <path d="M16 24L21 29L32 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="37" r="2.5" fill="#e84c3d" />
  </svg>
);
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
const WAIcon = ({ size = 22, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);



// ============================================================
// KKTC ŞİKAYET PLATFORMU v2 — sikayetetkktc.com
// Şikayetvar.com analizi ile geliştirilmiş tam sürüm
// ============================================================

// ─── DESIGN TOKENS ──────────────────────────────────────────
const C = {
  navy:    "#0f2744",
  primary: "#1a3c5e",
  blue:    "#2563a8",
  accent:  "#e84c3d",
  green:   "#10b981",
  amber:   "#f59e0b",
  red:     "#ef4444",
  purple:  "#6366f1",
  bg:      "#f1f5f9",
  bgCard:  "#ffffff",
  text:    "#0f172a",
  muted:   "#64748b",
  light:   "#94a3b8",
  border:  "#e2e8f0",
  borderMd:"#cbd5e1",
};

// ─── MOCK DATA ──────────────────────────────────────────────
const PRESET_CATEGORIES = [
  { id: 1,  name: "Kamu Kurumları",        icon: "🏛️", color: C.blue,   count: 12840 },
  { id: 2,  name: "Telekomünikasyon",      icon: "📡", color: C.purple, count: 9320  },
  { id: 3,  name: "Bankacılık & Finans",   icon: "🏦", color: C.green,  count: 8750  },
  { id: 4,  name: "Sağlık Hizmetleri",     icon: "🏥", color: C.accent, count: 7430  },
  { id: 5,  name: "Eğitim Kurumları",      icon: "🎓", color: C.amber,  count: 6210  },
  { id: 6,  name: "Ulaşım & Lojistik",     icon: "🚌", color: C.primary,count: 5890  },
  { id: 7,  name: "Su & Elektrik",         icon: "⚡", color: "#f97316",count: 11200 },
  { id: 8,  name: "Belediye Hizmetleri",   icon: "🏙️", color: "#0891b2",count: 9870  },
  { id: 9,  name: "E-Ticaret & Alışveriş", icon: "🛒", color: "#7c3aed",count: 7640  },
  { id: 10, name: "Sigorta",               icon: "🛡️", color: "#059669",count: 4320  },
  { id: 11, name: "Gayrimenkul",           icon: "🏠", color: "#dc2626",count: 3890  },
  { id: 12, name: "Diğer",                 icon: "📋", color: C.muted,  count: 5430  },
];

const MOCK_COMPLAINTS = [
  { id:1, title:"Lefkoşa Devlet Hastanesi'nde 4 Saatlik Bekleme Skandalı", body:"Dün sabah saat 09:00'da Lefkoşa Devlet Hastanesi acil servisine başvurdum. 4 saat boyunca hiçbir işlem yapılmadan bekletildim. Doktorların sayısı yetersiz, hemşireler ilgisiz davranıyor. Bu durum ciddi bir sağlık riski oluşturmaktadır.", category:"Sağlık Hizmetleri", company:"Lefkoşa Devlet Hastanesi", author:"Mehmet Y.", avatar:"MY", date:"22 Mart 2026", views:4821, votes:234, comments:18, status:"Açık" },
  { id:2, title:"KKTC Telekom İnternet Kesintisi 3 Gündür Devam Ediyor", body:"3 gündür internet bağlantım yok. Müşteri hizmetlerini 20 kez aradım, her seferinde 'teknik ekip bakıyor' dediler. İş yerimden çalışamıyorum, büyük maddi kayıp yaşıyorum.", category:"Telekomünikasyon", company:"KKTC Telekomünikasyon", author:"Ayşe K.", avatar:"AK", date:"21 Mart 2026", views:3291, votes:187, comments:24, status:"İnceleniyor" },
  { id:3, title:"İş Bankası KKTC Haksız Kart Aidatı Kesintisi", body:"Hesabımdan bilgim dışında işlem ücreti kesildi. Şubeye gittiğimde 'sistem güncellendi' dediler. Bu tamamen hukuka aykırı bir uygulamadır.", category:"Bankacılık & Finans", company:"İş Bankası KKTC", author:"Ali R.", avatar:"AR", date:"20 Mart 2026", views:8920, votes:512, comments:43, status:"Çözüldü" },
  { id:4, title:"Gazimağusa Belediyesi Su Kesintisi Bildirimsiz Yapıldı", body:"Sabah 06:00'da su kesildi, akşam 22:00'ye kadar yoktu. Hiçbir önceden bildirim yapılmadı. Bebek sahibiyim, bu kabul edilemez bir durumdur.", category:"Su & Elektrik", company:"Gazimağusa Belediyesi", author:"Fatma D.", avatar:"FD", date:"19 Mart 2026", views:6340, votes:389, comments:31, status:"Açık" },
  { id:5, title:"Yakın Doğu Üniversitesi Burs Ödemeleri 4 Aydır Gecikti", body:"4 aydır burs ödemesi almıyorum. Mali işler departmanı her gün 'bu hafta çıkacak' diyor. Ev kiram var, geçinemiyorum artık.", category:"Eğitim Kurumları", company:"Yakın Doğu Üniversitesi", author:"Hasan T.", avatar:"HT", date:"18 Mart 2026", views:5120, votes:276, comments:19, status:"İnceleniyor" },
];

const STATUS_MAP = {
  "Açık":       { bg:"#fee2e2", color:"#dc2626", dot:"#ef4444" },
  "İnceleniyor":{ bg:"#fef9c3", color:"#b45309", dot:"#f59e0b" },
  "Çözüldü":    { bg:"#dcfce7", color:"#16a34a", dot:"#22c55e" },
  "Yayınlanamadı":{ bg:"#f1f5f9", color:"#64748b", dot:"#94a3b8" },
  "Aktif":      { bg:"#dcfce7", color:"#16a34a", dot:"#22c55e" },
  "Engelli":    { bg:"#fee2e2", color:"#dc2626", dot:"#ef4444" },
};

// ─── SHARED STYLES ──────────────────────────────────────────
const btn = (v="primary", sz="md") => {
  const size = { sm:{ padding:"5px 12px", fontSize:12 }, md:{ padding:"9px 18px", fontSize:13 }, lg:{ padding:"13px 26px", fontSize:15 } }[sz];
  const variant = {
    primary:  { background:C.primary, color:"#fff", border:`1.5px solid ${C.primary}` },
    secondary:{ background:"transparent", color:C.primary, border:`1.5px solid ${C.primary}` },
    accent:   { background:C.accent, color:"#fff", border:`1.5px solid ${C.accent}` },
    success:  { background:C.green, color:"#fff", border:`1.5px solid ${C.green}` },
    danger:   { background:C.red, color:"#fff", border:`1.5px solid ${C.red}` },
    ghost:    { background:"transparent", color:C.muted, border:`1.5px solid ${C.border}` },
    purple:   { background:C.purple, color:"#fff", border:`1.5px solid ${C.purple}` },
  }[v];
  return { ...size, ...variant, borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontWeight:600, transition:"all .15s", letterSpacing:.2, display:"inline-flex", alignItems:"center", gap:5 };
};
const inp = { width:"100%", padding:"10px 13px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:C.text, background:"#fff", outline:"none", boxSizing:"border-box" };
const card = { background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:12, padding:22, boxShadow:"0 1px 4px rgba(0,0,0,.05)" };
const sideLink = (a) => ({ display:"flex", alignItems:"center", gap:11, padding:"11px 20px", cursor:"pointer", color: a ? "#fff" : "rgba(255,255,255,.6)", background: a ? "rgba(255,255,255,.12)" : "transparent", borderLeft: a ? `3px solid ${C.accent}` : "3px solid transparent", fontSize:13.5, fontFamily:"inherit", border_:"none", outline:"none", width:"100%", textAlign:"left", transition:"all .15s" });

// ─── MINI COMPONENTS ────────────────────────────────────────
const Avatar = ({ initials, size=38, bg=C.primary }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size*.34, flexShrink:0 }}>{initials}</div>
);
const Badge = ({ s }) => {
  const m = STATUS_MAP[s] || { bg:"#f1f5f9", color:"#64748b", dot:"#94a3b8" };
  return <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 9px", borderRadius:20, fontSize:11.5, fontWeight:600, background:m.bg, color:m.color }}>
    <span style={{ width:6, height:6, borderRadius:"50%", background:m.dot, flexShrink:0 }} />{s}
  </span>;
};
const Toggle = ({ on, onChange }) => (
  <div onClick={() => onChange(!on)} style={{ width:42, height:22, borderRadius:11, background: on ? C.green : C.border, cursor:"pointer", position:"relative", flexShrink:0, transition:"background .2s" }}>
    <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left: on ? 23 : 3, transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
  </div>
);
const FormRow = ({ label, children }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:"block", fontSize:12, fontWeight:600, color:C.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:.5 }}>{label}</label>
    {children}
  </div>
);
const Modal = ({ open, onClose, title, children, maxW=520 }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:maxW, maxHeight:"90vh", overflowY:"auto", padding:30, position:"relative" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h2 style={{ margin:0, fontSize:18, color:C.primary }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.muted, lineHeight:1, padding:4 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── TOP BAR ────────────────────────────────────────────────
const TopBar = ({ stats }) => (
  <div style={{ background:C.navy, color:"rgba(255,255,255,.8)", padding:"5px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12.5 }}>
    <span>📢 Toplam çözülen şikayet: <strong style={{ color:"#4ade80" }}>{(stats?.resolved||1847330).toLocaleString()}</strong></span>
    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
      <a href="https://instagram.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{ display:"flex", opacity:.75 }} title="Instagram"><IGIcon size={14} color="#fff" /></a>
      <a href="https://facebook.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{ display:"flex", opacity:.75 }} title="Facebook"><FBIcon size={14} color="#fff" /></a>
      <a href="https://twitter.com/sikayetetkktc" target="_blank" rel="noopener noreferrer" style={{ display:"flex", opacity:.75 }} title="Twitter"><TWIcon size={14} color="#fff" /></a>
      <span style={{ opacity:.4 }}>|</span>
      <span>🌐 sikayetetkktc.com</span>
    </div>
  </div>
);

// ─── NAVBAR ─────────────────────────────────────────────────
const Navbar = ({ page, setPage, user, setUser }) => {
  const [drop, setDrop] = useState(false);
  return (
    <nav style={{ background:"#fff", borderBottom:`2px solid ${C.primary}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:62, position:"sticky", top:0, zIndex:99, boxShadow:"0 2px 8px rgba(0,0,0,.07)" }}>
      {/* Logo */}
      <div onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
        <LogoIcon size={34} />
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:C.primary, lineHeight:1 }}>ŞikayetETKKTC</div>
          <div style={{ fontSize:9.5, color:C.light, letterSpacing:.8 }}>sikayetetkktc.com</div>
        </div>
      </div>
      {/* Nav links */}
      <div style={{ display:"flex", gap:2 }}>
        {[["home","Ana Sayfa"],["complaints","Şikayetler"],["categories","Kategoriler"]].map(([id,label])=>(
          <button key={id} onClick={()=>setPage(id)} style={{ padding:"7px 13px", borderRadius:6, cursor:"pointer", fontSize:13.5, fontWeight: page===id ? 600 : 400, color: page===id ? C.primary : C.muted, background: page===id ? "#e8f0fe" : "transparent", border:"none", fontFamily:"inherit" }}>{label}</button>
        ))}
        {user?.role==="admin" && <button onClick={()=>setPage("admin")} style={{ padding:"7px 13px", borderRadius:6, cursor:"pointer", fontSize:13.5, fontWeight:600, color:C.purple, background:"#ede9fe", border:"none", fontFamily:"inherit" }}>🔧 Admin</button>}
      </div>
      {/* Auth */}
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {user ? (
          <div style={{ position:"relative" }}>
            <div onClick={()=>setDrop(!drop)} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"6px 10px", borderRadius:8, border:`1px solid ${C.border}` }}>
              <Avatar initials={user.avatar} size={28} />
              <span style={{ fontSize:13.5, fontWeight:600 }}>{user.name.split(" ")[0]}</span>
              <span style={{ fontSize:10, color:C.muted }}>{drop?"▲":"▼"}</span>
            </div>
            {drop && (
              <div style={{ position:"absolute", right:0, top:"110%", background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, minWidth:220, boxShadow:"0 8px 24px rgba(0,0,0,.12)", zIndex:200, padding:8 }}>
                <div style={{ padding:"10px 14px 8px", borderBottom:`1px solid ${C.border}`, marginBottom:4 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{user.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{user.email}</div>
                </div>
                {[["profile","👤 Profilimi Düzenle"],["my-complaints","📋 Şikayetlerim"],["notifications","🔔 Bildirimlerim"],["saved","🔖 Kaydedilenler"]].map(([p,l])=>(
                  <button key={p} onClick={()=>{ setPage(p); setDrop(false); }} style={{ ...sideLink(false), padding:"9px 14px", borderRadius:8, border:"none" }}>{l}</button>
                ))}
                <div style={{ borderTop:`1px solid ${C.border}`, marginTop:4, paddingTop:4 }}>
                  <button onClick={()=>{ setUser(null); setPage("home"); setDrop(false); }} style={{ ...sideLink(false), padding:"9px 14px", borderRadius:8, border:"none", color:"rgba(255,100,100,.8)" }}>🚪 Çıkış Yap</button>
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
        <button style={btn("accent","sm")} onClick={()=>setPage(user ? "new-complaint" : "login")}>+ Şikayet Yaz</button>
      </div>
    </nav>
  );
};

// ─── FOOTER ─────────────────────────────────────────────────
const Footer = ({ footerData }) => {
  const fd = footerData || {
    desc: "KKTC'nin bağımsız şikayet platformu. Sesinizi duyurun, değişim yaratın.",
    columns: [
      { title:"Platform", links:[{label:"Şikayetler",url:"#"},{label:"Kategoriler",url:"#"},{label:"Trend100",url:"#"},{label:"Canlı İzle",url:"#"}] },
      { title:"Kurumlar İçin", links:[{label:"Kurumsal Hesap",url:"#"},{label:"Şikayet Yanıtla",url:"#"},{label:"İtibar Yönetimi",url:"#"},{label:"Fiyatlandırma",url:"#"}] },
      { title:"Yardım", links:[{label:"SSS",url:"#"},{label:"Kullanım Kuralları",url:"#"},{label:"Gizlilik",url:"#"},{label:"İletişim",url:"#"}] },
    ],
    copyright: "© 2026 ŞikayetETKKTC. Tüm hakları saklıdır.",
    instagram: "sikayetetkktc",
    facebook: "sikayetetkktc",
    twitter: "sikayetetkktc",
  };
  return (
  <footer style={{ background:C.navy, color:"rgba(255,255,255,.65)", padding:"40px 24px 20px" }}>
    <div style={{ maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:28, marginBottom:28 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
            <LogoIcon size={32} />
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:15, lineHeight:1 }}>ŞikayetETKKTC</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", letterSpacing:.6 }}>sikayetetkktc.com</div>
            </div>
          </div>
          <p style={{ fontSize:12.5, lineHeight:1.65, margin:"0 0 16px" }}>{fd.desc}</p>
          <div style={{ display:"flex", gap:8 }}>
            {fd.instagram && (
              <a href={`https://instagram.com/${fd.instagram}`} target="_blank" rel="noopener noreferrer"
                style={{ width:34, height:34, borderRadius:8, background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <IGIcon size={17} color="#fff" />
              </a>
            )}
            {fd.facebook && (
              <a href={`https://facebook.com/${fd.facebook}`} target="_blank" rel="noopener noreferrer"
                style={{ width:34, height:34, borderRadius:8, background:"#1877F2", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FBIcon size={17} color="#fff" />
              </a>
            )}
            {fd.twitter && (
              <a href={`https://twitter.com/${fd.twitter}`} target="_blank" rel="noopener noreferrer"
                style={{ width:34, height:34, borderRadius:8, background:"#000", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <TWIcon size={17} color="#fff" />
              </a>
            )}
          </div>
        </div>
        {fd.columns.map(col=>(
          <div key={col.title}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:12.5, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>{col.title}</div>
            {col.links.map(link=>(
              <a key={link.label} href={link.url||"#"}
                style={{ display:"block", fontSize:12.5, marginBottom:7, color:"rgba(255,255,255,.65)", textDecoration:"none" }}
                onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.65)"}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:16, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10, fontSize:12 }}>
        <span>{fd.copyright}</span>
        <div style={{ display:"flex", gap:14 }}>
          {["Kullanım Şartları","Gizlilik","Çerez Politikası"].map(l=><span key={l} style={{ cursor:"pointer" }}>{l}</span>)}
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
    <div onClick={()=>onClick(c)} style={{ ...card, cursor:"pointer", position:"relative", overflow:"hidden", borderTop:`3px solid ${cat?.color||C.primary}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <Avatar initials={c.avatar} size={36} bg={cat?.color||C.primary} />
          <div>
            <div style={{ fontWeight:600, fontSize:13.5 }}>{c.author}</div>
            <div style={{ fontSize:11.5, color:C.muted }}>{c.date}</div>
          </div>
        </div>
        <Badge s={c.status} />
      </div>
      <h3 style={{ margin:"0 0 7px", fontSize:14.5, color:C.text, lineHeight:1.4 }}>{c.title}</h3>
      <p style={{ margin:"0 0 12px", fontSize:12.5, color:C.muted, lineHeight:1.55 }}>{c.body.substring(0,110)}...</p>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12 }}>
        <span style={{ background:(cat?.color||C.primary)+"18", color:cat?.color||C.primary, padding:"2px 9px", borderRadius:20, fontWeight:600, fontSize:11.5 }}>{cat?.icon} {c.company}</span>
        <div style={{ display:"flex", gap:12, color:C.muted }}>
          <span>👁 {c.views.toLocaleString()}</span>
          <span>👍 {c.votes}</span>
          <span>💬 {c.comments}</span>
        </div>
      </div>
    </div>
  );
};

// ─── HOME PAGE ──────────────────────────────────────────────
const HomePage = ({ setPage, setSelected, user }) => {
  const [search, setSearch] = useState("");
  const filtered = search ? MOCK_COMPLAINTS.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase())) : MOCK_COMPLAINTS;

  return (
    <div>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, ${C.primary} 55%, #1e5fa0 100%)`, padding:"60px 24px", textAlign:"center", color:"#fff" }}>
        <div style={{ display:"inline-block", background:C.accent, padding:"3px 14px", borderRadius:20, fontSize:12.5, fontWeight:600, marginBottom:14, letterSpacing:.5 }}>🇨🇾 KKTC'nin Güvenilir Şikayet Platformu</div>
        <h1 style={{ fontSize:38, fontWeight:800, margin:"0 0 14px", lineHeight:1.2 }}>Sesinizi Duyurun,<br />Çözüm Bulun!</h1>
        <p style={{ fontSize:16.5, opacity:.82, maxWidth:520, margin:"0 auto 28px", lineHeight:1.65 }}>
          Kıbrıs'ta kamu kurumlarından özel işletmelere her türlü şikayetinizi kayıt altına alın.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button style={btn("accent","lg")} onClick={()=>setPage(user?"new-complaint":"login")}>+ Şikayet Yaz</button>
          <button style={{ ...btn("secondary","lg"), color:"#fff", borderColor:"rgba(255,255,255,.45)" }} onClick={()=>setPage("complaints")}>Tüm Şikayetler</button>
        </div>
      </div>
      {/* Stats */}
      <div style={{ background:C.accent, padding:"14px 24px", display:"flex", justifyContent:"center", gap:44, flexWrap:"wrap" }}>
        {[["4.282.012","Toplam Şikayet"],["1.847.330","Çözülen"],["342.891","Üye"],["8.92M","Aylık Ziyaretçi"]].map(([n,l])=>(
          <div key={l} style={{ textAlign:"center", color:"#fff" }}>
            <div style={{ fontSize:20, fontWeight:800 }}>{n}</div>
            <div style={{ fontSize:11, opacity:.88, textTransform:"uppercase", letterSpacing:.6 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px 24px" }}>
        {/* Search */}
        <div style={{ ...card, marginBottom:28, padding:"16px 20px" }}>
          <div style={{ display:"flex", gap:10 }}>
            <input style={{ ...inp, fontSize:15, padding:"11px 15px" }} placeholder="🔍  Kurum adı, şikayet konusu veya kategori ara..." value={search} onChange={e=>setSearch(e.target.value)} />
            <button style={btn("primary","lg")}>Ara</button>
          </div>
        </div>
        {/* Categories strip */}
        <div style={{ marginBottom:36 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.primary }}>Kategoriler</h2>
            <button style={btn("ghost","sm")} onClick={()=>setPage("categories")}>Tümünü Gör →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:12 }}>
            {PRESET_CATEGORIES.slice(0,8).map(cat=>(
              <div key={cat.id} onClick={()=>setPage("complaints")} style={{ ...card, cursor:"pointer", textAlign:"center", padding:"16px 12px", borderTop:`3px solid ${cat.color}` }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{cat.icon}</div>
                <div style={{ fontWeight:600, fontSize:13, marginBottom:3 }}>{cat.name}</div>
                <div style={{ fontSize:11.5, color:C.muted }}>{cat.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Recent complaints */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.primary }}>Son Şikayetler</h2>
            <button style={btn("ghost","sm")} onClick={()=>setPage("complaints")}>Tümünü Gör →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
            {filtered.map(c=><ComplaintCard key={c.id} c={c} onClick={c=>{ setSelected(c); setPage("detail"); }} />)}
          </div>
        </div>
        {/* Why us */}
        <div style={{ marginTop:44 }}>
          <h2 style={{ margin:"0 0 20px", fontSize:20, fontWeight:800, color:C.primary }}>Neden ŞikayetETKKTC?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:14 }}>
            {[["🛡️","Güvenilir Platform","KKTC hukuku çerçevesinde, kimliğiniz korunarak."],["⚡","Hızlı Çözüm","Şikayetleriniz doğrudan ilgili kurumlarla paylaşılır."],["📊","Anlık Takip","Şikayetinizin durumunu her an takip edin."],["🔔","E-posta Bildirimi","Cevap geldiğinde anında bildirim alın."],["🤖","AI Destekli","Yapay zeka ile şikayetinizi profesyonelce oluşturun."],["👥","Topluluk","Diğer kullanıcılar şikayetinizi destekleyebilir."]].map(([i,t,d])=>(
              <div key={t} style={{ ...card, padding:18 }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{i}</div>
                <h3 style={{ margin:"0 0 5px", fontSize:14, color:C.primary }}>{t}</h3>
                <p style={{ margin:0, fontSize:12.5, color:C.muted, lineHeight:1.5 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* CTA */}
      <div style={{ background:C.primary, padding:"44px 24px", textAlign:"center", color:"#fff" }}>
        <h2 style={{ fontSize:26, marginBottom:10 }}>Şikayetinizi Bir Kurum Görmeli</h2>
        <p style={{ opacity:.8, marginBottom:22, fontSize:15 }}>KKTC'de yaşadığınız sorunları bizimle paylaşın.</p>
        <button style={btn("accent","lg")} onClick={()=>setPage(user?"new-complaint":"login")}>Ücretsiz Şikayet Yaz</button>
      </div>
    </div>
  );
};

// ─── CATEGORIES PAGE (with custom category add) ─────────────
const CategoriesPage = ({ setPage }) => {
  const [categories, setCategories] = useState(PRESET_CATEGORIES);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name:"", icon:"📌", color:C.blue });
  const ICON_OPTIONS = ["📌","🏢","🚗","🌿","💊","🎵","🍔","🏋️","✈️","📱","💻","🏦","🛠️","🎭","🏪","🏗️","🌊","🔌"];

  const addCategory = () => {
    if (!newCat.name.trim()) return;
    setCategories([...categories, { id: Date.now(), ...newCat, count: 0, custom: true }]);
    setNewCat({ name:"", icon:"📌", color:C.blue });
    setShowAdd(false);
  };

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ margin:"0 0 4px", fontSize:26, fontWeight:800, color:C.primary }}>Tüm Kategoriler</h1>
          <p style={{ margin:0, color:C.muted, fontSize:14 }}>{categories.length} kategori · {categories.filter(c=>c.custom).length} kullanıcı tarafından eklendi</p>
        </div>
        <button style={btn("primary")} onClick={()=>setShowAdd(true)}>+ Yeni Kategori Ekle</button>
      </div>

      {/* Preset categories */}
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:15, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.8, marginBottom:14 }}>Standart Kategoriler</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:14 }}>
          {categories.filter(c=>!c.custom).map(cat=>(
            <div key={cat.id} onClick={()=>setPage("complaints")} style={{ ...card, cursor:"pointer", borderLeft:`4px solid ${cat.color}`, padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={{ fontSize:26 }}>{cat.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{cat.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{cat.count.toLocaleString()} şikayet</div>
                </div>
              </div>
              <div style={{ height:5, borderRadius:3, background:C.bg }}>
                <div style={{ height:"100%", width:`${Math.min((cat.count/12840)*100,100)}%`, background:cat.color, borderRadius:3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom categories */}
      {categories.filter(c=>c.custom).length > 0 && (
        <div>
          <h2 style={{ fontSize:15, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.8, marginBottom:14 }}>Kullanıcı Kategorileri</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:14 }}>
            {categories.filter(c=>c.custom).map(cat=>(
              <div key={cat.id} style={{ ...card, borderLeft:`4px solid ${cat.color}`, padding:"16px 18px", position:"relative" }}>
                <div style={{ position:"absolute", top:10, right:10, background:C.accent+"15", color:C.accent, fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20 }}>Kullanıcı</div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:26 }}>{cat.icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14 }}>{cat.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>0 şikayet</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No custom yet */}
      {categories.filter(c=>c.custom).length === 0 && (
        <div style={{ ...card, textAlign:"center", padding:36, background:"#fafbfc", border:`2px dashed ${C.border}` }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📂</div>
          <h3 style={{ margin:"0 0 6px", fontSize:16, color:C.primary }}>Henüz Kullanıcı Kategorisi Yok</h3>
          <p style={{ color:C.muted, fontSize:14, marginBottom:16 }}>İhtiyaç duyduğunuz bir kategori yoksa kendiniz ekleyebilirsiniz.</p>
          <button style={btn("primary")} onClick={()=>setShowAdd(true)}>+ İlk Kategoriyi Ekle</button>
        </div>
      )}

      {/* Add modal */}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Yeni Kategori Ekle">
        <FormRow label="Kategori Adı">
          <input style={inp} placeholder="Örn: Çevre Sorunları, Gürültü Şikayetleri..." value={newCat.name} onChange={e=>setNewCat({...newCat, name:e.target.value})} />
        </FormRow>
        <FormRow label="İkon Seç">
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {ICON_OPTIONS.map(ic=>(
              <button key={ic} onClick={()=>setNewCat({...newCat, icon:ic})} style={{ width:40, height:40, borderRadius:8, border:`2px solid ${newCat.icon===ic ? C.primary : C.border}`, background: newCat.icon===ic ? "#e8f0fe" : "#fff", cursor:"pointer", fontSize:18 }}>{ic}</button>
            ))}
          </div>
        </FormRow>
        <FormRow label="Renk Seç">
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[C.blue, C.accent, C.green, C.purple, C.amber, "#0891b2", "#7c3aed", "#059669", "#dc2626", "#f97316"].map(col=>(
              <button key={col} onClick={()=>setNewCat({...newCat, color:col})} style={{ width:32, height:32, borderRadius:"50%", background:col, border: newCat.color===col ? `3px solid ${C.text}` : "3px solid transparent", cursor:"pointer" }} />
            ))}
          </div>
        </FormRow>
        {/* Preview */}
        <div style={{ ...card, display:"flex", alignItems:"center", gap:12, marginBottom:20, borderLeft:`4px solid ${newCat.color}` }}>
          <div style={{ fontSize:26 }}>{newCat.icon}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color: newCat.name ? C.text : C.muted }}>{newCat.name || "Kategori adı..."}</div>
            <div style={{ fontSize:12, color:C.muted }}>Önizleme</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ ...btn("ghost"), flex:1 }} onClick={()=>setShowAdd(false)}>İptal</button>
          <button style={{ ...btn("primary"), flex:1 }} onClick={addCategory} disabled={!newCat.name.trim()}>✓ Kategori Ekle</button>
        </div>
      </Modal>
    </div>
  );
};

// ─── COMPLAINTS LIST ────────────────────────────────────────
const ComplaintsPage = ({ setPage, setSelected }) => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const filtered = MOCK_COMPLAINTS.filter(c => filter==="all" || c.status===filter);
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"34px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:C.primary }}>Tüm Şikayetler</h1>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[["all","Tümü"],["Açık","Açık"],["İnceleniyor","İnceleniyor"],["Çözüldü","Çözüldü"]].map(([v,l])=>(
            <button key={v} style={btn(filter===v?"primary":"ghost","sm")} onClick={()=>setFilter(v)}>{l}</button>
          ))}
          <select style={{ ...inp, width:"auto", padding:"6px 10px", fontSize:13 }} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">En Yeni</option><option value="popular">En Popüler</option><option value="votes">En Çok Oy</option>
          </select>
        </div>
      </div>
      <div style={{ display:"flex", gap:22 }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:14 }}>
          {filtered.map(c=>(
            <div key={c.id} onClick={()=>{ setSelected(c); setPage("detail"); }} style={{ ...card, cursor:"pointer", borderLeft:`4px solid ${STATUS_MAP[c.status]?.dot||C.primary}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <Avatar initials={c.avatar} size={34} bg={PRESET_CATEGORIES.find(x=>x.name===c.category)?.color||C.primary} />
                  <div>
                    <span style={{ fontWeight:600, fontSize:13.5 }}>{c.author}</span>
                    <span style={{ fontSize:12, color:C.muted, marginLeft:8 }}>{c.date} · {c.category}</span>
                  </div>
                </div>
                <Badge s={c.status} />
              </div>
              <h3 style={{ margin:"0 0 7px", fontSize:15, color:C.text }}>{c.title}</h3>
              <p style={{ margin:"0 0 10px", fontSize:13, color:C.muted, lineHeight:1.5 }}>{c.body.substring(0,170)}...</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12.5 }}>
                <span style={{ background:C.primary+"15", color:C.primary, padding:"2px 9px", borderRadius:20, fontWeight:600, fontSize:12 }}>🏢 {c.company}</span>
                <div style={{ display:"flex", gap:14, color:C.muted }}>
                  <span>👁 {c.views.toLocaleString()}</span><span>👍 {c.votes}</span><span>💬 {c.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
        <div style={{ width:248, flexShrink:0 }}>
          <div style={{ ...card, marginBottom:14 }}>
            <h3 style={{ margin:"0 0 14px", fontSize:14.5, color:C.primary, fontWeight:700 }}>Kategoriler</h3>
            {PRESET_CATEGORIES.slice(0,8).map(cat=>(
              <div key={cat.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}`, fontSize:13, cursor:"pointer" }}>
                <span>{cat.icon} {cat.name}</span>
                <span style={{ color:C.muted, fontSize:12 }}>{cat.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ ...card, background:C.primary, color:"#fff" }}>
            <h3 style={{ margin:"0 0 6px", fontSize:14.5 }}>Şikayet Yaz</h3>
            <p style={{ fontSize:12.5, opacity:.8, marginBottom:14 }}>Sorununuzu bizimle paylaşın.</p>
            <button style={btn("accent")} onClick={()=>setPage("new-complaint")}>+ Oluştur</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── COMPLAINT DETAIL ────────────────────────────────────────
const DetailPage = ({ complaint, setPage, user }) => {
  const [vote, setVote] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id:1, author:"Kemal A.", avatar:"KA", text:"Aynı sorunu ben de yaşadım. Bu kurumun hesap vermesi lazım.", date:"22 Mart 2026", likes:12 },
    { id:2, author:"Zeynep M.", avatar:"ZM", text:"Şikayetinizi destekliyorum. Lütfen ilgili bakanlığa da bildirin.", date:"21 Mart 2026", likes:8 },
  ]);
  if (!complaint) return null;
  const cat = PRESET_CATEGORIES.find(x=>x.name===complaint.category);
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"30px 24px" }}>
      <button style={btn("ghost","sm")} onClick={()=>setPage("complaints")}>← Tüm Şikayetler</button>
      <div style={{ display:"flex", gap:22, marginTop:18 }}>
        <div style={{ flex:1 }}>
          <div style={{ ...card, borderTop:`4px solid ${cat?.color||C.primary}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Avatar initials={complaint.avatar} size={40} bg={cat?.color||C.primary} />
                <div>
                  <div style={{ fontWeight:600 }}>{complaint.author}</div>
                  <div style={{ fontSize:12.5, color:C.muted }}>{complaint.date} · {complaint.category}</div>
                </div>
              </div>
              <Badge s={complaint.status} />
            </div>
            <h1 style={{ fontSize:20, margin:"0 0 10px", color:C.primary, lineHeight:1.3 }}>{complaint.title}</h1>
            <div style={{ display:"flex", gap:7, marginBottom:18, flexWrap:"wrap" }}>
              <span style={{ background:(cat?.color||C.primary)+"18", color:cat?.color||C.primary, padding:"3px 10px", borderRadius:20, fontWeight:600, fontSize:12 }}>🏢 {complaint.company}</span>
              <span style={{ background:C.bg, color:C.muted, padding:"3px 10px", borderRadius:20, fontSize:12 }}>📁 {complaint.category}</span>
            </div>
            <p style={{ fontSize:14.5, lineHeight:1.7, color:C.text, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>{complaint.body}</p>
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, marginTop:14, display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ fontSize:13, color:C.muted }}>Faydalı mı?</span>
              <button style={btn(vote==="up"?"success":"ghost","sm")} onClick={()=>setVote(vote==="up"?null:"up")}>👍 {complaint.votes+(vote==="up"?1:0)}</button>
              <button style={btn(vote==="down"?"danger":"ghost","sm")} onClick={()=>setVote(vote==="down"?null:"down")}>👎</button>
              <span style={{ marginLeft:"auto", fontSize:12.5, color:C.muted }}>👁 {complaint.views.toLocaleString()}</span>
            </div>
          </div>
          {/* Comments */}
          <div style={{ marginTop:22 }}>
            <h2 style={{ fontSize:17, color:C.primary, marginBottom:14, fontWeight:700 }}>Yorumlar ({comments.length})</h2>
            {comments.map(c=>(
              <div key={c.id} style={{ ...card, marginBottom:10 }}>
                <div style={{ display:"flex", gap:10 }}>
                  <Avatar initials={c.avatar} size={34} bg={C.accent} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontWeight:600, fontSize:13.5 }}>{c.author}</span>
                      <span style={{ fontSize:12, color:C.muted }}>{c.date}</span>
                    </div>
                    <p style={{ margin:"0 0 7px", fontSize:13.5, lineHeight:1.5 }}>{c.text}</p>
                    <button style={btn("ghost","sm")}>👍 {c.likes}</button>
                  </div>
                </div>
              </div>
            ))}
            {user ? (
              <div style={card}>
                <h3 style={{ margin:"0 0 10px", fontSize:14.5 }}>Yorum Yaz</h3>
                <textarea style={{ ...inp, minHeight:90, marginBottom:10 }} placeholder="Yorumunuzu yazın..." value={comment} onChange={e=>setComment(e.target.value)} />
                <button style={btn("primary")} onClick={()=>{ if(comment.trim()){ setComments([...comments,{ id:Date.now(), author:user.name, avatar:user.avatar, text:comment, date:"22 Mart 2026", likes:0 }]); setComment(""); } }}>Gönder</button>
              </div>
            ) : (
              <div style={{ ...card, textAlign:"center" }}>
                <p style={{ color:C.muted, marginBottom:10 }}>Yorum yapmak için giriş yapın.</p>
                <button style={btn("primary")} onClick={()=>setPage("login")}>Giriş Yap</button>
              </div>
            )}
          </div>
        </div>
        {/* Sidebar */}
        <div style={{ width:240, flexShrink:0 }}>
          <div style={{ ...card, marginBottom:14 }}>
            <h3 style={{ margin:"0 0 14px", fontSize:14.5, color:C.primary, fontWeight:700 }}>Durum Takibi</h3>
            {[["Açık","Yayınlandı",true],["İnceleniyor","Kurum inceliyor",complaint.status!=="Açık"],["Çözüldü","Sorun çözüldü",complaint.status==="Çözüldü"]].map(([s,d,done],i)=>(
              <div key={i} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"center" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background: done ? C.green : C.border, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, flexShrink:0 }}>{done?"✓":i+1}</div>
                <div><div style={{ fontSize:13, fontWeight:600 }}>{s}</div><div style={{ fontSize:11.5, color:C.muted }}>{d}</div></div>
              </div>
            ))}
          </div>
          <div style={card}>
            <h3 style={{ margin:"0 0 12px", fontSize:14.5, color:C.primary, fontWeight:700 }}>İstatistikler</h3>
            {[["Görüntülenme",complaint.views.toLocaleString()],["Oy",complaint.votes],["Yorum",complaint.comments]].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}`, fontSize:13.5 }}>
                <span style={{ color:C.muted }}>{l}</span><span style={{ fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AI COMPLAINT WIZARD ─────────────────────────────────────
const AIComplaintPage = ({ user, setPage }) => {
  const [messages, setMessages] = useState([
    { role:"ai", text:"Merhaba! Şikayetinizi birlikte oluşturalım. Hangi kurum veya işletme hakkında şikayetiniz var?" }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1); // 1=company, 2=category, 3=detail, 4=preview
  const [draft, setDraft] = useState({ company:"", category:"", title:"", body:"" });
  const [isTyping, setIsTyping] = useState(false);
  const [useForm, setUseForm] = useState(false); // toggle AI vs form
  const msgRef = useRef(null);

  const scrollToBottom = () => { if(msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight; };
  useEffect(scrollToBottom, [messages]);

  const AI_STEPS = {
    1: (input) => {
      setDraft(d => ({...d, company: input}));
      return { text:`"${input}" hakkında bir şikayet oluşturacağız. 📁 Bu şikayet hangi kategoriye giriyor?\n\n${PRESET_CATEGORIES.slice(0,6).map((c,i)=>`${i+1}. ${c.icon} ${c.name}`).join("\n")}\n\nBir numara yazın veya farklı bir kategori belirtin.`, next: 2 };
    },
    2: (input) => {
      const catIdx = parseInt(input) - 1;
      const catName = PRESET_CATEGORIES[catIdx]?.name || input;
      setDraft(d => ({...d, category: catName}));
      return { text:`"${catName}" kategorisini seçtiniz. ✅\n\nŞimdi yaşadığınız sorunu detaylıca anlatın. Ne oldu, ne zaman oldu, ne bekliyorsunuz? Ne kadar detaylı yazarsanız o kadar etkili olur.`, next: 3 };
    },
    3: (input) => {
      const title = input.length > 60 ? input.substring(0,57)+"..." : input;
      setDraft(d => ({...d, body: input, title: title}));
      return { text:`Şikayetiniz hazırlanıyor... 🤖\n\n**Oluşturulan Şikayet Özeti:**\n📍 Kurum: ${draft.company}\n📁 Kategori: ${draft.category}\n📝 Başlık: "${title}"\n\nŞikayetinizi yayınlamak için 'Onayla ve Yayınla' yazın, düzenlemek için 'Düzenle' yazın.`, next: 4 };
    },
    4: (input) => {
      if (input.toLowerCase().includes("onayla")) {
        return { text:"✅ Şikayetiniz başarıyla yayınlandı! Yanıt geldiğinde e-posta ile bilgilendirileceksiniz.", next:5 };
      }
      return { text:"Hangi kısmı değiştirmek istiyorsunuz? (kurum / kategori / detay)", next:3 };
    }
  };

  const send = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role:"user", text:userMsg }]);
    setIsTyping(true);
    setTimeout(() => {
      const resp = AI_STEPS[step]?.(userMsg);
      if (resp) {
        setMessages(m => [...m, { role:"ai", text:resp.text }]);
        setStep(resp.next);
      }
      setIsTyping(false);
    }, 900);
  };

  if (!user) return (
    <div style={{ maxWidth:480, margin:"60px auto", padding:"0 24px" }}>
      <div style={card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🔐</div>
          <h2 style={{ color:C.primary }}>Giriş Gerekli</h2>
          <p style={{ color:C.muted }}>Şikayet oluşturmak için lütfen giriş yapın.</p>
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <button style={{ ...btn("primary"), flex:1 }} onClick={()=>setPage("login")}>Giriş Yap</button>
            <button style={{ ...btn("secondary"), flex:1 }} onClick={()=>setPage("register")}>Üye Ol</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", height:"calc(100vh - 130px)" }}>
      {/* Left panel */}
      <div style={{ width:220, background:C.navy, display:"flex", flexDirection:"column", padding:24, gap:16 }}>
        <div>
          <div style={{ width:48, height:48, borderRadius:12, background:C.purple, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:12 }}>✏️</div>
          <h2 style={{ color:"#fff", margin:0, fontSize:16, fontWeight:700 }}>Şikayet Oluştur</h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {[["1","Şikayet Detayı",step>=1],["2","Marka / Kurum",step>=2],["3","Belge Ekle",step>=3]].map(([n,l,done])=>(
            <div key={n} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 0" }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background: done ? C.green : "rgba(255,255,255,.15)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{done&&step>parseInt(n)?"✓":n}</div>
              <span style={{ fontSize:13, color: done ? "#fff" : "rgba(255,255,255,.45)" }}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:"auto" }}>
          <button style={{ ...btn("ghost","sm"), color:"rgba(255,255,255,.5)", borderColor:"rgba(255,255,255,.15)", width:"100%" }} onClick={()=>setUseForm(!useForm)}>
            {useForm ? "🤖 AI Moduna Geç" : "📝 Form Moduna Geç"}
          </button>
        </div>
      </div>

      {/* Right: Chat or Form */}
      {!useForm ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#f8fafc" }}>
          {/* Top bar */}
          <div style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#fff", display:"flex", alignItems:"center", gap:12 }}>
            <Avatar initials={user.avatar} size={28} />
            <div style={{ flex:1, display:"flex", gap:14, justifyContent:"center", fontSize:13, color:C.muted }}>
              <span>Şikayetler</span><span>Trend100</span><span>TV</span>
            </div>
          </div>
          {/* Messages */}
          <div ref={msgRef} style={{ flex:1, overflowY:"auto", padding:24, display:"flex", flexDirection:"column", gap:14 }}>
            {messages.map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth:"72%", padding:"11px 16px", borderRadius: m.role==="user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: m.role==="user" ? C.primary : "#fff", color: m.role==="user" ? "#fff" : C.text, fontSize:14, lineHeight:1.55, boxShadow:"0 1px 3px rgba(0,0,0,.08)", whiteSpace:"pre-wrap" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display:"flex" }}>
                <div style={{ background:"#fff", padding:"11px 16px", borderRadius:"4px 16px 16px 16px", fontSize:14, color:C.muted, boxShadow:"0 1px 3px rgba(0,0,0,.08)" }}>
                  <span style={{ animation:"pulse 1s infinite" }}>● ● ●</span>
                </div>
              </div>
            )}
          </div>
          {/* Input */}
          <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}`, background:"#fff", display:"flex", gap:10 }}>
            <input style={{ ...inp, flex:1 }} placeholder="Cevabınızı buraya yazın..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} />
            <button style={{ width:42, height:42, borderRadius:"50%", background: input.trim() ? C.green : C.border, border:"none", cursor: input.trim() ? "pointer" : "default", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, flexShrink:0 }} onClick={send}>➤</button>
          </div>
        </div>
      ) : (
        // Form mode
        <div style={{ flex:1, padding:32, overflowY:"auto", background:"#f8fafc" }}>
          <h2 style={{ margin:"0 0 24px", color:C.primary, fontSize:20, fontWeight:700 }}>Şikayet Formu</h2>
          <div style={{ ...card, maxWidth:580 }}>
            <FormRow label="Şikayet Başlığı">
              <input style={inp} placeholder="Kısa ve açıklayıcı bir başlık" value={draft.title} onChange={e=>setDraft({...draft, title:e.target.value})} />
            </FormRow>
            <FormRow label="Kategori">
              <select style={inp} value={draft.category} onChange={e=>setDraft({...draft, category:e.target.value})}>
                <option value="">Seçin</option>
                {PRESET_CATEGORIES.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
              </select>
            </FormRow>
            <FormRow label="Kurum / İşletme">
              <input style={inp} placeholder="Şikayet ettiğiniz kurum adı" value={draft.company} onChange={e=>setDraft({...draft, company:e.target.value})} />
            </FormRow>
            <FormRow label="Şikayet Detayı">
              <textarea style={{ ...inp, minHeight:140, resize:"vertical" }} placeholder="Ne oldu, ne zaman oldu, ne bekliyorsunuz?" value={draft.body} onChange={e=>setDraft({...draft, body:e.target.value})} />
            </FormRow>
            <FormRow label="Dosya Ekle (isteğe bağlı)">
              <div style={{ border:`2px dashed ${C.border}`, borderRadius:8, padding:18, textAlign:"center", color:C.muted, cursor:"pointer" }}>
                📎 Fotoğraf veya PDF yükleyin (maks. 5 dosya · 10MB)
              </div>
            </FormRow>
            <button style={{ ...btn("success","lg"), width:"100%" }} onClick={()=>setPage("complaints")}>✓ Şikayeti Yayınla</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AUTH PAGES ──────────────────────────────────────────────
const LoginPage = ({ setPage, setUser }) => {
  const [form, setForm] = useState({ email:"", pass:"" });
  const [err, setErr] = useState("");
  return (
    <div style={{ maxWidth:440, margin:"56px auto", padding:"0 24px" }}>
      <div style={card}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:38, marginBottom:8 }}>🔐</div>
          <h1 style={{ fontSize:22, margin:"0 0 6px", color:C.primary }}>Giriş Yap</h1>
          <p style={{ color:C.muted, margin:0, fontSize:13.5 }}>ŞikayetETKKTC hesabınıza giriş yapın</p>
        </div>
        {err && <div style={{ background:"#fee2e2", color:"#dc2626", padding:"9px 13px", borderRadius:8, marginBottom:14, fontSize:13 }}>⚠️ {err}</div>}
        <FormRow label="E-posta"><input style={inp} type="email" placeholder="ornek@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></FormRow>
        <FormRow label="Şifre"><input style={inp} type="password" placeholder="••••••••" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})} /></FormRow>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:18 }}>
          <span style={{ fontSize:13, color:C.blue, cursor:"pointer" }}>Şifremi Unuttum</span>
        </div>
        <button style={{ ...btn("primary","lg"), width:"100%" }} onClick={()=>{ if(form.email&&form.pass){ setUser({ name:"Kerem Çelik", email:form.email, avatar:"KC", role:"user" }); setPage("home"); } else setErr("E-posta ve şifre gereklidir."); }}>Giriş Yap</button>
        <div style={{ borderTop:`1px solid ${C.border}`, marginTop:18, paddingTop:14, display:"flex", gap:8 }}>
          <button style={{ ...btn("ghost","sm"), flex:1 }} onClick={()=>{ setUser({ name:"Admin", email:"admin@sikayetetkktc.com", avatar:"AD", role:"admin" }); setPage("admin"); }}>🔧 Admin Demo</button>
          <button style={{ ...btn("ghost","sm"), flex:1 }} onClick={()=>{ setUser({ name:"Test Kullanıcı", email:"test@test.com", avatar:"TK", role:"user" }); setPage("home"); }}>👤 Kullanıcı Demo</button>
        </div>
        <div style={{ textAlign:"center", marginTop:14, fontSize:13.5 }}>
          <span style={{ color:C.muted }}>Hesabınız yok mu? </span>
          <span style={{ color:C.blue, cursor:"pointer", fontWeight:600 }} onClick={()=>setPage("register")}>Üye Ol</span>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = ({ setPage, setUser }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", pass:"", city:"", agree:false, newsletter:false });
  return (
    <div style={{ maxWidth:500, margin:"56px auto", padding:"0 24px" }}>
      <div style={card}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <h1 style={{ fontSize:22, margin:"0 0 5px", color:C.primary }}>Üye Ol</h1>
          <p style={{ color:C.muted, margin:0, fontSize:13.5 }}>KKTC'nin güvenilir sesine katılın</p>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:22 }}>
          {[1,2].map(s=><div key={s} style={{ flex:1, height:4, borderRadius:2, background: s<=step ? C.primary : C.border }} />)}
        </div>
        {step===1 && <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <FormRow label="Ad"><input style={inp} placeholder="Adınız" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} /></FormRow>
            <FormRow label="Soyad"><input style={inp} placeholder="Soyadınız" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} /></FormRow>
          </div>
          <FormRow label="E-posta"><input style={inp} type="email" placeholder="ornek@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></FormRow>
          <FormRow label="Telefon"><input style={inp} placeholder="0533 000 00 00" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></FormRow>
          <button style={{ ...btn("primary","lg"), width:"100%" }} onClick={()=>setStep(2)} disabled={!form.firstName||!form.email}>Devam Et →</button>
        </>}
        {step===2 && <>
          <FormRow label="Şifre"><input style={inp} type="password" placeholder="En az 8 karakter" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})} /></FormRow>
          <FormRow label="Şehir">
            <select style={inp} value={form.city} onChange={e=>setForm({...form,city:e.target.value})}>
              <option value="">Şehir Seçin</option>
              {["Lefkoşa","Gazimağusa","Girne","Güzelyurt","İskele"].map(c=><option key={c}>{c}</option>)}
            </select>
          </FormRow>
          <div style={{ marginBottom:14 }}>
            {[["agree","Kullanım Koşulları'nı okudum, kabul ediyorum."],["newsletter","Haberdar olmak istiyorum (opsiyonel)"]].map(([k,l])=>(
              <label key={k} style={{ display:"flex", alignItems:"flex-start", gap:9, fontSize:13, color:C.muted, marginBottom:10, cursor:"pointer" }}>
                <input type="checkbox" checked={form[k]} onChange={e=>setForm({...form,[k]:e.target.checked})} style={{ marginTop:2 }} />{l}
              </label>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button style={{ ...btn("ghost"), flex:1 }} onClick={()=>setStep(1)}>← Geri</button>
            <button style={{ ...btn("success"), flex:1 }} onClick={()=>{ setUser({ name:`${form.firstName} ${form.lastName}`, email:form.email, avatar:(form.firstName[0]+(form.lastName[0]||"")).toUpperCase(), role:"user" }); setPage("home"); }} disabled={!form.pass||!form.agree}>✓ Kayıt Ol</button>
          </div>
        </>}
        <div style={{ textAlign:"center", marginTop:14, fontSize:13.5 }}>
          <span style={{ color:C.muted }}>Zaten hesabınız var mı? </span>
          <span style={{ color:C.blue, cursor:"pointer", fontWeight:600 }} onClick={()=>setPage("login")}>Giriş Yap</span>
        </div>
      </div>
    </div>
  );
};

// ─── USER PANEL ──────────────────────────────────────────────
const UserPanel = ({ user, setUser, setPage, initTab="profile" }) => {
  const [tab, setTab] = useState(initTab);
  const [profileStrength, setProfileStrength] = useState(33);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    solutionBrowser:true, solutionEmail:true, passwordChange:false, complaintReview:true,
    complaintChat:false, smsPromo:false, unpublished:true, replyNotif:true, commentNotif:false,
  });
  const [profileForm, setProfileForm] = useState({ name:user?.name||"", email:user?.email||"", phone:"", city:"" });

  const sideItems = [
    { id:"profile", label:"Profilimi Düzenle", sub:[{ id:"notif-prefs", label:"Bildirim Tercihleri" },{ id:"delete-acc", label:"Hesabımı Sil" }] },
    { id:"my-complaints", label:"Şikayetlerim" },
    { id:"notifications", label:"Bildirimlerim" },
    { id:"supported", label:"Desteklediklerim" },
    { id:"commented", label:"Yorumladıklarım" },
    { id:"saved", label:"Kaydedilenler" },
    { id:"tests", label:"Teste Katıl" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"calc(100vh - 130px)" }}>
      {/* Sidebar */}
      <div style={{ width:220, background:C.navy, flexShrink:0 }}>
        <div style={{ padding:"20px 16px 12px" }}>
          {sideItems.map(item=>(
            <div key={item.id}>
              <button style={{ ...sideLink(tab===item.id), padding:"10px 16px", borderRadius:7, border:"none", width:"100%" }} onClick={()=>setTab(item.id)}>{item.label}</button>
              {item.sub && item.id==="profile" && tab.startsWith("profile") || tab==="notif-prefs" || tab==="delete-acc" ? item.sub?.map(s=>(
                <button key={s.id} style={{ ...sideLink(tab===s.id), paddingLeft:32, fontSize:12.5, border:"none", width:"100%", borderRadius:0 }} onClick={()=>setTab(s.id)}>{s.label}</button>
              )) : null}
            </div>
          ))}
        </div>
        <div style={{ padding:"0 16px 16px", marginTop:"auto" }}>
          <button style={{ ...btn("accent"), width:"100%", justifyContent:"center" }} onClick={()=>setPage("new-complaint")}>Şikayet Yaz ✏️</button>
          <button style={{ ...sideLink(false), marginTop:8, border:"none" }} onClick={()=>{ setUser(null); setPage("home"); }}>🚪 Çıkış Yap</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:32, background:"#f5f7fb", overflowY:"auto" }}>

        {/* Profile */}
        {tab==="profile" && (
          <div style={{ maxWidth:680 }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:24 }}>
              <div style={{ position:"relative" }}>
                <Avatar initials={user.avatar} size={72} bg={C.primary} />
              </div>
              <div>
                <h2 style={{ margin:"0 0 4px", fontSize:20, color:C.text }}>{user.name}</h2>
                <div style={{ display:"flex", gap:8 }}>
                  <button style={btn("success","sm")}>📷 Yeni Fotoğraf Yükle</button>
                  <button style={btn("ghost","sm")}>Kaldır</button>
                </div>
              </div>
              {/* Strength */}
              <div style={{ marginLeft:"auto", ...card, minWidth:220 }}>
                <div style={{ fontSize:13.5, fontWeight:600, marginBottom:6 }}>Profilinizin Gücü: <span style={{ color:C.green }}>%{profileStrength}</span></div>
                <div style={{ height:6, borderRadius:3, background:C.border, marginBottom:10 }}>
                  <div style={{ height:"100%", width:`${profileStrength}%`, background: profileStrength>66?C.green:profileStrength>33?C.amber:C.red, borderRadius:3, transition:"width .4s" }} />
                </div>
                {[{ label:"E-Postanı Doğrula", done:false },{ label:"Profil Fotoğrafı Yükle", done:true },{ label:"Telefonunu Doğrula", done:false }].map(s=>(
                  <div key={s.label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12.5, color: s.done ? C.green : C.blue, marginBottom:4, cursor:"pointer" }}>
                    <span style={{ fontSize:13 }}>{s.done?"✅":"➕"}</span>{s.label}
                  </div>
                ))}
              </div>
            </div>
            {/* Stats */}
            <div style={{ display:"flex", gap:16, marginBottom:24 }}>
              {[["Şikayetlerin","8"],["Desteklerin","24"],["Yaptığın Yorumlar","12"]].map(([l,v])=>(
                <div key={l} style={{ ...card, flex:1, textAlign:"center", padding:14 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:C.primary }}>{v}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Form */}
            <div style={card}>
              {[["Ad Soyad","name","text"],["E-Posta","email","email"],["Telefon","phone","tel"],["Şifre","password","password"]].map(([l,k,t])=>(
                <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12.5, color:C.muted, marginBottom:5 }}>{l}</div>
                    <input style={{ ...inp, border:"none", padding:"4px 0", background:"transparent", color: k==="password" ? C.muted : C.text, fontSize:14 }}
                      type={t} placeholder={t==="password"?"••••••••••":""} value={k!=="password"?(profileForm[k]||""):""}
                      onChange={e=>setProfileForm({...profileForm,[k]:e.target.value})} />
                  </div>
                  <button style={{ ...btn("ghost","sm"), color:C.blue, borderColor:"transparent" }}>Düzenle</button>
                </div>
              ))}
              <button style={{ ...btn("primary"), marginTop:16 }} onClick={()=>{ setProfileStrength(Math.min(100,profileStrength+10)); }}>💾 Kaydet</button>
            </div>
          </div>
        )}

        {/* Notification Preferences */}
        {tab==="notif-prefs" && (
          <div style={{ maxWidth:680 }}>
            <h2 style={{ margin:"0 0 18px", fontSize:20, color:C.text, fontWeight:700 }}>Bildirim Tercihleri</h2>
            <div style={{ ...card, marginBottom:12, background:C.navy, color:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>🖥️</span>
                <span style={{ fontSize:14 }}>Size tarayıcı üzerinden bilgilendirmek için izin verin</span>
              </div>
              <button style={btn("success","sm")}>Bildirimleri Aç</button>
            </div>
            {[
              { key:"solutionBrowser", label:"Desteklediğiniz şikayetin çözüm bilgilendirmesi", sub:[{k:"solutionBrowser",l:"Tarayıcı"},{k:"solutionEmail",l:"E-Posta"}], expanded:true },
              { key:"passwordChange", label:"Şifre Değiştirme İşleminde İlgili Kullanıcının Bilgilendirilmesi", sub:[], expanded:false },
              { key:"complaintReview", label:"Şikayet değerlendirmesi hakkında bilgilendirmeler", sub:[], expanded:false },
              { key:"complaintChat", label:"Şikayet sohbet bildirimi", sub:[], expanded:false },
              { key:"smsPromo", label:"Şikayetçiye uygulama tanıtım SMS'i gönderilmesi", sub:[], expanded:false },
              { key:"unpublished", label:"Şikayetin yayınlanamaması hakkında bilgilendirmeler", sub:[], expanded:false },
              { key:"replyNotif", label:"Şikayetinize gelen cevap hakkında bilgilendirmeler", sub:[], expanded:false },
              { key:"commentNotif", label:"Şikayetinize yapılan yorumlar hakkında bilgilendirmeler", sub:[], expanded:false },
            ].map((item,i)=>(
              <div key={i} style={{ ...card, marginBottom:8, padding:"14px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:14, fontWeight: item.expanded ? 600 : 400 }}>{item.label}</span>
                  <span style={{ fontSize:12, color:C.muted, cursor:"pointer" }}>{item.expanded?"▲":"▼"}</span>
                </div>
                {item.expanded && item.sub.map(s=>(
                  <div key={s.k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0 0 12px", borderTop:`1px solid ${C.border}`, marginTop:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:C.muted }}>
                      <span>{s.l==="Tarayıcı"?"🖥️":"✉️"}</span><span>{s.l}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:13, color: notifSettings[s.k] ? C.green : C.muted }}>{notifSettings[s.k]?"Açık":"Kapalı"}</span>
                      <Toggle on={notifSettings[s.k]} onChange={v=>setNotifSettings({...notifSettings,[s.k]:v})} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* My Complaints */}
        {tab==="my-complaints" && (
          <div style={{ maxWidth:680 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h2 style={{ margin:"0 0 3px", fontSize:20, color:C.text, fontWeight:700 }}>Şikayetlerim</h2>
                <p style={{ margin:0, color:C.muted, fontSize:13.5 }}>1 Şikayet</p>
              </div>
              <button style={btn("accent","sm")} onClick={()=>setPage("new-complaint")}>+ Yeni Şikayet</button>
            </div>
            {/* Example: unpublished complaint */}
            <div style={{ ...card, borderLeft:`4px solid ${C.light}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ marginBottom:6 }}>
                    <Badge s="Yayınlanamadı" />
                  </div>
                  <h3 style={{ margin:"0 0 6px", fontSize:15, color:C.text }}>Philips TV Ayıplı Ürün Satıp Ürününün Arkasında Durmuyor</h3>
                  <div style={{ fontSize:12.5, color:C.muted, marginBottom:10 }}>28 Aralık 2016 09:59</div>
                  <div style={{ ...card, background:"#fef9c3", borderColor:C.amber, padding:"10px 14px", fontSize:13, color:"#92400e" }}>
                    <strong>Zamanaşımı:</strong> Şikayetinizde belirttiğiniz olay platform kuralımız gereği üç yıllık zaman aşımı süresini aşmış durumda. Eğer hâlen devam eden güncel bir mağduriyet s<span style={{ color:C.blue, cursor:"pointer" }}>...</span>
                  </div>
                </div>
                <button style={{ ...btn("ghost","sm"), marginLeft:12 }}>⋯</button>
              </div>
            </div>
            {/* Active complaints */}
            {MOCK_COMPLAINTS.slice(0,2).map(c=>(
              <div key={c.id} style={{ ...card, marginTop:10, borderLeft:`4px solid ${STATUS_MAP[c.status]?.dot}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <h3 style={{ margin:"0 0 5px", fontSize:14.5 }}>{c.title}</h3>
                    <div style={{ fontSize:12.5, color:C.muted }}>{c.date}</div>
                  </div>
                  <Badge s={c.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications */}
        {tab==="notifications" && (
          <div style={{ maxWidth:680 }}>
            <h2 style={{ margin:"0 0 20px", fontSize:20, color:C.text, fontWeight:700 }}>Bildirimlerim</h2>
            <div style={{ ...card }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:38, height:38, borderRadius:8, background:"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📋</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>Müşteri Deneyimi Anketi</div>
                  <div style={{ fontSize:13, color:C.muted }}>Sahip olduğunuz ürünlerle ilgili deneyimlerinizi paylaşır mısınız?</div>
                </div>
                <span style={{ fontSize:12, color:C.muted }}>22 Mart 20:32</span>
                <span style={{ width:8, height:8, borderRadius:"50%", background:C.green, flexShrink:0 }} />
              </div>
              {[
                { icon:"💬", t:"Şikayetinize yeni bir yorum yapıldı", time:"2 saat önce", read:false },
                { icon:"✅", t:"Şikayetiniz çözüldü olarak işaretlendi", time:"1 gün önce", read:true },
                { icon:"👍", t:"Şikayetiniz 50 kez desteklendi", time:"3 gün önce", read:true },
              ].map((n,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom: i<2 ? `1px solid ${C.border}` : "none", background: n.read ? "transparent" : "#f0f9ff" }}>
                  <span style={{ fontSize:20 }}>{n.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight: n.read ? 400 : 600 }}>{n.t}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{n.time}</div>
                  </div>
                  {!n.read && <span style={{ width:8, height:8, borderRadius:"50%", background:C.green, flexShrink:0 }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty states */}
        {["supported","commented","saved"].includes(tab) && (
          <div style={{ maxWidth:680, textAlign:"center", padding:60 }}>
            <div style={{ width:100, height:100, borderRadius:"50%", background:C.border, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, color:"#fff" }}>
              {tab==="supported"?"✍️":tab==="commented"?"✍️":"🔖"}
            </div>
            <h3 style={{ fontSize:18, color:C.text, marginBottom:8 }}>{tab==="saved"?"Henüz Şikayetiniz Yok":"Sorgunuza ait bir şikayet bulunamadı."}</h3>
            {tab==="saved" && <p style={{ color:C.muted, fontSize:14 }}>Kaydettiğiniz şikayetleri buradan takip edebilirsiniz.</p>}
          </div>
        )}

        {tab==="tests" && (
          <div style={{ maxWidth:680 }}>
            <h2 style={{ margin:"0 0 18px", fontSize:20, fontWeight:700 }}>Teste Katıl</h2>
            <div style={{ ...card, borderLeft:`4px solid ${C.purple}` }}>
              <div style={{ display:"flex", gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📋</div>
                <div>
                  <h3 style={{ margin:"0 0 5px", fontSize:15 }}>Kişisel Ürün Markalarınız</h3>
                  <p style={{ margin:"0 0 10px", fontSize:13.5, color:C.muted }}>Sahip olduğunuz ürün markalarını belirleyin, size özel içerikler gösterelim.</p>
                  <button style={btn("purple","sm")}>Ankete Katıl</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account */}
        {tab==="delete-acc" && (
          <div style={{ maxWidth:500 }}>
            <h2 style={{ margin:"0 0 18px", fontSize:20, fontWeight:700, color:C.red }}>Hesabımı Sil</h2>
            <div style={{ ...card, borderLeft:`4px solid ${C.red}` }}>
              <div style={{ marginBottom:16 }}>
                <p style={{ color:C.text, fontSize:14.5, lineHeight:1.6 }}>Hesabınızı silmek kalıcı bir işlemdir. Tüm şikayetleriniz, yorumlarınız ve profil bilgileriniz silinecektir.</p>
                <ul style={{ color:C.muted, fontSize:13.5, lineHeight:1.8, paddingLeft:18 }}>
                  <li>Tüm şikayetleriniz kaldırılacak</li>
                  <li>Yorumlarınız ve oylarınız silinecek</li>
                  <li>Bu işlem geri alınamaz</li>
                </ul>
              </div>
              {!showDeleteConfirm ? (
                <button style={btn("danger")} onClick={()=>setShowDeleteConfirm(true)}>🗑 Hesabımı Sil</button>
              ) : (
                <div style={{ background:"#fff5f5", border:`1px solid #fecaca`, borderRadius:8, padding:16 }}>
                  <p style={{ fontWeight:600, color:C.red, marginBottom:10 }}>Bu işlemi onaylıyor musunuz?</p>
                  <div style={{ display:"flex", gap:10 }}>
                    <button style={{ ...btn("ghost"), flex:1 }} onClick={()=>setShowDeleteConfirm(false)}>İptal</button>
                    <button style={{ ...btn("danger"), flex:1 }} onClick={()=>{ setUser(null); setPage("home"); }}>Evet, Hesabımı Sil</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── ADMIN PANEL ─────────────────────────────────────────────
const AdminPanel = ({ user, setPage, footerData: initFooterData, setFooterData: setParentFooterData, siteStats, setSiteStats }) => {
  const [tab, setTab] = useState("dashboard");
  const [users, setUsers] = useState([
    { id:1, name:"Mehmet Yılmaz", email:"mehmet@e.com", phone:"0533 123 45 67", complaints:8, status:"Aktif", joined:"Ocak 2025" },
    { id:2, name:"Ayşe Kaya", email:"ayse@e.com", phone:"0542 987 65 43", complaints:15, status:"Aktif", joined:"Şubat 2025" },
    { id:3, name:"Ali Rıza", email:"ali@e.com", phone:"0548 456 78 90", complaints:3, status:"Engelli", joined:"Mart 2025" },
    { id:4, name:"Fatma Demir", email:"fatma@e.com", phone:"0553 321 09 87", complaints:22, status:"Aktif", joined:"Ocak 2025" },
  ]);
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [footerData, setFooterData] = useState(initFooterData || {
    desc: "KKTC'nin bağımsız şikayet platformu. Sesinizi duyurun, değişim yaratın.",
    columns: [
      { title:"Platform", links:[{label:"Şikayetler",url:"#"},{label:"Kategoriler",url:"#"},{label:"Trend100",url:"#"},{label:"Canlı İzle",url:"#"}] },
      { title:"Kurumlar İçin", links:[{label:"Kurumsal Hesap",url:"#"},{label:"Şikayet Yanıtla",url:"#"},{label:"İtibar Yönetimi",url:"#"},{label:"Fiyatlandırma",url:"#"}] },
      { title:"Yardım", links:[{label:"SSS",url:"#"},{label:"Kullanım Kuralları",url:"#"},{label:"Gizlilik",url:"#"},{label:"İletişim",url:"#"}] },
    ],
    copyright: "© 2026 ŞikayetETKKTC. Tüm hakları saklıdır.",
    instagram: "sikayetetkktc",
    facebook: "sikayetetkktc",
    twitter: "sikayetetkktc",
  });
  // Sync footer to parent
  useEffect(()=>{ if(setParentFooterData) setParentFooterData(footerData); },[footerData]);
  const [settings, setSettings] = useState({ siteName:"ŞikayetETKKTC", siteUrl:"https://sikayetetkktc.com", metaTitle:"ŞikayetETKKTC - KKTC'nin Güvenilir Şikayet Platformu", metaDesc:"KKTC'de kamu ve özel kurumlar hakkında şikayetlerinizi bildirin.", ga:"G-XXXXXXXXXX", primaryColor:C.primary, accentColor:C.accent, contactEmail:"info@sikayetetkktc.com", phone:"+90 392 000 00 00" });

  const sideItems = [
    { id:"dashboard", icon:"📊", l:"Dashboard" },
    { id:"complaints", icon:"📋", l:"Şikayetler" },
    { id:"users", icon:"👥", l:"Kullanıcılar" },
    { id:"categories", icon:"📁", l:"Kategoriler" },
    { id:"footer-edit", icon:"🔗", l:"Footer Yönetimi" },
    { id:"seo", icon:"🔍", l:"SEO Yönetimi" },
    { id:"site-settings", icon:"⚙️", l:"Site Ayarları" },
    { id:"reports", icon:"📈", l:"Raporlar" },
  ];

  const th = { padding:"11px 14px", textAlign:"left", background:"#f8fafc", fontWeight:600, color:C.muted, fontSize:11.5, textTransform:"uppercase", letterSpacing:.5, borderBottom:`2px solid ${C.border}` };
  const td_ = { padding:"13px 14px", borderBottom:`1px solid ${C.border}`, verticalAlign:"middle", fontSize:13.5 };

  return (
    <div style={{ display:"flex", minHeight:"calc(100vh - 76px)" }}>
      <div style={{ width:220, background:C.navy, flexShrink:0, padding:"20px 0" }}>
        <div style={{ padding:"0 16px 18px", borderBottom:"1px solid rgba(255,255,255,.1)", marginBottom:12 }}>
          <div style={{ fontSize:10.5, color:"rgba(255,255,255,.4)", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Admin Panel</div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{user.name}</div>
        </div>
        {sideItems.map(item=>(
          <button key={item.id} style={{ ...sideLink(tab===item.id), border:"none", display:"flex", alignItems:"center", gap:9 }} onClick={()=>setTab(item.id)}>
            <span>{item.icon}</span><span>{item.l}</span>
          </button>
        ))}
        <div style={{ padding:"16px 16px 0" }}>
          <button style={{ ...btn("ghost","sm"), color:"rgba(255,255,255,.5)", borderColor:"rgba(255,255,255,.15)", width:"100%" }} onClick={()=>setPage("home")}>← Siteye Dön</button>
        </div>
      </div>

      <div style={{ flex:1, padding:28, background:C.bg, overflowY:"auto" }}>

        {tab==="dashboard" && (
          <div>
            <h2 style={{ margin:"0 0 22px", fontSize:20, color:C.primary, fontWeight:700 }}>Dashboard</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:14, marginBottom:28 }}>
              {[["📋","Toplam Şikayet","4.282.012",C.primary],["👥","Toplam Üye","342.891",C.green],["✅","Çözülen","1.847.330",C.green],["⏳","Bekleyen","2.312.456",C.amber],["🔥","Günlük","1.284",C.accent],["👁","Aylık Ziyaretçi","8.92M",C.blue]].map(([i,l,v,col])=>(
                <div key={l} style={{ ...card, borderTop:`4px solid ${col}`, textAlign:"center", padding:16 }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{i}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:col }}>{v}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
              <div style={card}>
                <h3 style={{ margin:"0 0 14px", fontSize:15, color:C.primary, fontWeight:700 }}>Son Şikayetler</h3>
                {MOCK_COMPLAINTS.map(c=>(
                  <div key={c.id} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
                    <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:10 }}>{c.title}</span>
                    <Badge s={c.status} />
                  </div>
                ))}
              </div>
              <div style={card}>
                <h3 style={{ margin:"0 0 14px", fontSize:15, color:C.primary, fontWeight:700 }}>Kategori Dağılımı</h3>
                {PRESET_CATEGORIES.slice(0,6).map(cat=>(
                  <div key={cat.id} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3 }}>
                      <span>{cat.icon} {cat.name}</span><span style={{ fontWeight:600 }}>{cat.count.toLocaleString()}</span>
                    </div>
                    <div style={{ height:5, borderRadius:3, background:C.border }}>
                      <div style={{ height:"100%", width:`${(cat.count/12840)*100}%`, background:cat.color, borderRadius:3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="complaints" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
              <h2 style={{ margin:0, fontSize:20, color:C.primary, fontWeight:700 }}>Şikayet Yönetimi</h2>
              <div style={{ display:"flex", gap:8 }}>
                <input style={{ ...inp, width:200 }} placeholder="Şikayet ara..." />
                <select style={{ ...inp, width:"auto" }}><option>Tüm Durumlar</option><option>Açık</option><option>İnceleniyor</option><option>Çözüldü</option></select>
              </div>
            </div>
            <div style={card}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["#","Başlık","Yazar","Kurum","Durum","Tarih","İşlem"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {complaints.map(c=>(
                    <tr key={c.id}>
                      <td style={td_}><span style={{ color:C.muted, fontSize:12 }}>#{c.id}</span></td>
                      <td style={{ ...td_, maxWidth:200 }}><div style={{ fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.title}</div><div style={{ fontSize:11.5, color:C.muted }}>{c.category}</div></td>
                      <td style={td_}>{c.author}</td>
                      <td style={td_}>{c.company}</td>
                      <td style={td_}>
                        <select style={{ ...inp, padding:"4px 8px", fontSize:12, width:"auto" }} value={c.status}
                          onChange={e=>setComplaints(complaints.map(x=>x.id===c.id?{...x,status:e.target.value}:x))}>
                          <option>Açık</option><option>İnceleniyor</option><option>Çözüldü</option>
                        </select>
                      </td>
                      <td style={{ ...td_, fontSize:12, color:C.muted }}>{c.date}</td>
                      <td style={td_}><div style={{ display:"flex", gap:5 }}>
                        <button style={btn("ghost","sm")}>👁</button>
                        <button style={btn("danger","sm")} onClick={()=>setComplaints(complaints.filter(x=>x.id!==c.id))}>🗑</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="users" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
              <h2 style={{ margin:0, fontSize:20, color:C.primary, fontWeight:700 }}>Kullanıcı Yönetimi</h2>
              <input style={{ ...inp, width:230 }} placeholder="Kullanıcı ara..." />
            </div>
            <div style={card}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["Kullanıcı","E-posta","Telefon","Şikayet","Durum","Kayıt","İşlem"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td style={td_}><div style={{ display:"flex", alignItems:"center", gap:9 }}><Avatar initials={u.name.split(" ").map(n=>n[0]).join("").slice(0,2)} size={30} /><span style={{ fontWeight:600 }}>{u.name}</span></div></td>
                      <td style={td_}>{u.email}</td>
                      <td style={td_}>{u.phone}</td>
                      <td style={{ ...td_, textAlign:"center", fontWeight:600 }}>{u.complaints}</td>
                      <td style={td_}><Badge s={u.status} /></td>
                      <td style={{ ...td_, color:C.muted, fontSize:12.5 }}>{u.joined}</td>
                      <td style={td_}><div style={{ display:"flex", gap:5 }}>
                        <button style={btn(u.status==="Aktif"?"ghost":"success","sm")} onClick={()=>setUsers(users.map(x=>x.id===u.id?{...x,status:x.status==="Aktif"?"Engelli":"Aktif"}:x))}>{u.status==="Aktif"?"🚫":"✓"}</button>
                        <button style={btn("danger","sm")} onClick={()=>setUsers(users.filter(x=>x.id!==u.id))}>🗑</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="categories" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
              <h2 style={{ margin:0, fontSize:20, color:C.primary, fontWeight:700 }}>Kategori Yönetimi</h2>
              <button style={btn("primary")}>+ Yeni Kategori</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
              {PRESET_CATEGORIES.map(cat=>(
                <div key={cat.id} style={{ ...card, borderLeft:`4px solid ${cat.color}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:24 }}>{cat.icon}</span>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13.5 }}>{cat.name}</div>
                        <div style={{ fontSize:12, color:C.muted }}>{cat.count.toLocaleString()} şikayet</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      <button style={btn("ghost","sm")}>✏️</button>
                      <button style={btn("danger","sm")}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="footer-edit" && (
          <div style={{ maxWidth:720 }}>
            <h2 style={{ margin:"0 0 6px", fontSize:20, color:C.primary, fontWeight:700 }}>Footer Yönetimi</h2>
            <p style={{ color:C.muted, fontSize:14, marginBottom:22 }}>Footer içeriğini, linklerini ve sosyal medya hesaplarını düzenleyin.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Açıklama metni */}
              <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:22, boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                <h3 style={{ margin:"0 0 16px", fontSize:15, color:C.primary, fontWeight:700 }}>📝 Açıklama Metni</h3>
                <FormRow label="Kısa Açıklama">
                  <textarea style={{ ...inp, minHeight:70 }} value={footerData.desc}
                    onChange={e=>setFooterData({...footerData,desc:e.target.value})} />
                </FormRow>
                <FormRow label="Telif Hakkı Metni">
                  <input style={inp} value={footerData.copyright}
                    onChange={e=>setFooterData({...footerData,copyright:e.target.value})} />
                </FormRow>
              </div>
              {/* Sosyal medya */}
              <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:22, boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                <h3 style={{ margin:"0 0 16px", fontSize:15, color:C.primary, fontWeight:700 }}>📱 Sosyal Medya Hesapları</h3>
                {[["instagram","Instagram","linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",IGIcon],
                  ["facebook","Facebook","#1877F2",FBIcon],
                  ["twitter","X (Twitter)","#000",TWIcon]].map(([key,label,bg,Icon])=>(
                  <FormRow key={key} label={label}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:36, height:36, borderRadius:8, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon size={18} color="#fff" />
                      </div>
                      <input style={{ ...inp, flex:1 }} placeholder="kullanici_adi"
                        value={footerData[key]||""}
                        onChange={e=>setFooterData({...footerData,[key]:e.target.value})} />
                      <a href={`https://${key==="twitter"?"twitter":"instagram"==="instagram"?key==="facebook"?"facebook.com":"instagram.com":"twitter.com"}/${footerData[key]}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ ...btn("ghost","sm"), textDecoration:"none" }}>↗</a>
                    </div>
                  </FormRow>
                ))}
              </div>
              {/* Footer kolonları */}
              {footerData.columns.map((col,ci)=>(
                <div key={ci} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:22, boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <h3 style={{ margin:0, fontSize:15, color:C.primary, fontWeight:700 }}>
                      🔗 Kolon: <input style={{ ...inp, display:"inline-block", width:"auto", padding:"3px 8px", fontSize:14, fontWeight:700 }}
                        value={col.title} onChange={e=>{const cols=[...footerData.columns];cols[ci]={...cols[ci],title:e.target.value};setFooterData({...footerData,columns:cols});}} />
                    </h3>
                    <button style={btn("primary","sm")} onClick={()=>{const cols=[...footerData.columns];cols[ci]={...cols[ci],links:[...cols[ci].links,{label:"Yeni Link",url:"#"}]};setFooterData({...footerData,columns:cols});}}>+ Link Ekle</button>
                  </div>
                  {col.links.map((link,li)=>(
                    <div key={li} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
                      <input style={{ ...inp, flex:2 }} placeholder="Link Adı" value={link.label}
                        onChange={e=>{const cols=[...footerData.columns];cols[ci].links[li]={...link,label:e.target.value};setFooterData({...footerData,columns:cols});}} />
                      <input style={{ ...inp, flex:3 }} placeholder="https://..." value={link.url}
                        onChange={e=>{const cols=[...footerData.columns];cols[ci].links[li]={...link,url:e.target.value};setFooterData({...footerData,columns:cols});}} />
                      <button style={btn("danger","sm")} onClick={()=>{const cols=[...footerData.columns];cols[ci].links=cols[ci].links.filter((_,i)=>i!==li);setFooterData({...footerData,columns:cols});}}>🗑</button>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <button style={btn("success","lg")} onClick={()=>{ if(setParentFooterData) setParentFooterData(footerData); alert('Footer güncellendi! ✓'); }}>💾 Değişiklikleri Kaydet</button>
              </div>
            </div>
          </div>
        )}

        {tab==="seo" && (
          <div style={{ maxWidth:680 }}>
            <h2 style={{ margin:"0 0 6px", fontSize:20, color:C.primary, fontWeight:700 }}>SEO Yönetimi</h2>
            <p style={{ color:C.muted, fontSize:14, marginBottom:22 }}>Arama motoru optimizasyonu ayarları</p>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={card}>
                <h3 style={{ margin:"0 0 18px", fontSize:15, color:C.primary, fontWeight:700 }}>🌐 Genel SEO</h3>
                <FormRow label={`Site Başlığı (${settings.metaTitle.length}/60)`}>
                  <input style={{ ...inp, borderColor: settings.metaTitle.length>60 ? C.red : C.border }} value={settings.metaTitle} onChange={e=>setSettings({...settings,metaTitle:e.target.value})} />
                </FormRow>
                <FormRow label={`Meta Açıklaması (${settings.metaDesc.length}/160)`}>
                  <textarea style={{ ...inp, minHeight:70 }} value={settings.metaDesc} onChange={e=>setSettings({...settings,metaDesc:e.target.value})} />
                </FormRow>
                <FormRow label="Canonical URL">
                  <input style={inp} value={settings.siteUrl} onChange={e=>setSettings({...settings,siteUrl:e.target.value})} />
                </FormRow>
              </div>
              <div style={card}>
                <h3 style={{ margin:"0 0 18px", fontSize:15, color:C.primary, fontWeight:700 }}>📊 Analitik</h3>
                <FormRow label="Google Analytics ID">
                  <input style={inp} placeholder="G-XXXXXXXXXX" value={settings.ga} onChange={e=>setSettings({...settings,ga:e.target.value})} />
                </FormRow>
                <FormRow label="Google Search Console Doğrulama">
                  <input style={inp} placeholder="content=xxxx..." />
                </FormRow>
                <FormRow label="Facebook Pixel ID">
                  <input style={inp} placeholder="Opsiyonel" />
                </FormRow>
              </div>
              <div style={card}>
                <h3 style={{ margin:"0 0 14px", fontSize:15, color:C.primary, fontWeight:700 }}>🗺️ Sitemap & Robots</h3>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
                  {["🗺️ Sitemap Oluştur","🤖 Robots.txt Düzenle","📥 Schema Markup"].map(t=><button key={t} style={btn("ghost","sm")}>{t}</button>)}
                </div>
                <div style={{ background:"#f0fdf4", border:`1px solid #bbf7d0`, borderRadius:8, padding:"10px 14px", fontSize:13, color:"#15803d" }}>
                  ✓ Sitemap son güncelleme: 22 Mart 2026 · 4.282.012 URL
                </div>
              </div>
              <button style={{ ...btn("success","lg"), width:200 }}>💾 SEO Ayarlarını Kaydet</button>
            </div>
          </div>
        )}

        {tab==="site-settings" && (
          <div style={{ maxWidth:680 }}>
            <h2 style={{ margin:"0 0 6px", fontSize:20, color:C.primary, fontWeight:700 }}>Site Ayarları</h2>
            <p style={{ color:C.muted, fontSize:14, marginBottom:22 }}>Platform genelindeki ayarları buradan yönetin</p>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={card}>
                <h3 style={{ margin:"0 0 18px", fontSize:15, color:C.primary, fontWeight:700 }}>🎨 Marka & Logo</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <FormRow label="Site Adı"><input style={inp} value={settings.siteName} onChange={e=>setSettings({...settings,siteName:e.target.value})} /></FormRow>
                  <FormRow label="Site URL"><input style={inp} value={settings.siteUrl} onChange={e=>setSettings({...settings,siteUrl:e.target.value})} /></FormRow>
                </div>
                <FormRow label="Logo Yükle">
                  <div style={{ border:`2px dashed ${C.border}`, borderRadius:8, padding:18, display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:52, height:52, borderRadius:10, background:settings.primaryColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:22, fontWeight:800 }}>Ş</div>
                    <div>
                      <button style={btn("ghost","sm")}>📁 Logo Yükle</button>
                      <div style={{ fontSize:12, color:C.muted, marginTop:5 }}>PNG, SVG — maks. 2MB · 200x60px önerilen</div>
                    </div>
                  </div>
                </FormRow>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <FormRow label="Ana Renk">
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <input type="color" value={settings.primaryColor} onChange={e=>setSettings({...settings,primaryColor:e.target.value})} style={{ width:38, height:34, borderRadius:6, border:`1px solid ${C.border}`, cursor:"pointer" }} />
                      <input style={{ ...inp, flex:1 }} value={settings.primaryColor} onChange={e=>setSettings({...settings,primaryColor:e.target.value})} />
                    </div>
                  </FormRow>
                  <FormRow label="Vurgu Rengi">
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <input type="color" value={settings.accentColor} onChange={e=>setSettings({...settings,accentColor:e.target.value})} style={{ width:38, height:34, borderRadius:6, border:`1px solid ${C.border}`, cursor:"pointer" }} />
                      <input style={{ ...inp, flex:1 }} value={settings.accentColor} onChange={e=>setSettings({...settings,accentColor:e.target.value})} />
                    </div>
                  </FormRow>
                </div>
              </div>
              <div style={card}>
                <h3 style={{ margin:"0 0 18px", fontSize:15, color:C.primary, fontWeight:700 }}>📧 İletişim</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <FormRow label="İletişim E-postası"><input style={inp} value={settings.contactEmail} onChange={e=>setSettings({...settings,contactEmail:e.target.value})} /></FormRow>
                  <FormRow label="Telefon"><input style={inp} value={settings.phone} onChange={e=>setSettings({...settings,phone:e.target.value})} /></FormRow>
                </div>
              </div>
              <div style={card}>
                <h3 style={{ margin:"0 0 16px", fontSize:15, color:C.primary, fontWeight:700 }}>⚙️ Sistem</h3>
                {[["Yeni şikayetler admin onayı gerektirsin",0],["Yorumlar admin onayı gerektirsin",1],["Yeni üye kayıtları açık",2],["E-posta bildirimleri aktif",3]].map(([l,i])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i<3 ? `1px solid ${C.border}` : "none" }}>
                    <span style={{ fontSize:13.5 }}>{l}</span>
                    <Toggle on={i%2===0} onChange={()=>{}} />
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={btn("success","lg")}>💾 Kaydet</button>
                <button style={btn("ghost")}>Önizle</button>
              </div>
            </div>
          </div>
        )}

        {tab==="reports" && (
          <div>
            <h2 style={{ margin:"0 0 22px", fontSize:20, color:C.primary, fontWeight:700 }}>Raporlar</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
              {[{ title:"Durum Dağılımı", items:[{ l:"Açık",v:2312456,c:C.red },{ l:"İnceleniyor",v:122226,c:C.amber },{ l:"Çözüldü",v:1847330,c:C.green }]},
                { title:"En Çok Şikayet Alan", items: PRESET_CATEGORIES.slice(0,5).map(c=>({ l:c.name,v:c.count,c:c.color }))}].map(rep=>(
                <div key={rep.title} style={card}>
                  <h3 style={{ margin:"0 0 14px", fontSize:15, color:C.primary, fontWeight:700 }}>{rep.title}</h3>
                  {rep.items.map((item,i)=>(
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3 }}>
                        <span>{item.l}</span><span style={{ fontWeight:600 }}>{item.v.toLocaleString()}</span>
                      </div>
                      <div style={{ height:6, borderRadius:3, background:C.border }}>
                        <div style={{ height:"100%", width:`${Math.min((item.v/(rep.items[0]?.v||1))*100,100)}%`, background:item.c, borderRadius:3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ ...card, marginTop:16 }}>
              <h3 style={{ margin:"0 0 14px", fontSize:15, color:C.primary, fontWeight:700 }}>Dışa Aktar</h3>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {["📊 Excel (XLSX)","📄 PDF Raporu","📋 CSV Verisi"].map(t=><button key={t} style={btn("ghost")}>{t}</button>)}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── BACKEND & DEPLOYMENT GUIDE ──────────────────────────────
const BackendGuidePage = () => (
  <div style={{ maxWidth:900, margin:"0 auto", padding:"36px 24px" }}>
    <h1 style={{ fontSize:26, color:C.primary, fontWeight:800, marginBottom:6 }}>🚀 Production Backend & Deployment Rehberi</h1>
    <p style={{ color:C.muted, fontSize:14.5, marginBottom:28 }}>FastAPI + PostgreSQL + Cloudflare Workers — 10M+ kullanıcıya hazır mimari</p>

    {/* Architecture */}
    <div style={{ ...card, marginBottom:18, borderTop:`4px solid ${C.blue}` }}>
      <h2 style={{ margin:"0 0 16px", fontSize:17, color:C.primary, fontWeight:700 }}>📐 Sistem Mimarisi</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
        {[["Frontend","React + Vite","Cloudflare Pages","⚡ CDN + Edge"],["Backend API","FastAPI (Python)","Railway / Fly.io","🚂 Auto-scale"],["Veritabanı","PostgreSQL 16","Supabase / Neon","🐘 Managed DB"],["Cache","Redis","Upstash Redis","⚡ Edge KV"],["Dosya","S3 Compat.","Cloudflare R2","☁️ $0 egress"],["E-posta","Transactional","Resend / SES","✉️ Bildirimler"]].map(([t,tech,srv,badge])=>(
          <div key={t} style={{ background:"#f8fafc", borderRadius:8, padding:14, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>{t}</div>
            <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:3 }}>{tech}</div>
            <div style={{ fontSize:12.5, color:C.blue }}>{srv}</div>
            <div style={{ fontSize:11.5, color:C.muted, marginTop:3 }}>{badge}</div>
          </div>
        ))}
      </div>
    </div>

    {/* FastAPI structure */}
    <div style={{ ...card, marginBottom:18, borderTop:`4px solid ${C.purple}` }}>
      <h2 style={{ margin:"0 0 14px", fontSize:17, color:C.primary, fontWeight:700 }}>🐍 FastAPI Proje Yapısı</h2>
      <pre style={{ background:"#0f172a", color:"#e2e8f0", borderRadius:10, padding:18, fontSize:12.5, overflowX:"auto", lineHeight:1.6 }}>{`backend/
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── core/
│   │   ├── config.py        # Settings (Pydantic BaseSettings)
│   │   ├── security.py      # JWT + bcrypt
│   │   └── database.py      # SQLAlchemy async engine
│   ├── models/
│   │   ├── user.py          # User SQLAlchemy model
│   │   ├── complaint.py     # Complaint model
│   │   ├── comment.py       # Comment model
│   │   └── category.py      # Category model
│   ├── schemas/
│   │   ├── user.py          # Pydantic schemas
│   │   └── complaint.py     # Request/Response schemas
│   ├── api/v1/
│   │   ├── auth.py          # /login, /register, /refresh
│   │   ├── complaints.py    # CRUD + search + filter
│   │   ├── comments.py      # Comment endpoints
│   │   ├── categories.py    # Category management
│   │   ├── users.py         # Profile + admin user mgmt
│   │   ├── admin.py         # Admin-only endpoints
│   │   └── uploads.py       # File upload to R2
│   └── services/
│       ├── email.py         # Resend integration
│       ├── search.py        # Full-text search (pg_trgm)
│       └── cache.py         # Redis caching layer
├── alembic/                 # DB migrations
├── tests/                   # pytest test suite
├── Dockerfile
├── docker-compose.yml
└── requirements.txt`}</pre>
    </div>

    {/* Key API endpoints */}
    <div style={{ ...card, marginBottom:18, borderTop:`4px solid ${C.green}` }}>
      <h2 style={{ margin:"0 0 14px", fontSize:17, color:C.primary, fontWeight:700 }}>🔌 Temel API Endpoint'leri</h2>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead><tr>{["Method","Endpoint","Açıklama","Auth"].map(h=><th key={h} style={{ padding:"9px 12px", textAlign:"left", background:"#f8fafc", fontWeight:600, color:C.muted, fontSize:11.5, borderBottom:`2px solid ${C.border}` }}>{h}</th>)}</tr></thead>
        <tbody>
          {[
            ["POST","/api/v1/auth/register","Kullanıcı kaydı","Hayır"],
            ["POST","/api/v1/auth/login","JWT token al","Hayır"],
            ["GET","/api/v1/complaints","Şikayet listesi (paginated)","Hayır"],
            ["POST","/api/v1/complaints","Şikayet oluştur","✓ User"],
            ["GET","/api/v1/complaints/{id}","Şikayet detayı","Hayır"],
            ["PATCH","/api/v1/complaints/{id}/status","Durum güncelle","✓ Admin"],
            ["DELETE","/api/v1/complaints/{id}","Şikayet sil","✓ Admin"],
            ["POST","/api/v1/complaints/{id}/comments","Yorum ekle","✓ User"],
            ["POST","/api/v1/complaints/{id}/vote","Oy ver","✓ User"],
            ["GET","/api/v1/admin/stats","Dashboard istatistikleri","✓ Admin"],
            ["POST","/api/v1/uploads","Dosya yükle (R2)","✓ User"],
            ["GET","/api/v1/categories","Kategori listesi","Hayır"],
            ["POST","/api/v1/categories","Kategori ekle","✓ User/Admin"],
          ].map(([m,ep,d,a],i)=>(
            <tr key={i}>
              <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ background: m==="GET"?"#dcfce7":m==="POST"?"#dbeafe":m==="PATCH"?"#fef9c3":"#fee2e2", color: m==="GET"?C.green:m==="POST"?C.blue:m==="PATCH"?"#b45309":C.red, padding:"2px 7px", borderRadius:5, fontSize:11.5, fontWeight:700, fontFamily:"monospace" }}>{m}</span>
              </td>
              <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}`, fontFamily:"monospace", fontSize:12.5, color:C.primary }}>{ep}</td>
              <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}`, color:C.muted }}>{d}</td>
              <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}`, color: a==="Hayır" ? C.muted : C.green, fontWeight: a!=="Hayır"?600:400 }}>{a}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Cloudflare */}
    <div style={{ ...card, marginBottom:18, borderTop:`4px solid ${C.amber}` }}>
      <h2 style={{ margin:"0 0 14px", fontSize:17, color:C.primary, fontWeight:700 }}>☁️ Cloudflare Deployment (sikayetetkktc.com)</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {[["Cloudflare Pages (Frontend)","• npm run build → dist/\n• Pages projesine bağla\n• Build: npm run build\n• Output: dist\n• Auto-deploy: GitHub push\n• Custom domain: sikayetetkktc.com"],
          ["Cloudflare Workers (API Gateway)","• API isteklerini backend'e yönlendir\n• Rate limiting (100 req/min/IP)\n• DDoS koruması otomatik\n• Edge locations: 300+ ülke\n• Latency: <50ms global"],
          ["DNS Ayarları (Veridyen→Cloudflare)","• NS kayıtlarını Cloudflare'e al\n• A record: @ → Backend IP\n• CNAME: www → @\n• Proxy: ✓ (turuncu bulut)\n• SSL: Full (strict) — otomatik"],
          ["Cloudflare R2 (Dosyalar)","• Bucket: sikayetkktc-uploads\n• CORS: sikayetetkktc.com\n• Max dosya: 10MB\n• Ücretsiz: 10GB/ay\n• Public URL: files.sikayetetkktc.com"],
        ].map(([t,c])=>(
          <div key={t} style={{ background:"#fffbeb", border:`1px solid #fde68a`, borderRadius:8, padding:14 }}>
            <div style={{ fontWeight:700, fontSize:13.5, color:"#92400e", marginBottom:8 }}>{t}</div>
            <pre style={{ margin:0, fontSize:12, color:"#78350f", lineHeight:1.7, fontFamily:"monospace", whiteSpace:"pre-wrap" }}>{c}</pre>
          </div>
        ))}
      </div>
    </div>

    {/* Performance */}
    <div style={{ ...card, borderTop:`4px solid ${C.accent}` }}>
      <h2 style={{ margin:"0 0 14px", fontSize:17, color:C.primary, fontWeight:700 }}>⚡ 10M Kullanıcı için Performans Stratejisi</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:12 }}>
        {[["🗄️ DB Optimizasyonu","• PostgreSQL connection pooling (PgBouncer)\n• Index: user_id, status, created_at\n• Full-text search: pg_trgm\n• Read replicas: okuma yükü dağıtımı\n• Partitioning: complaints tablosu aylık"],
          ["⚡ Cache Stratejisi","• Redis: popüler şikayetler (5 dakika TTL)\n• CDN: statik dosyalar (1 yıl)\n• API: /complaints listesi (30 saniye)\n• User session: JWT + Redis blacklist\n• Rate limit: Cloudflare Workers KV"],
          ["🔄 Async & Queue","• FastAPI async/await tüm DB sorguları\n• Celery + Redis: e-posta kuyruğu\n• Background tasks: istatistik güncelleme\n• Webhook: kurum bildirim sistemi\n• Batch: toplu e-posta (SendGrid)"],
          ["📊 Monitoring","• Sentry: hata takibi\n• Prometheus + Grafana: metrikler\n• Cloudflare Analytics: trafik\n• PagerDuty: alert sistemi\n• Logs: Loki + Grafana Stack"],
        ].map(([t,c])=>(
          <div key={t} style={{ background:"#f8fafc", borderRadius:8, padding:14, border:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:700, fontSize:13.5, color:C.primary, marginBottom:8 }}>{t}</div>
            <pre style={{ margin:0, fontSize:12, color:C.muted, lineHeight:1.7, fontFamily:"monospace", whiteSpace:"pre-wrap" }}>{c}</pre>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const [siteStats, setSiteStats] = useState({ total:4282012, resolved:1847330, members:342891 });
  const [footerData, setFooterData] = useState({
    desc: "KKTC'nin bağımsız şikayet platformu. Sesinizi duyurun, değişim yaratın.",
    columns: [
      { title:"Platform", links:[{label:"Şikayetler",url:"#"},{label:"Kategoriler",url:"#"},{label:"Trend100",url:"#"},{label:"Canlı İzle",url:"#"}] },
      { title:"Kurumlar İçin", links:[{label:"Kurumsal Hesap",url:"#"},{label:"Şikayet Yanıtla",url:"#"},{label:"İtibar Yönetimi",url:"#"},{label:"Fiyatlandırma",url:"#"}] },
      { title:"Yardım", links:[{label:"SSS",url:"#"},{label:"Kullanım Kuralları",url:"#"},{label:"Gizlilik",url:"#"},{label:"İletişim",url:"#"}] },
    ],
    copyright: "© 2026 ŞikayetETKKTC. Tüm hakları saklıdır.",
    instagram: "sikayetetkktc",
    facebook: "sikayetetkktc",
    twitter: "sikayetetkktc",
  });

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Georgia','Times New Roman',serif", color:C.text }}>
      <style>{`* { box-sizing: border-box; } button:hover { opacity: .88; } input:focus, textarea:focus, select:focus { border-color: #2563a8 !important; box-shadow: 0 0 0 3px rgba(37,99,168,.12); }`}</style>
      <TopBar stats={siteStats} />
      <Navbar page={page} setPage={setPage} user={user} setUser={setUser} />

      {page==="home" && <HomePage setPage={setPage} setSelected={setSelected} user={user} />}
      {page==="complaints" && <ComplaintsPage setPage={setPage} setSelected={setSelected} />}
      {page==="detail" && <DetailPage complaint={selected} setPage={setPage} user={user} />}
      {page==="categories" && <CategoriesPage setPage={setPage} />}
      {page==="login" && <LoginPage setPage={setPage} setUser={setUser} />}
      {page==="register" && <RegisterPage setPage={setPage} setUser={setUser} />}
      {page==="new-complaint" && <AIComplaintPage user={user} setPage={setPage} />}
      {page==="profile" && user && <UserPanel user={user} setUser={setUser} setPage={setPage} initTab="profile" />}
      {page==="my-complaints" && user && <UserPanel user={user} setUser={setUser} setPage={setPage} initTab="my-complaints" />}
      {page==="notifications" && user && <UserPanel user={user} setUser={setUser} setPage={setPage} initTab="notifications" />}
      {page==="saved" && user && <UserPanel user={user} setUser={setUser} setPage={setPage} initTab="saved" />}
      {page==="admin" && user?.role==="admin" && <AdminPanel user={user} setPage={setPage} footerData={footerData} setFooterData={setFooterData} />}
      {page==="backend-guide" && <BackendGuidePage />}

      {/* Quick access to backend guide */}
      {user?.role==="admin" && page!=="backend-guide" && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:50 }}>
          <button style={{ ...btn("primary"), boxShadow:"0 4px 16px rgba(0,0,0,.18)", padding:"11px 16px" }} onClick={()=>setPage("backend-guide")}>
            🚀 Deployment Rehberi
          </button>
        </div>
      )}

      <Footer footerData={footerData} />
    </div>
  );
}
