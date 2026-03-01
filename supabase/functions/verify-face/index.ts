import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { faceImageBase64, profileImageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const content: any[] = [
      {
        type: "text",
        text: `You are a face verification AI for CivicLens governance platform. Analyze the provided webcam selfie for:

1. LIVENESS CHECK: Is this a real live person (not a photo of a photo, not a screen, not a mask)? Look for:
   - Natural skin texture and lighting
   - 3D depth cues
   - Natural background (not a screen border)
   - Signs of being a printed photo or digital screen

2. FACE DETECTION: Is there exactly one clear human face visible?

3. FACE QUALITY: Is the face well-lit, not blurry, and suitable for identification?

${profileImageBase64 ? "4. IDENTITY MATCH: Compare the webcam selfie with the profile photo. Do they appear to be the same person?" : ""}

Respond with JSON: { "isLive": boolean, "faceDetected": boolean, "qualityGood": boolean, "identityMatch": boolean, "confidence": number (0-100), "reason": string }`
      },
      {
        type: "image_url",
        image_url: { url: faceImageBase64 }
      }
    ];

    if (profileImageBase64) {
      content.push({
        type: "image_url",
        image_url: { url: profileImageBase64 }
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a face verification system. Always respond with valid JSON only." },
          { role: "user", content }
        ],
        tools: [{
          type: "function",
          function: {
            name: "verify_face",
            description: "Return face verification results",
            parameters: {
              type: "object",
              properties: {
                isLive: { type: "boolean" },
                faceDetected: { type: "boolean" },
                qualityGood: { type: "boolean" },
                identityMatch: { type: "boolean" },
                confidence: { type: "number" },
                reason: { type: "string" }
              },
              required: ["isLive", "faceDetected", "qualityGood", "identityMatch", "confidence", "reason"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "verify_face" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("Face verification failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result;
    if (toolCall?.function?.arguments) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      result = { isLive: false, faceDetected: false, qualityGood: false, identityMatch: false, confidence: 0, reason: "Verification inconclusive" };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("verify-face error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
