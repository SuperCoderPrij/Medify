"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

const GEMINI_API_KEY = "AIzaSyCsJ2CsdZw7ENvx8DzR-h4pBEtmGoAEbWI";

export const askAboutMedicine = action({
  args: {
    medicineName: v.string(),
    manufacturer: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const prompt = `
      Tell me about the medicine "${args.medicineName}" manufactured by "${args.manufacturer}".
      ${args.details ? `Additional details: ${args.details}` : ""}
      
      Please provide the following information in a clear, patient-friendly format:
      1. 💊 **Recommended Use**: What is it typically used for?
      2. ⚠️ **Potential Side Effects**: Common things to watch out for.
      3. 🛡️ **Primary Function**: How does it work?
      4. 🔄 **Alternative Medicines**: Common generic alternatives.
      
      Keep the response concise (under 200 words).
      
      IMPORTANT DISCLAIMER: Start with "Note: This is AI-generated information. Always consult a healthcare professional."
    `;

    try {
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
        throw new Error("Failed to fetch from Gemini API");
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        return "I couldn't generate information for this medicine at the moment.";
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini Action Error:", error);
      throw new Error("Failed to process AI request");
    }
  },
});