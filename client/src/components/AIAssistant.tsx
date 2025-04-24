import React, { useState, useRef, useEffect } from 'react';
import { Send, PaperclipIcon, Brain } from 'lucide-react';
import { consultarAsistenteIA } from '@/lib/openai';
import { useFlashcards } from '@/context/FlashcardContext';
import { Flashcard } from '@/data/flashcards';

// Definir la estructura de un mensaje
interface Mensaje {
  tipo: "usuario" | "asistente" | "error" | "sistema";
  contenido: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [pregunta, setPregunta] = useState<string>('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      tipo: 'sistema',
      contenido: 'Bienvenido al Asistente de Microbioenergética. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [cargando, setCargando] = useState<boolean>(false);
  const { flashcards } = useFlashcards();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Auto-scroll a los mensajes más recientes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Función para enviar consulta al asistente
  const enviarConsulta = async (textoConsulta: string, patogenoSeleccionado: Flashcard | null = null) => {
    if (!textoConsulta.trim()) return;
    
    const mensajeUsuario: Mensaje = {
      tipo: 'usuario',
      contenido: textoConsulta,
      timestamp: new Date()
    };
    
    setMensajes(prev => [...prev, mensajeUsuario]);
    setCargando(true);
    
    try {
      // Usar la función consultarAsistenteIA para gestionar la comunicación con el servidor
      const { texto: respuestaTexto, error } = await consultarAsistenteIA(
        textoConsulta,
        patogenoSeleccionado?.name || undefined,
        patogenoSeleccionado?.classificationCode || undefined
      );
      
      // Crear un objeto similar a la respuesta anterior para mantener compatibilidad
      const data = {
        texto: respuestaTexto,
        error: error
      };
      
      if (data.error) {
        setMensajes(prev => [
          ...prev, 
          {
            tipo: 'error',
            contenido: `Error: ${data.error}`,
            timestamp: new Date()
          }
        ]);
      } else {
        setMensajes(prev => [
          ...prev, 
          {
            tipo: 'asistente',
            contenido: data.texto,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      setMensajes(prev => [
        ...prev, 
        {
          tipo: 'error',
          contenido: 'Ha ocurrido un error al comunicarse con el asistente. Por favor, intenta de nuevo más tarde.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setPregunta('');
      setCargando(false);
    }
  };

  // Función para ejecutar acción rápida desde los botones
  const ejecutarAccionRapida = (accion: 'explicar' | 'resumir' | 'reescribir' | 'conflicto' | 'casos' | 'metafora' | 'sanacion') => {
    const selectedCard = selectedCardId ? flashcards.find(c => c.id === selectedCardId) : null;
    if (!selectedCard) return;
    
    let texto = '';
    switch (accion) {
      case 'explicar':
        texto = `Explicar en detalle el patógeno ${selectedCard.name}`;
        break;
      case 'resumir':
        texto = `Resumir brevemente la información sobre ${selectedCard.name}`;
        break;
      case 'reescribir':
        texto = `Reescribir la información de ${selectedCard.name} en lenguaje simple`;
        break;
      case 'conflicto':
        texto = `Explica en detalle el conflicto emocional asociado a ${selectedCard.name} y cómo se manifiesta en el cuerpo`;
        break;
      case 'casos':
        texto = `Proporciona ejemplos de casos donde la presencia de ${selectedCard.name} podría indicar conflictos emocionales específicos`;
        break;
      case 'metafora':
        texto = `Crea una metáfora o analogía que explique la relación simbólica entre ${selectedCard.name} y el conflicto emocional que representa`;
        break;
      case 'sanacion':
        texto = `Sugiere posibles enfoques de sanación emocional para resolver el conflicto asociado con ${selectedCard.name}`;
        break;
    }
    
    setPregunta(texto);
    setTimeout(() => enviarConsulta(texto, selectedCard), 10);
  };
  
  // Manejador del formulario de envío
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim()) return;
    
    const selectedCard = selectedCardId ? flashcards.find(c => c.id === selectedCardId) : null;
    await enviarConsulta(pregunta, selectedCard);
  };

  // Formatear la hora para los mensajes
  const formatearHora = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Obtener un color basado en la categoría del flashcard
  const obtenerColorCategoria = (categoria: string): string => {
    switch (categoria) {
      case 'bacteria':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'virus_adn':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'virus_arn':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'parasito':
      case 'parasitos':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'hongo':
      case 'hongos':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Mostrar nombre de categoría en español
  const obtenerNombreCategoria = (categoria: string): string => {
    switch (categoria) {
      case 'bacteria':
        return 'Bacteria';
      case 'virus_adn':
        return 'Virus ADN';
      case 'virus_arn':
        return 'Virus ARN';
      case 'parasito':
      case 'parasitos':
        return 'Parásito';
      case 'hongo':
      case 'hongos':
        return 'Hongo';
      default:
        return categoria;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow">
      {/* Cabecera */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center">
        <Brain className="h-6 w-6 text-purple-500 mr-2" />
        <h2 className="text-xl text-slate-800 dark:text-white">
          Asistente de <span className="font-semibold">Microbio</span>energética
        </h2>
      </div>
      
      {/* Panel de selección de flashcard */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Seleccionar patógeno específico (opcional)
        </h3>
        <div className="relative">
          <select
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            value={selectedCardId || ""}
            onChange={(e) => setSelectedCardId(e.target.value || null)}
          >
            <option value="">Sin selección - Consulta general</option>
            {flashcards.map((card: Flashcard) => (
              <option key={card.id} value={card.id}>
                {card.name} ({obtenerNombreCategoria(card.category)})
              </option>
            ))}
          </select>
        </div>
        {selectedCardId && (
          <div className="mt-2">
            <div className="flex flex-col space-y-2">
              <span className="text-xs">
                Consultando específicamente sobre:{' '}
                {flashcards.find(c => c.id === selectedCardId)?.name}
                {(flashcards.find(c => c.id === selectedCardId)?.classificationCode) && (
                  <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded text-xs">
                    Código: {flashcards.find(c => c.id === selectedCardId)?.classificationCode}
                  </span>
                )}
              </span>
              
              {/* Botones de acciones rápidas - Fila 1: Básicos */}
              <div className="flex flex-wrap gap-1 mt-1">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    ejecutarAccionRapida('explicar');
                  }}
                  className="bg-slate-700 text-white text-xs py-1 px-2 rounded hover:bg-slate-600"
                  disabled={cargando}
                >
                  Explicar
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    ejecutarAccionRapida('resumir');
                  }}
                  className="bg-slate-700 text-white text-xs py-1 px-2 rounded hover:bg-slate-600"
                  disabled={cargando}
                >
                  Resumir
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    ejecutarAccionRapida('reescribir');
                  }}
                  className="bg-slate-700 text-white text-xs py-1 px-2 rounded hover:bg-slate-600"
                  disabled={cargando}
                >
                  Simplificar
                </button>
                
                {/* Botones relacionados con Microbioenergética */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    ejecutarAccionRapida('conflicto');
                  }}
                  className="bg-purple-700 text-white text-xs py-1 px-2 rounded hover:bg-purple-600"
                  disabled={cargando}
                >
                  Conflicto emocional
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    ejecutarAccionRapida('casos');
                  }}
                  className="bg-blue-700 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                  disabled={cargando}
                >
                  Ejemplos clínicos
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    ejecutarAccionRapida('metafora');
                  }}
                  className="bg-green-700 text-white text-xs py-1 px-2 rounded hover:bg-green-600"
                  disabled={cargando}
                >
                  Metáfora simbólica
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    ejecutarAccionRapida('sanacion');
                  }}
                  className="bg-amber-700 text-white text-xs py-1 px-2 rounded hover:bg-amber-600"
                  disabled={cargando}
                >
                  Enfoques de sanación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Contenedor de chat */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        {mensajes.map((mensaje, index) => (
          <div 
            key={index} 
            className={`flex ${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 rounded-lg p-3 ${
                mensaje.tipo === 'usuario' 
                  ? 'bg-purple-500 text-white' 
                  : mensaje.tipo === 'sistema'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
                    : mensaje.tipo === 'error'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="mb-1">
                {mensaje.contenido.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {line}
                    {i < mensaje.contenido.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              <div className="text-xs opacity-70 text-right">
                {formatearHora(mensaje.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {cargando && (
          <div className="flex justify-start">
            <div className="max-w-3/4 rounded-lg p-3 bg-slate-100 dark:bg-slate-700 animate-pulse">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Área de entrada */}
      <form onSubmit={manejarEnvio} className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 p-3 rounded-l-lg bg-slate-100 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            disabled={cargando}
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 p-3 rounded-r-lg flex items-center justify-center disabled:opacity-50"
            disabled={!pregunta.trim() || cargando}
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;