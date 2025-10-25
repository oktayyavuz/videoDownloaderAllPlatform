# RimuruTR Media Downloader / RimuruTR Medya İndirici

Download media from YouTube, TikTok, Instagram and Twitter. Works as both a website and Telegram bot.

YouTube, TikTok, Instagram ve Twitter'dan medya indirme platformu. Hem web sitesi hem de Telegram botu olarak çalışır.

## 🚀 Features / Özellikler

- **Multi-Platform Support / Çoklu Platform Desteği**: YouTube, TikTok, Instagram, Twitter
- **Video & Audio Download / Video & Ses İndirme**: Both video and audio-only files / Hem video hem de sadece ses dosyası
- **Quality Selection / Kalite Seçimi**: Best quality, 1080p, 720p, 480p options / En iyi kalite, 1080p, 720p, 480p seçenekleri
- **Telegram Bot**: Easy-to-use Telegram interface / Telegram üzerinden kolay kullanım
- **Modern Web Interface / Modern Web Arayüzü**: Responsive and user-friendly design / Responsive ve kullanıcı dostu tasarım
- **Real-time Progress / Gerçek Zamanlı Progress**: Download progress and percentage tracking / İndirme ilerlemesi ve yüzde takibi
- **Auto Cleanup / Otomatik Temizlik**: Files automatically deleted after 24 hours / 24 saat sonra dosyalar otomatik silinir
- **System Control / Sistem Kontrolü**: Automatic system status check and startup / Otomatik sistem durumu kontrolü ve başlatma
- **Console Logging / Konsol Logging**: Detailed console logs and tracking / Detaylı konsol logları ve takip
- **SQLite Database / SQLite Veritabanı**: Data management with Prisma ORM / Prisma ORM ile veri yönetimi

## 🛠️ Technologies / Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database / Veritabanı**: SQLite
- **Bot**: node-telegram-bot-api
- **Media Download / Medya İndirme**: yt-dlp (for all platforms / tüm platformlar için)
- **Styling**: Tailwind CSS, Lucide React Icons
- **Progress Tracking**: Real-time progress updates
- **File Management / Dosya Yönetimi**: Automatic file cleanup / Otomatik dosya temizleme

## 📦 Installation / Kurulum

### 1. Clone the Project / Projeyi Klonlayın

```bash
git clone https://github.com/oktayyavuz/videoDownloaderAllPlatform
cd videoDownloaderAllPlatform
```

### 2. Install Dependencies / Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables / Ortam Değişkenleri

Copy `env.example` file as `.env` and fill in the required values:

`env.example` dosyasını `.env` olarak kopyalayın ve gerekli değerleri doldurun:

```bash
cp env.example .env
```

Edit the `.env` file:

`.env` dosyasını düzenleyin:

```env
# Telegram Bot Configuration / Telegram Bot Yapılandırması
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=rimurutrbot
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash

# Database Configuration / Veritabanı Yapılandırması
DATABASE_URL="file:./dev.db"

# Application Configuration / Uygulama Yapılandırması
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development

# Server Configuration / Sunucu Yapılandırması
PORT=3000
HOST=localhost

# Media Download Configuration / Medya İndirme Yapılandırması
MAX_FILE_SIZE=100000000
DOWNLOAD_TIMEOUT=300000
TEMP_DIR=./temp

# Security / Güvenlik
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Prepare Database / Veritabanını Hazırlayın

```bash
# Generate Prisma client / Prisma client'ı oluştur
npm run db:generate

# Create database / Veritabanını oluştur
npm run db:push
```

### 5. Start Application / Uygulamayı Başlatın

```bash
# Development mode / Development modu
npm run dev

