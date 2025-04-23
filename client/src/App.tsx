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
  const [activeTab, setActiveTab] = useState<"study" | "dashboard" | "favorites" | "assistant">("study");

  return (
    <ThemeProvider>
      <FlashcardProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <main className="w-full md:ml-64 p-4 md:p-8">
                {activeTab === "study" && <StudyView />}
                {activeTab === "dashboard" && <Dashboard />}
                {activeTab === "favorites" && <Favorites />}
                {activeTab === "assistant" && <AIAssistant />}
              </main>
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </FlashcardProvider>
    </ThemeProvider>
  );
}

export default App;
