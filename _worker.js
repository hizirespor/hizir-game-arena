const CONFIG_KEY = "site-config-v1";
const SESSION_COOKIE = "hizir_admin";
const SESSION_TTL = 60 * 60 * 8;

const DEFAULT_CONFIG = {
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

const json = (data, status=200, extra={}) => new Response(JSON.stringify(data), {status, headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...extra}});
const b64u = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
const enc = new TextEncoder();
async function hmac(secret, value){
  const key=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  return b64u(new Uint8Array(await crypto.subtle.sign("HMAC",key,enc.encode(value))));
}
function cookieValue(request,name){
  const raw=request.headers.get("cookie")||"";
  for(const part of raw.split(";")){const [k,...v]=part.trim().split("=");if(k===name)return v.join("=");}
  return "";
}
async function makeSession(env){
  const payload=b64u(enc.encode(JSON.stringify({exp:Math.floor(Date.now()/1000)+SESSION_TTL})));
  return `${payload}.${await hmac(env.SESSION_SECRET,payload)}`;
}
async function isAdmin(request,env){
  if(!env.SESSION_SECRET) return false;
  const token=cookieValue(request,SESSION_COOKIE); if(!token||!token.includes(".")) return false;
  const [payload,sig]=token.split(".");
  if((await hmac(env.SESSION_SECRET,payload))!==sig) return false;
  try{
    const s=payload.replace(/-/g,"+").replace(/_/g,"/");
    const obj=JSON.parse(atob(s+"=".repeat((4-s.length%4)%4)));
    return Number(obj.exp)>Math.floor(Date.now()/1000);
  }catch{return false;}
}
function sameOrigin(request){
  const origin=request.headers.get("origin");
  return !origin || origin===new URL(request.url).origin;
}
function cleanString(v,max=500){return String(v??"").trim().slice(0,max);}
function cleanUrl(v){
  const s=cleanString(v,1000);
  if(s.startsWith("#")||s.startsWith("/")||/^(https?:|tel:|mailto:)/i.test(s)) return s;
  return "";
}
function normalize(input){
  const o={...DEFAULT_CONFIG};
  const s=(k,m=500)=>{if(k in input)o[k]=cleanString(input[k],m)};
  ["heroTitleMain","heroTitleAccent","refreshRate","cpu","gpu","fiber","googleRating","googleReviewCount","aboutYear","phoneDisplay","phoneE164","whatsappNumber","instagramHandle","address","openingHours","campaignTitle","campaignButtonText"].forEach(k=>s(k,200));
  ["heroDescription","aboutText1","aboutText2","campaignText"].forEach(k=>s(k,1400));
  ["heroImage","instagramUrl","mapsUrl","campaignLink","galleryImage1","galleryImage2","galleryImage3"].forEach(k=>{if(k in input)o[k]=cleanUrl(input[k])||DEFAULT_CONFIG[k]});
  o.campaignActive=Boolean(input.campaignActive);
  if(Array.isArray(input.games))o.games=input.games.map(x=>cleanString(x,60)).filter(Boolean).slice(0,40);
  return o;
}
async function getConfig(env){
  if(!env.SITE_DATA) return DEFAULT_CONFIG;
  const stored=await env.SITE_DATA.get(CONFIG_KEY,{type:"json"});
  return stored?{...DEFAULT_CONFIG,...stored}:DEFAULT_CONFIG;
}

export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    if(url.pathname==="/api/site-data" && request.method==="GET"){
      return json({config:await getConfig(env)});
    }
    if(url.pathname==="/api/login" && request.method==="POST"){
      if(!sameOrigin(request)) return json({error:"Geçersiz istek."},403);
      if(!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({error:"Admin secret ayarları Cloudflare'da henüz tanımlanmamış."},500);
      let body={}; try{body=await request.json();}catch{}
      if(String(body.password||"")!==String(env.ADMIN_PASSWORD)) return json({error:"Şifre hatalı."},401);
      const token=await makeSession(env);
      return json({ok:true},200,{"set-cookie":`${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL}`});
    }
    if(url.pathname==="/api/logout" && request.method==="POST"){
      return json({ok:true},200,{"set-cookie":`${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`});
    }
    if(url.pathname==="/api/me" && request.method==="GET") return json({authenticated:await isAdmin(request,env)});
    if(url.pathname==="/api/site-data" && request.method==="POST"){
      if(!sameOrigin(request)) return json({error:"Geçersiz istek."},403);
      if(!(await isAdmin(request,env))) return json({error:"Oturum gerekli."},401);
      if(!env.SITE_DATA) return json({error:"SITE_DATA KV bağlantısı Cloudflare'da henüz tanımlanmamış."},500);
      let body; try{body=await request.json();}catch{return json({error:"Geçersiz veri."},400)}
      const config=normalize(body.config||body);
      await env.SITE_DATA.put(CONFIG_KEY,JSON.stringify(config));
      return json({ok:true,config,savedAt:new Date().toISOString()});
    }
    if(url.pathname.startsWith("/api/")) return json({error:"Bulunamadı."},404);
    return env.ASSETS.fetch(request);
  }
};
