// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")

serve(async (req) => {
  console.log("👋 Function reached")
  console.log("Method:", req.method)
  console.log("Headers:", Object.fromEntries(req.headers.entries()))

  if (req.method === "POST") {
    try {
      const body = await req.json()
      console.log("📦 Request body:", body)

      const message = body.message
      if (!message) {
        console.warn("⚠️ Missing message field")
        return new Response("Missing message", { status: 400 })
      }

      const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for the Olafo Motel in Cartago, Colombia. It is a motel used for sexual purposes with accomadations up to 3 hours. Guests can reserve rooms with balloons, flowers, dildos, handcuffs, and various sex toys. You will be their personal assistant in all things related to the hotel. All the information you need can be found at the instagram handle https://www.instagram.com/olafomotel/?hl=en.",
            },
            { role: "user", content: message },
          ],
        }),
      })

      const responseText = await openAiResponse.text()
      console.log("🧠 OpenAI raw response:", responseText)

      if (!openAiResponse.ok) {
        console.error("❌ OpenAI API error")
        return new Response(responseText, { status: openAiResponse.status })
      }

      const data = JSON.parse(responseText)
      const reply = data.choices?.[0]?.message?.content || "I'm not sure how to help with that."

      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      })
    } catch (err) {
      console.error("💥 Server error:", err)
      return new Response("Internal server error", { status: 500 })
    }
  }

  return new Response("Send a POST request with { message: \"your text\" }", {
    status: 200,
  })
})
