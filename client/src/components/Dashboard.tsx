import React from 'react';
import ChartComponent from '@/components/ChartComponent';
import { useFlashcards } from '@/context/FlashcardContext';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlashcardImporter from './FlashcardImporter';
import { resetRecentActivity } from '@/lib/resetLocalStorage';
import { RotateCcw } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: "study" | "dashboard" | "favorites" | "assistant" | "gallery") => void;
}

const Dashboard = ({ setActiveTab }: DashboardProps) => {
  const { flashcards, studyStats, recentActivity } = useFlashcards();
  
  // Contar flashcards por categoría
  const categoryCount = flashcards.reduce((acc, card) => {
    const category = card.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Generar datos para el gráfico de categorías
  const categoriesChartData = {
    labels: Object.keys(categoryCount).map(cat => {
      if (cat === 'bacteria') return 'Bacterias';
      if (cat === 'virus_adn') return 'Virus ADN';
      if (cat === 'virus_arn') return 'Virus ARN';
      if (cat === 'parasito') return 'Parásitos';
      if (cat === 'hongo') return 'Hongos';
      return cat;
    }),
    datasets: [
      {
        label: 'Flashcards por Categoría',
        data: Object.values(categoryCount),
        backgroundColor: [
          '#3b82f6', // blue-500 para bacterias
          '#22c55e', // green-500 para virus ADN
          '#ef4444', // red-500 para virus ARN
          '#f59e0b', // amber-500 para parásitos
          '#8b5cf6', // violet-500 para hongos
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Generar datos para el gráfico de progreso diario
  const progressChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Tarjetas Estudiadas',
        data: studyStats.dailyProgress,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Generar datos para el gráfico de estado de estudio
  const studyStatusChartData = {
    labels: ['Estudiadas', 'No Estudiadas', 'Dominadas'],
    datasets: [
      {
        label: 'Estado de Estudio',
        data: [
          studyStats.studied,
          flashcards.length - studyStats.studied,
          studyStats.mastered,
        ],
        backgroundColor: [
          '#3b82f6', // blue-500
          '#94a3b8', // slate-400
          '#22c55e', // green-500
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const currentWeekday = new Date().toLocaleDateString('es-ES', { weekday: 'long' });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Panel de Control</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Gestiona tus flashcards y monitorea tu progreso de estudio
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total de Flashcards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flashcards.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              En {Object.keys(categoryCount).length} categorías
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Tarjetas Estudiadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.studied}</div>
            <p className="text-xs text-slate-500 mt-1">
              {Math.round((studyStats.studied / flashcards.length) * 100)}% completado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Sesiones de Estudio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.sessions}</div>
            <p className="text-xs text-slate-500 mt-1">
              Última sesión: {studyStats.lastSession ? formatDate(new Date(studyStats.lastSession)) : 'Nunca'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Agregadas Recientemente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.addedThisWeek}</div>
            <p className="text-xs text-slate-500 mt-1">
              Esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Importador de Flashcards */}
      <FlashcardImporter />

      {/* Gráficos en pestañas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartComponent type="doughnut" data={categoriesChartData} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estado de Estudio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartComponent type="pie" data={studyStatusChartData} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Estudio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ChartComponent
              type="line"
              data={progressChartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Tarjetas Estudiadas'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Día de la Semana'
                    }
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Actividad Reciente</CardTitle>
          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar solo el historial de actividad reciente? Esto no afectará tus favoritos ni otras configuraciones.')) {
                resetRecentActivity();
              }
            }}
            className="flex items-center text-xs text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
            title="Reiniciar solo el historial de actividad"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            <span>Reiniciar historial</span>
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.type === 'completed' ? 'bg-green-500' :
                    activity.type === 'favorite' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.description}</p>
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(new Date(activity.timestamp))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center">
                No hay actividad reciente
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sugerencia para estudiar */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">¡Hoy es {currentWeekday}!</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Es un buen momento para estudiar algunas tarjetas nuevas o repasar las que ya has visto.
        </p>
        <button
          onClick={() => setActiveTab('study')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Comenzar a Estudiar
        </button>
      </div>
    </div>
  );
};

export default Dashboard;