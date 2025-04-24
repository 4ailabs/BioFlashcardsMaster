import { useState } from "react";
import { BookOpen, LayoutDashboard, Star, Search, Brain, Grid, RotateCcw } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useFlashcards } from "@/context/FlashcardContext";
import CategoryFilter from "./CategoryFilter";
import { cn } from "@/lib/utils";
import { forceResetStorage } from "@/lib/resetLocalStorage";

interface SidebarProps {
  activeTab: "study" | "dashboard" | "favorites" | "assistant" | "gallery";
  setActiveTab: (tab: "study" | "dashboard" | "favorites" | "assistant" | "gallery") => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { searchQuery, setSearchQuery, favoritesOnly, setFavoritesOnly } = useFlashcards();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`Búsqueda: "${value}"`);
    // Establecer el valor y forzar un refresco con un valor diferente primero
    setSearchQuery("");
    setTimeout(() => {
      setSearchQuery(value);
    }, 10);
  };

  const handleFavoritesToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFavoritesOnly(e.target.checked);
  };

  return (
    <aside className="w-full md:w-64 md:h-screen bg-white dark:bg-slate-800 shadow-lg md:fixed left-0 md:overflow-y-auto">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">MicroBioCards</h1>
            <ThemeToggle />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Dr. Miguel Ojeda Ríos</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab("study")}
              className={cn(
                "flex items-center w-full p-2 rounded-lg",
                activeTab === "study"
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white"
                  : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              <span>Estudiar</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={cn(
                "flex items-center w-full p-2 rounded-lg",
                activeTab === "dashboard"
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white"
                  : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              <span>Estadísticas</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("favorites")}
              className={cn(
                "flex items-center w-full p-2 rounded-lg",
                activeTab === "favorites"
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white"
                  : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}
            >
              <Star className="mr-2 h-5 w-5 text-amber-500" />
              <span>Favoritos</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("assistant")}
              className={cn(
                "flex items-center w-full p-2 rounded-lg",
                activeTab === "assistant"
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white"
                  : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}
            >
              <Brain className="mr-2 h-5 w-5 text-purple-500" />
              <span>Asistente IA</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("gallery")}
              className={cn(
                "flex items-center w-full p-2 rounded-lg",
                activeTab === "gallery"
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white"
                  : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}
            >
              <Grid className="mr-2 h-5 w-5 text-green-500" />
              <span>Galería</span>
            </button>
          </li>
        </ul>
      </nav>
      
      {/* Filter Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <h2 className="font-medium mb-3">Filtros</h2>
        
        {/* Search */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar tarjetas..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        {/* Categories */}
        <h3 className="text-sm font-medium mb-2">Categorías</h3>
        <CategoryFilter />
        
        {/* Favorites toggle */}
        <div className="mt-4 flex items-center">
          <input 
            type="checkbox" 
            id="favorites-only" 
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            checked={favoritesOnly}
            onChange={handleFavoritesToggle}
          />
          <label htmlFor="favorites-only" className="ml-2 text-sm">Mostrar solo favoritos</label>
        </div>
      </div>
      
      {/* Reset Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => {
            if (window.confirm('¿Estás seguro de que deseas reiniciar la aplicación? Esta acción eliminará tus datos guardados y es útil para resolver problemas.')) {
              forceResetStorage();
            }
          }}
          className="flex items-center w-full p-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          <span>Reiniciar aplicación</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
