import { v4 as uuidv4 } from 'uuid';
import { Flashcard } from '@/data/flashcards';
import { findClassificationCode } from './classificationCodes';
import { bacteriasData } from './bacteriasData';
import { convertirBacteriasAFlashcards, combinarFlashcardsSinDuplicados } from './bacteriasImporter';

// Definir la estructura de datos del archivo JSON de patógenos
interface PatogenosData {
  bacterias: string[];
  virus_adn: string[];
  virus_arn: string[];
  parasitos: string[];
  hongos: string[];
}

// Datos de patógenos directamente en el código
const patogenosData: PatogenosData = {
  "bacterias": [
    // Mantenemos estos strings por compatibilidad con el código que los procesa
    // pero en realidad usaremos el dataset completo de bacteriasData
    "Estafilococo dorado A1",
    "Estafilococo albus A2",
    "Neumococo A3",
    "Streptococo Beta hemolítico A4",
    "Estreptococo fragilis A5",
    "Estreptococo faecalis A6",
    "Estreptococo alfa A7",
    "Estreptococo G A8",
    "Estreptococo C A9",
    "Estreptococo B agalactie A10",
    "Bacilo antráx A11",
    "Bacilo de Klebs-löffler (Difteria) A12",
    "Listeria A13",
    "Neisseria catarrhalis A14",
    "Gonococo, gonorrea A15",
    "Meningococo A16",
    "Campylobacter A17",
    "Enterobacter cloacae A18",
    "Escherichia Coli A19",
    "Helicobacter Pylori A20",
    "Klebsiella A21",
    "Proteus A22",
    "Salmonella A23",
    "Shigella A24",
    "Vibrio Cholerae. Bacilo del Cólera A25",
    "Yersinia A26",
    "Bacilo de la Tos ferina A27",
    "Pseudomona aeruginosa A28",
    "Haemophilus influenzae A29",
    "Pasteurella A30",
    "Brucella A31",
    "Coxiella A32",
    "Clamidia A33",
    "Borrelia A34",
    "Leptospira A35",
    "Treponema pallidum A36",
    "Ricketisia A37",
    "Legionella A38",
    "Micoplasma A39",
    "Bacilo de la Tuberculosis A40",
    "Bacilo de la Lepra A41",
    "Gardenerella A42",
    "Clostridium tetani A43",
    "Clostridium malignun A44",
    "Clostridium perfringes A45",
    "Clostridium leptum A46",
    "Clostridium histolyticum A47",
    "Fusobacterium A48",
    "Prevotella A49",
    "Tifo exantemático A50",
    "Morganella tifo A51",
    "Veionella A52"
  ],
  "virus_adn": [
    "Virus de la viruela B1",
    "Vaccinia B2",
    "Virus Orf B3",
    "Herpes simple tipo 1 B4",
    "Herpes simple tipo 2 B5",
    "Virus de la varicela zoster B6",
    "Citomegalovirus humano B7",
    "Herpesvirus humano tipo 6 B8",
    "Herpesvirus humano tipo 7 B9",
    "Virus Epstein-Barr B10",
    "Herpesvirus humano tipo 8 B11",
    "Adenovirus B12",
    "Virus del Papiloma B13",
    "Virus de la verruga común (papilomavirus) B14",
    "Virus JC (virus del polioma) B15",
    "Virus BK (virus del polioma) B16",
    "Virus de la hepatitis B B17",
    "Parvovirus B19 B18"
  ],
  "virus_arn": [
    "Virus de la rabia B19",
    "Influenza B20",
    "Virus de la Aftosa (coxsackie) B21",
    "Rubéola B22",
    "VIH 1 B23",
    "Pleuritis viral (coxsackie) B24",
    "Sarampión B25",
    "Catarro común B26",
    "Virus del Nilo B27",
    "Virus del dengue B28",
    "Virus de la encefalitis B29",
    "Sinusitis viral (rinovirus) B30",
    "Rotavirus B31",
    "Virus Newcastle B32",
    "Virus Guiliam barre B33",
    "Virus del dengue hemorrágico B34",
    "Enterovirus B35",
    "Meningitis viral B36",
    "Coronavirus B37",
    "HTLV 1 B38",
    "Virus Norwalk B39",
    "HTLV 2 B40",
    "Virus de la parotiditis B41",
    "Virus de la polio B42",
    "HTLV 4 B43",
    "VIH 2 B44",
    "Virus del Ebola B45",
    "Virus Zika B46",
    "Hanta virus B47",
    "Virus H1N7 B48",
    "Virus Chikunguña B49"
  ],
  "parasitos": [
    "Toxoplasma gondii C1",
    "Plasmodium C2",
    "Entamoeba histolytica C3",
    "Sarcoptes scabiei C4",
    "Filaria C5",
    "Blastocystis hominis C6",
    "Balantidium Coli C7",
    "Trypanosoma Cruzi C8",
    "Fasciolopsis Buski C9",
    "Enterobius vermicularis C10",
    "Trichinella spiralis C11",
    "Trichomonas C12",
    "Schistosoma C13",
    "Parásitos intestinales C14",
    "Babesia C15",
    "Trypanosoma Gambiense C16",
    "Onchocerca volvulus C17",
    "Leishmania C18",
    "Giardia lamblia C19"
  ],
  "hongos": [
    "Aspergillus D1",
    "Cryptococcus neoformans D2",
    "Coccidioides immitis D3",
    "Histoplasma capsulatum D4",
    "Candida albicans D5",
    "Trichophyton D6",
    "Pneumocystis carinii D7",
    "Actinomyces D8",
    "Micelio intestinal D9",
    "Microsporum canis D10",
    "Malassezia furfur D11"
  ]
};

