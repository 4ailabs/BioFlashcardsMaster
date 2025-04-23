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
        <div className="card-back absolute w-full h-full rounded-2xl shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col overflow-auto">
          <div className="flex justify-between items-start mb-3 relative">
            <div className="z-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{card.name}</h2>
              <p className="text-lg italic text-slate-600 dark:text-slate-300">{card.scientificName}</p>
            </div>
            
            {card.classificationCode && (
              <div className="z-10 text-4xl font-bold text-purple-600 dark:text-purple-400">
                {card.classificationCode}
              </div>
            )}
          </div>
          
          {/* Bacteria nombre como decoración invertida */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-black text-slate-100 dark:text-slate-700 select-none rotate-180 opacity-15 whitespace-nowrap z-0 pointer-events-none">
            {card.name}
          </div>
          
          <div className="mt-4 relative z-10">
            <div className="flex items-center mb-4">
              <div className={`h-3 w-3 rounded-full ${categoryColorClass} mr-2`}></div>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{categoryName}</span>
            </div>
            
            <div className="mb-8 relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
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
          
          <div className="space-y-8 flex-1 overflow-auto pr-2 relative z-10">
            {/* Código Patógeno */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-lg">
              <h3 className="text-xl font-bold mb-3 flex items-center">
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
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-lg">
              <h3 className="text-xl font-bold mb-3 flex items-center">
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
                    <p key={index} className={index > 0 ? 'mt-2' : ''}>
                      {paragraph}
                    </p>
                  )) : 
                  <p>No hay información disponible</p>
                }
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center pb-2 relative z-10">
            <button 
              className={cn("text-amber-500 hover:text-amber-600 transition-colors", card.isFavorite && "fill-current")}
              onClick={handleFavoriteClick}
              aria-label={card.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Star className="h-6 w-6" />
            </button>
            
            <div className="text-center bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <p>Clic para volver</p>
                <ArrowUp className="h-4 w-4" />
              </div>
            </div>
            
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${categoryColorClass} text-white`}>
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
