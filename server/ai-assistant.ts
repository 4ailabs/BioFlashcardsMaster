import OpenAI from "openai";
import { Request, Response } from "express";

// Inicializar el cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ID del asistente personalizado
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

export async function handleAsistenteIA(req: Request, res: Response) {
  try {
    const { pregunta, idPatogeno, classificationCode } = req.body;

    if (!pregunta) {
      return res.status(400).json({ error: "Se requiere una pregunta" });
    }
    
    if (!ASSISTANT_ID) {
      return res.status(500).json({ 
        texto: null, 
        error: "No se ha configurado el ID del asistente de OpenAI" 
      });
    }

    // Crear un thread
    const thread = await openai.beta.threads.create();

    // Añadir el mensaje del usuario al thread
    let contenidoMensaje = pregunta;
    
    // Si hay un patógeno seleccionado, añadir esa información al mensaje
    if (idPatogeno) {
      let infoPatogeno = `[Consulta específica sobre patógeno ID: ${idPatogeno}`;
      
      // Si además tiene código de clasificación, lo añadimos
      if (classificationCode) {
        infoPatogeno += `, Código Patógeno: ${classificationCode}`;
      }
      
      infoPatogeno += `] ${pregunta}`;
      contenidoMensaje = infoPatogeno;
    }
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: contenidoMensaje
    });

    // Ejecutar el asistente en el thread
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // Esperar a que el asistente complete la respuesta
    let runStatus = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );

    // Esperar a que el asistente termine de procesar (con timeout)
    const startTime = Date.now();
    const TIMEOUT = 30000; // 30 segundos de timeout

    while (runStatus.status !== "completed" && runStatus.status !== "failed") {
      // Verificar timeout
      if (Date.now() - startTime > TIMEOUT) {
        return res.status(408).json({
          texto: null,
          error: "La solicitud ha excedido el tiempo de espera. Por favor, intenta de nuevo con una consulta más breve."
        });
      }

      // Esperar un momento antes de verificar de nuevo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar el estado actualizado
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      // Si hay un error, devolver mensaje de error
      if (runStatus.status === "failed") {
        return res.status(500).json({
          texto: null,
          error: "Error al procesar la consulta con el asistente"
        });
      }
    }

    // Obtener la respuesta del asistente
    const messages = await openai.beta.threads.messages.list(thread.id);
    
    // La respuesta más reciente del asistente estará en los primeros mensajes
    // (ordenados por recency)
    const respuesta = messages.data
      .filter(msg => msg.role === "assistant")
      .map(msg => {
        // Extraer el texto de cada parte del contenido
        if (Array.isArray(msg.content)) {
          return msg.content
            .filter(content => content.type === "text")
            .map(content => 'text' in content ? content.text.value : '')
            .join('\n');
        }
        return '';
      })
      .join('\n')
      .trim();

    return res.status(200).json({ 
      texto: respuesta || "No se pudo generar una respuesta.", 
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