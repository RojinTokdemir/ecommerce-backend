# 🛒 E-Commerce Web Application (Node.js)

Bu proje, Node.js ve Express.js kullanılarak geliştirilmiş, admin paneli bulunan, ürün yönetimi, favoriler, sepet ve çok adımlı ödeme akışına sahip bir e-ticaret web uygulamasıdır.

Proje, backend ve frontend’in birlikte çalıştığı full-stack bir yapıya sahiptir ve eğitim amaçlı olarak geliştirilmiştir.

## 🎯 Projenin Amacı

Bu projenin amacı:

- Backend (Node.js) ile REST API geliştirme
- Veritabanı (MySQL + Sequelize) kullanımı
- Admin yetkilendirme ve rol bazlı erişim
- Dinamik ürün listeleme ve detay sayfası
- Gerçekçi bir e-ticaret akışının uygulanması
- Seed & dummy data mantığını öğretmek konularını tek bir projede bir araya getirmektir.

## ✨ Uygulama Özellikleri

### 👤 Kullanıcı Tarafı

- Ürünleri listeleme
- Ürün detaylarını görüntüleme
- Favorilere ürün ekleme / çıkarma
- Sepete ürün ekleme
- Sepette ürün adedi artırma / azaltma / silme
- 3 adımlı ödeme süreci (Step 1 – Step 2 – Step 3)

### 🔐 Kimlik Doğrulama

- Kullanıcı giriş (login)
- JWT tabanlı authentication
- Kullanıcı rolü kontrolü (admin / user)

### 🛠️ Admin Paneli

- Sadece admin erişebilir
- Ürün ekleme
- Ürün güncelleme
- Ürün silme
- Admin panel linki sadece admin girişinde görünür

### 🌱 Seed & Dummy Data

- Seed data: Proje ilk kurulduğunda otomatik ürün ekler
- Dummy data: Veritabanı yoksa uygulamanın boş görünmemesini sağlar

## 🧰 Kullanılan Teknolojiler

### Backend

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

### Frontend

- (Template Engine)
- HTML5
- CSS3
- Bootstrap 5
- Vanilla JavaScript

### Diğer

- LocalStorage
- Git & GitHub

## 📁 Proje Dosya Yapısı

### 📌 Dosyaların Görevleri

public/js
- admin.js → Admin panel işlemleri
- cart.js → Sepet işlemleri
- checkout.js → 3 adımlı ödeme akışı
- details.js → Ürün detay sayfası
- favorites.js → Favori ürünler
- navbar.js → Navbar davranışları
- products.js → Ürün listeleme
- utils.js → Yardımcı fonksiyonlar

src
- config/db.js → MySQL bağlantı ayarları
- controllers/ → İş mantığı
- models/ → Sequelize modelleri
- routes/ → API route’ları
- seeders/ → Seed dosyaları
- views/ → EJS sayfaları


## ⚙️ Kurulum (Sıfırdan İndirenler İçin)

1️⃣ Projeyi klonla
git clone <repo-url>
cd ecommerce-backend

2️⃣ Gerekli paketleri yükle
npm install

3️⃣ MySQL veritabanı oluştur
CREATE DATABASE ecommerce_db;

4️⃣ Ortam değişkenlerini ayarla

.env.example dosyasını .env olarak kopyala ve düzenle:

PORT=3000
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
JWT_SECRET=secretkey

5️⃣ Uygulamayı başlat
npm start

### 🌱 Seed Sistemi Nasıl Çalışır?

- Uygulama ilk çalıştığında:
- Admin kullanıcı otomatik oluşturulur
- Ürün tablosu boşsa seedProduct.js çalışır
- Ürün tablosunda veri varsa:
- Seed tekrar çalışmaz
- Sonradan ürün ekleme:
- Admin panel üzerinden yapılır

### 🔑 Varsayılan Admin Bilgileri
- Kullanıcı adı: admin
- Şifre: 1234

### 👩‍💻 Proje Geliştiricisi

- Rojin Tokdemir
- Junior Software Developer
Node.js • JavaScript • MySQL • Bootstrap