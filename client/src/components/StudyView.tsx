import { ChevronLeft, ChevronRight, Shuffle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Flashcard from "./Flashcard";
import { useFlashcards } from "@/context/FlashcardContext";
import { getStudyProgress } from "@/lib/utils";

const StudyView = () => {
  const { 
    flashcards, 
    filteredFlashcards, 
    currentCardIndex, 
    setCurrentCardIndex,
    studyStats,
    shuffleCards,
    resetProgress
  } = useFlashcards();

  const totalFilteredCards = filteredFlashcards.length;
  const currentPosition = totalFilteredCards > 0 ? currentCardIndex + 1 : 0;
  
  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < totalFilteredCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const progress = getStudyProgress(studyStats.studied, totalFilteredCards);
  
  return (
    <div className="w-full">
      {/* Card Navigation */}
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0 || totalFilteredCards === 0}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Tarjeta anterior</span>
          </Button>
          <span className="text-sm font-medium">
            {totalFilteredCards > 0 
              ? `Tarjeta ${currentPosition} de ${totalFilteredCards}` 
              : "No hay tarjetas para mostrar"}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextCard}
            disabled={currentCardIndex === totalFilteredCards - 1 || totalFilteredCards === 0}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Siguiente tarjeta</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shuffleCards}
            disabled={totalFilteredCards <= 1}
            className="flex items-center px-3 py-1.5 text-sm rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            <Shuffle className="h-4 w-4 mr-1" />
            Mezclar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetProgress}
            className="flex items-center px-3 py-1.5 text-sm rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reiniciar
          </Button>
        </div>
      </div>
      
      {/* Flashcard */}
      <div className="w-full">
        {totalFilteredCards > 0 && filteredFlashcards[currentCardIndex] ? (
          <Flashcard card={filteredFlashcards[currentCardIndex]} />
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-2">No hay tarjetas que coincidan con tus filtros</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Intenta cambiar tu búsqueda o los filtros de categoría</p>
          </div>
        )}
      </div>
      
      {/* Progress tracker */}
      {totalFilteredCards > 0 && (
        <div className="w-full bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center">
              <div className="h-2 w-full sm:w-64 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium whitespace-nowrap">{progress}% completado</span>
            </div>
            
            <div className="flex justify-between w-full sm:w-auto sm:justify-start sm:space-x-4">
              <div className="text-center px-1">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Restantes</p>
                <p className="text-base sm:text-lg font-medium">{totalFilteredCards - studyStats.studied}</p>
              </div>
              <div className="text-center px-1">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Estudiadas</p>
                <p className="text-base sm:text-lg font-medium">{studyStats.studied}</p>
              </div>
              <div className="text-center px-1">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Dominadas</p>
                <p className="text-base sm:text-lg font-medium">{studyStats.mastered}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyView;