import { GoogleGenAI, Type } from "@google/genai";
import { OcrResult } from "../types";

const processImageWithGemini = async (base64Image: string): Promise<OcrResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this ride-sharing app screenshot (likely Uber or 99). 
    Extract the following data strictly.
    If a field is not found, return null or 0.
    
    Notes:
    - Distances might be in 'm' (meters) or 'km'. Convert ALL distances to 'km' (float).
    - Times might be 'min' or 'h:mm'. Convert ALL times to total minutes (float/int).
    - 'total_time_min' is the sum of approach time and trip time if explicitly shown as total, otherwise sum parts.
    - 'total_distance_km' is sum of approach and trip distances.
    - 'platform' should be 'Uber' or '99'.
    
    Return JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            category: { type: Type.STRING },
            total_price: { type: Type.NUMBER },
            surge_multiplier: { type: Type.NUMBER },
            passenger_rating: { type: Type.NUMBER },
            time_to_passenger_min: { type: Type.NUMBER },
            distance_to_passenger_km: { type: Type.NUMBER },
            time_trip_min: { type: Type.NUMBER },
            distance_trip_km: { type: Type.NUMBER },
            total_time_min: { type: Type.NUMBER },
            total_distance_km: { type: Type.NUMBER },
            origin_address: { type: Type.STRING },
            destination_address: { type: Type.STRING },
          },
          required: ["total_price", "total_time_min", "total_distance_km"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    const data = JSON.parse(text) as OcrResult;
    return data;
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    throw error;
  }
};

export default processImageWithGemini;