// Función para extraer el código de clasificación del nombre de un patógeno
const extractClassificationCode = (name: string): string | undefined => {
  // Busca patrones como "A1", "B23", "C5", "D11" al final del nombre
  const match = name.match(/([ABCD]\d+)$/);
  return match ? match[1] : undefined;
};

// Función para generar características básicas para un patógeno
const generateBasicInfo = (name: string, category: string): {
  scientificName: string;
  characteristics: string;
  conflictBasis: string;
  notes: string;
  codeMapping: Record<string, any>;
} => {
  // Extraer el nombre científico basado en convenciones comunes
  let scientificName = name.split(' ').slice(0, 2).join(' ');
  
  // Para virus, simplificar
  if (category.includes('virus')) {
    scientificName = name;
  }
  
  // Características genéricas basadas en categoría
  let characteristics = '';
  let conflictBasis = '';
  let notes = '';
  let codeMapping: Record<string, any> = {};
  
  switch (category) {
    case 'bacteria':
      characteristics = `Bacteria que puede causar diversas infecciones en humanos. Requiere condiciones específicas para su crecimiento y proliferación.`;
      conflictBasis = `Puede producir toxinas que dañan los tejidos y desencadenan respuestas inflamatorias. Algunos tipos desarrollan resistencia a antibióticos.`;
      notes = `Importante mantener medidas de higiene apropiadas para prevenir su propagación. El tratamiento depende de la sensibilidad antibiótica.`;
      codeMapping = {
        type: 'bacteria',
        gramStain: 'variable',
        habitat: 'human_host'
      };
      break;
    case 'virus_adn':
      characteristics = `Virus con ADN como material genético. Infecta células huésped para replicarse utilizando la maquinaria celular del hospedador.`;
      conflictBasis = `Puede causar enfermedades con capacidad de integrar su material genético en el ADN del huésped, potencialmente llevando a infecciones latentes o persistentes.`;
      notes = `La respuesta inmune celular es crucial para controlar estas infecciones. Algunos tienen potencial oncogénico.`;
      codeMapping = {
        type: 'virus',
        genomeType: 'dna',
        structure: 'variable'
      };
      break;
    case 'virus_arn':
      characteristics = `Virus con ARN como material genético. Muestra alta tasa de mutación debido a la falta de mecanismos de corrección durante la replicación.`;
      conflictBasis = `Causa diversas enfermedades humanas y su alta variabilidad genética dificulta el desarrollo de vacunas y tratamientos efectivos.`;
      notes = `La respuesta inmune humoral es importante para neutralizar estos virus. Algunos persisten crónicamente en el organismo.`;
      codeMapping = {
        type: 'virus',
        genomeType: 'rna',
        structure: 'variable'
      };
      break;
    case 'parasito':
    case 'parasitos':
      characteristics = `Organismo que vive a expensas de otro, causando daño al huésped. Presentan ciclos de vida complejos, a menudo con diferentes estadios de desarrollo.`;
      conflictBasis = `Pueden causar enfermedades al competir por nutrientes, destruir tejidos o generar respuestas inmunes exageradas.`;
      notes = `El diagnóstico suele requerir identificación microscópica. Los tratamientos son específicos para cada tipo de parásito.`;
      codeMapping = {
        type: 'parasite',
        lifecycle: 'complex',
        habitat: 'human_tissues'
      };
      break;
    case 'hongo':
    case 'hongos':
      characteristics = `Organismo eucariota que puede crecer como levadura o como hongo filamentoso (moho). Puede ser saprofito o parásito.`;
      conflictBasis = `Causa micosis que pueden ser superficiales, subcutáneas o sistémicas. Algunas especies producen micotoxinas dañinas.`;
      notes = `Las infecciones fúngicas invasivas son particularmente problemáticas en pacientes inmunocomprometidos.`;
      codeMapping = {
        type: 'fungus',
        morphology: 'variable',
        habitat: 'environmental'
      };
      break;
    default:
      characteristics = `Patógeno con características específicas que afectan al huésped humano de diversas maneras.`;
      conflictBasis = `Puede causar enfermedades a través de diversos mecanismos patogénicos.`;
      notes = `El diagnóstico y tratamiento dependen de las manifestaciones clínicas y la identificación del agente.`;
      codeMapping = {
        type: 'pathogen'
      };
  }
  
  return {
    scientificName,
    characteristics,
    conflictBasis,
    notes,
    codeMapping
  };
};

