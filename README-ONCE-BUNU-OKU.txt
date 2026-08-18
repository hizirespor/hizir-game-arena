HIZIR GAME ARENA - WRANGLER ADMIN PAKETI
=========================================

Bu paket Cloudflare Pages'e Wrangler ile yuklemek icin hazirdir.
Dashboard'dan ZIP surukleyip birakma kullanma; /functions klasoru icin Wrangler gereklidir.

PROJE
- Cloudflare Pages proje adi: hizir-game-arena
- Site: https://hizirespor.com
- Admin: https://hizirespor.com/admin/

CLOUDFLARE'DA ZATEN TANIMLI OLMASI GEREKENLER
1) Settings > Variables and secrets
   Secret adi: ADMIN_PASSWORD
   Degeri: senin yonetici sifren

2) Settings > Bindings
   Binding adi: SITE_DATA
   KV namespace: hizir-espor-kv

WINDOWS'TA EN KOLAY KURULUM
1) ZIP'i masaustune cikar.
2) Klasoru ac.
3) Ilk kez: 1-KURULUM.bat dosyasini calistir.
4) Tarayicida Cloudflare iznini onayla.
5) Sonra 2-DEPLOY.bat dosyasini calistir.
6) Deploy bittikten sonra https://hizirespor.com/admin/ adresini ac.

SONRAKI GUNCELLEMELERDE
- Sadece 2-DEPLOY.bat yeterlidir.

NOT
- ADMIN_PASSWORD bu ZIP dosyasinin icine yazilmamistir.
- SITE_DATA'daki mevcut site verilerin silinmez; KV ayni namespace'e bagli kalir.
- Admin oturumu HMAC-SHA256 ile imzalanir; sifre token icine yazilmaz.
