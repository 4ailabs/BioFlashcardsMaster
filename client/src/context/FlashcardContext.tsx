import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Flashcard, StudyStats, RecentActivity } from '@/data/flashcards';
import { generateFlashcardsFromPatogenosData } from '@/lib/generateFlashcards';
import { loadBacteriasFromJson } from '@/lib/loadBacterias';
import { loadVirusFromJson } from '@/lib/loadVirus';
import { loadPatogenosFromJson } from '@/lib/loadPatogenos';

interface FlashcardContextType {
  flashcards: Flashcard[];
  filteredFlashcards: Flashcard[];
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (favoritesOnly: boolean) => void;
  toggleFavorite: (id: string) => void;
  studyStats: StudyStats;
  shuffleCards: () => void;
  resetProgress: () => void;
  recentActivity: RecentActivity[];
}

const initialStudyStats: StudyStats = {
  studied: 0,
  mastered: 0,
  sessions: 0,
  lastSession: null,
  addedThisWeek: 5,
  dailyProgress: [3, 5, 2, 8, 4, 6, 7]
};

const initialRecentActivity: RecentActivity[] = [
  {
    type: 'completed',
    title: 'Completed study session',
    description: 'Studied 15 cards in Bacteria category',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    type: 'favorite',
    title: 'Added new card to favorites',
    description: 'Hepatitis B Virus (HBV)',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    type: 'started',
    title: 'Started study session',
    description: 'Mixed categories, 25 minutes',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString() // 26 hours ago
  }
];

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export function FlashcardProvider({ children }: { children: ReactNode }) {
  // Load flashcards data and enhance with localStorage favorites
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>(
    'flashcards',
    []
  );
  
  // Inicializar o actualizar flashcards
  useEffect(() => {
    try {
      // Verificar si hay un forzado de reset para solucionar problemas de duplicación
      const forceReset = localStorage.getItem('force_reset') === 'true';
      if (forceReset) {
        console.log("Detectado reseteo forzado. Limpiando datos...");
        localStorage.removeItem('force_reset');
        localStorage.removeItem('flashcards');
        // Continuar con inicialización normal después de limpiar
      }
      
      // Comprobar si hay demasiadas flashcards (más de 100) - posible indicador de duplicación
      if (flashcards.length > 100) {
        console.log(`Detectada posible duplicación: ${flashcards.length} flashcards. Limpiando...`);
        localStorage.removeItem('flashcards');
        // Forzar recarga para reiniciar desde cero
        window.location.reload();
        return;
      }
      
      // Generar flashcards iniciales 
      let baseFlashcards: Flashcard[] = [];
      if (flashcards.length === 0) {
        // Solo generamos las flashcards base si no hay datos
        console.log("Inicializando flashcards base desde cero...");
        baseFlashcards = generateFlashcardsFromPatogenosData();
      } else {
        // Filtrar las flashcards existentes para mantener solo las que NO son bacterias
        baseFlashcards = flashcards.filter(card => card.category !== 'bacteria');
        console.log(`Usando ${baseFlashcards.length} flashcards base existentes (no-bacterias)`);
      }
      
      // Cargar las bacterias desde el JSON (estas tienen prioridad y reemplazarán cualquier bacteria existente)
      console.log("Cargando bacterias desde JSON...");
      const bacteriasFlashcards = loadBacteriasFromJson();
      console.log(`Cargadas ${bacteriasFlashcards.length} bacterias desde JSON`);
      
      // Cargar los virus desde el JSON
      console.log("Cargando virus desde JSON...");
      const { virusAdn, virusArn } = loadVirusFromJson();
      console.log(`Cargados ${virusAdn.length} virus ADN y ${virusArn.length} virus ARN desde JSON`);
      
      // Cargar los parásitos y hongos desde JSON
      console.log("Cargando parásitos y hongos desde JSON...");
      const { parasitos, hongos } = loadPatogenosFromJson();
      console.log(`Cargados ${parasitos.length} parásitos y ${hongos.length} hongos desde JSON`);
      
      // En lugar de combinar directamente, vamos a eliminar duplicados por código de clasificación
      // Crear un mapa para realizar un seguimiento de las tarjetas por código de clasificación
      const cardsByClassCode = new Map<string, Flashcard>();
      
      // 1. Primero, agregar todas las bacterias del JSON (tienen prioridad)
      bacteriasFlashcards.forEach(card => {
        if (card.classificationCode) {
          cardsByClassCode.set(card.classificationCode, card);
        } else {
          // Si no tiene código de clasificación, usar el ID
          cardsByClassCode.set(card.id, card);
        }
      });
      
      // 2. Luego, agregar los virus ADN del JSON (tienen prioridad sobre los generados)
      virusAdn.forEach(card => {
        if (card.classificationCode) {
          cardsByClassCode.set(card.classificationCode, card);
        } else {
          cardsByClassCode.set(card.id, card);
        }
      });
      
      // 3. Luego, agregar los virus ARN del JSON (tienen prioridad sobre los generados)
      virusArn.forEach(card => {
        if (card.classificationCode) {
          cardsByClassCode.set(card.classificationCode, card);
        } else {
          cardsByClassCode.set(card.id, card);
        }
      });
      
      // 4. Agregar los parásitos del JSON
      parasitos.forEach(card => {
        if (card.classificationCode) {
          cardsByClassCode.set(card.classificationCode, card);
        } else {
          cardsByClassCode.set(card.id, card);
        }
      });
      
      // 5. Agregar los hongos del JSON
      hongos.forEach(card => {
        if (card.classificationCode) {
          cardsByClassCode.set(card.classificationCode, card);
        } else {
          cardsByClassCode.set(card.id, card);
        }
      });
      
      // 6. Finalmente, agregar las flashcards base que no tengan códigos duplicados
      baseFlashcards.forEach(card => {
        const key = card.classificationCode || card.id;
        // Solo agregar si no existe o si no corresponde a una categoría que ya procesamos desde el JSON
        if (!cardsByClassCode.has(key) || 
            (card.category !== 'bacteria' && 
             card.category !== 'virus_adn' && 
             card.category !== 'virus_arn' &&
             card.category !== 'parasito' &&
             card.category !== 'hongo')) {
          cardsByClassCode.set(key, card);
        }
      });
      
      // Convertir el mapa de vuelta a un array
      const uniqueFlashcards = Array.from(cardsByClassCode.values());
      console.log(`Total de flashcards después de eliminar duplicados: ${uniqueFlashcards.length}`);
      
      // Calcular cuántas flashcards serían si hubiéramos concatenado directamente
      const totalRawCount = baseFlashcards.length + bacteriasFlashcards.length + virusAdn.length + virusArn.length + parasitos.length + hongos.length;
      const eliminadas = totalRawCount - uniqueFlashcards.length;
      if (eliminadas > 0) {
        console.log(`Se eliminaron ${eliminadas} flashcards duplicadas`);
      }
      
      // Mostrar estadísticas de las categorías
      const categoryCounts = {
        bacteria: uniqueFlashcards.filter(card => card.category === 'bacteria').length,
        virus_adn: uniqueFlashcards.filter(card => card.category === 'virus_adn').length,
        virus_arn: uniqueFlashcards.filter(card => card.category === 'virus_arn').length,
        parasito: uniqueFlashcards.filter(card => card.category === 'parasito').length,
        hongo: uniqueFlashcards.filter(card => card.category === 'hongo').length
      };
      console.log("Distribución por categorías:", categoryCounts);
      
      // Actualizar el estado solo si hay cambios o si acabamos de inicializar
      if (uniqueFlashcards.length !== flashcards.length || flashcards.length === 0) {
        console.log(`Actualizando flashcards: ${flashcards.length} → ${uniqueFlashcards.length}`);
        setFlashcards(uniqueFlashcards);
        
        // Añadir actividad de actualización
        const newActivity: RecentActivity = {
          type: 'completed',
          title: 'Actualización de flashcards',
          description: `Flashcards actualizadas: total ${uniqueFlashcards.length}`,
          timestamp: new Date().toISOString()
        };
        
        setRecentActivity(prevActivity => [newActivity, ...prevActivity.slice(0, 9)]);
      } else {
        console.log("No se necesita actualización de flashcards");
      }
    } catch (error) {
      console.error("Error al actualizar las flashcards:", error);
    }
  }, []);
  
  const [currentCardIndex, setCurrentCardIndex] = useLocalStorage<number>(
    'currentCardIndex',
    0
  );
  
  const [selectedCategory, setSelectedCategory] = useLocalStorage<string>(
    'selectedCategory',
    'all'
  );
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  
  const [studyStats, setStudyStats] = useLocalStorage<StudyStats>(
    'studyStats',
    initialStudyStats
  );
  
  const [recentActivity, setRecentActivity] = useLocalStorage<RecentActivity[]>(
    'recentActivity',
    initialRecentActivity
  );

  // Nota: activeTab y setActiveTab ahora se pasan desde App.tsx
  
  // Filter flashcards based on category, search query, and favorites
  const filteredFlashcards = useMemo(() => {
    console.log(`Filtrando flashcards - query: "${searchQuery}" - categoría: ${selectedCategory} - favoritos: ${favoritesOnly}`);
    console.log(`Total de flashcards disponibles: ${flashcards.length}`);
    
    if (searchQuery.trim() === '' && selectedCategory === 'all' && !favoritesOnly) {
      console.log("Sin filtros activos, mostrando todas las tarjetas");
      return flashcards;
    }
    
    const filtered = flashcards.filter(card => {
      // Filter by category
      const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
      
      // Filter by favorites (prioritize this filter)
      const favoriteMatch = !favoritesOnly || card.isFavorite;
      
      // If category or favorite filter doesn't match, skip text search
      if (!categoryMatch || !favoriteMatch) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery.trim() === '') {
        return true; // No search query, match all cards that pass category and favorite filters
      }
      
      const searchLower = searchQuery.toLowerCase().trim();
      
      // Check various fields for matches
      const nameMatch = card.name && card.name.toLowerCase().includes(searchLower);
      const scientificNameMatch = card.scientificName && card.scientificName.toLowerCase().includes(searchLower);
      const characteristicsMatch = card.characteristics && card.characteristics.toLowerCase().includes(searchLower);
      const notesMatch = card.notes && card.notes.toLowerCase().includes(searchLower);
      const conflictBasisMatch = card.conflictBasis && card.conflictBasis.toLowerCase().includes(searchLower);
      
      // Check if any field matches
      const textMatch = nameMatch || scientificNameMatch || characteristicsMatch || notesMatch || conflictBasisMatch;
      
      return textMatch;
    });
    
    console.log(`Tarjetas filtradas: ${filtered.length}`);
    return filtered;
  }, [flashcards, selectedCategory, searchQuery, favoritesOnly]);
  
  // Make sure currentCardIndex is valid
  useEffect(() => {
    if (filteredFlashcards.length > 0 && currentCardIndex >= filteredFlashcards.length) {
      setCurrentCardIndex(0);
    }
  }, [filteredFlashcards, currentCardIndex, setCurrentCardIndex]);
  
  // Toggle favorite status for a card
  const toggleFavorite = (id: string) => {
    const updatedFlashcards = flashcards.map(card => {
      if (card.id === id) {
        const newCard = { ...card, isFavorite: !card.isFavorite };
        
        // Add activity if card is added to favorites
        if (!card.isFavorite) {
          const newActivity: RecentActivity = {
            type: 'favorite',
            title: 'Added new card to favorites',
            description: card.name,
            timestamp: new Date().toISOString()
          };
          setRecentActivity([newActivity, ...recentActivity.slice(0, 9)]);
        }
        
        return newCard;
      }
      return card;
    });
    
    setFlashcards(updatedFlashcards);
  };
  
  // Shuffle cards
  const shuffleCards = () => {
    const shuffled = [...filteredFlashcards].sort(() => Math.random() - 0.5);
    
    // Find the indices in the original flashcards array
    const newOrder = shuffled.map(card => 
      flashcards.findIndex(c => c.id === card.id)
    );
    
    // Update original flashcards with the new order
    const newFlashcards = [...flashcards];
    filteredFlashcards.forEach((card, i) => {
      newFlashcards[flashcards.findIndex(c => c.id === card.id)] = shuffled[i];
    });
    
    setFlashcards(newFlashcards);
    setCurrentCardIndex(0);
    
    // Add shuffle activity
    const newActivity: RecentActivity = {
      type: 'started',
      title: 'Shuffled flashcards',
      description: `Shuffled ${filteredFlashcards.length} cards`,
      timestamp: new Date().toISOString()
    };
    setRecentActivity([newActivity, ...recentActivity.slice(0, 9)]);
    
    // Increment session count
    setStudyStats({
      ...studyStats,
      sessions: studyStats.sessions + 1,
      lastSession: new Date().toISOString()
    });
  };
  
  // Reset study progress
  const resetProgress = () => {
    setStudyStats({
      ...studyStats,
      studied: 0,
      mastered: 0,
      lastSession: new Date().toISOString()
    });
    
    // Add reset activity
    const newActivity: RecentActivity = {
      type: 'started',
      title: 'Reset study progress',
      description: 'Started fresh study session',
      timestamp: new Date().toISOString()
    };
    setRecentActivity([newActivity, ...recentActivity.slice(0, 9)]);
  };

  // Increment studied count when card changes
  useEffect(() => {
    const currentCard = filteredFlashcards[currentCardIndex];
    if (currentCard) {
      const updatedStats = { ...studyStats };
      
      // Increment studied count if it hasn't been studied yet
      if (!currentCard.studied) {
        updatedStats.studied += 1;
        
        // Update the flashcard with studied status
        const updatedFlashcards = flashcards.map(card => {
          if (card.id === currentCard.id) {
            return { ...card, studied: true };
          }
          return card;
        });
        
        setFlashcards(updatedFlashcards);
      }
      
      // Update session timestamp
      updatedStats.lastSession = new Date().toISOString();
      
      setStudyStats(updatedStats);
    }
  }, [currentCardIndex]);
  
  return (
    <FlashcardContext.Provider
      value={{
        flashcards,
        filteredFlashcards,
        currentCardIndex,
        setCurrentCardIndex,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        favoritesOnly,
        setFavoritesOnly,
        toggleFavorite,
        studyStats,
        shuffleCards,
        resetProgress,
        recentActivity
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
}
