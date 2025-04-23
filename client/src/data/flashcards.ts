export interface Flashcard {
  id: string;
  category: string;
  name: string;
  scientificName: string;
  characteristics: string;
  conflictBasis: string;
  notes: string;
  codeMapping: Record<string, any>;
  classificationCode?: string; // Código de clasificación de Centro Bioenergética (A1, B1, C1, D1, etc.)
  isFavorite: boolean;
  studied?: boolean;
}

export interface StudyStats {
  studied: number;
  mastered: number;
  sessions: number;
  lastSession: string | null;
  addedThisWeek: number;
  dailyProgress: number[];
}

export interface RecentActivity {
  type: 'completed' | 'favorite' | 'started';
  title: string;
  description: string;
  timestamp: string;
}

const flashcards: Flashcard[] = [
  // Bacteria
  {
    id: "B1",
    category: "bacteria",
    name: "Escherichia coli",
    scientificName: "E. coli",
    characteristics: "Gram-negative, facultative anaerobic, rod-shaped bacterium. Common inhabitant of the gastrointestinal tract of warm-blooded organisms.",
    conflictBasis: "Some strains can cause food poisoning, urinary tract infections, and neonatal meningitis. Produces endotoxins that can lead to severe inflammatory response.",
    notes: "Most E. coli strains are harmless and are part of the normal gut microbiota. Pathogenic strains acquire virulence factors through horizontal gene transfer.",
    codeMapping: {
      metabolicType: "facultative_anaerobe",
      cellWall: "gram_negative"
    },
    classificationCode: "A19", // Código según Centrobioenergetica
    isFavorite: true
  },
  {
    id: "B2",
    category: "bacteria",
    name: "Staphylococcus aureus",
    scientificName: "S. aureus",
    characteristics: "Gram-positive, facultative anaerobic, spherical bacterium that forms grape-like clusters. Common member of the skin microbiota.",
    conflictBasis: "Causes skin infections, respiratory infections, food poisoning, and toxic shock syndrome. Some strains are antibiotic-resistant (MRSA).",
    notes: "Produces various toxins including enterotoxins, exfoliative toxins, and toxic shock syndrome toxin (TSST). Forms biofilms on medical devices.",
    codeMapping: {
      metabolicType: "facultative_anaerobe",
      cellWall: "gram_positive"
    },
    classificationCode: "A1", // Código según Centrobioenergetica
    isFavorite: false
  },
  {
    id: "B3",
    category: "bacteria",
    name: "Mycobacterium tuberculosis",
    scientificName: "M. tuberculosis",
    characteristics: "Slow-growing, aerobic, non-motile, non-spore-forming, acid-fast bacilli. Has a unique cell wall with high lipid content.",
    conflictBasis: "Causes tuberculosis (TB), primarily affecting the lungs but can spread to other organs. Transmitted through respiratory droplets.",
    notes: "Can remain dormant for years in a latent TB infection. Requires extended treatment with multiple antibiotics due to drug resistance issues.",
    codeMapping: {
      metabolicType: "obligate_aerobe",
      cellWall: "acid_fast"
    },
    isFavorite: false
  },
  {
    id: "B4",
    category: "bacteria",
    name: "Clostridium tetani",
    scientificName: "C. tetani",
    characteristics: "Gram-positive, obligate anaerobic, spore-forming rod. Spores are highly resistant to heat and antiseptics.",
    conflictBasis: "Produces tetanospasmin, a potent neurotoxin that causes tetanus. Enters the body through wounds contaminated with soil, dust, or animal feces.",
    notes: "The tetanus toxin blocks inhibitory neurotransmitters in the CNS, resulting in muscle spasms and rigidity. Preventable through vaccination.",
    codeMapping: {
      metabolicType: "obligate_anaerobe",
      cellWall: "gram_positive",
      toxinProduction: "tetanospasmin"
    },
    isFavorite: false
  },
  {
    id: "B5",
    category: "bacteria",
    name: "Helicobacter pylori",
    scientificName: "H. pylori",
    characteristics: "Gram-negative, microaerophilic, spiral-shaped bacterium with multiple flagella. Produces urease to neutralize stomach acid.",
    conflictBasis: "Associated with gastritis, peptic ulcers, and gastric cancer. Colonizes the gastric mucosa and triggers inflammatory responses.",
    notes: "Can persist in the stomach for decades if untreated. Transmitted primarily through oral-oral or fecal-oral routes within families.",
    codeMapping: {
      metabolicType: "microaerophile",
      cellWall: "gram_negative",
      enzymeProduction: "urease"
    },
    classificationCode: "A20", // Código según Centrobioenergetica
    isFavorite: false
  },
  
  // Virus ADN
  {
    id: "VA1",
    category: "virus_adn",
    name: "Human Papillomavirus",
    scientificName: "HPV",
    characteristics: "Non-enveloped, double-stranded DNA virus from the Papillomaviridae family. Over 200 types identified.",
    conflictBasis: "High-risk types (16, 18) cause cervical, anal, and oropharyngeal cancers. Low-risk types cause genital warts and respiratory papillomatosis.",
    notes: "Vaccines are available against high-risk types. Persistent infections with high-risk HPV types are necessary for cancer development.",
    codeMapping: {
      genomeType: "dsDNA",
      envelope: "non_enveloped",
      oncogenic: "high_risk_types"
    },
    classificationCode: "B5", // Código según Centrobioenergetica
    isFavorite: false
  },
  {
    id: "VA2",
    category: "virus_adn",
    name: "Hepatitis B Virus",
    scientificName: "HBV",
    characteristics: "Partially double-stranded DNA virus from the Hepadnaviridae family. Replicates through an RNA intermediate using reverse transcriptase.",
    conflictBasis: "Causes acute and chronic hepatitis, cirrhosis, and hepatocellular carcinoma. Transmitted through blood, sexual contact, and perinatal routes.",
    notes: "Preventable through vaccination. Chronic infection develops in 90% of infants, 30% of children, and less than 5% of adults infected.",
    codeMapping: {
      genomeType: "partial_dsDNA",
      envelope: "enveloped",
      replication: "reverse_transcription"
    },
    classificationCode: "B3", // Código según Centrobioenergetica
    isFavorite: true
  },
  {
    id: "VA3",
    category: "virus_adn",
    name: "Herpes Simplex Virus",
    scientificName: "HSV",
    characteristics: "Double-stranded DNA virus from the Herpesviridae family. Two main types: HSV-1 (oral) and HSV-2 (genital).",
    conflictBasis: "Causes recurrent mucocutaneous lesions, keratitis, and potentially encephalitis. Establishes latency in sensory ganglia.",
    notes: "Remains dormant in nerve cells and can reactivate periodically. HSV-1 is increasingly causing genital herpes due to oral-genital contact.",
    codeMapping: {
      genomeType: "dsDNA",
      envelope: "enveloped",
      latency: "neuronal"
    },
    isFavorite: false
  },
  {
    id: "VA4",
    category: "virus_adn",
    name: "Smallpox Virus",
    scientificName: "Variola virus",
    characteristics: "Large, brick-shaped, double-stranded DNA virus from the Poxviridae family. Two variants: Variola major and Variola minor.",
    conflictBasis: "Caused smallpox, a severe disease with high mortality (30% for Variola major). Now eradicated globally.",
    notes: "The only human infectious disease to be eradicated globally through vaccination. Last natural case was in 1977 in Somalia.",
    codeMapping: {
      genomeType: "dsDNA",
      envelope: "enveloped",
      replication: "cytoplasmic"
    },
    isFavorite: false
  },
  
  // Virus ARN
  {
    id: "VR1",
    category: "virus_arn",
    name: "HIV",
    scientificName: "Human Immunodeficiency Virus",
    characteristics: "Enveloped, single-stranded RNA retrovirus. Two types: HIV-1 (globally prevalent) and HIV-2 (mainly West Africa).",
    conflictBasis: "Causes AIDS by targeting CD4+ T cells, leading to immunodeficiency. Transmitted through blood, sexual contact, and perinatal routes.",
    notes: "Uses reverse transcriptase to convert RNA to DNA, which integrates into host genome. Antiretroviral therapy suppresses viral replication but doesn't eliminate latent virus.",
    codeMapping: {
      genomeType: "ssRNA_positive",
      envelope: "enveloped",
      replication: "reverse_transcription",
      targetCells: "CD4_T_cells"
    },
    classificationCode: "C2", // Código según Centrobioenergetica
    isFavorite: false
  },
  {
    id: "VR2",
    category: "virus_arn",
    name: "Influenza Virus",
    scientificName: "Influenza A, B, C, D",
    characteristics: "Segmented, negative-sense, single-stranded RNA virus from the Orthomyxoviridae family. Influenza A undergoes antigenic shift and drift.",
    conflictBasis: "Causes seasonal influenza and potentially pandemic flu. Infects respiratory epithelium, leading to inflammation and cell death.",
    notes: "Influenza A subtypes are named based on hemagglutinin (H) and neuraminidase (N) proteins. Birds are the natural reservoir for many influenza A viruses.",
    codeMapping: {
      genomeType: "ssRNA_negative_segmented",
      envelope: "enveloped",
      antigenic: "variable",
      targetTissue: "respiratory"
    },
    isFavorite: false
  },
  {
    id: "VR3",
    category: "virus_arn",
    name: "SARS-CoV-2",
    scientificName: "Severe acute respiratory syndrome coronavirus 2",
    characteristics: "Enveloped, positive-sense, single-stranded RNA virus from the Coronaviridae family. Contains spike glycoproteins on the surface.",
    conflictBasis: "Causes COVID-19, primarily affecting the respiratory system but can affect multiple organs. Ranges from asymptomatic to severe disease.",
    notes: "Uses ACE2 receptor for cell entry. Multiple variants have emerged with increased transmissibility or immune evasion properties.",
    codeMapping: {
      genomeType: "ssRNA_positive",
      envelope: "enveloped",
      receptor: "ACE2",
      targetTissue: "respiratory_multiple"
    },
    isFavorite: false
  },
  {
    id: "VR4",
    category: "virus_arn",
    name: "Rotavirus",
    scientificName: "Rotavirus A-E",
    characteristics: "Non-enveloped, double-stranded RNA virus with a distinctive wheel-like appearance (rota means wheel in Latin).",
    conflictBasis: "Leading cause of severe diarrhea in infants and young children globally. Infects enterocytes in the small intestine.",
    notes: "Vaccines have dramatically reduced rotavirus infections in countries with routine vaccination. Transmitted through the fecal-oral route.",
    codeMapping: {
      genomeType: "dsRNA_segmented",
      envelope: "non_enveloped",
      targetTissue: "intestinal",
      transmission: "fecal_oral"
    },
    isFavorite: false
  },
  
  // Parasitos
  {
    id: "P1",
    category: "parasito",
    name: "Plasmodium falciparum",
    scientificName: "P. falciparum",
    characteristics: "Protozoan parasite that causes the most severe form of malaria. Has a complex life cycle between mosquito and human hosts.",
    conflictBasis: "Infects red blood cells and the liver. Causes severe malaria with complications like cerebral malaria, respiratory distress, and organ failure.",
    notes: "Transmitted by female Anopheles mosquitoes. Has developed resistance to multiple antimalarial drugs, complicating treatment.",
    codeMapping: {
      type: "protozoan",
      lifecycle: "complex",
      vector: "anopheles_mosquito",
      targetCells: "erythrocytes_hepatocytes"
    },
    classificationCode: "D8", // Código según Centrobioenergetica
    isFavorite: true
  },
  {
    id: "P2",
    category: "parasito",
    name: "Taenia solium",
    scientificName: "T. solium",
    characteristics: "Tapeworm with a segmented body that can reach several meters in length. Has both an intestinal form and a tissue form (cysticercus).",
    conflictBasis: "Adult worms in the intestine cause taeniasis. Larval cysts in tissues cause cysticercosis, which can lead to neurocysticercosis if they affect the brain.",
    notes: "Humans acquire taeniasis by eating undercooked pork containing cysticerci. Cysticercosis occurs by ingesting tapeworm eggs, usually through fecal-oral transmission.",
    codeMapping: {
      type: "helminth_cestode",
      lifecycle: "indirect",
      intermediateHost: "pig",
      tissue: "intestine_various_tissues"
    },
    isFavorite: false
  },
  {
    id: "P3",
    category: "parasito",
    name: "Trypanosoma cruzi",
    scientificName: "T. cruzi",
    characteristics: "Flagellated protozoan parasite with different morphological forms during its life cycle (trypomastigote, amastigote, epimastigote).",
    conflictBasis: "Causes Chagas disease, affecting the heart, digestive, and nervous systems. Acute phase may be mild, but chronic phase leads to cardiomyopathy and megasyndromes.",
    notes: "Transmitted by triatomine bugs (kissing bugs) through fecal contamination of the bite wound or mucous membranes. Can also be transmitted through blood transfusion, organ transplantation, and congenitally.",
    codeMapping: {
      type: "protozoan_kinetoplastid",
      lifecycle: "complex",
      vector: "triatomine_bug",
      targetTissues: "cardiac_digestive_nervous"
    },
    isFavorite: false
  },
  {
    id: "P4",
    category: "parasito",
    name: "Schistosoma mansoni",
    scientificName: "S. mansoni",
    characteristics: "Blood fluke with separate male and female forms. Adult worms live in blood vessels of the intestine.",
    conflictBasis: "Causes intestinal schistosomiasis. Eggs trapped in tissues trigger inflammatory responses, leading to granuloma formation and fibrosis.",
    notes: "Transmitted through freshwater snails. Infective larvae (cercariae) penetrate human skin during water contact. Preventable through improved sanitation and treatment of infected individuals.",
    codeMapping: {
      type: "helminth_trematode",
      lifecycle: "indirect",
      intermediateHost: "freshwater_snail",
      targetTissue: "intestinal_venules"
    },
    isFavorite: false
  },
  
  // Hongos
  {
    id: "H1",
    category: "hongo",
    name: "Candida albicans",
    scientificName: "C. albicans",
    characteristics: "Dimorphic fungus that can exist as yeast or filamentous forms. Common commensal organism in the oral cavity, gastrointestinal tract, and vagina.",
    conflictBasis: "Causes candidiasis ranging from superficial mucosal infections to invasive candidiasis in immunocompromised hosts.",
    notes: "Overgrowth occurs when normal microbiota is disrupted or when immune defenses are compromised. Forms biofilms on medical devices, contributing to nosocomial infections.",
    codeMapping: {
      type: "yeast",
      morphology: "dimorphic",
      status: "commensal_opportunistic",
      targetTissues: "mucosal_systemic"
    },
    classificationCode: "E4", // Código según Centrobioenergetica
    isFavorite: false
  },
  {
    id: "H2",
    category: "hongo",
    name: "Aspergillus fumigatus",
    scientificName: "A. fumigatus",
    characteristics: "Filamentous fungus with septate hyphae and airborne conidia. Ubiquitous in the environment, particularly in decaying organic matter.",
    conflictBasis: "Causes aspergillosis, including allergic bronchopulmonary aspergillosis, aspergilloma, and invasive aspergillosis in immunocompromised patients.",
    notes: "Thermotolerant, can grow at body temperature. Small conidia size allows penetration into alveoli. Produces several virulence factors including gliotoxin.",
    codeMapping: {
      type: "mold",
      morphology: "filamentous",
      reproduction: "asexual_conidia",
      targetTissue: "primarily_respiratory"
    },
    isFavorite: false
  },
  {
    id: "H3",
    category: "hongo",
    name: "Cryptococcus neoformans",
    scientificName: "C. neoformans",
    characteristics: "Encapsulated yeast found in soil enriched with bird droppings, particularly pigeons. Has a polysaccharide capsule that inhibits phagocytosis.",
    conflictBasis: "Causes cryptococcosis, primarily cryptococcal meningitis. Particularly significant in HIV-infected individuals.",
    notes: "Infection occurs through inhalation of desiccated yeast cells or spores. Can disseminate to the central nervous system, showing neurotropism.",
    codeMapping: {
      type: "yeast",
      virulenceFactor: "polysaccharide_capsule",
      enzyme: "laccase",
      targetTissue: "pulmonary_cns"
    },
    isFavorite: false
  }
];

export default flashcards;
