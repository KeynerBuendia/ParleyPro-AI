import { GoogleGenAI, Type } from "@google/genai";
import { MatchData, AIPrediction } from "../types";

// Inicializar cliente Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Utiliza Google Search Grounding para obtener datos REALES de partidos próximos.
 * Actúa como un reemplazo de una API de deportes tradicional.
 */
export const getRealUpcomingMatches = async (): Promise<MatchData[]> => {
  try {
    const model = 'gemini-2.5-flash';

    // Nota: Cuando usamos herramientas como googleSearch, no podemos usar 'responseSchema' estricto
    // en la misma llamada de manera fiable en todas las versiones, así que usaremos prompt engineering
    // para forzar el JSON.
    const prompt = `
      Search for 5 to 6 upcoming major sports matches scheduled for TODAY or TOMORROW.
      Focus on high profile leagues: NBA, Premier League, La Liga, Champions League, or NFL.

      For each match found, extract the following details using the search results:
      1. Teams (Home vs Away)
      2. Date and Time (Convert to ISO string if possible)
      3. Current estimated Moneyline Odds (Decimal format, e.g., 1.95). If exact odds aren't found, estimate based on standings.
      4. Recent Form (Last 5 games W/L/D) - Search for this.
      5. Key Injuries - Search for real recent injury news.
      6. Win Streak.

      RETURN A STRICT JSON ARRAY. Do not include markdown formatting like \`\`\`json.
      The JSON objects must match this structure:
      {
        "id": "string (unique)",
        "sport": "Fútbol" | "Baloncesto",
        "league": "string",
        "date": "ISO string",
        "homeTeam": {
          "name": "string",
          "winStreak": number,
          "homeAwayPerformance": number (0.0 to 1.0 estimate),
          "keyInjuries": ["string"],
          "last5Games": ["W","L","D"...]
        },
        "awayTeam": {
          "name": "string",
          "winStreak": number,
          "homeAwayPerformance": number (0.0 to 1.0 estimate),
          "keyInjuries": ["string"],
          "last5Games": ["W","L","D"...]
        },
        "odds": {
          "homeWin": number,
          "awayWin": number,
          "draw": number (optional)
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // ACTIVAMOS BÚSQUEDA REAL
        temperature: 0.1,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI Search");

    // Limpieza de JSON (a veces el modelo incluye bloques de código markdown)
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parseo manual
    const matches: MatchData[] = JSON.parse(jsonString);
    return matches;

  } catch (error) {
    console.error("Error fetching live matches:", error);
    // Retornamos array vacío en error para manejarlo en la UI
    return [];
  }
};

export const analyzeMatches = async (matches: MatchData[]): Promise<AIPrediction[]> => {
  try {
    const model = 'gemini-2.5-flash';

    // Esquema estricto para la respuesta JSON de la predicción
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          matchId: { type: Type.STRING },
          predictedWinner: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
          reasoning: { type: Type.STRING },
          suggestedBet: { type: Type.STRING },
          riskLevel: { type: Type.STRING, enum: ["Bajo", "Medio", "Alto"] }
        },
        required: ["matchId", "predictedWinner", "confidenceScore", "reasoning", "suggestedBet", "riskLevel"]
      }
    };

    const prompt = `
      Actúa como un Experto en Ciencia de Datos Deportivos (Sports Data Scientist).
      
      Analiza los siguientes datos de partidos REALES.
      
      Tu algoritmo de predicción debe ponderar:
      1. Racha actual (winStreak) y Forma (Last 5): 35%
      2. Desempeño Local/Visitante (homeAwayPerformance): 25%
      3. Impacto de Lesiones Clave (keyInjuries): 25% (Analiza la gravedad de los nombres listados)
      4. Valor matemático en las Cuotas (Odds): 15% (Busca Value Bets)

      Para cada partido, calcula un "Puntaje de Confianza" (0-100).
      
      Datos de entrada:
      ${JSON.stringify(matches, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, 
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIPrediction[];
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Error analyzing matches:", error);
    return [];
  }
};