import React from 'react';
import { useFlashcards } from '@/context/FlashcardContext';
import { Flashcard as FlashcardType } from '@/data/flashcards';
import { getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { Star, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const GridView = () => {
  const { flashcards, toggleFavorite, setCurrentCardIndex, setActiveTab } = useFlashcards();

  // Agrupar flashcards por categoría
  const groupedFlashcards = flashcards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, FlashcardType[]>);

  // Ordenar categorías
  const categoryOrder = ['bacteria', 'virus_adn', 'virus_arn', 'parasito', 'hongo'];
  const sortedCategories = Object.keys(groupedFlashcards).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  const handleCardClick = (card: FlashcardType, index: number) => {
    // Encontrar el índice global de esta tarjeta en el array completo de flashcards
    const globalIndex = flashcards.findIndex(c => c.id === card.id);
    if (globalIndex !== -1) {
      setCurrentCardIndex(globalIndex);
      setActiveTab('study');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Layers className="mr-2 h-6 w-6 text-purple-500" />
        Galería de Patógenos
      </h2>

      {sortedCategories.map(category => (
        <div key={category} className="space-y-4">
          <div className="flex items-center">
            <div className={`h-4 w-4 rounded-full ${getCategoryColor(category)} mr-2`}></div>
            <h3 className="text-xl font-bold">{getCategoryLabel(category)}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedFlashcards[category].map((card, index) => (
              <div 
                key={card.id}
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer relative"
                onClick={() => handleCardClick(card, index)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{card.id}</span>
                  <button 
                    className={cn("text-amber-500", card.isFavorite && "fill-current")} 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(card.id);
                    }}
                    aria-label={card.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                </div>

                <h4 className="font-bold text-md mb-1 line-clamp-2">{card.name}</h4>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mb-2">{card.scientificName}</p>
                
                {/* Mostrar código de clasificación si existe */}
                {card.classificationCode && (
                  <div className="text-xs mt-2 p-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded inline-block">
                    <span className="font-bold">Código: </span>
                    <span>{card.classificationCode}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;