function b64url(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(payload, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64url(new Uint8Array(sig));
}

async function validToken(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [tsRaw, nonce, signature] = parts;
    const ts = Number(tsRaw);
    if (!Number.isFinite(ts)) return false;
    if (Date.now() - ts > 12 * 60 * 60 * 1000 || ts > Date.now() + 60_000) return false;
    const expected = await sign(`${tsRaw}.${nonce}`, secret);
    return expected === signature;
  } catch {
    return false;
  }
}

export async function onRequestPost(context) {
  const secret = context.env.ADMIN_PASSWORD;
  if (!secret) {
    return Response.json(
      { error: "ADMIN_PASSWORD Cloudflare Secret olarak tanımlı değil." },
      { status: 500 }
    );
  }

  if (!context.env.SITE_DATA) {
    return Response.json(
      { error: "SITE_DATA KV binding tanımlı değil." },
      { status: 500 }
    );
  }

  const auth = context.request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!(await validToken(token, secret))) {
    return Response.json({ error: "Oturum geçersiz. Tekrar giriş yap." }, { status: 401 });
  }

  let body;
  try { body = await context.request.json(); }
  catch { return Response.json({ error: "Geçersiz veri." }, { status: 400 }); }

  const allowed = [
    "eyebrow","announcement","title","subtitle","aboutTitle","aboutText",
    "feature1","feature2","feature3","address","phone","whatsapp",
    "instagram","maps","s1v","s1l","s2v","s2l","s3v","s3l","s4v","s4l"
  ];

  const clean = {};
  for (const key of allowed) {
    if (typeof body?.[key] === "string") clean[key] = body[key].slice(0, 5000);
  }

  await context.env.SITE_DATA.put("site_content", JSON.stringify(clean));
  return Response.json({ ok: true });
}
