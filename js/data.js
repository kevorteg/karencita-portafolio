export const tools = [
    {
        id: 'about',
        icon: 'user-circle',
        label: 'Sobre Mí',
        role: 'Perfil Jefe / Creativa',
        title: 'Diseñar es pensar, comunicar es conectar',
        intro: [
            "Soy una creativa multidisciplinar enfocada en transformar ideas en experiencias visuales y estratégicas. Mi trabajo se desarrolla entre el diseño, la publicidad, el marketing y la ilustración, integrando pensamiento creativo con análisis y estrategia.",
            "Me interesa crear soluciones visuales con intención, que no solo se vean bien, sino que comuniquen con claridad y coherencia. Cada proyecto comienza entendiendo el contexto, el mensaje y las personas a las que va dirigido.",
            "Trabajo desde una perspectiva artística y estratégica, cuidando cada etapa del proceso creativo, desde la conceptualización hasta la ejecución final."
        ],
        whatIDo: [
            { title: "Diseño gráfico", desc: "Desarrollo identidades visuales y piezas gráficas que reflejan la esencia de cada marca, manteniendo coherencia estética y funcional en todos los formatos." },
            { title: "Publicidad", desc: "Creo conceptos publicitarios claros y creativos, enfocados en comunicar mensajes relevantes y conectar con el público de manera auténtica." },
            { title: "Marketing y mercadotecnia", desc: "Trabajo estrategias creativas basadas en análisis, objetivos y público, buscando que cada acción tenga un propósito y genere impacto real." },
            { title: "Ilustración y arte", desc: "Exploro la ilustración como una herramienta expresiva que complementa proyectos visuales y aporta identidad, emoción y carácter." }
        ],
        skills: {
            creative: ["Dirección creativa", "Pensamiento conceptual", "Storytelling visual", "Composición y color"],
            technical: ["Diseño gráfico", "Branding", "Ilustración", "Publicidad", "Marketing estratégico"],
            professional: ["Organización creativa", "Comunicación visual", "Trabajo colaborativo", "Gestión de proyectos"]
        },
        process: [
            "Investigación y análisis.",
            "Conceptualización creativa.",
            "Desarrollo visual y estratégico.",
            "Ajustes y refinamiento.",
            "Entrega final."
        ],
        projectsText: "Cada proyecto representa una combinación de creatividad, estrategia y ejecución. Trabajo con marcas, emprendimientos y proyectos personales, adaptando cada solución a su contexto y necesidades.",
        education: "Formación académica y autodidacta en diseño, publicidad y marketing, complementada con aprendizaje continuo y práctica profesional constante.",
        testimonials: [
            "Destaca por su creatividad, compromiso y atención al detalle. Supo entender el proyecto y llevarlo a un nivel visual muy sólido.",
            "Tiene una visión estratégica clara y una sensibilidad estética que aporta mucho valor al trabajo final.",
            "Trabajar con ella fue una experiencia fluida y profesional, con resultados creativos bien pensados."
        ],
        contact: {
            text: "¿Tienes una idea, proyecto o marca que necesita dirección creativa? Estoy abierta a nuevas colaboraciones y proyectos.",
            availability: ["Disponible para proyectos.", "Modalidad global, remoto o presencial."]
        }
    },
    { id: 'design', icon: 'palette', label: 'Diseño Gráfico', role: 'Lenguaje Visual', desc: 'El diseño es el lenguaje visual de una marca.', manifesto: 'Desarrollo identidades visuales y piezas gráficas que reflejan la esencia de cada marca.', services: ['Identidad visual', 'Branding', 'Sistemas visuales'] },
    { id: 'illustration', icon: 'pen-tool', label: 'Ilustración', role: 'Narrativa Visual', desc: 'La ilustración es mi espacio más libre.', manifesto: 'Exploro la ilustración como una herramienta expresiva única.', services: ['Ilustración editorial', 'Concept art'] },
    { id: 'publicity', icon: 'megaphone', label: 'Publicidad', role: 'Comunicación', desc: 'Comunicar con intención es la clave.', manifesto: 'Creo conceptos publicitarios claros y creativos.', services: ['Dirección creativa', 'Campañas'] },
    { id: 'marketing', icon: 'bar-chart-3', label: 'Marketing', role: 'Estrategia', desc: 'La creatividad necesita análisis.', manifesto: 'Estrategias basadas en objetivos reales y métricas.', services: ['Estrategia de marca', 'Growth'] },
    { id: 'color', icon: 'swatch-book', label: 'Color Lab', role: 'Colorimetría Pro', desc: 'Laboratorio técnico de armonías cromáticas.', manifesto: 'Herramienta avanzada para la generación de paletas profesionales y validación de accesibilidad.', services: [] }
];

export const projects = [
    { id: 1, title: 'Aura Branding', category: 'design', img: 'assets/images/projects/aura.jpg', description: 'Sistema visual para marca de lujo.' },
    { id: 2, title: 'Noches de Neón', category: 'illustration', img: 'assets/images/projects/neon.jpg', description: 'Serie de ilustraciones digitales.' },
    { id: 99, title: 'Protocolo Contacto', category: 'special', img: 'assets/images/projects/contact.jpg', description: 'Estoy abierta a nuevas colaboraciones creativas.' }
];
