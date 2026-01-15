¡Hola Karencita! (Guía de Supervivencia)

Si estás leyendo esto es porque quieres **cambiar algo de tu portafolio** (o pusiste a un amigo a hacerlo). ¡Relax! No necesitas ser hacker para actualizar tus textos o subir fotos nuevas.

Solo hay **UNA** regla sagrada:

> 🚨 **¡NO TOQUES EL CÓDIGO!** 🚨
> Aléjate de archivos como `main.js` o `index.html`.
>
> 💀 **Y SOBRE TODO:** Jamás de los jamases toques **`js/color-studio.js`**. Esa es nuestra obra maestra matemática. Si le mueves una coma, el universo explota (y el selector de color deja de funcionar). 🤯

---

## 📂 Tu Zona Segura: `js/data.js`

Todo el contenido de tu página vive en un archivito llamado **`data.js`** (dentro de la carpeta `js`). 
Ese es tu **centro de control**. Ahí puedes cambiar todo sin miedo a dañar el sistema.

### ¿Cómo edito sin romper nada? 🛠️

Abre `js/data.js` y sigue estos tips de oro:

1.  **Solo cambia lo naranja/blanco**: Lo que está entre comillas (`'texto'` o `"texto"`).
    *   ✅ BIEN: `'Hola Karen'`
    *   ❌ MAL: `'Hola Karen` (¡Te comiste una comilla! 😱)
2.  **Respeta las comitas**: Al final de cada línea suele haber una coma `,`. ¡No la borres!

---

## ✏️ ¿Qué quieres cambiar hoy?

### 1. ¿Nuevo puesto o Bio? 👩‍💻
Busca la parte que dice **`about`**.
Ahí puedes cambiar tu título en `role` (ej. "Directora Creativa") o tu historia en `intro`.

### 1.5 Estadísticas y Barras de Porcentaje 📊
¡Sí, lo de la derecha también se cambia!
Baja al final del archivo donde dice **`sidebarData`**.
*   **Perfil**: Cambia "Liderazgo" o "Status".
*   **Habilidades (Skills)**: Verás números como `level: 95`. ¡Ese es el porcentaje de la barra!
    *   Ejemplo: Cambia `95` por `100` para subirle el nivel.

### 2. ¿Tus Servicios? 🎨
Baja hasta donde dicen `design`, `illustration`, `marketing`...
Cambia lo que dice en `desc` (la frase corta) o `services` (la lista de cosas que haces).

### 3. ¿Testimonios de Clientes? ⭐
Busca **`testimonials`**.
Simplemente borra mis ejemplos y pega las flores que te echen tus clientes reales.

### 4. ¿Subir Proyecto Nuevo? 📸
Al final del archivo está la lista **`projects`**. Para agregar uno nuevo, copia y pega esto antes del cierre `];`:


```javascript
{ 
    id: 99, 
    title: 'Nombre del Proyecto', 
    category: 'design',   // O 'illustration', 'marketing'
    img: 'assets/images/projects/tu-foto.jpg', 
    description: 'Chisme corto del proyecto.' 
},
```
*(Ojo: Asegúrate que la foto `tu-foto.jpg` esté guardada en la carpeta `assets/images/projects/`)*.

---

## 🆘 ¡Ayuda, rompí algo!

Si guardas y la página se pone blanca o no carga:
1.  ¡Respira! 🧘‍♀️
2.  Seguro borraste una comilla `'` o una coma `,` sin querer.
3.  Dale **Ctrl + Z** (Deshacer) hasta que reviva y vuelve a intentarlo con más calmita.
4.  Si no te funciona, escríbeme para corregir los errores.

¡Tú puedes! Haz que ese portafolio brille. ✨🚀
