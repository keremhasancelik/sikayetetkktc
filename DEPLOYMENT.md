# 🚀 ŞikayetETKKTC — Yayına Alma Rehberi
# Domain: sikayetetkktc.com

## HIZLI ÖZET
Frontend → Cloudflare Pages (ÜCRETSİZ)
Backend  → Railway.app (~5$/ay)
Veritabanı → Supabase (ÜCRETSİZ)
Dosya   → Cloudflare R2 (ÜCRETSİZ)
E-posta → Resend (ÜCRETSİZ)

---

## ADIM 1 — GitHub'a Yükle

```bash
git init
git add .
git commit -m "İlk commit - ŞikayetETKKTC"
git remote add origin https://github.com/KULLANICI_ADIN/sikayetetkktc.git
git push -u origin main
```

---

## ADIM 2 — Supabase (Ücretsiz PostgreSQL)

1. https://supabase.com adresine git → "New Project" oluştur
2. Proje adı: sikayetetkktc
3. Oluşturunca sol menüden Settings → Database → Connection string kopyala
4. Bu değeri not et: postgresql://postgres:[ŞİFRE]@[HOST]:5432/postgres

---

## ADIM 3 — Railway (Backend)

1. https://railway.app adresine git → GitHub ile giriş yap
2. "New Project" → "Deploy from GitHub repo" → sikayetetkktc seç
3. Root Directory: backend
4. Aşağıdaki environment variable'ları ekle:

```
DATABASE_URL=postgresql://postgres:ŞİFRE@HOST:5432/postgres
SECRET_KEY=super-gizli-anahtar-buraya-yaz
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=https://sikayetetkktc.com,https://www.sikayetetkktc.com
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@sikayetetkktc.com
R2_ACCOUNT_ID=xxxxx
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=sikayetetkktc-uploads
```

5. Deploy tamamlanınca URL'yi not al: sikayetetkktc-api.up.railway.app

---

## ADIM 4 — Cloudflare Pages (Frontend)

1. https://dash.cloudflare.com → "Pages" → "Create a project"
2. GitHub'daki repoyu seç
3. Build ayarları:
   - Build command: cd frontend && npm install && npm run build
   - Build output directory: frontend/dist
4. Environment variables ekle:
   - VITE_API_URL = https://api.sikayetetkktc.com
5. Deploy et → URL: sikayetetkktc.pages.dev

---

## ADIM 5 — Domain Bağla (sikayetetkktc.com)

### Cloudflare'e taşı:
1. https://dash.cloudflare.com → "Add a Site" → sikayetetkktc.com gir
2. Free plan seç
3. Sana verilen 2 nameserver adresini kopyala (örn: nina.ns.cloudflare.com)
4. Domain kayıt şirketine git (GoDaddy, Namecheap vb.)
5. DNS → Nameservers bölümünden Cloudflare nameserver'larını yaz
6. 24-48 saat bekle (genellikle 1 saatte aktif olur)

### DNS kayıtları ekle (Cloudflare'de):
```
Tip     İsim    Değer                              Proxy
CNAME   @       sikayetetkktc.pages.dev            ON (turuncu)
CNAME   www     sikayetetkktc.com                  ON (turuncu)
CNAME   api     sikayetetkktc-api.up.railway.app   ON (turuncu)
```

### Cloudflare Pages'e custom domain ekle:
1. Pages → sikayetetkktc → Custom domains → Add domain
2. sikayetetkktc.com yaz → Save

---

## ADIM 6 — Resend (E-posta, Ücretsiz 3000/ay)

1. https://resend.com → Hesap oluştur
2. Domains → Add domain → sikayetetkktc.com
3. Verilen DNS kayıtlarını Cloudflare'e ekle
4. API Keys → Create API Key → Railway'e ekle

---

## ADIM 7 — Google Analytics

1. https://analytics.google.com → Hesap oluştur
2. Mülk adı: ŞikayetETKKTC
3. Ölçüm ID'sini kopyala (G-XXXXXXXXXX)
4. frontend/index.html dosyasında G-XXXXXXXXXX kısmını değiştir

---

## ADIM 8 — Admin Şifresi Belirle

Backend çalışınca ilk admin hesabını oluştur:
```
POST https://api.sikayetetkktc.com/api/v1/auth/register
{
  "email": "admin@sikayetetkktc.com",
  "password": "güçlü-şifre",
  "full_name": "Admin"
}
```
Sonra veritabanından role='admin' olarak güncelle.

---

## KONTROL LİSTESİ

- [ ] GitHub'a yüklendi
- [ ] Supabase veritabanı oluşturuldu
- [ ] Railway backend deploy edildi
- [ ] Cloudflare Pages frontend deploy edildi
- [ ] sikayetetkktc.com Cloudflare'e taşındı
- [ ] DNS kayıtları eklendi
- [ ] Custom domain Cloudflare Pages'e bağlandı
- [ ] SSL otomatik aktif (Cloudflare)
- [ ] Resend e-posta kuruldu
- [ ] Google Analytics ID eklendi
- [ ] Admin hesabı oluşturuldu
- [ ] Test şikayeti gönderildi

---

## SORUN GİDERME

**Site açılmıyor:** Cloudflare DNS propagation bekle (max 48 saat)
**API çalışmıyor:** Railway loglarına bak, DATABASE_URL doğru mu?
**Şikayetler kayıt olmuyor:** CORS_ORIGINS'e domaini ekledin mi?
**E-posta gitmiyor:** Resend domain doğrulaması tamamlandı mı?

Destek: destek@sikayetetkktc.com
