import { v4 as uuidv4 } from 'uuid';
import { Flashcard } from '@/data/flashcards';
import parasitosJson from './parasitos.json';
import hongosJson from './hongos.json';

/**
 * Procesa un objeto de patógeno individual y lo convierte en una Flashcard
 */
function processPatogenoData(patogeno: any, processedCodes: Set<string>, category: string): Flashcard | null {
  // Extraer datos del JSON
  const classificationCode = patogeno.id_referencia;
  
  // Verificamos si ya procesamos este patógeno para evitar duplicados
  if (processedCodes.has(classificationCode)) {
    return null; // Saltar esta entrada
  }
  
  // Marcamos el código como procesado
  processedCodes.add(classificationCode);
  
  const name = patogeno.nombre_comun;
  const scientificName = patogeno.nombre_cientifico || '';
  const tipo = patogeno.tipo || '';
  
  // Construir la descripción
  let characteristics = patogeno.descripcion || '';
  
  // Agregar características adicionales si existen
  if (patogeno.notas?.caracteristicas) {
    characteristics += `\n\n${patogeno.notas.caracteristicas}`;
  }
  if (patogeno.notas?.mecanismo) {
    characteristics += `\n\nMecanismo: ${patogeno.notas.mecanismo}`;
  }
  if (patogeno.notas?.metabolismo) {
    characteristics += `\n\nMetabolismo: ${patogeno.notas.metabolismo}`;
  }
  if (patogeno.notas?.patologia) {
    characteristics += `\n\nPatología: ${patogeno.notas.patologia}`;
  }
  
  // Construir la base conflictual
  let conflictBasis = '';
  if (patogeno.conflicto_base?.etapa_ontogenica) {
    conflictBasis += `Etapa ontogénica: ${patogeno.conflicto_base.etapa_ontogenica}\n\n`;
  }
  if (patogeno.conflicto_base?.sensaciones) {
    conflictBasis += `Sensaciones: ${patogeno.conflicto_base.sensaciones}\n\n`;
  }
  if (patogeno.conflicto_base?.otros_conflictos) {
    conflictBasis += `Conflictos relacionados: ${patogeno.conflicto_base.otros_conflictos}\n\n`;
  }
  if (patogeno.conflicto_base?.notas_conflicto) {
    conflictBasis += `Notas del conflicto: ${patogeno.conflicto_base.notas_conflicto}`;
  }
  
  // Construir las notas
  let notes = '';
  
  // Procesar diferentes campos de notas
  const notasKeys = [
    'enfermedades_relacionadas', 
    'interacciones', 
    'comportamiento', 
    'presentacion_clinica',
    'presentacion_cutanea',
    'presentacion_visceral',
    'transmision',
    'reservorio',
    'interaccion_inmune',
    'observacion', 
    'otros'
  ];
  
  for (const key of notasKeys) {
    if (patogeno.notas && patogeno.notas[key]) {
      notes += `${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}: ${patogeno.notas[key]}\n\n`;
    }
  }
  
  // Agregar códigos patógenos
  if (patogeno.codigo_patogeno && patogeno.codigo_patogeno.length > 0) {
    notes += `Localización patógena: ${patogeno.codigo_patogeno.join(', ')}`;
  }
  
  // Crear la flashcard
  const flashcard: Flashcard = {
    id: `${classificationCode}-${uuidv4().substring(0, 8)}`,
    category,
    name,
    scientificName,
    characteristics,
    conflictBasis,
    notes,
    codeMapping: {
      type: category,
      codigoPatogeno: patogeno.codigo_patogeno || []
    },
    classificationCode,
    isFavorite: false
  };
  
  return flashcard;
}

/**
 * Convierte los datos de parásitos y hongos del JSON al formato de Flashcard
 */
export function loadPatogenosFromJson(): { parasitos: Flashcard[], hongos: Flashcard[] } {
  try {
    console.log(`Cargando ${parasitosJson.length} parásitos y ${hongosJson.length} hongos desde JSONs`);
    const parasitosFlashcards: Flashcard[] = [];
    const hongosFlashcards: Flashcard[] = [];
    
    // Creamos un Set para llevar control de los códigos de clasificación ya procesados
    const processedCodes = new Set<string>();
    
    // Procesar parásitos
    parasitosJson.forEach((parasito: any) => {
      const flashcard = processPatogenoData(parasito, processedCodes, 'parasito');
      if (flashcard) {
        parasitosFlashcards.push(flashcard);
      }
    });
    
    // Procesar hongos
    hongosJson.forEach((hongo: any) => {
      const flashcard = processPatogenoData(hongo, processedCodes, 'hongo');
      if (flashcard) {
        hongosFlashcards.push(flashcard);
      }
    });
    
    console.log(`Se generaron ${parasitosFlashcards.length} flashcards de parásitos`);
    console.log(`Se generaron ${hongosFlashcards.length} flashcards de hongos`);
    
    return { 
      parasitos: parasitosFlashcards, 
      hongos: hongosFlashcards 
    };
  } catch (error) {
    console.error("Error al cargar patógenos desde JSON:", error);
    return { 
      parasitos: [], 
      hongos: [] 
    };
  }
}

// Función para combinar flashcards sin duplicados
export function mergePatogenosFlashcards(
  existingCards: Flashcard[], 
  parasitosCards: Flashcard[],
  hongosCards: Flashcard[]
): Flashcard[] {
  // Crear un Set con los códigos de clasificación existentes
  const existingCodes = new Set(
    existingCards
      .filter(card => card.classificationCode)
      .map(card => card.classificationCode)
  );
  
  // Filtrar los parásitos para eliminar duplicados
  const uniqueParasitosCards = parasitosCards.filter(
    card => !existingCodes.has(card.classificationCode || '')
  );
  
  // Filtrar los hongos para eliminar duplicados
  const uniqueHongosCards = hongosCards.filter(
    card => !existingCodes.has(card.classificationCode || '')
  );
  
  console.log(`Añadiendo ${uniqueParasitosCards.length} nuevas flashcards de parásitos`);
  console.log(`Añadiendo ${uniqueHongosCards.length} nuevas flashcards de hongos`);
  
  // Combinamos todas las flashcards: las existentes, parásitos y hongos
  return [...existingCards, ...uniqueParasitosCards, ...uniqueHongosCards];
}