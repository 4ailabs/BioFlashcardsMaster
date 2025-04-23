import { useEffect, useRef } from "react";
import { TrendingUp, CheckCircle, PlusCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFlashcards } from "@/context/FlashcardContext";
import { useTheme } from "@/context/ThemeContext";
import { formatDate } from "@/lib/utils";
import ChartComponent from "./ChartComponent";
import FlashcardImporter from "./FlashcardImporter";

const Dashboard = () => {
  const { flashcards, studyStats, recentActivity } = useFlashcards();
  const { isDarkMode } = useTheme();

  // Calculate statistics
  const totalCards = flashcards.length;
  const cardsMastered = studyStats.mastered;
  const masteredPercentage = totalCards > 0 ? Math.round((cardsMastered / totalCards) * 100) : 0;
  const totalSessions = studyStats.sessions;
  const cardsAddedThisWeek = studyStats.addedThisWeek;
  const lastSession = studyStats.lastSession ? new Date(studyStats.lastSession) : null;

  // Prepare chart data
  const categoryData = {
    bacteria: 0,
    virus_adn: 0,
    virus_arn: 0,
    parasito: 0,
    hongo: 0,
  };

  flashcards.forEach((card) => {
    if (categoryData.hasOwnProperty(card.category)) {
      categoryData[card.category as keyof typeof categoryData]++;
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel de Estadísticas</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="shadow">
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total de Tarjetas</h3>
            <p className="text-3xl font-bold">{totalCards}</p>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+{cardsAddedThisWeek} añadidas esta semana</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow">
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tarjetas Dominadas</h3>
            <p className="text-3xl font-bold">{cardsMastered}</p>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <span>{masteredPercentage}% del total</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow">
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Sesiones de Estudio</h3>
            <p className="text-3xl font-bold">{totalSessions}</p>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <span>Última sesión: {lastSession ? formatDate(lastSession) : 'Nunca'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Flashcard Importer */}
      <div className="mb-8">
        <FlashcardImporter />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow">
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Distribución por Categoría</h3>
            <div className="h-64">
              <ChartComponent
                type="doughnut" 
                data={{
                  labels: ['Bacterias', 'Virus ADN', 'Virus ARN', 'Parásitos', 'Hongos'],
                  datasets: [
                    {
                      data: [
                        categoryData.bacteria,
                        categoryData.virus_adn,
                        categoryData.virus_arn,
                        categoryData.parasito,
                        categoryData.hongo,
                      ],
                      backgroundColor: [
                        'hsl(217, 91%, 60%)', // bacteria
                        'hsl(158, 64%, 40%)', // virus-adn
                        'hsl(0, 84%, 60%)',   // virus-arn
                        'hsl(38, 92%, 50%)',  // parasito
                        'hsl(265, 83%, 64%)'  // hongo
                      ],
                    }
                  ]
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: isDarkMode ? '#e2e8f0' : '#475569',
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow">
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Progreso de Aprendizaje</h3>
            <div className="h-64">
              <ChartComponent
                type="line" 
                data={{
                  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                  datasets: [
                    {
                      label: 'Tarjetas Estudiadas',
                      data: studyStats.dailyProgress,
                      borderColor: 'hsl(246, 86%, 67%)',
                      tension: 0.1,
                      fill: false
                    }
                  ]
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#475569',
                        stepSize: 2
                      },
                      grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                      }
                    },
                    x: {
                      ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#475569'
                      },
                      grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: isDarkMode ? '#e2e8f0' : '#475569'
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="shadow">
        <CardContent className="p-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Actividad Reciente</h3>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                let Icon;
                let colorClass = "";
                
                switch (activity.type) {
                  case "completed":
                    Icon = CheckCircle;
                    colorClass = "bg-bacteria/10 text-bacteria";
                    break;
                  case "favorite":
                    Icon = PlusCircle;
                    colorClass = "bg-virus-adn/10 text-virus-adn";
                    break;
                  case "started":
                    Icon = Clock;
                    colorClass = "bg-primary/10 text-primary";
                    break;
                  default:
                    Icon = Clock;
                    colorClass = "bg-primary/10 text-primary";
                }
                
                return (
                  <div className="flex items-start" key={index}>
                    <div className={`${colorClass} p-2 rounded-full mr-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{activity.description}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDate(new Date(activity.timestamp))}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500">No hay actividad reciente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
