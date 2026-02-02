import { GoogleGenAI } from "@google/genai";

// const apiKey = process.env.API_KEY || '';
// // Initialize safe AI instance. 
// // Note: In a real app, you should handle missing keys gracefully in UI, 
// // but for this structure we assume env is set or we catch errors.
// const ai = new GoogleGenAI({ apiKey });

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY  });

export const checkFormat = async (text: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. Unable to perform AI format check.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following social survey report abstract/text for academic formatting, tone, and logical structure. Provide a brief checklist of 'Pass' or 'Needs Improvement' and one suggestion. Text: "${text}"`,
    });
    return response.text || "No analysis returned.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error performing AI analysis. Please try again later.";
  }
};

export const generateTeachingInsight = async (topic: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short, 2-sentence pedagogical insight for a teacher regarding student performance in: ${topic}`,
    });
    return response.text || "No insight available.";
  } catch (error) {
    return "Could not generate insight.";
  }
};
