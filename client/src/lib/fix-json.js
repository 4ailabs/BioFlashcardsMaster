// Script para corregir el JSON
const fs = require('fs');

// Leer el archivo
const jsonFile = './client/src/lib/bacterias.json';
let jsonData = fs.readFileSync(jsonFile, 'utf8');

// Corregir los problemas comunes en JSON
jsonData = jsonData.replace(/\/\/.*$/gm, ''); // Eliminar comentarios al final de línea
jsonData = jsonData.replace(/,\s*}/g, ' }'); // Eliminar comas finales
jsonData = jsonData.replace(/,\s*]/g, ' ]'); // Eliminar comas finales en arrays

// Intentar analizar para verificar
try {
  const obj = JSON.parse(jsonData);
  console.log('JSON es válido después de correcciones.');
  
  // Guardar el archivo corregido
  fs.writeFileSync(jsonFile, JSON.stringify(obj, null, 2), 'utf8');
  console.log('Archivo JSON corregido y guardado.');
} catch (error) {
  console.error('Error al analizar el JSON:', error.message);
}