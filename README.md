# E-Commerce Backend Projesi (Node.js)

Bu proje, Node.js kullanılarak geliştirilmiş bir e-ticaret backend
uygulamasıdır. Projenin amacı, bir e-ticaret sisteminin temel backend
mantığını (kullanıcı yönetimi, ürün işlemleri ve yetkilendirme)
öğrenmek ve uygulamaktır.

---

## 🎯 Projenin Amacı

Bu projede aşağıdaki konuların pratikte öğrenilmesi hedeflenmiştir:

- Node.js ile backend geliştirme mantığını kavramak
- Express.js ile REST API oluşturmak
- JWT kullanarak kimlik doğrulama yapmak
- Rol bazlı yetkilendirme (Admin / User) uygulamak
- MySQL veritabanı ile veri yönetimi sağlamak

---

## 🧰 Kullanılan Teknolojiler

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT (JSON Web Token)
- dotenv
- JavaScript (ES6)

---

## ✨ Özellikler

- Kullanıcı kayıt ve giriş işlemleri
- JWT tabanlı kimlik doğrulama
- Admin ve normal kullanıcı ayrımı
- Ürün listeleme ve ürün detay görüntüleme
- Yetkilendirme middleware yapısı
- RESTful API mimarisi

---

## 📁 Klasör Yapısı ve İşlevleri

```text
ecommerce-backend/
├─ public/                 → Statik dosyalar
│  ├─ css/                 → CSS dosyaları
│  ├─ images/              → Görseller
│  └─ js/                  → Frontend JavaScript dosyaları
├─ src/
│  ├─ config/              → Veritabanı ve uygulama ayarları
│  ├─ controllers/         → İş mantığının yazıldığı dosyalar
│  ├─ middlewares/         → Kimlik doğrulama ve yetkilendirme
│  ├─ models/              → Sequelize veritabanı modelleri
│  ├─ routes/              → API endpoint tanımları
│  └─ views/               → EJS / template dosyaları
├─ app.js                  → Express uygulamasının ana dosyası
├─ server.js               → Sunucu başlangıç noktası
├─ .env.example            → Ortam değişkenleri örneği
├─ package.json
└─ package-lock.json



⚙️ Kurulum

1️⃣ Bağımlılıkları yükle
npm install

2️⃣ Ortam değişkenlerini ayarla
.env.example dosyasını .env olarak kopyala ve veritabanı bilgilerini gir.

3️⃣ Uygulamayı başlat
npm start

▶️ Çalıştırma
Uygulama varsayılan olarak aşağıdaki adreste çalışır:

http://localhost:3000
👤 Varsayılan Kullanıcılar
Normal kullanıcılar kayıt (register) olarak sisteme giriş yapabilir.

Admin yetkisine sahip kullanıcılar admin işlemlerini gerçekleştirebilir.

Admin işlemleri JWT ve rol kontrolü ile korunmaktadır.

🌐 Örnek API Endpoint’leri
Grup	Method	Endpoint	Açıklama	Yetki
Auth	POST	/api/auth/register	Kullanıcı kayıt	Public
Auth	POST	/api/auth/login	Kullanıcı giriş	Public
Products	GET	/products	Ürün listeleme	Public
Products	GET	/products/:id	Ürün detay	Public
Products	POST	/products	Ürün ekleme	Admin
⚠️ Önemli Notlar
node_modules klasörü projeye bilinçli olarak dahil edilmemiştir.

Gerçek ortam değişkenleri güvenlik sebebiyle paylaşılmamıştır.

Proje eğitim ve akademik amaçlıdır.

👩‍💻 Proje Geliştirici
Bu proje bireysel olarak geliştirilmiştir.

Geliştirici: Rojin Tokdemir