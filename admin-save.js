export async function onRequestPost(context) {
  try {
    const request = context.request;
    const env = context.env;

    if (!env.SITE_DATA) {
      return jsonResponse(
        { error: "SITE_DATA binding bulunamadı." },
        500
      );
    }

    const authHeader = request.headers.get("Authorization") || "";

    if (!authHeader.startsWith("Bearer ")) {
      return jsonResponse(
        { error: "Yetkisiz işlem." },
        401
      );
    }

    const token = authHeader.substring(7);

    const tokenData = await env.SITE_DATA.get(
      `admin_token:${token}`
    );

    if (!tokenData) {
      return jsonResponse(
        { error: "Oturum geçersiz veya süresi dolmuş." },
        401
      );
    }

    let incomingData;

    try {
      incomingData = await request.json();
    } catch (e) {
      return jsonResponse(
        { error: "Geçersiz veri gönderildi." },
        400
      );
    }

    const allowedFields = [
      "eyebrow",
      "announcement",
      "title",
      "subtitle",

      "aboutTitle",
      "aboutText",

      "feature1",
      "feature2",
      "feature3",

      "address",
      "phone",
      "whatsapp",
      "instagram",
      "maps",

      "s1v",
      "s1l",
      "s2v",
      "s2l",
      "s3v",
      "s3l",
      "s4v",
      "s4l",

      "galleryImage1",
      "galleryImage2",
      "galleryImage3"
    ];

    const currentDataRaw =
      await env.SITE_DATA.get("site_content");

    let currentData = {};

    if (currentDataRaw) {
      try {
        currentData = JSON.parse(currentDataRaw);
      } catch (e) {
        currentData = {};
      }
    }

    allowedFields.forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(
          incomingData,
          field
        )
      ) {
        currentData[field] =
          typeof incomingData[field] === "string"
            ? incomingData[field].trim()
            : incomingData[field];
      }
    });

    await env.SITE_DATA.put(
      "site_content",
      JSON.stringify(currentData)
    );

    return jsonResponse({
      success: true,
      message: "Değişiklikler kaydedildi."
    });

  } catch (error) {
    return jsonResponse(
      {
        error: "Sunucu hatası.",
        detail: String(error?.message || error)
      },
      500
    );
  }
}

function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Cache-Control": "no-store"
      }
    }
  );
}
