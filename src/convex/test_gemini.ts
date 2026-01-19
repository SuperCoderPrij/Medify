"use node";
import { action } from "./_generated/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const testGemini = action({
  args: {},
  handler: async (ctx) => {
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return { error: "GEMINI_API_KEY is not set" };
    }

    try {
      console.log("Testing Gemini API with key ending in:", GEMINI_API_KEY.slice(-4));
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }]
          }),
        }
      );

      const status = response.status;
      const text = await response.text();
      console.log(`Status: ${status}`);
      console.log(`Response: ${text}`);

      return { status, text };
    } catch (error: any) {
      console.error("Error:", error);
      return { error: error.toString() };
    }
  },
});