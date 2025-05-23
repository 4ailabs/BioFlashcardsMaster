// Función para consultar al asistente de IA a través del endpoint backend
export async function consultarAsistenteIA(
  pregunta: string,
  idPatogeno?: string,
  classificationCode?: string
): Promise<{ texto: string; error: string | null }> {
  try {
    // Usamos un endpoint relativo que funciona tanto en desarrollo como en producción (Vercel)
    const respuesta = await fetch("/api/asistente-ia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        pregunta, 
        idPatogeno,
        classificationCode 
      }),
    });

    if (!respuesta.ok) {
      return {
        texto: "", // Cambiado para evitar null
        error: `Error en la solicitud: ${respuesta.status}`,
      };
    }

    const data = await respuesta.json();
    
    return {
      texto: data.texto || "", // Garantizar que siempre sea string, nunca null
      error: data.error || null,
    };
  } catch (error: any) {
    console.error("Error consultando asistente IA:", error);
    return {
      texto: "", // Cambiado para evitar null
      error: error?.message || "Error de conexión con el servidor",
    };
  }
}