import OpenAI from "openai";
import { Request, Response } from "express";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handleAsistenteIA(req: Request, res: Response) {
  try {
    const { pregunta, idPatogeno } = req.body;

    if (!pregunta) {
      return res.status(400).json({ error: "Se requiere una pregunta" });
    }

    const systemPrompt = `Eres un experto en Microbioenergética, especializado en patógenos, bacterias, virus, hongos y parásitos. 
    Tu objetivo es proporcionar información científica precisa y detallada sobre estos organismos, sus características, 
    mecanismos de acción, tratamientos y relevancia clínica.
    
    ${idPatogeno ? `Enfoca tu respuesta específicamente en el patógeno con ID: ${idPatogeno}.` : ''}
    
    Responde de manera concisa pero completa, usando terminología científica apropiada pero explicando 
    los conceptos de forma que sean comprensibles. Incluye, cuando sea relevante:
    - Clasificación taxonómica
    - Características estructurales
    - Mecanismos patogénicos
    - Manifestaciones clínicas
    - Diagnóstico y tratamiento
    - Datos epidemiológicos relevantes
    
    Si no conoces la respuesta a alguna pregunta específica, indica claramente que no tienes esa información 
    en lugar de especular.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: pregunta }
      ],
    });

    return res.status(200).json({ 
      texto: response.choices[0].message.content || "No se pudo generar una respuesta.", 
      error: null 
    });
  } catch (error: any) {
    console.error("Error al consultar asistente IA:", error);
    return res.status(500).json({ 
      texto: null, 
      error: error?.message || "Error al conectar con el asistente de IA." 
    });
  }
}