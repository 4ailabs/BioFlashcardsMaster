/**
 * Función para reiniciar la aplicación eliminando los datos almacenados en localStorage
 */
export function resetLocalStorage(): void {
  // Conservamos el modo oscuro/claro porque es una preferencia del usuario
  const theme = localStorage.getItem('theme');
  
  // Eliminar todas las claves de localStorage
  localStorage.clear();
  
  // Restaurar el theme si existía
  if (theme) {
    localStorage.setItem('theme', theme);
  }
  
  console.log('LocalStorage reiniciado. La aplicación cargará datos nuevos en el próximo inicio.');
  
  // Marcar que se ha hecho un reseteo para evitar duplicaciones
  localStorage.setItem('flashcards_reset_needed', 'true');
  
  // Recargar la página para aplicar los cambios
  window.location.reload();
}

/**
 * Función para hacer un reseteo forzado, eliminando todas las flashcards y marcadores
 * para solucionar problemas de duplicación.
 */
export function forceResetStorage(): void {
  // Conservamos el modo oscuro/claro porque es una preferencia del usuario
  const theme = localStorage.getItem('theme');
  
  // Eliminar todas las claves de localStorage
  localStorage.clear();
  
  // Restaurar el theme si existía
  if (theme) {
    localStorage.setItem('theme', theme);
  }
  
  // Marcar que se ha hecho un reseteo forzado
  localStorage.setItem('force_reset', 'true');
  
  console.log('Se ha realizado un reinicio forzado. La aplicación se reiniciará completamente.');
  
  // Recargar la página
  window.location.reload();
}

/**
 * Función para reiniciar selectivamente solo el historial de actividad reciente
 * sin afectar a los favoritos u otras configuraciones
 */
export function resetRecentActivity(): void {
  // Eliminar solo la clave de localStorage relacionada con la actividad reciente
  localStorage.removeItem('recentActivity');
  
  console.log('Historial de actividad reciente reiniciado.');
  
  // Establecer una actividad inicial de reinicio
  const resetActivity = [{
    type: 'started',
    title: 'Historial reiniciado',
    description: 'Reinicio selectivo del historial de actividad reciente',
    timestamp: new Date().toISOString()
  }];
  
  localStorage.setItem('recentActivity', JSON.stringify(resetActivity));
  
  // Recargar la página para aplicar los cambios
  window.location.reload();
}

// Función para verificar si hay datos de flashcards en localStorage
export function hasFlashcardsData(): boolean {
  return localStorage.getItem('flashcards') !== null;
}

// Función para verificar si es necesario un reseteo de emergencia
export function needsEmergencyReset(): boolean {
  const flashcards = localStorage.getItem('flashcards');
  if (!flashcards) return false;
  
  try {
    const data = JSON.parse(flashcards);
    // Si hay demasiadas flashcards (más de 100), probablemente haya duplicados
    return data.length > 100;
  } catch (e) {
    // Si hay un error al parsear, mejor reiniciar
    return true;
  }
}