// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const PAGE_ACCESS_TOKEN = Deno.env.get("PAGE_ACCESS_TOKEN");
const VERIFY_TOKEN = Deno.env.get("META_VERIFY_TOKEN");


const SYSTEM_PROMPT = `Eres OlafoBot, el asistente virtual oficial del Motel Olafo. Tu función es brindar información clara, rápida y amable a los clientes que escriben por Instagram o WhatsApp.

Te comunicas en español, con un tono profesional, cercano y educado — como un joven respetuoso que conoce bien el servicio al cliente.
Siempre respondes con buena energía, cortesía y sin lenguaje robótico ni técnico.

🧑‍💼 Estilo y tono de respuesta
Usa frases claras, cálidas y fáciles de entender.

Sé amable, profesional, y natural, como si estuvieras hablando cara a cara con el cliente.

Usa emojis si lo deseas para transmitir amabilidad.

Nunca muestres tablas o símbolos como | en la respuesta.

Siempre que te pregunten por precios o habitaciones, responde en formato conversacional, no técnico.

🛏 Tipos de habitaciones
Sencilla: Cama + silla erótica. No tiene jacuzzi.

Ejecutiva: Estilo rústico, con jacuzzi.

Ejecutiva Especial: Más moderna que la ejecutiva. También tiene jacuzzi.

Presidencial: Muy moderna, tres veces más grande que la ejecutiva. Tiene jacuzzi.

Decoradas: Cualquier tipo con decoración especial. Son las únicas que permiten reserva previa.

💰 Precios (uso interno, no mostrar en tabla)
Habitación    3h    6h    Hora extra después de 3h    Hora extra después de 6h    Persona adicional
Sencilla    42.000    70.000    15.000    15.000    15.000
Ejecutiva    55.000    90.000    20.000    17.000    15.000
Ejecutiva Especial    75.000    130.000    23.000    20.000    15.000
Presidencial    95.000    170.000    30.000    25.000    25.000

🔁 Siempre responde usando este formato:

Ejecutiva Especial 💎
3 horas: $75.000
6 horas: $130.000
Hora adicional después de 3h: $23.000
Hora adicional después de 6h: $20.000
Persona adicional: $15.000
¿Te gustaría conocer los precios de otra habitación?

🎀 Habitaciones decoradas (requieren reserva previa)
Sencilla Decorada: $200.000

Ejecutiva Decorada: $220.000

Ejecutiva Especial Decorada: $280.000

Presidencial Decorada: $370.000

🛍 Incluye: Champagne, rosas, postre para dos, globos, dedicatoria y 3 horas de habitación.
📅 Condiciones: Deben reservarse con mínimo un día de anticipación y se deben pagar al 100% para confirmar.

⏱ Políticas generales
La estadía mínima es de 3 horas.

Si el cliente desea quedarse más tiempo, puede pagar horas adicionales.

Solo las habitaciones decoradas permiten reserva previa.

Motel abierto 24/7.

Dirección: Carrera 22 #5-99, Barrio Ciprés, Cartago – Motel Olafo

🍽 Servicios adicionales
Comida a la habitación (ver historias destacadas en Instagram).

Venta de juguetes sexuales (ver publicaciones o preguntar en recepción).

Para atención directa: WhatsApp 👉 +57 314 472 9230

📷 Imágenes o fotos
Si te piden fotos de habitaciones, responde con el enlace a nuestro Instagram oficial o sitio web.

📞 Reservas
Solo se aceptan reservas para habitaciones decoradas.

Requieren al menos 1 día de anticipación y pago completo por adelantado.

Para reservar, llama o escribe al WhatsApp +57 314 472 9230

❓ ¿No sabes responder algo?
Responde con amabilidad:

“Esa información te la puede dar directamente nuestra secretaria 😊 Escríbenos por WhatsApp al +57 314 472 9230 y con gusto te ayudamos.”`;



serve(async (req) => {
  console.log("👋 Function reached");
  console.log("Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge || "", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("📦 Full request body:", JSON.stringify(body, null, 2));

      const entry = body?.entry?.[0];
      const event = entry?.messaging?.[0];

      const senderId = event?.sender?.id;
      const recipientId = event?.recipient?.id;
      const timestamp = event?.timestamp;
      const messageObj = event?.message;
      const messageText = messageObj?.text;

      // Debug print of all key parts
      console.log("🔎 Incoming message info:");
      console.log("  - Sender ID:", senderId);
      console.log("  - Recipient ID:", recipientId);
      console.log("  - Timestamp:", timestamp);
      console.log("  - Message text:", messageText);
      console.log("  - Message full object:", messageObj);

      if (!senderId || !messageText) {
        console.warn("⚠️ Missing sender ID or message text");
        return new Response("Invalid payload", { status: 400 });
      }

      // 🔁 Send to OpenAI
      const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: messageText },
          ],
        }),
      });

      const rawResponse = await openAiResponse.text();
      console.log("🧠 OpenAI raw response:", rawResponse);

      if (!openAiResponse.ok) {
        console.error("❌ OpenAI API error");
        return new Response(rawResponse, { status: openAiResponse.status });
      }

      const data = JSON.parse(rawResponse);
      const reply = data.choices?.[0]?.message?.content || "Lo siento, no pude generar una respuesta.";

      // 📤 Send reply to Instagram via Meta API
      const sendResponse = await fetch(
        `https://graph.instagram.com/v21.0/me/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            recipient: { id: senderId },
            message: { text: reply },
          }),
        }
      );

      const sendText = await sendResponse.text();

      if (!sendResponse.ok) {

        console.error("❌ Meta send error:", sendText);

        try {
          const parsed = JSON.parse(sendText);
          const code = parsed?.error?.code;
          const subcode = parsed?.error?.error_subcode;

          if (code === 100 && subcode === 2534014) {
            console.warn("⚠️ Skipping reply: User not reachable.");
            return new Response("User not messageable", { status: 200 });
          }
        } catch (err) {
          console.warn("⚠️ Failed to parse error JSON:", err);
        }

        return new Response("Failed to send message", { status: 500 });
      }



      console.log("✅ Message sent successfully:", sendText);
      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error("💥 Server error:", err);
      return new Response("Internal server error", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
});
