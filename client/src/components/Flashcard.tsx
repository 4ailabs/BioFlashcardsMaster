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

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(card.id);
  };

  const categoryColorClass = getCategoryColor(card.category);
  const categoryName = getCategoryLabel(card.category);

  return (
    <div className="flashcard w-full max-w-2xl mx-auto h-[500px] mb-8">
      <div
        className={cn("card-inner w-full h-full relative", isFlipped && "flipped")}
        onClick={handleCardClick}
      >
        {/* Front of card */}
        <div className="card-front absolute w-full h-full rounded-2xl shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryColorClass} text-white`}>
                {categoryName}
              </span>
              <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">{card.id}</span>
            </div>
            <button 
              className={cn("text-amber-500", card.isFavorite && "fill-current")} 
              onClick={handleFavoriteClick} 
              aria-label={card.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Star className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{card.name}</h2>
              <p className="text-lg font-mono text-slate-600 dark:text-slate-400">{card.scientificName}</p>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Clic para ver detalles</p>
            <ArrowDown className="h-4 w-4 mx-auto mt-1" />
          </div>
        </div>
        
        {/* Back of card */}
        <div className="card-back absolute w-full h-full rounded-2xl shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col overflow-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryColorClass} text-white`}>
                {categoryName}
              </span>
              <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">{card.id}</span>
            </div>
            <button 
              className={cn("text-amber-500", card.isFavorite && "fill-current")}
              onClick={handleFavoriteClick}
              aria-label={card.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Star className="h-5 w-5" />
            </button>
          </div>
          
          <h2 className="text-xl font-bold mb-1">{card.name}</h2>
          <p className="text-sm font-mono text-slate-600 dark:text-slate-400 mb-4">{card.scientificName}</p>
          
          <div className="space-y-4 flex-1 overflow-auto pr-2">
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">Características</h3>
              <p className="mt-1">{card.characteristics}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">Base Conflictual</h3>
              <p className="mt-1">{card.conflictBasis}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">Notas</h3>
              <p className="mt-1">{card.notes}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">Código Patógeno</h3>
              <div className="mt-1 font-mono text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded">
                {card.classificationCode && (
                  <div className="mb-2 p-1 bg-slate-200 dark:bg-slate-600 rounded inline-block">
                    <span className="font-bold">Código Centrobioenergetica: </span>
                    <span className="text-purple-600 dark:text-purple-400">{card.classificationCode}</span>
                  </div>
                )}
                <code>
                  {JSON.stringify(card.codeMapping, null, 2)}
                </code>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Clic para volver</p>
            <ArrowUp className="h-4 w-4 mx-auto mt-1" />
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
