import { v4 as uuidv4 } from 'uuid';
import { Flashcard } from '@/data/flashcards';
import virusAdnJson from './virus.json';
import virusArnJson from './arn.json';

/**
 * Procesa un objeto de virus individual y lo convierte en una Flashcard
 */
function processVirusData(virus: any, processedCodes: Set<string>): Flashcard | null {
  // Extraer datos del JSON
  const classificationCode = virus.id_referencia;
  
  // Verificamos si ya procesamos este virus para evitar duplicados
  if (processedCodes.has(classificationCode)) {
    return null; // Saltar esta entrada
  }
  
  // Marcamos el código como procesado
  processedCodes.add(classificationCode);
  
  const name = virus.nombre_comun;
  const scientificName = virus.nombre_cientifico || '';
  const tipo = virus.tipo || '';
  
  // Determinar la categoría basada en el tipo
  const category = tipo.toLowerCase().includes('adn') || tipo.toLowerCase().includes('dna') 
    ? 'virus_adn' 
    : tipo.toLowerCase().includes('arn') || tipo.toLowerCase().includes('rna') 
      ? 'virus_arn' 
      : 'virus_adn'; // Por defecto consideramos ADN si no está especificado
  
  // Construir la descripción
  let characteristics = virus.descripcion || '';
  if (virus.notas?.caracteristicas) {
    characteristics += `\n\n${virus.notas.caracteristicas}`;
  }
  if (virus.notas?.mecanismo) {
    characteristics += `\n\nMecanismo: ${virus.notas.mecanismo}`;
  }
  
  // Construir la base conflictual
  let conflictBasis = '';
  if (virus.conflicto_base?.etapa_ontogenica) {
    conflictBasis += `Etapa ontogénica: ${virus.conflicto_base.etapa_ontogenica}\n\n`;
  }
  if (virus.conflicto_base?.sensaciones) {
    conflictBasis += `Sensaciones: ${virus.conflicto_base.sensaciones}\n\n`;
  }
  if (virus.conflicto_base?.otros_conflictos) {
    conflictBasis += `Conflictos relacionados: ${virus.conflicto_base.otros_conflictos}\n\n`;
  }
  if (virus.conflicto_base?.notas_conflicto) {
    conflictBasis += `Notas del conflicto: ${virus.conflicto_base.notas_conflicto}`;
  }
  
  // Construir las notas
  let notes = '';
  
  // Procesar diferentes campos de notas
  const notasKeys = [
    'enfermedades_relacionadas', 
    'interacciones', 
    'familia_viral', 
    'presentacion', 
    'observacion', 
    'otros'
  ];
  
  for (const key of notasKeys) {
    if (virus.notas && virus.notas[key]) {
      notes += `${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}: ${virus.notas[key]}\n\n`;
    }
  }
  
  // Agregar códigos patógenos
  if (virus.codigo_patogeno && virus.codigo_patogeno.length > 0) {
    notes += `Localización patógena: ${virus.codigo_patogeno.join(', ')}`;
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
      type: 'virus',
      genomeType: category === 'virus_adn' ? 'dna' : 'rna',
      codigoPatogeno: virus.codigo_patogeno || []
    },
    classificationCode,
    isFavorite: false
  };
  
  return flashcard;
}

/**
 * Convierte los datos de virus del JSON al formato de Flashcard
 */
export function loadVirusFromJson(): { virusAdn: Flashcard[], virusArn: Flashcard[] } {
  try {
    console.log(`Cargando ${virusAdnJson.length} virus ADN y ${virusArnJson.length} virus ARN desde JSONs`);
    const virusAdnFlashcards: Flashcard[] = [];
    const virusArnFlashcards: Flashcard[] = [];
    
    // Creamos un Set para llevar control de los códigos de clasificación ya procesados
    const processedCodes = new Set<string>();
    
    // Procesar virus ADN
    virusAdnJson.forEach((virus: any) => {
      const flashcard = processVirusData(virus, processedCodes);
      if (flashcard) {
        virusAdnFlashcards.push(flashcard);
      }
    });
    
    // Procesar virus ARN
    virusArnJson.forEach((virus: any) => {
      const flashcard = processVirusData(virus, processedCodes);
      if (flashcard) {
        virusArnFlashcards.push(flashcard);
      }
    });
    
    console.log(`Se generaron ${virusAdnFlashcards.length} flashcards de virus ADN`);
    console.log(`Se generaron ${virusArnFlashcards.length} flashcards de virus ARN`);
    
    return { 
      virusAdn: virusAdnFlashcards, 
      virusArn: virusArnFlashcards 
    };
  } catch (error) {
    console.error("Error al cargar virus desde JSON:", error);
    return { 
      virusAdn: [], 
      virusArn: [] 
    };
  }
}

// Función para combinar flashcards sin duplicados
export function mergeVirusFlashcards(
  existingCards: Flashcard[], 
  virusAdnCards: Flashcard[],
  virusArnCards: Flashcard[]
): Flashcard[] {
  // Crear un Set con los códigos de clasificación existentes
  const existingCodes = new Set(
    existingCards
      .filter(card => card.classificationCode)
      .map(card => card.classificationCode)
  );
  
  // Filtrar los virus ADN para eliminar duplicados
  const uniqueVirusAdnCards = virusAdnCards.filter(
    card => !existingCodes.has(card.classificationCode || '')
  );
  
  // Filtrar los virus ARN para eliminar duplicados
  const uniqueVirusArnCards = virusArnCards.filter(
    card => !existingCodes.has(card.classificationCode || '')
  );
  
  console.log(`Añadiendo ${uniqueVirusAdnCards.length} nuevas flashcards de virus ADN`);
  console.log(`Añadiendo ${uniqueVirusArnCards.length} nuevas flashcards de virus ARN`);
  
  // Combinamos todas las flashcards: las existentes, virus ADN y virus ARN
  return [...existingCards, ...uniqueVirusAdnCards, ...uniqueVirusArnCards];
}