import OpenAI from "openai";

export default async function handler(req, res) {
  // Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
    
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
    
    const thread = await openai.beta.threads.create();
    
    let contenidoMensaje = pregunta;
    if (idPatogeno) {
      let infoPatogeno = `[Consulta específica sobre patógeno: ${idPatogeno}`;
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
    
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });
    
    let runStatus = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    
    const startTime = Date.now();
    const TIMEOUT = 30000; // 30 segundos
    
    while (runStatus.status !== "completed" && runStatus.status !== "failed") {
      if (Date.now() - startTime > TIMEOUT) {
        return res.status(408).json({
          texto: null,
          error: "La solicitud ha excedido el tiempo de espera. Por favor, intenta de nuevo con una consulta más breve."
        });
      }
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (runStatus.status === "failed") {
        return res.status(500).json({
          texto: null,
          error: "Error al procesar la consulta con el asistente"
        });
      }
    }
    
    const messages = await openai.beta.threads.messages.list(thread.id);
    
    const respuesta = messages.data
      .filter((msg) => msg.role === "assistant")
      .map((msg) => {
        if (Array.isArray(msg.content)) {
          return msg.content
            .filter((content) => content.type === "text")
            .map((content) => "text" in content ? content.text.value : "")
            .join("\n");
        }
        return "";
      })
      .join("\n")
      .trim();
    
    return res.status(200).json({
      texto: respuesta || "No se pudo generar una respuesta.",
      error: null
    });
    
  } catch (error) {
    console.error("Error al consultar asistente IA:", error);
    return res.status(500).json({
      texto: null,
      error: error?.message || "Error al conectar con el asistente de IA."
    });
  }
}