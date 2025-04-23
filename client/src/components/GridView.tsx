import React, { useEffect } from 'react';
import { useFlashcards } from '@/context/FlashcardContext';
import { Flashcard as FlashcardType } from '@/data/flashcards';
import { getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { Star, Layers, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { findClassificationCode } from '@/lib/classificationCodes';

const GridView = () => {
  const { flashcards, toggleFavorite, setCurrentCardIndex, setActiveTab } = useFlashcards();
  
  // Efecto para asignar códigos de clasificación a las flashcards que no los tienen
  useEffect(() => {
    // Esta función solo se ejecuta en el cliente, no en el servidor
    if (typeof window !== 'undefined') {
      // Resetear el estado para forzar una nueva asignación de códigos
      sessionStorage.removeItem('hasAssignedClassificationCodes');
      
      // Prevenir recargas infinitas usando una bandera en sessionStorage
      const hasAssignedCodes = sessionStorage.getItem('hasAssignedClassificationCodes');
      if (hasAssignedCodes) return;
      
      // Verificar si hay flashcards sin código de clasificación o con códigos que necesitan actualización
      const flashcardsToUpdate = flashcards.filter(card => 
        !card.classificationCode || 
        (card.name === 'Mycobacterium tuberculosis' && card.classificationCode !== 'A40')
      );
      
      if (flashcardsToUpdate.length > 0) {
        console.log(`Asignando códigos de clasificación a ${flashcardsToUpdate.length} flashcards...`);
        
        // Crear una copia de las flashcards para no modificar el estado directamente
        const updatedFlashcards = [...flashcards];
        
        // Asignar códigos de clasificación
        let codesAssigned = false;
        flashcardsToUpdate.forEach(card => {
          const index = updatedFlashcards.findIndex(c => c.id === card.id);
          if (index !== -1) {
            // Si es Mycobacterium tuberculosis, asignar código fijo
            if (card.name === 'Mycobacterium tuberculosis') {
              updatedFlashcards[index] = {
                ...updatedFlashcards[index],
                classificationCode: 'A40'
              };
              console.log(`Asignado código A40 a Mycobacterium tuberculosis (corregido)`);
              codesAssigned = true;
            } else {
              // Para otras tarjetas, usar la función de búsqueda 
              const code = findClassificationCode(card.name, card.category);
              if (code) {
                updatedFlashcards[index] = {
                  ...updatedFlashcards[index],
                  classificationCode: code
                };
                console.log(`Asignado código ${code} a ${card.name}`);
                codesAssigned = true;
              }
            }
          }
        });
        
        if (codesAssigned) {
          // Guardar flashcards actualizadas en localStorage para persistencia
          localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
          
          // Marcar que ya hemos asignado códigos para evitar recargas infinitas
          sessionStorage.setItem('hasAssignedClassificationCodes', 'true');
          
          // Forzar recarga para aplicar los cambios
          window.location.reload();
        } else {
          // Si no se asignaron códigos, marcar como completado para evitar recargas
          sessionStorage.setItem('hasAssignedClassificationCodes', 'true');
        }
      } else {
        // No hay tarjetas que requieran códigos, marcar como completado
        sessionStorage.setItem('hasAssignedClassificationCodes', 'true');
      }
    }
  }, []);

  // Agrupar flashcards por categoría
  const groupedFlashcards = flashcards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, FlashcardType[]>);

  // Ordenar categorías
  const categoryOrder = ['bacteria', 'virus_adn', 'virus_arn', 'parasito', 'parasitos', 'hongo', 'hongos'];
  const sortedCategories = Object.keys(groupedFlashcards).sort(
    (a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      // Si ambas categorías están en el orden predefinido, usamos ese orden
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      } 
      // Si solo una está en el orden, esa va primero
      else if (indexA !== -1) {
        return -1;
      } 
      else if (indexB !== -1) {
        return 1;
      }
      // Si ninguna está en el orden, las ordenamos alfabéticamente
      return a.localeCompare(b);
    }
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
                  {/* Identificador interno (oculto visualmente pero accesible para screen readers) */}
                  <span className="sr-only">ID: {card.id}</span>
                  
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
                  <div className="absolute top-2 right-10 flex items-center">
                    <Tag className="h-3 w-3 mr-1 text-purple-500" />
                    <span className="text-xs font-bold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded">
                      {card.classificationCode}
                    </span>
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