// Función para generar flashcards a partir de los datos de patógenos
export function generateFlashcardsFromPatogenosData(): Flashcard[] {
  const flashcards: Flashcard[] = [];
  
  // Procesar bacterias
  if (patogenosData.bacterias && Array.isArray(patogenosData.bacterias)) {
    patogenosData.bacterias.forEach((item: string) => {
      const classificationCode = extractClassificationCode(item);
      const cleanName = item.replace(/\s+[ABCD]\d+$/, '').trim();
      
      const { scientificName, characteristics, conflictBasis, notes, codeMapping } = 
        generateBasicInfo(cleanName, 'bacteria');
      
      flashcards.push({
        id: `${classificationCode || 'BACT'}-${uuidv4().substring(0, 8)}`,
        category: 'bacteria',
        name: cleanName,
        scientificName,
        characteristics,
        conflictBasis,
        notes,
        codeMapping,
        classificationCode,
        isFavorite: false
      });
    });
  }
  
  // Procesar virus ADN
  if (patogenosData.virus_adn && Array.isArray(patogenosData.virus_adn)) {
    patogenosData.virus_adn.forEach((item: string) => {
      const classificationCode = extractClassificationCode(item);
      const cleanName = item.replace(/\s+[ABCD]\d+$/, '').trim();
      
      const { scientificName, characteristics, conflictBasis, notes, codeMapping } = 
        generateBasicInfo(cleanName, 'virus_adn');
      
      flashcards.push({
        id: `${classificationCode || 'VADN'}-${uuidv4().substring(0, 8)}`,
        category: 'virus_adn',
        name: cleanName,
        scientificName,
        characteristics,
        conflictBasis,
        notes,
        codeMapping,
        classificationCode,
        isFavorite: false
      });
    });
  }
  
  // Procesar virus ARN
  if (patogenosData.virus_arn && Array.isArray(patogenosData.virus_arn)) {
    patogenosData.virus_arn.forEach((item: string) => {
      const classificationCode = extractClassificationCode(item);
      const cleanName = item.replace(/\s+[ABCD]\d+$/, '').trim();
      
      const { scientificName, characteristics, conflictBasis, notes, codeMapping } = 
        generateBasicInfo(cleanName, 'virus_arn');
      
      flashcards.push({
        id: `${classificationCode || 'VARN'}-${uuidv4().substring(0, 8)}`,
        category: 'virus_arn',
        name: cleanName,
        scientificName,
        characteristics,
        conflictBasis,
        notes,
        codeMapping,
        classificationCode,
        isFavorite: false
      });
    });
  }
  
  // Procesar parásitos
  if (patogenosData.parasitos && Array.isArray(patogenosData.parasitos)) {
    patogenosData.parasitos.forEach((item: string) => {
      const classificationCode = extractClassificationCode(item);
      const cleanName = item.replace(/\s+[ABCD]\d+$/, '').trim();
      
      const { scientificName, characteristics, conflictBasis, notes, codeMapping } = 
        generateBasicInfo(cleanName, 'parasito');
      
      flashcards.push({
        id: `${classificationCode || 'PARA'}-${uuidv4().substring(0, 8)}`,
        category: 'parasito',
        name: cleanName,
        scientificName,
        characteristics,
        conflictBasis,
        notes,
        codeMapping,
        classificationCode,
        isFavorite: false
      });
    });
  }
  
  // Procesar hongos
  if (patogenosData.hongos && Array.isArray(patogenosData.hongos)) {
    patogenosData.hongos.forEach((item: string) => {
      const classificationCode = extractClassificationCode(item);
      const cleanName = item.replace(/\s+[ABCD]\d+$/, '').trim();
      
      const { scientificName, characteristics, conflictBasis, notes, codeMapping } = 
        generateBasicInfo(cleanName, 'hongo');
      
      flashcards.push({
        id: `${classificationCode || 'HONG'}-${uuidv4().substring(0, 8)}`,
        category: 'hongo',
        name: cleanName,
        scientificName,
        characteristics,
        conflictBasis,
        notes,
        codeMapping,
        classificationCode,
        isFavorite: false
      });
    });
  }
  
  return flashcards;
}

// Función para inicializar las flashcards (primera vez o cuando no hay datos en localStorage)
export function initializeFlashcards(): Flashcard[] {
  const storedFlashcards = localStorage.getItem('flashcards');
  
  // Si ya hay flashcards almacenadas, devolverlas
  if (storedFlashcards) {
    try {
      const parsedFlashcards = JSON.parse(storedFlashcards);
      return parsedFlashcards;
    } catch (error) {
      console.error("Error parsing stored flashcards:", error);
      // Si hay error al parsear, generar nuevas
      return generateFlashcardsFromPatogenosData();
    }
  }
  
  // Si no hay flashcards almacenadas, generar nuevas
  const newFlashcards = generateFlashcardsFromPatogenosData();
  localStorage.setItem('flashcards', JSON.stringify(newFlashcards));
  return newFlashcards;
}

// Exportar la función principal
export default initializeFlashcards;