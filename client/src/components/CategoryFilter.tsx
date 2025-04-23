import { useFlashcards } from "@/context/FlashcardContext";
import { getCategoryTextColor, getCategoryHoverColor } from "@/lib/utils";

const CategoryFilter = () => {
  const { flashcards, selectedCategory, setSelectedCategory } = useFlashcards();
  
  // Count cards per category
  const categoryCounts = {
    all: flashcards.length,
    bacteria: flashcards.filter(card => card.category === 'bacteria').length,
    virus_adn: flashcards.filter(card => card.category === 'virus_adn').length,
    virus_arn: flashcards.filter(card => card.category === 'virus_arn').length,
    parasito: flashcards.filter(card => card.category === 'parasito').length,
    hongo: flashcards.filter(card => card.category === 'hongo').length,
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-1">
      <button 
        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg ${
          selectedCategory === 'all' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-primary/10 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-300'
        }`}
        onClick={() => handleCategoryClick('all')}
      >
        <span>All Categories</span>
        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-600">{categoryCounts.all}</span>
      </button>
      
      <button 
        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg ${
          selectedCategory === 'bacteria' 
            ? 'bg-bacteria/10 text-bacteria dark:bg-bacteria/20' 
            : `${getCategoryHoverColor('bacteria')} ${getCategoryTextColor('bacteria')}`
        }`}
        onClick={() => handleCategoryClick('bacteria')}
      >
        <span>Bacteria</span>
        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-600">{categoryCounts.bacteria}</span>
      </button>
      
      <button 
        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg ${
          selectedCategory === 'virus_adn' 
            ? 'bg-virus-adn/10 text-virus-adn dark:bg-virus-adn/20' 
            : `${getCategoryHoverColor('virus_adn')} ${getCategoryTextColor('virus_adn')}`
        }`}
        onClick={() => handleCategoryClick('virus_adn')}
      >
        <span>Virus ADN</span>
        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-600">{categoryCounts.virus_adn}</span>
      </button>
      
      <button 
        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg ${
          selectedCategory === 'virus_arn' 
            ? 'bg-virus-arn/10 text-virus-arn dark:bg-virus-arn/20' 
            : `${getCategoryHoverColor('virus_arn')} ${getCategoryTextColor('virus_arn')}`
        }`}
        onClick={() => handleCategoryClick('virus_arn')}
      >
        <span>Virus ARN</span>
        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-600">{categoryCounts.virus_arn}</span>
      </button>
      
      <button 
        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg ${
          selectedCategory === 'parasito' 
            ? 'bg-parasito/10 text-parasito dark:bg-parasito/20' 
            : `${getCategoryHoverColor('parasito')} ${getCategoryTextColor('parasito')}`
        }`}
        onClick={() => handleCategoryClick('parasito')}
      >
        <span>Parasitos</span>
        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-600">{categoryCounts.parasito}</span>
      </button>
      
      <button 
        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg ${
          selectedCategory === 'hongo' 
            ? 'bg-hongo/10 text-hongo dark:bg-hongo/20' 
            : `${getCategoryHoverColor('hongo')} ${getCategoryTextColor('hongo')}`
        }`}
        onClick={() => handleCategoryClick('hongo')}
      >
        <span>Hongos</span>
        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-600">{categoryCounts.hongo}</span>
      </button>
    </div>
  );
};

export default CategoryFilter;