# Production mode / Production modu
npm run build
npm start
```

## 🤖 Telegram Bot Setup / Telegram Bot Kurulumu

1. Create a new bot with [@BotFather](https://t.me/botfather)
   [@BotFather](https://t.me/botfather) ile yeni bot oluşturun
2. Add bot token to `.env` file
   Bot token'ını `.env` dosyasına ekleyin
3. Add bot username to `.env` file (rimurutrbot)
   Bot username'ini `.env` dosyasına ekleyin (rimurutrbot)
4. Bot will automatically start when application launches
   Uygulama başlatıldığında bot otomatik olarak çalışmaya başlar

### Bot Commands / Bot Komutları

- `/start` - Start bot and welcome message / Botu başlat ve hoş geldin mesajı
- `/help` - Help and usage information / Yardım ve kullanım bilgileri
- `/status` - Bot status and statistics / Bot durumu ve istatistikler

### Bot Features / Bot Özellikleri

- **Quality Selection / Kalite Seçimi**: Best quality, 1080p, 720p, 480p, audio only / En iyi kalite, 1080p, 720p, 480p, sadece ses
- **Progress Tracking**: Real-time download progress / İndirme ilerlemesi real-time takip
- **Thumbnail Sending / Thumbnail Gönderimi**: Send video thumbnails / Video thumbnail'leri ile birlikte gönderim
- **Video Details / Video Detayları**: Title, duration, file size / Başlık, süre, boyut bilgileri
- **Rate Limiting**: Update limitations to avoid Telegram API limits / Telegram API limitlerini aşmamak için güncelleme sınırlaması

## 📱 Usage / Kullanım

### Website / Web Sitesi

1. Go to main page / Ana sayfaya gidin
2. Enter the media URL you want to download / İndirmek istediğiniz medya URL'sini girin
3. Select video or audio option / Video veya ses seçeneğini belirleyin
4. Choose quality (best, 1080p, 720p, 480p) / Kalite seçimi yapın (best, 1080p, 720p, 480p)
5. Click "Download" button / "İndir" butonuna tıklayın
6. Track progress with progress bar / Progress bar ile ilerlemeyi takip edin
7. Download file when completed / İndirme tamamlandığında dosyayı indirin

### Telegram Bot

1. Find bot on Telegram: `@rimurutrbot`
   Botu Telegram'da bulun: `@rimurutrbot`
2. Start with `/start` command
   `/start` komutu ile başlatın
3. Send the media URL you want to download
   İndirmek istediğiniz medya URL'sini gönderin
4. Choose quality (with inline keyboard)
   Kalite seçimi yapın (inline keyboard ile)
5. Bot automatically detects platform and downloads
   Bot otomatik olarak platformu tespit eder ve indirir
6. Track progress with progress messages
   Progress mesajları ile ilerlemeyi takip edin
7. Thumbnail and file automatically sent when completed
   İndirme tamamlandığında thumbnail ve dosya otomatik olarak gönderilir

## 🔧 API Endpoints

### POST /api/download
Start media download process / Medya indirme işlemi başlatır.

```json
{
  "url": "https://youtube.com/watch?v=...",
  "mediaType": "VIDEO", // or "AUDIO" / veya "AUDIO"
  "quality": "best" // best, 1080p, 720p, 480p
}
```

### GET /api/download/[id]
Download the downloaded file / İndirilen dosyayı indirir.

### GET /api/download/[id]/progress
Get download progress / İndirme ilerlemesini getirir.

### GET /api/stats
Get statistics / İstatistikleri getirir.

### GET /api/bot
Check bot status / Bot durumunu kontrol eder.

### POST /api/bot
Start/stop bot / Botu başlatır/durdurur.

```json
{
  "action": "start" // or "stop" / veya "stop"
}
```

### GET /api/system
Check all systems status / Tüm sistemlerin durumunu kontrol eder.

### POST /api/system
Start/stop systems / Sistemleri başlatır/durdurur.

```json
{
  "action": "start-all" // or "stop-all" / veya "stop-all"
}
```

### GET /api/cleanup
Check cleanup service status / Temizlik servisi durumunu kontrol eder.

### POST /api/cleanup
Start/stop cleanup service / Temizlik servisini başlatır/durdurur.

```json
{
  "action": "start", // or "stop", "cleanup" / veya "stop", "cleanup"
}
```

## 📊 Supported Platforms / Desteklenen Platformlar

| Platform | Video | Audio / Ses | Image / Resim | Quality Selection / Kalite Seçimi | Notes / Notlar |
|----------|-------|-------------|---------------|-----------------------------------|-----------------|
| YouTube | ✅ | ✅ | ❌ | ✅ | Uses yt-dlp / yt-dlp kullanır |
| TikTok | ✅ | ❌ | ❌ | ✅ | Requires yt-dlp / yt-dlp gerekli |
| Instagram | ✅ | ❌ | ✅ | ✅ | Requires yt-dlp / yt-dlp gerekli |
| Twitter | ✅ | ❌ | ❌ | ✅ | Requires yt-dlp / yt-dlp gerekli |

## 🧹 Auto Cleanup System / Otomatik Temizlik Sistemi

- **24 Hour Rule / 24 Saat Kuralı**: Downloaded files automatically deleted after 24 hours / İndirilen dosyalar 24 saat sonra otomatik silinir
- **Database Cleanup / Veritabanı Temizliği**: Old download records deleted / Eski download kayıtları silinir
- **Temp Folder Cleanup / Temp Klasör Temizliği**: Temporary files cleaned / Geçici dosyalar temizlenir
- **Auto Start / Otomatik Başlatma**: Cleanup service starts automatically when site launches / Site başlatıldığında temizlik servisi otomatik başlar
- **Manual Cleanup / Manuel Temizlik**: Manual cleanup possible via API / API ile manuel temizlik yapılabilir

## 🔍 System Control and Auto Startup / Sistem Kontrolü ve Otomatik Başlatma

### Auto System Control / Otomatik Sistem Kontrolü
- System check performed **2 seconds after** `npm run dev` starts site
  `npm run dev` ile site başlatıldığında **2 saniye sonra** sistem kontrolü yapılır
- **Bot** and **Cleanup service** status checked
  **Bot** ve **Cleanup servisi** durumu kontrol edilir
- Non-working systems **automatically started**
  Çalışmayan sistemler **otomatik başlatılır**

### ⚠️ Known Issues / Bilinen Sorunlar

**Auto System Startup Issue / Otomatik Sistem Başlatma Sorunu:**
- Auto system startup may not work properly sometimes
  Otomatik sistem başlatma bazen düzgün çalışmayabilir
- You may need to start systems manually in this case
  Bu durumda manuel olarak sistemleri başlatmanız gerekebilir

**Manual System Startup / Manuel Sistem Başlatma:**
```bash
# Start bot / Bot'u başlat
Invoke-RestMethod -Uri "http://localhost:3000/api/bot" -Method POST -Body '{"action":"start"}' -ContentType "application/json"

