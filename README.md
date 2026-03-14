<div align="center">
  <h1 style="border-bottom: none;">Karen Creative Portfolio:<br>System Documentation</h1>
  <p>
    <b>A robust, modular, and dynamic web ecosystem designed to showcase creative strategy and vision.</b>
  </p>
  <div>
    <img src="https://img.shields.io/badge/Architecture-Modular-black?style=flat-square" alt="Architecture" />
    <img src="https://img.shields.io/badge/Deployment-Production_Ready-black?style=flat-square" alt="Deployment" />
    <img src="https://img.shields.io/badge/UI_UX-Dynamic_Theme-black?style=flat-square" alt="UI/UX" />
  </div>
</div>

<br>

---

## ⌘ System Overview

This platform is engineered as a dynamic, client-side application. It utilizes a centralized data layer (`data.js`) to separate content from logic and presentation. This architecture guarantees that maintaining and updating the portfolio requires zero programming background, ensuring scalability and ease of use.

## ⌗ Technical Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Markup & Structure** | HTML5 | Semantic structure and accessibility foundation. |
| **Logic & State** | Vanilla JavaScript (ES6 Modules) | Dynamic rendering, state management, and interaction. |
| **Styling Engine** | Tailwind CSS (CDN) | Utility-first styling with native dark mode support. |
| **Animation Library** | GSAP 3 | High-performance, timeline-based motion and transitions. |
| **Iconography** | Lucide Icons | Consistent, scalable vector graphics. |

---

## ◧ Content Management Layer (Guide for Administrators)

All site content is isolated within a single configuration file: `js/data.js`. The application dynamically reads this file to render the user interface. 

To update the portfolio, you only need to modify text strings within this file. **Important constraint:** Only modify the text contained inside the single or double quotes (`'text'` or `"text"`). Do not remove structural elements like commas or braces.

Expand the sections below for detailed configuration parameters:

<details>
<summary><b>▸ 1. Global Identity & Navigation</b></summary>

Modify the basic site metadata and navigation elements within the `siteContent` object.

| Variable | Description | Location in Code |
| :--- | :--- | :--- |
| `meta.title` | The name displayed on the browser tab. | `siteContent.meta` |
| `header.logoText` | The main brand text in the top navigation bar. | `siteContent.header` |
| `welcome.title` | The main headline shown in the introductory modal. | `siteContent.welcome` |
| `welcome.text` | The descriptive paragraph inside the modal. | `siteContent.welcome` |

</details>

<details>
<summary><b>▸ 2. Professional Profile (About Section)</b></summary>

Your primary introduction and professional summary.

| Variable | Description | Location in Code |
| :--- | :--- | :--- |
| `role` | Your professional title (e.g., "Director / Creative"). | `tools` array -> `id: 'about'` |
| `intro` | The main introductory paragraph. | `tools` array -> `id: 'about'` |
| `experience` | Your timeline of roles. Update the `period`, `role`, and `company` fields. | `tools` array -> `id: 'about'` |

</details>

<details>
<summary><b>▸ 3. Projects & Portfolio Gallery</b></summary>

To add or modify existing creative projects, locate the `projects` array inside `data.js`. Each project is a block of data.

**Structure of a Project:**
```javascript
{
    id: 1, // Unique identifier (must be a number)
    title: 'Project Name', // The title displayed on the card
    category: 'design', // The filter category (must match filter buttons)
    img: 'assets/images/projects/file-name.jpg', // Path to the image
    description: 'Detailed description of the creative process.' // Short text
}
```
*To add a new project, copy an existing block, increment the `id`, and paste it at the end of the list.*
</details>

<details>
<summary><b>▸ 4. Curriculum Vitae (CV Section)</b></summary>

Your detailed resume, including education, work history, and skills. Located within the `id: 'cv'` object in the `tools` array.

| Variable | Description |
| :--- | :--- |
| `profile.summary` | The main text block for your professional profile. |
| `experience` | A list of your jobs. Each job requires a `period`, `role`, `company`, and a list of `tasks`. |
| `education` | Your academic background (`period`, `degree`, `school`). |
| `skills` | Categorized lists of your abilities (`technical`, `soft`, and `areas` of expertise). |
| `downloadUrl` | The link to download your compiled PDF resume. |

</details>

<details>
<summary><b>▸ 5. System Properties & Metrics (Right Inspector)</b></summary>

The metrics displayed in the right sidebar are controlled by the `sidebarData` object.

| Variable | Description |
| :--- | :--- |
| `profileData` | Key/Value pairs describing your professional status (e.g., Modality, Leadership style). |
| `skillsData` | The progress bars. Adjust the `value` to change the skill name, and the `level` (0-100) to adjust the visual bar length. |

</details>

---

## ⌗ Deployment & Environment Setup

This project requires zero complex build steps. 

1. **Local Access:** Due to security policies in modern browsers regarding ES6 modules, you cannot simply double-click `index.html`. 
2. **Server Requirement:** Run a local development server. 
   - If using VS Code, install the `Live Server` extension and click "Go Live".
   - Alternatively, use Python: `python -m http.server 8000`.
3. **Cache Invalidation:** If changes made in `data.js` do not reflect in the browser, perform a hard refresh (`Ctrl + F5` or `Cmd + Shift + R`) to bypass browser caching.

---

<div align="center">
  <br>
  <p>hecho con mucho amor ❤️</p>
</div>
