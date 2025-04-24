import { useState, useEffect } from "react";
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

  // Verificar si la tarjeta existe
  if (!card) {
    return (
      <div className="flashcard w-full max-w-2xl mx-auto h-[60vh] sm:h-[500px] mb-4 sm:mb-8 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No hay tarjeta disponible</p>
      </div>
    );
  }

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(card.id);
  };

  // Valores de categoría seguros
  const category = card.category || 'default';
  const categoryColorClass = getCategoryColor(category);
  const categoryName = getCategoryLabel(category);

  return (
    <div className="flashcard w-full max-w-2xl mx-auto h-[60vh] sm:h-[500px] mb-4 sm:mb-8">
      <div
        className={cn("card-inner w-full h-full relative", isFlipped && "flipped")}
        onClick={handleCardClick}
      >
        {/* Front of card */}
        <div className="card-front absolute w-full h-full rounded-2xl shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-4 sm:p-6 flex flex-col">
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
            <div className="text-7xl sm:text-9xl font-black text-gray-50 dark:text-gray-800/30 opacity-30 transform -rotate-12 select-none">
              {card.name}
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative z-10">
            <div className="text-center relative w-full">
              <div className="relative">
                {card.classificationCode && (
                  <div className={`absolute -right-2 -top-10 sm:-top-20 text-3xl sm:text-4xl font-bold ${categoryColorClass} text-white px-2 py-1 rounded-lg shadow-lg flex items-center justify-center`} style={{minWidth: '60px', textAlign: 'center'}}>
                    {card.classificationCode}
                  </div>
                )}
                <div className={`h-1.5 w-20 ${categoryColorClass} rounded-full mx-auto mb-4 sm:mb-6`}></div>
                <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white">{card.name}</h2>
                <p className="text-lg sm:text-xl italic text-slate-600 dark:text-slate-400">{card.scientificName}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-1.5 shadow-inner inline-block">
              <p className="text-sm text-slate-600 dark:text-slate-300">Clic para ver detalles</p>
              <ArrowDown className="h-4 w-4 mx-auto mt-1 text-slate-400" />
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div className="card-back absolute w-full h-full rounded-2xl shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-4 sm:p-6 flex flex-col">
          {/* Watermark background for the back */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none opacity-10">
            <div className="text-7xl sm:text-9xl font-black text-gray-100 dark:text-gray-800 transform rotate-12 select-none">
              {card.classificationCode || card.category.substring(0, 4).toUpperCase()}
            </div>
          </div>
          
          <div className="flex justify-between items-start mb-2 sm:mb-3 relative z-10">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{card.name}</h2>
              <p className="text-base sm:text-lg italic text-slate-600 dark:text-slate-300">{card.scientificName}</p>
            </div>
            
            {card.classificationCode && (
              <div className={`text-2xl sm:text-4xl font-bold ${categoryColorClass} text-white px-2 py-1 rounded-lg shadow-lg flex items-center justify-center`} style={{minWidth: '60px', textAlign: 'center'}}>
                {card.classificationCode}
              </div>
            )}
          </div>
          
          <div className="mt-1 sm:mt-2 relative z-10">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className={`h-3 w-3 rounded-full ${categoryColorClass} mr-2`}></div>
              <span className={`text-sm sm:text-lg font-bold ${categoryColorClass} text-white px-2 py-0.5 rounded`}>{categoryName}</span>
            </div>
            
            <div className="mb-3 sm:mb-6 p-2 sm:p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-slate-900 dark:text-white">Características</h3>
              {card.characteristics ? 
                card.characteristics.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={`${index > 0 ? 'mt-1 sm:mt-2' : ''} text-sm sm:text-base text-slate-700 dark:text-slate-300`}>
                    {paragraph}
                  </p>
                )) : 
                <p className="text-slate-500">No hay información disponible</p>
              }
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto pr-2 relative z-10 max-h-[calc(100%-190px)] md:max-h-[calc(100%-160px)]">
            {/* Código Patógeno */}
            <div className="p-2 sm:p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center text-slate-900 dark:text-white">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                </svg>
                Código patógeno
              </h3>
              {card.codeMapping && card.codeMapping.codigoPatogeno && card.codeMapping.codigoPatogeno.length > 0 ? (
                <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1">
                  {card.codeMapping.codigoPatogeno.map((codigo: string, index: number) => (
                    <li key={index} className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{codigo}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm sm:text-base text-slate-500">No hay información disponible</p>
              )}
            </div>
            
            {/* Conflicto base */}
            <div className="p-2 sm:p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center text-slate-900 dark:text-white">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Conflicto base
              </h3>
              <div>
                {card.conflictBasis ? 
                  card.conflictBasis.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={`${index > 0 ? 'mt-1 sm:mt-2' : ''} text-sm sm:text-base text-slate-700 dark:text-slate-300`}>
                      {paragraph}
                    </p>
                  )) : 
                  <p className="text-sm sm:text-base text-slate-500">No hay información disponible</p>
                }
              </div>
            </div>

            {/* Notas adicionales - sólo si hay contenido */}
            {card.notes && (
              <div className="p-2 sm:p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm backdrop-blur-sm">
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center text-slate-900 dark:text-white">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <p key={index} className={`${index > 0 ? 'mt-1 sm:mt-2' : ''} text-sm sm:text-base text-slate-700 dark:text-slate-300`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 sm:mt-4 flex justify-between items-center pb-1 relative z-10">
            <button 
              className={cn("text-amber-500 hover:text-amber-600 transition-colors", card.isFavorite && "fill-current")}
              onClick={handleFavoriteClick}
              aria-label={card.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Star className="h-5 sm:h-6 w-5 sm:w-6" />
            </button>
            
            <div className="text-center bg-slate-100 dark:bg-slate-700 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Clic para volver</p>
                <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
              </div>
            </div>
            
            <span className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${categoryColorClass} text-white shadow-sm`}>
              {categoryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom arrow components for simplicity
const ArrowDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

const ArrowUp = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

export default Flashcard;