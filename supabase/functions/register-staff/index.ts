// supabase/functions/register-staff/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Get env vars
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Must be service role key
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { staffname, tag, email, lab } = await req.json();

    // ✅ Validate required fields
    if (!staffname || !tag || !email || !lab) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    // 🔁 Step 1: Ask ESP32 to scan fingerprint
    const esp32Url = "http://192.168.0.100/capture-fingerprint"; // Update to your ESP32's actual IP

    const esp32Response = await fetch(esp32Url);
    if (!esp32Response.ok) {
      throw new Error("ESP32 fingerprint capture failed");
    }

    const { fingerprint_id } = await esp32Response.json();

    if (!fingerprint_id) {
      throw new Error("No fingerprint ID returned by ESP32");
    }

    // 💾 Step 2: Insert into Supabase
    const { data, error } = await supabase.from("staff").insert([
      {
        staffname,
        tag: parseInt(tag),
        email,
        lab,
        fingerprint_id: parseInt(fingerprint_id),
      },
    ]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, staff: data[0] }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
