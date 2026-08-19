(() => {
  const FALLBACK = {
    heroTitleMain: "Şehrin",
    heroTitleAccent: "Fenomen Cafesi",
    heroDescription: "Yüksek FPS, düşük gecikme ve rekabet için hazırlanmış oyuncu sistemleri. Valorant'tan CS2'ye, GTA 5'ten ETS 2'ye oyun burada başlar.",
    heroImage: "assets/arena-1.webp",
    refreshRate: "540",
    cpu: "7800X3D",
    gpu: "RTX 4060",
    fiber: "1G / 1G",
    googleRating: "4,7",
    googleReviewCount: "1.100+ gerçek kullanıcı yorumu",
    aboutYear: "2000'DEN BERİ",
    aboutText1: "Hızır Game Arena, Gaziantep'te oyun kültürünü teknolojiyle buluşturan, rekabetçi oyunculara güçlü sistemler ve sosyal bir buluşma alanı sunan e-spor kompleksidir.",
    aboutText2: "Amacımız yalnızca bilgisayar sunmak değil; oyuncuların rahat ettiği, takımını kurduğu, performansını gösterdiği ve yeniden gelmek istediği bir oyun ortamı oluşturmaktır.",
    games: ["VALORANT","CS2","GTA 5 MODLU","ETS 2 MP","FORZA","LEAGUE OF LEGENDS","WARZONE","APEX","MINECRAFT","CS 1.6"],
    phoneDisplay: "0530 308 98 92",
    phoneE164: "+905303089892",
    whatsappNumber: "905303089892",
    instagramUrl: "https://www.instagram.com/hizirgamecafe/",
    instagramHandle: "@hizirgamecafe",
    mapsUrl: "https://maps.app.goo.gl/pDUSkGoS71udXeFV7?g_st=ic",
    address: "Alleben Mahallesi, Şair Nabi Sokak No:11/A, Şahinbey / Gaziantep",
    openingHours: "07:00 – 00:00",
    campaignActive: false,
    campaignTitle: "Oyunculara özel kampanya",
    campaignText: "Güncel kampanya ve duyurular burada yayınlanır.",
    campaignButtonText: "Detay Al",
    campaignLink: "#konum",
    galleryImage1: "assets/arena-1.webp",
    galleryImage2: "assets/arena-2.webp",
    galleryImage3: "assets/arena-3.webp"
  };

  const text = (id, value) => { const el=document.getElementById(id); if(el && value != null) el.textContent=String(value); };
  const src = (id, value) => { const el=document.getElementById(id); if(el && value) el.src=value; };
  const safeHref = (value, fallback="#") => {
    if (!value) return fallback;
    const v=String(value).trim();
    if (v.startsWith("#") || v.startsWith("/") || /^(https?:|tel:|mailto:)/i.test(v)) return v;
    return fallback;
  };
  const whatsappUrl = (num) => `https://wa.me/${String(num||"").replace(/\D/g,"")}?text=${encodeURIComponent("Merhaba Hızır Game Arena, bilgi almak istiyorum.")}`;

  function apply(c){
    text("hero-title-main",c.heroTitleMain); text("hero-title-accent",c.heroTitleAccent); text("hero-description",c.heroDescription);
    src("hero-image",c.heroImage); text("stat-refresh",c.refreshRate); text("stat-cpu",c.cpu); text("stat-gpu",c.gpu); text("stat-fiber",c.fiber);
    text("google-rating",c.googleRating); text("google-review-count",c.googleReviewCount);
    text("about-year",c.aboutYear); text("about-text-1",c.aboutText1); text("about-text-2",c.aboutText2);
    text("instagram-handle",c.instagramHandle); text("contact-address",c.address); text("opening-hours",c.openingHours);
    src("gallery-image-1",c.galleryImage1); src("gallery-image-2",c.galleryImage2); src("gallery-image-3",c.galleryImage3);

    const cloud=document.getElementById("game-cloud");
    if(cloud && Array.isArray(c.games)){
      cloud.replaceChildren(...c.games.filter(Boolean).map(g=>{const s=document.createElement("span");s.textContent=g;return s;}));
    }

    document.querySelectorAll('a[href^="tel:"]').forEach(a=>{a.href=`tel:${String(c.phoneE164||FALLBACK.phoneE164).replace(/[^+\d]/g,"")}`; if(a.classList.contains("secondary") && /\d/.test(a.textContent)) a.textContent=c.phoneDisplay;});
    document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>a.href=whatsappUrl(c.whatsappNumber));
    document.querySelectorAll('a[href*="instagram.com/"]').forEach(a=>a.href=safeHref(c.instagramUrl,a.href));
    document.querySelectorAll('a[href*="pDUSkGoS71udXeFV7"]').forEach(a=>a.href=safeHref(c.mapsUrl,a.href));
    const ci=document.getElementById("contact-instagram"); if(ci){ci.href=safeHref(c.instagramUrl,ci.href);ci.textContent=c.instagramHandle;}

    const banner=document.getElementById("campaign-banner");
    if(banner){
      banner.hidden=!c.campaignActive;
      text("campaign-title",c.campaignTitle); text("campaign-text",c.campaignText);
      const link=document.getElementById("campaign-link"); if(link){link.textContent=c.campaignButtonText||"Detay Al";link.href=safeHref(c.campaignLink,"#konum");}
    }
  }

  async function load(){
    let config=FALLBACK;
    try{
      const r=await fetch('/api/site-data',{cache:'no-store',headers:{'Accept':'application/json'}});
      if(r.ok){const j=await r.json();config={...FALLBACK,...(j.config||j)};}
    }catch(e){console.info('Admin verileri henüz bağlanmamış; varsayılan içerik kullanılıyor.');}
    apply(config);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',load); else load();
})();
