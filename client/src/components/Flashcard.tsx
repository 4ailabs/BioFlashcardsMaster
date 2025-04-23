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
      <div className="flashcard w-full max-w-2xl mx-auto h-[500px] mb-8 flex items-center justify-center">
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
    <div className="flashcard w-full max-w-2xl mx-auto h-[500px] mb-8">
      <div
        className={cn("card-inner w-full h-full relative", isFlipped && "flipped")}
        onClick={handleCardClick}
      >
        {/* Front of card */}
        <div className="card-front absolute w-full h-full rounded-2xl shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
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
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center relative w-full">
              {card.classificationCode && (
                <div className="absolute right-0 top-0 z-0 text-8xl font-black text-purple-100 dark:text-purple-900 opacity-20 select-none">
                  {card.classificationCode}
                </div>
              )}
              
              <div className="relative z-10">
                {card.classificationCode && (
                  <div className="absolute -right-2 -top-20 text-4xl font-bold text-purple-600 dark:text-purple-400 drop-shadow-sm">
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
              <ArrowDown className="h-4 w-4 mx-auto mt-1 text-slate-400" />
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div className="card-back absolute w-full h-full rounded-2xl shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-6 flex flex-col overflow-auto">
          <div className="flex justify-between items-start mb-3 relative">
            <div className="z-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white drop-shadow-sm">{card.name}</h2>
              <p className="text-lg italic text-slate-600 dark:text-slate-300">{card.scientificName}</p>
            </div>
            
            {card.classificationCode && (
              <div className="absolute right-0 top-0 z-0 text-6xl font-black text-purple-200 dark:text-purple-900 opacity-30 select-none">
                {card.classificationCode}
              </div>
            )}
            
            {card.classificationCode && (
              <div className="z-10 text-3xl font-bold text-purple-600 dark:text-purple-400 drop-shadow-sm">
                {card.classificationCode}
              </div>
            )}
          </div>
          
          <div className="space-y-6 flex-1 overflow-auto pr-2 mt-2">
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-xl p-4 shadow-sm">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <div className={`h-3 w-3 rounded-full ${categoryColorClass} mr-2`}></div>
                {categoryName}
              </h3>
              <div className="mt-1">
                {card.characteristics ? 
                  card.characteristics.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={index > 0 ? 'mt-2' : ''}>
                      {paragraph}
                    </p>
                  )) : 
                  <p>No hay información disponible</p>
                }
              </div>
            </div>
            
            {/* Código Patógeno */}
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-xl p-4 shadow-sm">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <svg className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                </svg>
                Código patógeno
              </h3>
              {card.codeMapping && card.codeMapping.codigoPatogeno && card.codeMapping.codigoPatogeno.length > 0 ? (
                <ul className="list-disc pl-8 space-y-2">
                  {card.codeMapping.codigoPatogeno.map((codigo: string, index: number) => (
                    <li key={index} className="text-slate-700 dark:text-slate-300">{codigo}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay información disponible</p>
              )}
            </div>
            
            {/* Conflicto base */}
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-xl p-4 shadow-sm">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <svg className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Conflicto base
              </h3>
              <div className="mt-1">
                {card.conflictBasis ? 
                  card.conflictBasis.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={index > 0 ? 'mt-2' : ''}>
                      {paragraph}
                    </p>
                  )) : 
                  <p>No hay información disponible</p>
                }
              </div>
            </div>
            
            {/* Notas */}
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-xl p-4 shadow-sm">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                  <line x1="9" y1="9" x2="10" y2="9" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="15" y2="17" />
                </svg>
                Notas
              </h3>
              <div className="mt-1">
                {card.notes ? 
                  card.notes.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={index > 0 ? 'mt-2' : ''}>
                      {paragraph}
                    </p>
                  )) : 
                  <p>No hay información disponible</p>
                }
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button 
              className={cn("text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors", card.isFavorite && "fill-current")}
              onClick={handleFavoriteClick}
              aria-label={card.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Star className="h-6 w-6" />
            </button>
            
            <div className="text-center bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-1 shadow-inner">
              <p>Clic para volver</p>
              <ArrowUp className="h-4 w-4 mx-auto mt-1" />
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
