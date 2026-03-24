# 🎬 Movie Recommendation System

Netflix tarzı kişiselleştirilmiş film öneri platformu. İşbirlikçi filtreleme, içerik bazlı öneriler ve açıklayıcı sistem ile size özel film önerileri sunar.

![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)
![Python](https://img.shields.io/badge/Python-3.11-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Redis](https://img.shields.io/badge/Redis-7-red.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Özellikler

### 🎯 Kişiselleştirilmiş Öneriler
- **Collaborative Filtering** - SVD algoritması ile kullanıcı benzerlikleri
- **Content-Based** - Film türü, içerik analizi
- **Hybrid Yaklaşım** - Her iki yöntemin kombinasyonu

### 📊 Öneri Açıklamaları
Her önerinin neden yapıldığını anlaşılır şekilde açıklar:
- "Beğendiğiniz drama filmleriyle benzer"
- "Sizinle benzer zevklere sahip kullanıcılar tarafından beğenildi"
- " aksiyon türündeki tercihlerinize uygun"

### 🔄 Gerçek Zamanlı Güncellemeler
- Socket.io ile anlık öneri güncellemeleri
- Oy verdikçe öneriler dinamik olarak değişir

### 🎨 Modern UI/UX
- **Next.js 14** - App Router ile modern React
- **TailwindCSS** - Responsive ve şık tasarım
- **Radix UI** - Erişilebilir bileşenler
- **Dark Mode** - Karanlık tema desteği

### 🔐 Kimlik Doğrulama
- Google ile giriş (NextAuth)
- Kullanıcı profili ve film geçmişi takibi

## 🏗️ Teknoloji Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend                               │
│                  Next.js 14 + React 18                       │
│               TailwindCSS + Radix UI                         │
│                  Socket.io Client                           │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP + WebSocket
┌────────────────────────────▼────────────────────────────────┐
│                     ML Service (FastAPI)                     │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │  Collaborative │  │    Content     │  │  Explainer   │ │
│  │  Filtering(SVD)│  │    Based       │  │   Service    │ │
│  └────────────────┘  └────────────────┘  └──────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    PostgreSQL 15                              │
│                   Kullanıcı ve Film Verileri                  │
└─────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                      Redis 7                                  │
│                    Önbellek ve Oturum                         │
└─────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                       TMDB API                                │
│                   Film afiş, bilgi ve görseller               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker & Docker Compose
- TMDB API Key (ücretsiz alınabilir)

### Docker ile Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/Berke-Cimen/movie-recommendation-system.git
cd movie-recommendation-system

# .env dosyasını oluşturun
cp .env.example .env

# TMDB API key'inizi ekleyin
# TMDB_API_KEY=your_api_key_here

# Tüm servisleri başlatın
docker-compose up -d

# Uygulamayı açın
open http://localhost:3000
```

### Servisler
| Servis | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| ML API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### Manuel Kurulum

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📡 API Kullanımı

### Film Önerisi
```bash
POST /recommend
Content-Type: application/json

{
  "user_id": 123,
  "movie_ids": [1, 2, 3],
  "ratings": [5.0, 4.0, 3.5],
  "limit": 10,
  "offset": 0
}
```

### Öneri Açıklaması
```bash
POST /recommend/explain
Content-Type: application/json

{
  "user_id": 123,
  "movie_id": 456
}
```

### Sağlık Kontrolü
```bash
GET /health
```

## 🤖 ML Algoritmaları

### Collaborative Filtering (SVD)
Surprise kütüphanesi ile Matrix Factorization:
- Kullanıcı-film rating matrisinin factorization
- 0.5 - 5.0 arası tahmin skoru
- Sparse matrix desteği

### Content-Based Filtering
Film özelliklerine dayalı benzerlik:
- Tür (genre) eşleştirmesi
- Film özellikleri vektörü
- Cosine similarity

### Explainer Service
Önerilerin neden yapıldığını açıklar:
- Tür eşleşmesi oranı
- Benzer kullanıcı tarafından beğenilme
- İçerik benzerliği skoru

## 📁 Proje Yapısı

```
movie-recommendation-system/
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Ana sayfa
│   │   └── api/               # API routes
│   ├── components/            # UI bileşenleri
│   ├── lib/                   # Yardımcı fonksiyonlar
│   └── package.json
│
├── ml-service/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py      # API endpointleri
│   │   ├── services/
│   │   │   ├── collab_filter.py   # SVD modeli
│   │   │   ├── explainer.py      # Öneri açıklaması
│   │   │   └── tmdb_sync.py      # TMDB senkronizasyonu
│   │   └── models/
│   │       └── schemas.py     # Pydantic modelleri
│   └── requirements.txt
│
├── docker-compose.yml
└── README.md
```

## ⚙️ Konfigürasyon

### Ortam Değişkenleri

```env
# Veritabanı
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moviedb

# Redis
REDIS_URL=redis://localhost:6379/0

# TMDB API (zorunlu)
TMDB_API_KEY=your_tmdb_api_key

# NextAuth
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📊 Desteklenen Algoritmalar

| Algoritma | Açıklama | Kullanım |
|-----------|----------|----------|
| **SVD** | Singular Value Decomposition | Collaborative filtering |
| **Cosine Similarity** | İçerik bazlı benzerlik | Tür eşleştirme |
| **Hybrid** | SVD + Content | En iyi öneriler |

## 🧪 Test

```bash
# ML Service test
cd ml-service
pytest

# Frontend test
cd frontend
npm test
```

## 📜 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**Yapımcı:** Berke Çimen
