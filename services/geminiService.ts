
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, this would be handled more gracefully.
  // For this environment, we assume API_KEY is set.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getPrioritizedTasks = async (tasks: string[]): Promise<string[]> => {
  const prompt = `
    From the following list of tasks for a remote worker, identify the top 3 most important and urgent priorities to ensure a productive day.
    Consider deadlines, impact, and effort.
    
    Task list:
    - ${tasks.join('\n- ')}

    Return your answer as a JSON array of strings, with ONLY the 3 task descriptions in priority order. Do not include any introductory text, explanations, or markdown formatting.
    The output should be a valid JSON array like ["Task 1", "Task 2", "Task 3"].
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A single prioritized task."
          }
        },
        temperature: 0.3,
      },
    });

    const jsonString = response.text;
    const prioritizedTasks = JSON.parse(jsonString);

    if (Array.isArray(prioritizedTasks) && prioritizedTasks.length > 0) {
      return prioritizedTasks.slice(0, 3);
    } else {
      throw new Error("AI response was not in the expected format.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback in case of API error
    return tasks.slice(0, 3);
  }
};
