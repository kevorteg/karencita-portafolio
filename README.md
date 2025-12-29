# 📖 Guía de Edición (Modo No-Código)

¡Hola! Esta guía es para que puedas cambiar los textos, fotos y proyectos de tu portafolio sin necesidad de saber programar. Todo el contenido importante vive en un solo archivo llamado `data.js`.

---

## 📂 ¿Dónde edito?

1.  Ve a la carpeta de tu proyecto.
2.  Entra en la carpeta `js`.
3.  Abre el archivo **`data.js`** (puedes usar el Bloc de Notas, VS Code o cualquier editor de texto).

---

## 📝 Reglas de Oro (¡Lee esto primero!)

Para que la página no se rompa, sigue estas 3 reglas simples:

1.  **Respeta las comillas**: Los textos siempre van entre comillas simples `'texto'` o dobles `"texto"`. Si borras una, ¡el código falla!
    *   ✅ BIEN: `'Hola mundo'`
    *   ❌ MAL: `'Hola mundo`
2.  **Cuidado con las comas**: Si ves una lista de cosas, cada línea suele terminar con una coma `,`. No las borres.
3.  **No toques lo que está en azul/código**: Solo cambia el texto que está en blanco/naranja (lo que está dentro de las comillas). No cambies palabras como `id:`, `icon:`, `const`, `export`.

---

## 🛠️ ¿Qué puedo cambiar?

### 1. Tu Perfil ("Sobre Mí")
Busca la sección que dice `id: 'about'`.
*   **`role`**: Tu título profesional (ej. "Directora Creativa").
*   **`title`**: La frase principal de tu bio.
*   **`intro`**: Tu historia. Cada párrafo es un texto separado por comas.
*   **`skills`**: Tus habilidades. Están agrupadas en `creative`, `technical`, y `professional`. ¡Agrega o quita las que quieras!

### 2. Tus Servicios
Busca las líneas que empiezan con `{ id: 'design'...`, `{ id: 'illustration'...`, etc.
*   **`label`**: El nombre del botón en el menú.
*   **`desc`**: La frase corta que aparece abajo.
*   **`manifesto`**: La descripción larga del servicio.
*   **`services`**: Una lista de lo que incluye (ej. `['Logotipos', 'Branding']`).

### 3. Testimonios
Busca la parte que dice `testimonials: [`
*   Ahí verás frases entre comillas. Simplemente borra las de ejemplo y escribe lo que dicen tus clientes reales.

### 4. Proyectos (Galería)
Al final del archivo verás `export const projects = [`.
Cada proyecto es un bloque así:
```javascript
{ 
    id: 1, 
    title: 'Nombre del Proyecto', 
    category: 'design', 
    img: 'assets/images/foto.jpg', 
    description: 'Descripción corta.' 
},
```
*   **Para agregar una foto nueva**:
    1.  Guarda tu imagen en la carpeta `assets/images/projects/`.
    2.  En `data.js`, cambia la parte de `img:` por el nombre de tu archivo (ej. `'assets/images/projects/mi-logo-nuevo.jpg'`).

---

## 🆘 ¿Algo salió mal?
Si guardas y la página se pone en blanco o no carga:
1.  Probablemente borraste una comilla `'` o una coma `,` por accidente.
2.  Presiona `Ctrl + Z` (Deshacer) hasta que vuelva a funcionar e inténtalo de nuevo con calma.

¡Disfruta actualizando tu portafolio! 🚀
