import { v4 as uuidv4 } from 'uuid';
import { Flashcard } from '@/data/flashcards';
import bacteriasJson from './bacterias.json';

/**
 * Convierte los datos de bacterias del JSON al formato de Flashcard
 */
export function loadBacteriasFromJson(): Flashcard[] {
  try {
    console.log(`Cargando ${bacteriasJson.length} bacterias desde JSON`);
    const flashcards: Flashcard[] = [];
    
    // Creamos un Set para llevar control de los códigos de clasificación ya procesados
    const processedCodes = new Set<string>();
    
    bacteriasJson.forEach((bacteria: any) => {
      // Extraer datos del JSON
      const classificationCode = bacteria.id_referencia;
      
      // Verificamos si ya procesamos esta bacteria para evitar duplicados
      if (processedCodes.has(classificationCode)) {
        return; // Skip this iteration
      }
      
      // Marcamos el código como procesado
      processedCodes.add(classificationCode);
      
      const name = bacteria.nombre_comun;
      const scientificName = bacteria.nombre_cientifico;
      
      // Construir la descripción
      let characteristics = bacteria.descripcion || '';
      if (bacteria.notas?.caracteristicas) {
        characteristics += `\n\n${bacteria.notas.caracteristicas}`;
      }
      if (bacteria.notas?.habitat) {
        characteristics += `\n\nHábitat: ${bacteria.notas.habitat}`;
      }
      if (bacteria.notas?.toxinas) {
        characteristics += `\n\nToxinas: ${bacteria.notas.toxinas}`;
      }
      if (bacteria.notas?.virulencia) {
        characteristics += `\n\nVirulencia: ${bacteria.notas.virulencia}`;
      }
      if (bacteria.notas?.afectaciones) {
        characteristics += `\n\nAfectaciones: ${bacteria.notas.afectaciones}`;
      }
      
      // Construir la base conflictual
      let conflictBasis = '';
      if (bacteria.conflicto_base?.etapa_ontogenica) {
        conflictBasis += `Etapa ontogénica: ${bacteria.conflicto_base.etapa_ontogenica}\n\n`;
      }
      if (bacteria.conflicto_base?.sensaciones) {
        conflictBasis += `Sensaciones: ${bacteria.conflicto_base.sensaciones}\n\n`;
      }
      if (bacteria.conflicto_base?.otros_conflictos) {
        conflictBasis += `Otros conflictos: ${bacteria.conflicto_base.otros_conflictos}`;
      }
      
      // Construir las notas
      let notes = '';
      if (bacteria.notas?.enfermedades_relacionadas) {
        notes += `Enfermedades relacionadas: ${bacteria.notas.enfermedades_relacionadas}\n\n`;
      }
      
      // Crear la flashcard
      const flashcard: Flashcard = {
        id: `${classificationCode}-${uuidv4().substring(0, 8)}`,
        category: 'bacteria',
        name,
        scientificName,
        characteristics,
        conflictBasis,
        notes,
        codeMapping: {
          type: 'bacteria',
          codigoPatogeno: bacteria.codigo_patogeno || []
        },
        classificationCode,
        isFavorite: false
      };
      
      flashcards.push(flashcard);
    });
    
    console.log(`Se generaron ${flashcards.length} flashcards de bacterias`);
    return flashcards;
  } catch (error) {
    console.error("Error al cargar bacterias desde JSON:", error);
    return [];
  }
}

// Función para combinar flashcards sin duplicados
export function mergeFlashcards(existingCards: Flashcard[], newCards: Flashcard[]): Flashcard[] {
  // Crear un Set con los códigos de clasificación existentes
  const existingCodes = new Set(
    existingCards
      .filter(card => card.classificationCode)
      .map(card => card.classificationCode)
  );
  
  // Filtrar las nuevas flashcards para eliminar duplicados
  const uniqueNewCards = newCards.filter(
    card => !existingCodes.has(card.classificationCode || '')
  );
  
  console.log(`Añadiendo ${uniqueNewCards.length} nuevas flashcards de bacterias`);
  
  // Combinar los arrays
  return [...existingCards, ...uniqueNewCards];
}