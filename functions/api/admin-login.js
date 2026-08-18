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

export async function onRequestPost(context) {
  const secret = context.env.ADMIN_PASSWORD;
  if (!secret) {
    return Response.json(
      { error: "ADMIN_PASSWORD Cloudflare Secret olarak tanımlı değil." },
      { status: 500 }
    );
  }

  let body = {};
  try { body = await context.request.json(); } catch {}

  if (typeof body.password !== "string" || body.password !== secret) {
    return Response.json({ error: "Yönetici şifresi hatalı." }, { status: 401 });
  }

  const payload = `${Date.now()}.${crypto.randomUUID()}`;
  const signature = await sign(payload, secret);
  return Response.json({ ok: true, token: `${payload}.${signature}` });
}
