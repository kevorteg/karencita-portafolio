export const tools = [
    {
        id: 'about',
        icon: 'user-circle',
        label: 'Sobre Mí',
        role: 'Mercadóloga & Directora Creativa',
        title: 'Estrategia que se ve, creatividad que funciona.',
        intro: [
            "Hola, soy Karen. Mercadóloga de profesión y creativa de corazón. Me dedico a darle vida a las marcas, uniendo los puntos entre lo que una empresa necesita y lo que la gente quiere ver.",
            "No creo en hacer cosas solo porque se ven 'bonitas'. Para mí, el diseño y la publicidad tienen que tener un propósito: comunicar, conectar y vender. Me gusta pensar antes de diseñar y analizar antes de proponer.",
            "Mi trabajo es una mezcla de estrategia y arte. Desde crear una identidad visual desde cero hasta planear una campaña que impacte, me involucro en el proceso para asegurar que el resultado final tenga alma y sentido."
        ],
        whatIDo: [
            { title: "Diseño Gráfico", desc: "Creo marcas que se sienten reales. Logos, identidades y piezas visuales que no solo decoran, sino que construyen la personalidad de tu negocio." },
            { title: "Publicidad", desc: "Ideas que pegan. Busco el ángulo creativo perfecto para que tu mensaje llegue claro, fuerte y directo a quien le tiene que llegar." },
            { title: "Marketing", desc: "Estrategia sin humo. Analizo el mercado y defino acciones claras para que tu marca crezca con pasos firmes y objetivos reales." },
            { title: "Branding", desc: "Arte para comunicar. A veces una imagen dice más que mil palabras, y uso la ilustración para darle ese toque único y personal a los proyectos." }
        ],
        skills: {
            creative: ["Dirección de Arte", "Conceptos Creativos", "Narrativa Visual", "Curaduría Estética"],
            technical: ["Suite Adobe", "Branding Estratégico", "Identidad Corporativa", "Campañas 360", "Redacción Creativa"],
            professional: ["Visión Estratégica", "Liderazgo de Equipos", "Gestión de Marcas", "Comunicación Asertiva"]
        },
        process: [
            "Platicar y entender el problema.",
            "Investigar a fondo el contexto.",
            "Lluvia de ideas y estrategia.",
            "Diseño y creación (la magia).",
            "Refinar y entregar lo mejor."
        ],
        projectsText: "Cada marca es un mundo y me encanta explorarlos todos. Aquí verás una selección de trabajos donde he puesto creatividad, estrategia y mucho cariño.",
        education: "Mercadóloga graduada con formación constante en diseño y dirección de arte. Nunca dejo de aprender porque el mundo digital nunca deja de cambiar.",
        testimonials: [
            "Entendió perfecto lo que quería incluso mejor que yo. El resultado fue increíble y súper profesional.",
            "Tiene una visión muy clara. No solo diseña lindo, sino que piensa en la estrategia detrás de cada elemento.",
            "Súper recomendada. Es muy fácil trabajar con ella y siempre entrega calidad top."
        ],
        contact: {
            text: "¿Tienes un proyecto en mente? Platiquemos. Siempre estoy buscando nuevos retos y marcas interesantes para colaborar.",
            availability: ["Freelance disponible.", "Proyectos por objetivo.", "Asesorías 1 a 1."]
        }
    },
    { id: 'design', icon: 'palette', label: 'Diseño Gráfico', role: 'Identidad Visual', desc: 'Tu marca merece verse increíble.', manifesto: 'Diseño sistemas visuales que cuentan la historia de tu negocio.', services: ['Logotipos', 'Manual de Marca', 'Papelería'] },
    { id: 'branding', icon: 'pen-tool', label: 'Branding', role: 'Arte Digital', desc: 'Dibujando ideas.', manifesto: 'Ilustraciones personalizadas para darle carácter a tus proyectos.', services: ['Editorial', 'Redes Sociales'] },
    { id: 'publicity', icon: 'megaphone', label: 'Publicidad', role: 'Campañas', desc: 'Hagamos ruido del bueno.', manifesto: 'Conceptos publicitarios que conectan con las emociones de la gente.', services: ['Concepto Creativo', 'Copywriting'] },
    { id: 'marketing', icon: 'bar-chart-3', label: 'Marketing', role: 'Estrategia', desc: 'Crecer con sentido.', manifesto: 'Planeación estratégica para que cada peso invertido cuente.', services: ['Auditoría de Marca', 'Plan de Contenidos'] },
    { id: 'color', icon: 'swatch-book', label: 'Color Lab', role: 'Estudio de Color', desc: 'El poder del color.', manifesto: 'Herramienta profesional para elegir paletas perfectas, accesibles y hermosas.', services: [] },
    { id: 'gallery', icon: 'camera', label: 'Galería', role: 'Fotografía & Mood', desc: 'Capturando momentos.', manifesto: 'Una colección curada de vibras visuales y fotografía.', services: [] },
    { id: 'strategy', icon: 'brain', label: 'Estrategia', role: 'Arquetipos de Marca', desc: 'Descubre el ADN de tu marca.', manifesto: 'Herramienta interactiva para definir la personalidad de tu negocio.', services: [] },
    { id: 'contact', icon: 'send', label: 'Contacto', role: 'Inicia el Viaje', desc: 'Hagamos realidad tu proyecto.', manifesto: 'Generador de brief interactivo para entender tus necesidades.', services: [] }
];

