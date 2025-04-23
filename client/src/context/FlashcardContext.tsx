import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import flashcardData, { Flashcard, StudyStats, RecentActivity } from '@/data/flashcards';

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
  activeTab: "study" | "dashboard" | "favorites";
  setActiveTab: (tab: "study" | "dashboard" | "favorites") => void;
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
    flashcardData
  );
  
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

  const [activeTab, setActiveTab] = useState<"study" | "dashboard" | "favorites">('study');
  
  // Filter flashcards based on category, search query, and favorites
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter(card => {
      // Filter by category
      const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
      
      // Filter by search query
      const searchMatch = searchQuery === '' || 
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by favorites
      const favoriteMatch = !favoritesOnly || card.isFavorite;
      
      return categoryMatch && searchMatch && favoriteMatch;
    });
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
        recentActivity,
        activeTab,
        setActiveTab
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
