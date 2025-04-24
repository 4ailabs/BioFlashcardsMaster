import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/Sidebar";
import StudyView from "@/components/StudyView";
import Dashboard from "@/components/Dashboard";
import Favorites from "@/components/Favorites";
import AIAssistant from "@/components/AIAssistant";
import GridView from "@/components/GridView";
import { ThemeProvider } from "./context/ThemeContext";
import { FlashcardProvider } from "./context/FlashcardContext";

function App() {
  const [activeTab, setActiveTab] = useState<"study" | "dashboard" | "favorites" | "assistant" | "gallery">("study");

  return (
    <ThemeProvider>
      <FlashcardProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <div className="min-h-screen overflow-hidden w-full flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <main className="w-full md:ml-64 p-3 md:p-8 overflow-x-hidden">
                <div className="max-w-screen-lg mx-auto">
                  {activeTab === "study" && <StudyView />}
                  {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
                  {activeTab === "favorites" && <Favorites setActiveTab={setActiveTab} />}
                  {activeTab === "assistant" && <AIAssistant />}
                  {activeTab === "gallery" && <GridView setActiveTab={setActiveTab} />}
                </div>
              </main>
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </FlashcardProvider>
    </ThemeProvider>
  );
}

export default App;