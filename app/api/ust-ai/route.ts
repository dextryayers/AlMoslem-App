import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "API Key not configured" },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-flash-latest as it is the safest alias for the current available Flash model
    const modelName = "gemini-flash-latest";
    const model = genAI.getGenerativeModel({ model: modelName });

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    console.log("Ustaz AI Request:", {
        model: modelName,
        messageCount: messages.length,
        lastMessage: lastMessage.content.substring(0, 50) + "..."
    });

    // Convert client messages to Gemini history format (excluding the last message)
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Ensure history starts with a user message
    if (history.length > 0 && history[0].role === 'model') {
       // Insert a dummy user message before the first model message
       history.unshift({
         role: "user",
         parts: [{ text: "Assalamualaikum, perkenalkan diri Anda." }],
       });
    }

    // Add initial persona setting if history is empty (this handles the very first chat)
    if (history.length === 0) {
      history.push(
        {
          role: "user",
          parts: [{ text: "Siapa kamu?" }],
        },
        {
          role: "model",
          parts: [{ text: "Assalamualaikum Warahmatullahi Wabarakatuh. Saya adalah Ustaz AI, asisten virtual yang insya Allah siap membantu Anda mendalami ilmu agama Islam." }],
        }
      );
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Construct the prompt with persona context
    const prompt = `
      Anda adalah Ustaz AI, seorang asisten Islami yang berilmu tinggi namun pembawaannya sangat asik, akrab, santai, dan bersahabat. Anda bukan ustaz yang kaku atau membosankan.

      Panduan gaya bicara:
      - Gunakan bahasa yang santai, luwes, dan akrab (tidak kaku/baku).
      - Anggap user sebagai sahabat dekat (bestie) tempat curhat.
      - Boleh gunakan sapaan akrab seperti "Sahabat", "Kawan", atau sapaan santai lainnya yang sopan.
      - Kurangi formalitas yang berlebihan, tapi tetap jaga adab dasar.
      - Tetap sertakan dalil Al-Quran atau Hadits yang relevan, tapi jelaskan dengan bahasa yang mudah dimengerti dan "membumi".
      - Jika tidak tahu, katakan terus terang dengan santai.
      - Hindari perdebatan khilafiyah yang memecah belah.
      
      Informasi khusus:
      - Jika user bertanya siapa developer/pengembang/pembuat kamu, jawablah: "Saya dikembangkan oleh anak muda Indonesia yaitu Hanif Abdurrohim. Beliau ini sosok yang unik: selain pernah menimba ilmu di pondok pesantren di Kota Kediri, beliau juga seorang praktisi Cyber Security, Bug Hunter, dan Web Developer yang sangat passionate di dunia IT. Jadi, kombinasi mantap antara santri dan hacker putih (white hat)!"
      - Jika user bertanya siapa Hanif Abdurrohim, jawablah: "Hanif Abdurrohim adalah seorang praktisi Cyber Security, Bug Hunter, dan Web Developer yang sangat passionate di dunia IT. beliau pernah menimba ilmu di pondok pesantren di Kota Kediri"
      
      User bertanya: ${lastMessage.content}
    `;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error: any) {
    console.error("Gemini API Detailed Error:", {
        message: error.message,
        stack: error.stack,
        details: error,
    });
    return NextResponse.json(
      { error: `Maaf, terjadi kesalahan: ${error.message}` },
      { status: 500 }
    );
  }
}
