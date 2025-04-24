# MicroBioCards

Aplicación educativa interactiva sobre Microbioenergética desarrollada por el Dr. Miguel Ojeda Rios.

## Descripción

**MicroBioCards** es una plataforma educativa que explora la Microbioenergética, conectando la comprensión científica de los microorganismos con interpretaciones emocionales y simbólicas. La aplicación presenta flashcards interactivas con información detallada sobre diferentes patógenos y su relación con conflictos emocionales.

## El código emocional, energético y simbólico de los microbios

Esta aplicación ayuda a comprender las conexiones entre microorganismos y estados emocionales según la perspectiva de la Microbioenergética, facilitando el estudio mediante categorías diferenciadas:

- **Bacterias**: Códigos A1-A99
- **Virus ADN**: Códigos B1-B99 
- **Virus ARN**: Códigos B1-B99
- **Parásitos**: Códigos C1-C99
- **Hongos**: Códigos D1-D99

## Características principales

- Interfaz intuitiva con tarjetas interactivas para el estudio
- Asistente de IA especializado en Microbioenergética
- Sistema de favoritos para marcar patógenos importantes
- Visualización de estadísticas de estudio
- Filtros por categoría y búsqueda por texto
- Modo oscuro/claro

## Instalación y uso

### Requisitos previos
- Node.js 18 o superior
- npm o yarn
- Una cuenta en Vercel (para despliegue)
- Una API Key de OpenAI

### Configuración local

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/microbio-cards.git
cd microbio-cards
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
OPENAI_API_KEY=tu_api_key_de_openai
OPENAI_ASSISTANT_ID=tu_assistant_id_de_openai
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:5000](http://localhost:5000) en tu navegador para ver la aplicación.

### Despliegue en Vercel

1. Sube tu código a GitHub
2. Crea una nueva aplicación en Vercel
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno `OPENAI_API_KEY` y `OPENAI_ASSISTANT_ID` en la configuración del proyecto
5. Despliega la aplicación

## Tecnologías utilizadas

- React con TypeScript
- Vite para desarrollo rápido
- Tailwind CSS para estilos
- Shadcn UI para componentes
- Chart.js para visualizaciones
- OpenAI API para asistente inteligente
- Vercel para despliegue

## Contribuir

Si deseas contribuir a este proyecto, consulta [CONTRIBUTING.md](./CONTRIBUTING.md) para obtener más información.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](./LICENSE) para más detalles.

## Autor

Dr. Miguel Ojeda Rios

---

Desarrollado con 💜 como herramienta educativa para la comunidad interesada en Microbioenergética.