# Start cleanup service / Temizlik servisini başlat
Invoke-RestMethod -Uri "http://localhost:3000/api/cleanup" -Method POST -Body '{"action":"start"}' -ContentType "application/json"

# Start all systems / Tüm sistemleri başlat
Invoke-RestMethod -Uri "http://localhost:3000/api/system" -Method POST -Body '{"action":"start-all"}' -ContentType "application/json"

# Check system status / Sistem durumunu kontrol et
Invoke-RestMethod -Uri "http://localhost:3000/api/system" -Method GET
```

## 📈 Console Logging and Progress Tracking / Konsol Logging ve Progress Tracking

### Console Logs / Konsol Logları
- **API Requests / API İstekleri**: Incoming download requests / Gelen indirme istekleri
- **Platform Detection / Platform Tespiti**: Platform detection from URL / URL'den platform belirleme
- **Progress Updates**: %0-100 progress tracking / %0-100 ilerleme takibi
- **Video Information / Video Bilgileri**: Title, duration, thumbnail / Başlık, süre, thumbnail
- **Download Commands / İndirme Komutları**: yt-dlp commands / yt-dlp komutları
- **Success/Error Status / Başarı/Hata Durumları**: Result information / Sonuç bilgileri
- **Telegram Bot Operations / Telegram Bot İşlemleri**: Bot activities / Bot aktiviteleri
- **File Information / Dosya Bilgileri**: Size, format, quality / Boyut, format, kalite
- **Cleanup Operations / Temizlik İşlemleri**: File deletion operations / Dosya silme işlemleri

### Progress Tracking
- **Web UI**: Real-time progress bar
- **Telegram Bot**: Progress messages (with rate limiting)
- **Console**: Detailed progress logs
- **Database**: Progress records

## 🚨 Requirements / Gereksinimler

- Node.js 18+
- npm or yarn
- yt-dlp (for all platforms / tüm platformlar için)
- ffmpeg (for audio conversion / ses dönüştürme için)

### yt-dlp Installation / yt-dlp Kurulumu

```bash
# macOS
brew install yt-dlp

