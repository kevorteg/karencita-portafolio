
<div align="center">
  <img src="assets/images/profile/perfil.png" alt="Karen Profile" width="120" style="border-radius: 50%; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);">

  <h1 style="font-size: 3em; margin-top: 20px;">Karen Creative Portfolio</h1>
  
  <p style="font-size: 1.2em; max-width: 600px; margin: 0 auto; line-height: 1.6;">
    Un espacio digital diseñado para destacar estrategia, creatividad y visión. 
    Construido con tecnología moderna, pensado para humanos.
  </p>

  <br>

  <!-- Tech Stack Badges -->
  <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP Animations" />
    <img src="https://img.shields.io/badge/Lucide-F05032?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide Icons" />
  </div>

  <br>

  <!-- Project Stats (Static Placeholder for Pro Look) -->
  <img src="https://img.shields.io/badge/Status-Online_🟢-success?style=flat-square&logo=github-actions" alt="Status" />
  <img src="https://img.shields.io/badge/Performance-100%25-brightgreen?style=flat-square&logo=lighthouse" alt="Performance" />
  <img src="https://img.shields.io/badge/Accessibility-A+-blue?style=flat-square&logo=accessibility" alt="A11y" />

</div>

<hr style="margin: 40px 0; border: 0; height: 1px; background: #e5e7eb;">

## 🚀 Guía de Inicio Rápido

Bienvenida a tu panel de control. No necesitas saber programación para mantener tu portafolio al día. Todo está centralizado en un solo lugar seguro.

### 📂 Tu Archivo Maestro: `js/data.js`

Todo lo que ves en la pantalla (textos, proyectos, estadísticas) vive en el archivo **`js/data.js`**. 
Piensa en él como un formulario de Word o Excel.

> **⚠️ Regla de Oro:** Solo modifica el texto que está entre comillas `'texto'` o `"texto"`. No borres las comas `,` al final de las líneas.

---

## 🛠️ ¿Cómo editar...?

### 1. 👩‍💻 Tu Información y Bio
Busca la sección **`about`** en `data.js`.
- **`role`**: Tu título profesional (ej. Mercadóloga & Social Media).
- **`intro`**: Tu presentación corta.
- **`experience`**: Tu trayectoria laboral (Empresa, Cargo, Fechas).

### 2. 📊 Estadísticas y Habilidades
Al final del archivo encontrarás **`sidebarData`**. Aquí controlas las barras de progreso que se ven a la derecha.
- **`level: 95`** → Cambia el número para ajustar la barra de habilidad (0 a 100).
- **`value: 'Creativa'`** → Cambia el texto de tus atributos.

### 3. 🎨 Servicios
En las secciones **`design`**, **`marketing`**, etc., puedes actualizar:
- **`desc`**: La frase impactante de cada servicio.
- **`services`**: La lista de puntos clave que ofreces.

### 4. 📸 Nuevo Proyecto
Para agregar un proyecto al portafolio, ve a la lista **`projects`** y añade un nuevo bloque así:

```javascript
{ 
    id: 99, 
    title: 'Nombre de tu Proyecto', 
    category: 'design', 
    img: 'assets/images/projects/foto-nueva.jpg', 
    description: 'Descripción corta y atractiva.' 
},
```

---

## 💎 Características Pro

| Feature | Descripción | Estado |
| :--- | :--- | :--- |
| **Modo Oscuro/Claro** | Se adapta a la preferencia del sistema y tiene botón manual. | ✅ Activo |
| **Color Lab** | Sistema inteligente que extrae colores de imágenes subidas. | ✅ Activo |
| **Animaciones GSAP** | Transiciones suaves y efectos de entrada cinematográficos. | ✅ Activo |
| **Responsive** | Se ve perfecto en iPhone, iPad y monitores 4K. | ✅ Activo |

---

<div align="center">
  <p style="opacity: 0.6; font-size: 0.9em;">
    Desarrollado con 👍 y mucho café por <a href="https://github.com/kevorteg"><b>Kevin Ortega</b></a>.<br>
    Sistema optimizado para <b>Karen's Creative Lab</b>.
  </p>
</div>
