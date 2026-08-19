HIZIR GAME ARENA — V8 MOBİL + ADMIN PANEL
===========================================

BU SÜRÜM NEDEN DAHA SAĞLAM?
- Ana sayfanın CSS'i index.html içine gömülüdür. styles.css yüklenmese bile tasarım kaybolmaz.
- Ana sayfanın site.js kodu da index.html içine gömülüdür.
- Admin panelinin CSS ve JavaScript'i admin/index.html içine gömülüdür.
- Telefon için gerçek açılır/kapanır hamburger menü eklendi.
- 390px, 640px, 900px ve geniş ekranlar için responsive düzeltmeler eklendi.
- Yatay taşma, geniş başlıklar, galeri, butonlar, harita, iletişim ve performans kartları mobilde düzeltildi.
- Mevcut Cloudflare Worker + KV admin sistemi korunmuştur.

DOSYALAR
- index.html                 : Ana site (CSS + site JS gömülü)
- styles.css                : Yedek/kolay düzenleme için bırakıldı
- site.js                   : Yedek/kolay düzenleme için bırakıldı
- assets/*                  : Mevcut logo ve salon görselleri
- admin/index.html          : Yönetim paneli (CSS + JS gömülü)
- admin/admin.css/admin.js  : Yedek olarak bırakıldı
- _worker.js                : Cloudflare Worker / KV / admin API
- _headers                  : Admin/API cache kuralları

CLOUDFLARE'A YÜKLEME
1) Çalışan siteyi silmeyin.
2) Bu ZIP ile yeni deployment oluşturun.
3) Önce Cloudflare'ın geçici deployment adresini açın.
4) Bilgisayarda ana sayfa ve /admin/ kontrol edin.
5) Telefonda menüyü, galeri, harita, WhatsApp ve butonları kontrol edin.
6) Her şey düzgünse deployment'ı production olarak kullanın.

ADMIN İÇİN CLOUDFARE AYARLARI
- KV binding variable: SITE_DATA
- Secret: ADMIN_PASSWORD
- Secret: SESSION_SECRET

Canlı admin: https://hizirespor.com/admin/

NOT
Ana sitenin tasarımı artık harici styles.css dosyasına bağlı değildir. Bu, daha önce görülen
'beyaz sayfa / ham HTML' problemini doğrudan hedefleyen en önemli V8 değişikliğidir.
