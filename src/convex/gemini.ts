"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const askAboutMedicine = action({
  args: {
    medicineName: v.string(),
    manufacturer: v.string(),
    details: v.optional(v.string()),
  },

  handler: async (_ctx, args) => {
    let apiKey: string | undefined;

    try {
      apiKey = process.env.GEMINI_API_KEY;
    } catch {
      return "AI service is not available at the moment.";
    }

    if (!apiKey) {
      return "AI service is not configured.";
    }

    const safeDetails =
      args.details && args.details.length > 500
        ? args.details.slice(0, 500)
        : args.details ?? "";

    const prompt = `
Analyze the following medicine for verification purposes:

Medicine Name: "${args.medicineName}"
Manufacturer: "${args.manufacturer}"
${safeDetails ? `Additional Details: ${safeDetails}` : ""}

Provide a concise verification summary.
Limit response to factual, general information only.
`;

    let response;
    try {
      response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" +
          apiKey,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );
    } catch {
      return "AI verification service is temporarily unavailable.";
    }

    if (!response || !response.ok) {
      if (response?.status === 429) {
        return "⚠️ AI service is currently at capacity. Please try again later.";
      }
      return "Unable to retrieve AI verification insights.";
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      return "AI response could not be processed.";
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof text !== "string" || text.length === 0) {
      return "AI could not generate verification insights for this medicine.";
    }

    return text;
  },
});
