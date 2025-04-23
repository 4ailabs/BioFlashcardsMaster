// Función para consultar al asistente de IA a través del endpoint backend
export async function consultarAsistenteIA(
  pregunta: string,
  idPatogeno?: string
): Promise<{ texto: string | null; error: string | null }> {
  try {
    const respuesta = await fetch("/api/asistente-ia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pregunta, idPatogeno }),
    });

    if (!respuesta.ok) {
      return {
        texto: null,
        error: `Error en la solicitud: ${respuesta.status}`,
      };
    }

    const data = await respuesta.json();
    
    return {
      texto: data.texto || null,
      error: data.error || null,
    };
  } catch (error: any) {
    console.error("Error consultando asistente IA:", error);
    return {
      texto: null,
      error: error?.message || "Error de conexión con el servidor",
    };
  }
}