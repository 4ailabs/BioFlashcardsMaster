import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlashcards } from "@/context/FlashcardContext";
import { getCategoryColor, getCategoryLabel } from "@/lib/utils";

const Favorites = () => {
  const { flashcards, toggleFavorite, setCurrentCardIndex, activeTab, setActiveTab } = useFlashcards();
  
  const favoriteCards = flashcards.filter(card => card.isFavorite);
  
  const handleCardClick = (index: number) => {
    const cardIndex = flashcards.findIndex(card => card.id === favoriteCards[index].id);
    setCurrentCardIndex(cardIndex);
    setActiveTab("study");
  };
  
  const handleRemoveFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Favorite Flashcards</h1>
      
      {favoriteCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteCards.map((card, index) => {
            const categoryColorClass = getCategoryColor(card.category);
            const categoryLabel = getCategoryLabel(card.category);
            
            return (
              <div 
                key={card.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryColorClass} text-white`}>
                        {categoryLabel}
                      </span>
                    </div>
                    <button 
                      className="text-amber-500 fill-current" 
                      onClick={(e) => handleRemoveFavorite(e, card.id)} 
                      aria-label="Remove from favorites"
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold mb-1">{card.name}</h3>
                  <p className="text-sm font-mono text-slate-600 dark:text-slate-400 mb-3">{card.scientificName}</p>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{card.characteristics.substring(0, 100)}...</p>
                </div>
                
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{card.id}</span>
                  <button 
                    className="text-primary text-sm font-medium"
                    onClick={() => handleCardClick(index)}
                  >
                    Study this card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Star className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No favorite flashcards yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Start marking cards as favorites during your study sessions</p>
          <Button 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            onClick={() => setActiveTab("study")}
          >
            Go to Study
          </Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
