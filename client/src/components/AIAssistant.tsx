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

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pregunta.trim()) return;
    
    const mensajeUsuario: Mensaje = {
      tipo: 'usuario',
      contenido: pregunta,
      timestamp: new Date()
    };
    
    setMensajes(prev => [...prev, mensajeUsuario]);
    setPregunta('');
    setCargando(true);
    
    try {
      const respuesta = await fetch("/api/asistente-ia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          pregunta: pregunta,
          idPatogeno: selectedCardId 
        }),
      });
      
      const data = await respuesta.json();
      
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
      setCargando(false);
    }
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
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'hongo':
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
        return 'Parásito';
      case 'hongo':
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
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Asistente de Microbioenergética</h2>
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
            <span className="text-xs">
              Consultando específicamente sobre:{' '}
              {flashcards.find(c => c.id === selectedCardId)?.name}
            </span>
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
                  <React.Fragment key={i}>
                    {line}
                    {i < mensaje.contenido.split('\n').length - 1 && <br />}
                  </React.Fragment>
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