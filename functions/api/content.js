export async function onRequestGet(context) {
  const defaults = {
    eyebrow:"GAZİANTEP'İN E-SPOR NOKTASI",
    title:"Oyunun merkezi<br>Hızır Game Arena.",
    subtitle:"Yüksek yenileme hızlı monitörler, güçlü sistemler ve 1000/1000 Mbps fiber internet ile rekabete hazır ol.",
    announcement:"Şehrin fenomen cafesi — Hızır Game Arena!",
    aboutTitle:"Gaziantep'te oyun deneyimini ileri taşıyoruz.",
    aboutText:"Hızır Game Arena, oyuncular için performans, konfor ve hızlı interneti tek çatı altında buluşturur.",
    feature1:"Akıcı ve rekabetçi oyun deneyimi için yüksek yenileme hızlı monitör seçenekleri.",
    feature2:"FPS oyunlarından güncel yapımlara kadar güçlü donanım altyapısı.",
    feature3:"Düşük gecikme ve yüksek hız için 1000/1000 Mbps fiber bağlantı.",
    s1v:"540 Hz",s1l:"Monitör seçeneği",s2v:"1000/1000",s2l:"Fiber internet",s3v:"RTX 4060",s3l:"Ekran kartı",s4v:"7800X3D",s4l:"İşlemci seçeneği",
    address:"Allaben Mah. Şair Nabi Sk. Şahinbey / Gaziantep",
    phone:"0530 308 98 92",instagram:"hizirgamecafe",whatsapp:"905303089892",
    maps:"https://maps.app.goo.gl/pYzKhzkgmbEi36BA6"
  };
  try {
    if (!context.env.SITE_DATA) {
      return Response.json(defaults, {headers:{"cache-control":"no-store"}});
    }
    const saved = await context.env.SITE_DATA.get("site_content", "json");
    return Response.json({...defaults, ...(saved || {})}, {headers:{"cache-control":"no-store"}});
  } catch {
    return Response.json(defaults, {headers:{"cache-control":"no-store"}});
  }
}
