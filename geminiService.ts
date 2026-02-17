
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSmartCaption = async (topic: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short, viral, futuristic social media caption for a post about: ${topic}. Use 1-2 emojis.`,
  });
  return response.text || "Scanning the neural network for thoughts...";
};

export const generateAuraImage = async (prompt: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A hyper-realistic, high-end commercial photography portrait of a real human being. NO ROBOTIC PARTS, NO CYBERNETICS, NO SCI-FI METAL. Pure human skin texture, realistic eyes, natural hair, professional studio lighting. The setting can be futuristic but the PERSON must be 100% human. Prompt: ${prompt}.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed", error);
  }
  return null;
};

export const getAIAssistantResponse = async (query: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      systemInstruction: "You are 'AETHER-1', a high-tech AI social assistant in a futuristic world. You are helpful, concise, and sound like a machine-human hybrid from the year 2088."
    }
  });
  return response.text || "Data stream interrupted.";
};