# Ubuntu/Debian
sudo apt install yt-dlp

# Windows
pip install yt-dlp
```

## 🔒 Security / Güvenlik

- Sensitive information protected with environment variables
  Hassas bilgiler environment variables ile korunur
- File size limitations
  Dosya boyutu sınırlaması
- Automatic cleanup of temporary files
  Geçici dosyalar otomatik temizlenir
- SQL injection protection (Prisma ORM)
  SQL injection koruması (Prisma ORM)
- Rate limiting (Telegram API)
  Rate limiting (Telegram API)

## 📈 Performance / Performans

- File download timeout
  Dosya indirme timeout'u
- Automatic cleanup of old files
  Eski dosyaların otomatik temizlenmesi
- Database optimization
  Veritabanı optimizasyonu
- Responsive design
  Responsive tasarım
- Progress tracking optimization
  Progress tracking optimizasyonu
- API protection with rate limiting
  Rate limiting ile API koruması

## 🐛 Troubleshooting / Sorun Giderme

### Bot Not Working / Bot Çalışmıyor
- Check tokens in `.env` file
  `.env` dosyasındaki token'ları kontrol edin
- Make sure bot is active
  Bot'un aktif olduğundan emin olun
- Check console logs
  Console loglarını kontrol edin
- Start bot manually
  Manuel olarak bot'u başlatın

### Download Failed / İndirme Başarısız
- Make sure URL is correct
  URL'nin doğru olduğundan emin olun
- Check if yt-dlp is installed
  yt-dlp'nin kurulu olduğunu kontrol edin
- Check your internet connection
  İnternet bağlantınızı kontrol edin
- Check console logs
  Konsol loglarını kontrol edin

### Database Error / Veritabanı Hatası
- Run `npm run db:push` command
  `npm run db:push` komutunu çalıştırın
- Check DATABASE_URL in `.env` file
  `.env` dosyasındaki DATABASE_URL'i kontrol edin

### System Startup Issues / Sistem Başlatma Sorunları
- Start systems manually
  Manuel olarak sistemleri başlatın
- Check console logs
  Console loglarını kontrol edin
- Test API endpoints
  API endpoint'lerini test edin

### Progress Tracking Issues / Progress Tracking Sorunları
- Check console logs
  Konsol loglarını kontrol edin
- Check database connection
  Veritabanı bağlantısını kontrol edin
- Check rate limiting settings
  Rate limiting ayarlarını kontrol edin

## 📝 License / Lisans

This project is licensed under the MIT License.

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Contributing / Katkıda Bulunma

1. Fork the project / Fork yapın
2. Create feature branch / Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit changes / Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push to branch / Push yapın (`git push origin feature/amazing-feature`)
5. Open Pull Request / Pull Request oluşturun

## 📞 Contact / İletişim

- Telegram: [@rimurutrbot](https://t.me/rimurutrbot)
- GitHub: [https://github.com/oktayyavuz/videoDownloaderAllPlatform](https://github.com/oktayyavuz/videoDownloaderAllPlatform)

---

**Note**: This project is for educational purposes. Be careful when downloading copyrighted content.

**Not**: Bu proje eğitim amaçlıdır. Telif hakkı olan içerikleri indirirken dikkatli olun.