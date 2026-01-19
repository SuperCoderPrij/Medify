"use node";
import { action } from "./_generated/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const listModels = action({
  args: {},
  handler: async (ctx) => {
    if (!GEMINI_API_KEY) {
      return { error: "GEMINI_API_KEY is not set" };
    }

    try {
      console.log("Listing models with key ending in:", GEMINI_API_KEY.slice(-4));
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
      );
      
      const data = await response.json();
      console.log("Available Models:", JSON.stringify(data, null, 2));
      return data;
    } catch (error: any) {
      console.error("Error:", error);
      return { error: error.toString() };
    }
  },
});