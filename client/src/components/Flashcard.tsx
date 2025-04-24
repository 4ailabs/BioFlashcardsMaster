import { useState } from "react";
import { Star } from "lucide-react";
import { cn, getCategoryColor, getCategoryLabel } from "@/lib/utils";
import { useFlashcards } from "@/context/FlashcardContext";
import { Flashcard as FlashcardType } from "@/data/flashcards";

interface FlashcardProps {
  card: FlashcardType;
}

const Flashcard = ({ card }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { toggleFavorite } = useFlashcards();

  if (!card) {
    return (
      <div className="flashcard w-full max-w-2xl mx-auto h-[500px] mb-8 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No hay tarjeta disponible</p>
      </div>
    );
  }

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // No voltear si el clic fue en el botón de favorito
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Depurar el estado de volteo
    console.log('Volteando tarjeta:', !isFlipped);
    setIsFlipped(!isFlipped);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(card.id);
  };

  const category = card.category || 'default';
  const categoryColorClass = getCategoryColor(category);
  const categoryName = getCategoryLabel(category);

  const getCategoryRgbColor = (category: string): string => {
    switch (category) {
      case 'bacteria': return 'rgba(0, 118, 230, 0.5)'; // #0076E6
      case 'virus_adn': return 'rgba(230, 140, 0, 0.5)'; // #E68C00
      case 'virus_arn': return 'rgba(255, 92, 34, 0.5)'; // #FF5C22
      case 'parasito': return 'rgba(0, 149, 115, 0.5)'; // #009573
      case 'hongo': return 'rgba(0, 116, 149, 0.5)'; // #007495
      default: return 'rgba(100, 116, 139, 0.5)'; // Slate
    }
  };

  const categoryRgbColor = getCategoryRgbColor(category);

  // Implementación con volteo simple
  return (
    <div className="card-container w-full max-w-2xl mx-auto mb-20">
      <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
        {/* Cara Frontal */}
        <div className="card-front bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${categoryColorClass} text-white shadow-sm`}>
              {categoryName}
            </span>
            <button 
              className={cn("text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors", card.isFavorite && "fill-current")} 
              onClick={handleFavoriteClick} 
              aria-label={card.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Star className="h-5 w-5" />
            </button>
          </div>
          
          {/* Watermark background */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none">
            <div className="text-9xl font-black text-gray-50 dark:text-gray-800/30 opacity-30 transform -rotate-12 select-none">
              {card.name}
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative z-10">
            <div className="text-center relative w-full">
              <div className="relative">
                {card.classificationCode && (
                  <div className={`absolute -right-2 -top-20 text-4xl font-bold ${categoryColorClass} text-white px-2 py-1 rounded-lg shadow-lg flex items-center justify-center`} style={{minWidth: '75px', textAlign: 'center'}}>
                    {card.classificationCode}
                  </div>
                )}
                <div className={`h-1.5 w-20 ${categoryColorClass} rounded-full mx-auto mb-6`}></div>
                <h2 className="text-4xl font-bold mb-3 text-slate-900 dark:text-white">{card.name}</h2>
                <p className="text-xl italic text-slate-600 dark:text-slate-400">{card.scientificName}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-1.5 shadow-inner inline-block">
              <p className="text-sm text-slate-600 dark:text-slate-300">Clic para ver detalles</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mx-auto mt-1 text-slate-400"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Cara Trasera */}
        <div className="card-back bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-6 flex flex-col" style={{overflowY: 'auto', paddingBottom: '100px'}}>
          {/* Indicador de scroll */}
          <div className="absolute right-3 top-0 w-1 h-full bg-gray-200 dark:bg-gray-700 rounded-full opacity-50 z-50 pointer-events-none">
            <div className="w-full bg-gray-400 dark:bg-gray-500 rounded-full h-20 transform opacity-80"></div>
          </div>
          {/* Watermark background for the back */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none opacity-10">
            <div className="text-9xl font-black text-gray-100 dark:text-gray-800 transform rotate-12 select-none">
              {card.classificationCode}
            </div>
          </div>
          
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{card.name}</h2>
              <p className="text-lg italic text-slate-600 dark:text-slate-300">{card.scientificName}</p>
            </div>
            
            {card.classificationCode && (
              <div className={`text-4xl font-bold ${categoryColorClass} text-white px-2 py-1 rounded-lg shadow-lg flex items-center justify-center`} style={{minWidth: '75px', textAlign: 'center'}}>
                {card.classificationCode}
              </div>
            )}
          </div>
          
          <div className="mt-2 relative z-10">
            <div className="flex items-center mb-3">
              <div className={`h-3 w-3 rounded-full ${categoryColorClass} mr-2`}></div>
              <span className={`text-lg font-bold ${categoryColorClass} text-white px-2 py-0.5 rounded`}>{categoryName}</span>
            </div>
            
            <div className="mb-6 p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Características</h3>
              {card.characteristics ? 
                card.characteristics.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={`${index > 0 ? 'mt-2' : ''} text-slate-700 dark:text-slate-300`}>
                    {paragraph}
                  </p>
                )) : 
                <p className="text-slate-500">No hay información disponible</p>
              }
            </div>
          </div>
          
          <div className="space-y-4 flex-1 relative z-10 pb-8" style={{minHeight: "400px"}}>
            {/* Código Patógeno */}
            <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-slate-900 dark:text-white">
                <svg className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                </svg>
                Código patógeno
              </h3>
              {card.codeMapping && card.codeMapping.codigoPatogeno && card.codeMapping.codigoPatogeno.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {card.codeMapping.codigoPatogeno.map((codigo: string, index: number) => (
                    <li key={index} className="text-slate-700 dark:text-slate-300">{codigo}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No hay información disponible</p>
              )}
            </div>
            
            {/* Conflicto base */}
            <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-slate-900 dark:text-white">
                <svg className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Conflicto base
              </h3>
              <div>
                {card.conflictBasis ? 
                  card.conflictBasis.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={`${index > 0 ? 'mt-2' : ''} text-slate-700 dark:text-slate-300`}>
                      {paragraph}
                    </p>
                  )) : 
                  <p className="text-slate-500">No hay información disponible</p>
                }
              </div>
            </div>

            {/* Notas adicionales - sólo si hay contenido */}
            {card.notes && (
              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-slate-900 dark:text-white">
                  <svg className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                    <line x1="9" y1="9" x2="10" y2="9" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="15" y2="17" />
                  </svg>
                  Notas adicionales
                </h3>
                <div>
                  {card.notes.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={`${index > 0 ? 'mt-2' : ''} text-slate-700 dark:text-slate-300`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 mb-2 flex justify-between items-center pb-1 relative z-10 sticky bottom-0 bg-gradient-to-t from-white to-transparent dark:from-slate-800 dark:to-transparent pt-4">
            <button 
              className={cn("text-amber-500 hover:text-amber-600 transition-colors", card.isFavorite && "fill-current")}
              onClick={handleFavoriteClick}
              aria-label={card.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Star className="h-6 w-6" />
            </button>
            
            <div className="text-center bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2.5 shadow-sm border-2 border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Clic para volver</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-slate-400"
                >
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </div>
            </div>
            
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${categoryColorClass} text-white shadow-sm`}>
              {categoryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;