export const sidebarData = {
    profile: {
        label: "Propiedades Perfil",
        items: [
            { label: "Liderazgo", value: "Creativa" },
            { label: "Modalidad", value: "Global / Remoto" },
            { label: "Status", value: "Online", isStatus: true }
        ]
    },
    skills: {
        creativeTitle: "Creativas",
        creative: [
            { name: "Dirección Creativa", level: 95 },
            { name: "Storytelling", level: 90 }
        ],
        professionalTitle: "Profesionales",
        professional: [
            { name: "Gestión Proyectos", level: 92 },
            { name: "Trabajo Colaborativo", level: 95 }
        ]
    },
    education: {
        title: "Educación_Layer",
        text: "Formación académica y autodidacta en diseño, publicidad y marketing."
    }
};

export const projects = [
    { id: 1, title: 'Aura Branding', category: 'design', img: 'assets/images/projects/aura.jpg', description: 'Sistema visual para marca de lujo.' },
    { id: 2, title: 'Noches de Neón', category: 'branding', img: 'assets/images/projects/neon.jpg', description: 'Serie de ilustraciones digitales.' },
    { id: 99, title: 'Protocolo Contacto', category: 'special', img: 'assets/images/projects/contact.jpg', description: 'Estoy abierta a nuevas colaboraciones creativas.' }
];

export const tutorialSteps = [
    {
        target: 'header',
        title: 'Centro de Comando',
        text: 'Aquí controlas el sistema global. Puedes cambiar entre modo Día/Noche para descansar la vista y verificar tu estado de conexión.'
    },
    {
        target: 'sidebar',
        title: 'Barra de Herramientas',
        text: 'Este es tu menú principal. Navega entre mis diferentes facetas profesionales. Cada icono desbloquea una nueva interfaz.'
    },
    {
        target: 'tool-btn-color',
        title: 'Color Lab 🧪',
        text: '¡La joya de la corona! Una herramienta técnica avanzada para diseñadores. Genera paletas, extrae colores de imágenes y verifica accesibilidad.'
    },
    {
        target: 'tool-btn-branding',
        title: 'Branding & Diseño',
        text: 'Explora mis servicios visuales. Aquí es donde la magia ocurre y las marcas cobran identidad propia.'
    },
    {
        target: 'tool-btn-strategy',
        title: 'Estrategia de Marca',
        text: 'No solo es diseño bonitos. Aquí definimos el ADN, los arquetipos y la ruta de crecimiento de tu negocio.'
    },
    {
        target: 'tabs-bar',
        title: 'Multitarea',
        text: 'Gestiona tus "ventanas" abiertas. Puedes tener varios proyectos o herramientas activas al mismo tiempo, como en un sistema operativo.'
    },
    {
        target: 'inspector',
        title: 'Inspector de Propiedades',
        text: 'El panel de detalles. Aquí verás información contextual, mis niveles de habilidad (Skills) y testimonios reales de clientes.'
    }
];
