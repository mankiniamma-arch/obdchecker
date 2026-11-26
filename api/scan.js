export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      matchedId: null,
      reason: "GEMINI_API_KEY not configured on Vercel"
    });
  }

  try {
    const { imageBase64, allowedIds = [] } = req.body || {};
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ error: "Missing imageBase64" });
    }

    const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: "Invalid base64 image format" });
    }

    const mimeType = match[1];
    const base64Data = match[2];

    if (base64Data.length > 5500000) {
      return res.status(413).json({ error: "Image too large" });
    }

    const validSet = new Set(Array.from(allowedIds) ? allowedIds : []);
    const allowedListText = Array.from(validSet).join(", ");

    const prompt = [
      "You are an automotive OBD-II and dashboard warning light extractor.",
      "Examine the image carefully. It may show an OBD-II diagnostic code (such as P0420, P0300, P0455, P0171), an auto parts scanner printout, or a car dashboard warning light symbol.",
      "Map your finding ONLY to one exact ID from this allowed list:",
      allowedListText,
      "Rules:",
      "- If an exact OBD-II code from the allowed list is visible (e.g., P0420), return that exact code ID.",
      "- If another standard OBD-II code like P0123 or B1000 is clearly readable on a scanner screen/printout, return that exact uppercase code (e.g. \"P0123\").",
      "- If a dashboard warning light icon is lit/visible, map it to the matching LIGHT_* ID from the allowed list (for example: steady check engine -> LIGHT_CEL_STEADY, flashing check engine -> LIGHT_CEL_FLASH, oil can -> LIGHT_OIL_PRESSURE, overheating thermometer -> LIGHT_COOLANT_TEMP, battery -> LIGHT_BATTERY, brake warning -> LIGHT_BRAKE, tire pressure -> LIGHT_TPMS, ABS -> LIGHT_ABS, airbag -> LIGHT_AIRBAG, traction/slip -> LIGHT_TRACTION, steering wheel -> LIGHT_POWER_STEERING).",
      "- If unclear or not an OBD code / dashboard light, set matchedId to null.",
      "Respond ONLY with valid JSON: {\"matchedId\": \"...\"}"
    ].join("\n");

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({
        matchedId: null,
        reason: "Upstream AI request failed",
        detail: errText.slice(0, 200)
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (_) {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (_) {}
      }
    }

    let matchedId = parsed?.matchedId ? String(parsed.matchedId).trim().toUpperCase() : null;

    if (!matchedId) {
      const codeHit = rawText.match(/\b([PBCU][0-3][0-9A-F]{3})\b/i);
      if (codeHit) matchedId = codeHit[1].toUpperCase();
    }

    if (matchedId && (validSet.has(matchedId) || /^[PBCU][0-3][0-9A-F]{3}$/.test(matchedId))) {
      return res.status(200).json({ matchedId });
    }

    return res.status(200).json({ matchedId: null });
  } catch (_) {
    return res.status(500).json({
      matchedId: null,
      reason: "Server scan error"
    });
  }
}
