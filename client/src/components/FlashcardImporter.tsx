import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useFlashcards } from '@/context/FlashcardContext';
import type { Flashcard } from '@/data/flashcards';

interface PatogenData {
  bacterias?: string[];
  virus_adn?: string[];
  virus_arn?: string[];
  parasitos?: string[];
  hongos?: string[];
}

const FlashcardImporter: React.FC = () => {
  const { toast } = useToast();
  const { flashcards } = useFlashcards();
  const [importing, setImporting] = useState(false);
  
  // Función para extraer el código de clasificación del nombre
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
  
  // Procesar datos para convertirlos en flashcards
  const processPatogenData = (data: PatogenData): Flashcard[] => {
    const newFlashcards: Flashcard[] = [];
    
    // Obtener códigos existentes para evitar duplicados
    const existingCodes = new Set(
      flashcards
        .filter(card => card.classificationCode)
        .map(card => card.classificationCode)
    );
    
    // Procesar cada categoría
    Object.entries(data).forEach(([categoryRaw, items]) => {
      if (!items || !Array.isArray(items)) return;
      
      const category = categoryRaw === "bacterias" ? "bacteria" : 
                      categoryRaw === "hongos" ? "hongo" : 
                      categoryRaw;
      
      items.forEach(item => {
        // Extraer el código de clasificación y limpiar el nombre
        const classificationCode = extractClassificationCode(item);
        
        // Verificar si ya existe
        if (classificationCode && existingCodes.has(classificationCode)) {
          console.log(`Saltando tarjeta con código ${classificationCode}, ya existe`);
          return;
        }
        
        const cleanName = item.replace(/\s+[ABCD]\d+$/, '').trim();
        
        // Generar información básica
        const { scientificName, characteristics, conflictBasis, notes, codeMapping } = generateBasicInfo(cleanName, category);
        
        // Crear la nueva flashcard
        const newFlashcard: Flashcard = {
          // Generar un ID único para cada tarjeta
          id: `${classificationCode || 'NEW'}-${uuidv4().substring(0, 8)}`,
          category,
          name: cleanName,
          scientificName,
          characteristics,
          conflictBasis,
          notes,
          codeMapping,
          classificationCode,
          isFavorite: false
        };
        
        newFlashcards.push(newFlashcard);
      });
    });
    
    return newFlashcards;
  };
  
  // Manejar la importación de un archivo JSON
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as PatogenData;
        
        const newFlashcards = processPatogenData(data);
        
        if (newFlashcards.length === 0) {
          toast({
            title: "No se encontraron nuevas tarjetas",
            description: "No hay tarjetas nuevas para importar o todas ya existen en la aplicación.",
            variant: "destructive"
          });
          setImporting(false);
          return;
        }
        
        // Guardar en localStorage
        const existingFlashcards = JSON.parse(localStorage.getItem('flashcards') || '[]');
        const updatedFlashcards = [...existingFlashcards, ...newFlashcards];
        localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
        
        toast({
          title: "Importación exitosa",
          description: `Se agregaron ${newFlashcards.length} nuevas tarjetas. Recarga la página para verlas.`,
          duration: 5000
        });
        
        // Recargar la página para mostrar las nuevas tarjetas
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error al importar:", error);
        toast({
          title: "Error al importar",
          description: "El archivo seleccionado no es válido.",
          variant: "destructive"
        });
      } finally {
        setImporting(false);
      }
    };
    
    reader.readAsText(file);
  };
  
  // Generar y descargar un archivo JSON de ejemplo
  const handleDownloadExample = () => {
    const jsonData = JSON.stringify({
      "bacterias": [
        "Estafilococo dorado A1",
        "Estafilococo albus A2",
        "Neumococo A3"
      ],
      "virus_adn": [
        "Virus de la viruela B1",
        "Vaccinia B2",
        "Virus Orf B3"
      ],
      "virus_arn": [
        "Virus de la rabia B19",
        "Influenza B20",
        "Virus de la Aftosa (coxsackie) B21"
      ],
      "parasitos": [
        "Toxoplasma gondii C1",
        "Plasmodium C2",
        "Entamoeba histolytica C3"
      ],
      "hongos": [
        "Aspergillus D1",
        "Cryptococcus neoformans D2",
        "Coccidioides immitis D3"
      ]
    }, null, 2);
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patogenos_ejemplo.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Ejemplo descargado",
      description: "Se ha descargado un archivo JSON de ejemplo con patógenos que puedes editar y luego importar.",
      duration: 3000,
    });
  };
  
  return (
    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 mb-4">
      <h3 className="text-lg font-medium mb-2">Importar Nuevas Tarjetas</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Selecciona un archivo JSON con los datos de nuevos patógenos para agregarlos a tu colección de flashcards.
      </p>
      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="file-upload"
          disabled={importing}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {importing ? "Importando..." : "Seleccionar Archivo"}
        </label>
        
        <button
          onClick={handleDownloadExample}
          className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Descargar Ejemplo
        </button>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 md:mt-0">
          Formato requerido: JSON con categorías (bacterias, virus_adn, virus_arn, parasitos, hongos)
        </p>
      </div>
    </div>
  );
};

export default FlashcardImporter;