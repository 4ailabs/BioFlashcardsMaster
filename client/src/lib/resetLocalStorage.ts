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
}

// Función para verificar si hay datos de flashcards en localStorage
export function hasFlashcardsData(): boolean {
  return localStorage.getItem('flashcards') !== null;
}