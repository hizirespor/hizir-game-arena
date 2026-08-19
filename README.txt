HIZIR GAME ARENA — YÖNETİM PANELLİ SÜRÜM
==========================================

CANLI SITE
- Ana site: https://hizirespor.com
- Yönetim paneli: https://hizirespor.com/admin/

BU SÜRÜMDE NELER VAR?
- Şifreli admin girişi
- Ana sayfa başlık/açıklama düzenleme
- 540 Hz / CPU / GPU / Fiber bilgileri
- Google puan ve yorum sayısı metni
- Kampanya/duyuru aç-kapat ve düzenleme
- Hakkımızda metinleri
- Telefon, WhatsApp, Instagram, adres, çalışma saatleri
- Oyun listesini ekleme/silme
- Hero ve galeri görsel URL/dosya yolları

ÖNEMLİ: Cloudflare'da 3 küçük kurulum gerekir
1) Bu ZIP'i mevcut hizir-game-arena Pages projesine yeni deployment olarak yükleyin.
   _worker.js dosyası drag-and-drop Direct Upload ile desteklenir.

2) Bir Workers KV namespace oluşturun (örnek ad: hizir-site-data).
   Pages projesi > Settings > Bindings > Add > KV Namespace
   Variable name: SITE_DATA
   Namespace: oluşturduğunuz hizir-site-data

3) Pages projesi > Settings > Variables and Secrets bölümünde iki SECRET oluşturun:
   ADMIN_PASSWORD = sizin belirleyeceğiniz güçlü yönetici şifresi
   SESSION_SECRET = uzun ve rastgele bir gizli anahtar (en az 32 karakter önerilir)

Bunlardan sonra https://hizirespor.com/admin/ adresinden giriş yapabilirsiniz.

GÜVENLİK
- Şifre HTML/JavaScript içine yazılmaz; Cloudflare secret olarak tutulur.
- Giriş başarılı olunca HttpOnly + Secure + SameSite=Strict oturum çerezi kullanılır.
- Admin sayfası arama motorlarına noindex olarak işaretlenmiştir.

NOT
- Görsel yükleme (bilgisayardan fotoğraf seçip doğrudan yükleme) bu ilk sürümde yoktur.
  Görsel alanlarına mevcut assets/... yolları veya doğrudan https görsel URL'si girilebilir.
- Sonraki sürümde Cloudflare R2 bağlayarak gerçek fotoğraf yükleme eklenebilir.
