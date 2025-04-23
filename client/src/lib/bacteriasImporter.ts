import { v4 as uuidv4 } from 'uuid';
import { Flashcard } from '@/data/flashcards';

/**
 * Interfaz para representar el formato de los datos de bacterias en el JSON proporcionado
 */
interface BacteriaJSONData {
  nombre_comun: string;
  nombre_cientifico: string;
  tipo: string;
  descripcion: string;
  id_referencia: string;
  codigo_patogeno: string[];
  conflicto_base: {
    etapa_ontogenica?: string;
    sensaciones?: string;
    otros_conflictos?: string;
  };
  notas: {
    toxinas?: string;
    virulencia?: string;
    enfermedades_relacionadas?: string;
    habitat?: string;
    caracteristicas?: string;
    afectaciones?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Convierte los datos de bacterias del formato JSON al formato de Flashcard
 * @param bacteriasJson Los datos de bacterias en formato JSON
 * @returns Array de Flashcard
 */
export function convertirBacteriasAFlashcards(bacteriasJson: BacteriaJSONData[]): Flashcard[] {
  // Array para almacenar las flashcards convertidas
  const flashcards: Flashcard[] = [];

  // Procesar cada bacteria
  bacteriasJson.forEach(bacteria => {
    // Extraer el código de clasificación (coincide con id_referencia)
    const classificationCode = bacteria.id_referencia;
    
    // Generar un ID único para la flashcard
    const id = `BACT-${classificationCode}-${uuidv4().substring(0, 4)}`;
    
    // Construir la cadena de características
    let characteristics = bacteria.descripcion || '';
    if (bacteria.notas.caracteristicas) {
      characteristics += `\n\n${bacteria.notas.caracteristicas}`;
    }
    if (bacteria.notas.habitat) {
      characteristics += `\n\nHábitat: ${bacteria.notas.habitat}`;
    }
    if (bacteria.notas.toxinas) {
      characteristics += `\n\nToxinas: ${bacteria.notas.toxinas}`;
    }
    if (bacteria.notas.virulencia) {
      characteristics += `\n\nVirulencia: ${bacteria.notas.virulencia}`;
    }
    if (bacteria.notas.afectaciones) {
      characteristics += `\n\nAfectaciones: ${bacteria.notas.afectaciones}`;
    }
    
    // Construir la cadena de base conflictual
    let conflictBasis = '';
    if (bacteria.conflicto_base.etapa_ontogenica) {
      conflictBasis += `Etapa ontogénica: ${bacteria.conflicto_base.etapa_ontogenica}\n\n`;
    }
    if (bacteria.conflicto_base.sensaciones) {
      conflictBasis += `Sensaciones: ${bacteria.conflicto_base.sensaciones}\n\n`;
    }
    if (bacteria.conflicto_base.otros_conflictos) {
      conflictBasis += `Otros conflictos: ${bacteria.conflicto_base.otros_conflictos}`;
    }
    
    // Construir la cadena de notas
    let notes = '';
    if (bacteria.notas.enfermedades_relacionadas) {
      notes += `Enfermedades relacionadas: ${bacteria.notas.enfermedades_relacionadas}\n\n`;
    }
    
    // Construir el mapeo de códigos
    const codeMapping: Record<string, any> = {
      type: 'bacteria',
      bacteriaType: bacteria.tipo,
      codigoPatogeno: bacteria.codigo_patogeno
    };
    
    // Crear la flashcard
    const flashcard: Flashcard = {
      id,
      category: 'bacteria',
      name: bacteria.nombre_comun,
      scientificName: bacteria.nombre_cientifico,
      characteristics,
      conflictBasis,
      notes,
      codeMapping,
      classificationCode,
      isFavorite: false
    };
    
    // Añadir la flashcard al array
    flashcards.push(flashcard);
  });
  
  return flashcards;
}

/**
 * Carga el JSON de bacterias desde un archivo local y lo convierte a Flashcards
 * @param jsonFilePath Ruta del archivo JSON
 * @returns Promise con el array de Flashcards
 */
export async function cargarBacteriasDesdeJSON(jsonData: BacteriaJSONData[]): Promise<Flashcard[]> {
  try {
    return convertirBacteriasAFlashcards(jsonData);
  } catch (error) {
    console.error("Error al cargar bacterias desde JSON:", error);
    return [];
  }
}

/**
 * Incorpora las flashcards de bacterias al array existente sin duplicados
 * @param existingFlashcards Array de flashcards existentes
 * @param bacteriasFlashcards Array de flashcards de bacterias
 * @returns Array combinado sin duplicados
 */
export function combinarFlashcardsSinDuplicados(
  existingFlashcards: Flashcard[],
  bacteriasFlashcards: Flashcard[]
): Flashcard[] {
  // Crear un Set con los códigos de clasificación existentes
  const existingCodes = new Set(
    existingFlashcards
      .filter(card => card.classificationCode)
      .map(card => card.classificationCode)
  );
  
  // Filtrar las flashcards de bacterias que no estén ya en el array existente
  const newBacteriasFlashcards = bacteriasFlashcards.filter(
    card => !existingCodes.has(card.classificationCode || '')
  );
  
  // Combinar los arrays
  return [...existingFlashcards, ...newBacteriasFlashcards];
}