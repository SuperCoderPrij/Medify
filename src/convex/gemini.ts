"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

const GEMINI_API_KEY = "AIzaSyB7SD77pOg5zWqiAa-nl7qOi1vjvV0JVuM";

export const askAboutMedicine = action({
  args: {
    medicineName: v.string(),
    manufacturer: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const prompt = `
      Analyze the following medicine for verification purposes:
      Medicine Name: "${args.medicineName}"
      Manufacturer: "${args.manufacturer}"
      ${args.details ? `Additional Details: ${args.details}` : ""}
      
      Please provide a concise, factual verification report with the following sections:
      1. 💊 **Medicine Summary**: Brief description of what this medicine is typically used for.
      2. 📅 **Expiry Validity**: Check the expiry date provided in details (if any) and confirm validity.
      3. 🏭 **Manufacturer Legitimacy**: Brief assessment of the manufacturer's reputation (based on general knowledge).
      4. ⚠️ **Safety Warning**: CLEARLY state if the medicine is expired (based on today's date) or if there are common counterfeit risks.

      Keep the response concise (under 200 words).
      Start with "Note: This is AI-generated information for verification support. Always consult a healthcare professional."
    `;

    try {
      // Using gemini-2.0-flash as it is confirmed available in the model list
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        
        if (response.status === 429) {
          return "⚠️ AI Service is currently at capacity. Please try again in a minute.";
        }

        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
                return `⚠️ AI Error: ${errorJson.error.message}`;
            }
        } catch (e) {
            // ignore json parse error
        }

        throw new Error(`Failed to fetch from Gemini API: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        return "I couldn't generate verification insights for this medicine at the moment.";
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini Action Error:", error);
      return "Unable to generate AI verification insights at this time. Please try again later.";
    }
  },
});