/**
 * Datos de bacterias extraídos del JSON
 */
export const bacteriasData = [
  {
    "nombre_comun": "Estafilococo dorado",
    "nombre_cientifico": "Staphylococcus aureus",
    "tipo": "Bacteria",
    "descripcion": "Grampositiva. Bacterias esféricas dispuestas en forma en racimos irregulares. Producen catalasa. Coagulasa positiva.",
    "id_referencia": "A1",
    "codigo_patogeno": [
      "Cabeza de páncreas - hígado",
      "Pericardio - pericardio",
      "Cabeza de páncreas - suprarrenales",
      "Apéndice - pleura"
    ],
    "conflicto_base": {
      "etapa_ontogenica": "1ª y 2ª etapa: Agresión a las corazas, activación del sistema de defensa, protección.",
      "sensaciones": "Vulnerabilidad, agresión, amenaza, rechazo, hostilidad, abandono, peligro en el nido. Indefenso, lastimado. El guardian de la integridad.",
      "otros_conflictos": "Conflictos relacionados con la madre."
    },
    "notas": {
      "toxinas": "Produce toxina estafilococcica, exotoxinas y enterotoxinas.",
      "enfermedades_relacionadas": "Infecciones de heridas en la piel, foliculitis, abscesos, acné, osteomielitis, impetigo, síndrome del shock tóxico, síndrome de la piel escaldada, endocarditis, neumonia, intoxicación alimentaria, náusea, vómito, diarrea, mastitis."
    }
  },
  {
    "nombre_comun": "Estafilococo albus",
    "nombre_cientifico": "Staphylococcus epidermidis",
    "tipo": "Bacteria",
    "descripcion": "Grampositiva. Bacterias esféricas dispuestas en forma en racimos irregulares. Producen catalasa. Coagulasa negativo.",
    "id_referencia": "A2",
    "codigo_patogeno": [
      "Epiplón - epiplón"
    ],
    "conflicto_base": {
      "etapa_ontogenica": "2ª etapa: Agresión a las corazas. Activación del sistema de defensa.",
      "sensaciones": "Agresión, ataque, vulnerabilidad, amenaza."
    },
    "notas": {
      "habitat": "Se le encuentra en abundancia en el microbioma normal de la piel.",
      "caracteristicas": "Puede generar biofilm y ser responsable de infecciones en implantes, catéteres.",
      "enfermedades_relacionadas": "Acné, infección de heridas en la piel."
    }
  },
  {
    "nombre_comun": "Neumococo",
    "nombre_cientifico": "Streptococcus pneumoniae",
    "tipo": "Bacteria",
    "descripcion": "Coco grampositivo encapsulado e inmovil. Tiene forma de lanceta y suele presentarse en parejas.",
    "id_referencia": "A3",
    "codigo_patogeno": [
      "Hueco poplíteo - hueco poplíteo"
    ],
    "conflicto_base": {
      "etapa_ontogenica": "1ª y 2ª etapa.",
      "sensaciones": "Miedo y vulnerabilidad. Miedo a morir. Miedo y susto en el territorio. Amenaza territorial. Sentirse solo y abandonado."
    },
    "notas": {
      "virulencia": "La cápsula es la estructura más externa y el principal factor de virulencia. Produce autolisina y neumolisina.",
      "enfermedades_relacionadas": "Neumonía, otitis media, meningitis, bacteremia/sepsis."
    }
  },
  {
    "nombre_comun": "Estreptococo Beta hemolítico",
    "nombre_cientifico": "Streptococcus pyogenes",
    "tipo": "Bacteria",
    "descripcion": "Coco grampositivo. Se presenta en forma de largas cadenas o individual. B- hemolitico del grupo A.",
    "id_referencia": "A4",
    "codigo_patogeno": [
      "Braquial - braquial",
      "Cardias - suprarrenales"
    ],
    "conflicto_base": {
      "etapa_ontogenica": "1ª etapa: Carencia.",
      "sensaciones": "Carencia afectiva, frustración, abandono, insatisfacción. Devaluación. Sensación infantil de rechazo e ignominia.",
      "otros_conflictos": "Dificutad para obtener el bocado (de alimento, de dinero, de afecto, de pertenencia). Se relaciona con conflictos con el padre."
    },
    "notas": {
      "caracteristicas": "Cápsula con ácido hialurónico idéntico al que se encuentra en el tejido conjuntivo humano. Produce estreptolisinas y estreptocinasa.",
      "enfermedades_relacionadas": "Faringitis, faringoamigdalitis, amigdalitis, impétigo, erisipela, sepsis puerperal, fiebre reumática, glomerulonefritis aguda, sindrome de shock tóxico, escarlatina."
    }
  },
  {
    "nombre_comun": "Estreptococo fragilis",
    "nombre_cientifico": "Streptococcus mutans",
    "tipo": "Bacteria",
    "descripcion": "Coco grampositivo. Se presenta en forma de cadenas.",
    "id_referencia": "A5",
    "codigo_patogeno": [
      "Ángulo de la mandíbula (gonion) - Ángulo de la mandíbula"
    ],
    "conflicto_base": {
      "etapa_ontogenica": "1ª etapa: Carencia.",
      "sensaciones": "Impotencia, insatisfacción, hambre.",
      "otros_conflictos": "Dificultad para morder u obtener el bocado esencial. Dificultad para expresar lo que se siente y lo que se piensa. Conflicto de no poder decir lo que se piensa. Ira reprimida."
    },
    "notas": {
      "habitat": "Se encuentra normalmente en la cavidad oral. Forma parte de la placa dental o biofilm dental. Metaboliza la sacarosa.",
      "enfermedades_relacionadas": "Caries, enfermedad periodontal, piorrea, gingivitis, abscesos dentales."
    }
  },
  {
    "nombre_comun": "Estreptococo faecalis",
    "nombre_cientifico": "Enterococcus faecalis",
    "tipo": "Bacteria",
    "descripcion": "Coco grampositivo.",
    "id_referencia": "A6",
    "codigo_patogeno": [
      "Plexo cervical - plexo cervical"
    ],
    "conflicto_base": {
      "etapa_ontogenica": "1ª etapa: Carencia y vulnerabilidad."
    },
    "notas": {
      "enfermedades_relacionadas": "Infecciones dentales. Bacteremia. Infecciones de la vejiga, próstata, epidídimo. Endocarditis."
    }
  },
  {
    "nombre_comun": "Estreptococo alfa",
    "nombre_cientifico": "Streptococcus viridans",
    "tipo": "Bacteria",
    "descripcion": "Coco grampositivo. Catalasa negativos.",
    "id_referencia": "A7",
    "codigo_patogeno": [
      "Coronarias - pulmón"
    ],
    "conflicto_base": {
      "otros_conflictos": "Conflicto de devaluación. Perdida del territorio.",
      "sensaciones": "Carencia, vulnerabilidad."
    },
    "notas": {
      "habitat": "Forman parte de la flora bucal facultativa.",
      "enfermedades_relacionadas": "Aterosclerosis, endocarditis, espondilitis, caries dental."
    }
  },
  {
    "nombre_comun": "Estreptococo G",
    "nombre_cientifico": "Streptococcus sp.",
    "tipo": "Bacteria",
    "descripcion": "Coco grampositivo.",
    "id_referencia": "A8",
    "codigo_patogeno": [
      "Vejiga - vejiga"
    ],
    "conflicto_base": {
      "otros_conflictos": "Conflicto territorial. Agresión territorial. Marcaje de territorio. No poder expresar la ira. Bloqueo al drenar la energía emocional.",
      "sensaciones": "Impotencia, agresión."
    },
    "notas": {
      "enfermedades_relacionadas": "Faringitis, faringoamigdalitis, rectitis."
    }
  },
  {
    "nombre_comun": "Estreptococo C",
    "nombre_cientifico": "Streptococcus sp.",
    "tipo": "Bacteria",
    "descripcion": "Coco grampositivo.",
    "id_referencia": "A9",
    "codigo_patogeno": [
      "Rama isquiatica - rama isquiatica"
    ],
    "conflicto_base": {
      "otros_conflictos": "Devaluación. He fallado. Me siento devaluado."
    },
    "notas": {
      "enfermedades_relacionadas": "Afecciones dentales, bacteriemia, erisipela."
    }
  },
  {
    "nombre_comun": "Estreptococo B agalactie",
    "nombre_cientifico": "Streptococcus sp.",
    "tipo": "Bacteria",
    "descripcion": "Coco grampositivo. B-hemolitico, catalasa negativo, oxidasa negativo.",
    "id_referencia": "A10",
    "codigo_patogeno": [
      "Ligamento externo de la rodilla - ligamento externo de la rodilla"
    ],
    "conflicto_base": {
      "otros_conflictos": "Conflicto de impotencia y devaluación. No podré desplegarme. He fallado.",
      "sensaciones": "Angustia, vacio, infelicidad."
    },
    "notas": {
      "enfermedades_relacionadas": "Infección de las membranas placentarias. Infección posparto. Infección del recien nacido. Bacteremia."
    }
  },
  // Agregamos más bacterias segúnt datos proporcionados
  {
    "nombre_comun": "Bacilo antráx",
    "nombre_cientifico": "Bacillus anthracis",
    "tipo": "Bacteria",
    "descripcion": "Bacilo grampositivo. Catalasa positivo.",
    "id_referencia": "A11",
    "codigo_patogeno": [
      "Craneal - craneal"
    ],
    "conflicto_base": {
      "otros_conflictos": "Conflicto de agresión territorial. Amenaza."
    },
    "notas": {
      "caracteristicas": "Hay 89 cepas conocidas, varian desde muy virulentas a formas benignas. Producen endosporas. Tiene dos factores de virulencia: Sustancia P y Factor B, estas proteinas estan codificadas por plasmidos. Ante circunstancias ambientales adversas la bacteria produce exotoxinas.",
      "enfermedades_relacionadas": "Carbunco."
    }
  },
  {
    "nombre_comun": "Bacilo de Klebs-löffler (Difteria)",
    "nombre_cientifico": "Corynebacterium diphtheriae",
    "tipo": "Bacteria",
    "descripcion": "Bacilo grampositivo. Catalasa positivo.",
    "id_referencia": "A12",
    "codigo_patogeno": [
      "Subclavio - subclavio"
    ],
    "conflicto_base": {
      "otros_conflictos": "Rechazo. Sentirse herido. No merecedor. Mi padre no se ocupará de mi. Ya no soy el preferido. Soledad y abandono. Separación del núcleo afectivo."
    },
    "notas": {
      "virulencia": "Produce toxina diftérica que es el principal factor de virulencia. Esta toxina se activa con un bacteriófago.",
      "afectaciones": "Lesiones de las vías respiratorias, orofaringe, miocardio, sistema nervioso y riñones."
    }
  },
  {
    "nombre_comun": "Listeria",
    "nombre_cientifico": "Listeria monocytogenes",
    "tipo": "Bacteria",
    "descripcion": "Bacilos grampositivos cortos y delgados, que no forman esporas. Catalasa positivos.",
    "id_referencia": "A13",
    "codigo_patogeno": [
      "Hígado - píloro"
    ],
    "conflicto_base": {
      "otros_conflictos": "Personalidad rígida y perfeccionista. Yo tengo la razón."
    },
    "notas": {
      "virulencia": "Produce listeriolisina O, que daña las membranas celulares. Reorganiza la actina celular para saltar de una célula vecina a otra.",
      "enfermedades_relacionadas": "Infección gastrointestinal, septicemia, neumonía, lesiones cutáneas, abscesos, conjuntivitis, endocarditis."
    }
  },
  {
    "nombre_comun": "Neisseria catarrhalis",
    "nombre_cientifico": "Moraxella catarrhalis",
    "tipo": "Bacteria",
    "descripcion": "Gramnegativa. Oxidasa positiva con forma de diplococos.",
    "id_referencia": "A14",
    "codigo_patogeno": [
      "Párpado - párpado"
    ],
    "conflicto_base": {
      "otros_conflictos": "Agresión territorial. Amenaza territorial. Confrontación de nuevos ambientes. Hay un peligro en el mundo. Conflicto de bocado auditivo. Dificultad para asimilar información auditiva. Oido derecho: Información auditiva que se escucha y es dificil de asimilar. Oido izquierdo: Información auditiva que se emite y es dificil de escuchar y decir."
    },
    "notas": {
      "enfermedades_relacionadas": "Otitis media, sinusitis, bronquitis, laringitis, bronconeumonía."
    }
  },
  {
    "nombre_comun": "Gonococo, gonorrea",
    "nombre_cientifico": "Neisseria gonorrhoeae",
    "tipo": "Bacteria",
    "descripcion": "Diplococo gramnegativo. Oxidasa positivo.",
    "id_referencia": "A15",
    "codigo_patogeno": [
      "Mandíbula - mandíbula",
      "4ª lumbar - 4ª lumbar"
    ],
    "conflicto_base": {
      "otros_conflictos": "Enojo respecto a su vida sexual. Fastidio con la pareja. Sensación de culpabilidad. Relación exasperante. Frustración."
    },
    "notas": {
      "virulencia": "Contiene pilis que es el factor de adherencia y ademas protegen a la bacteria de la fagocitosis.",
      "enfermedades_relacionadas": "Leucorrea, uretritis, enfermerdad inflamatoria pelvica, vaginitis, cervicitis, endometritis, salpingitis, prostatitis, artritis."
    }
  }
];