import { tools } from '../data.js';

export function renderCVSection(container, themePanel, themeBorder) {
    const cvTool = tools.find(t => t.id === 'cv');
    if (!cvTool) return;

    const { profile, contact, experience, education, skills, downloadUrl, profileImage } = cvTool;

    let html = `
        <div class="max-w-7xl mx-auto pb-24 font-sans text-stone-800 dark:text-stone-100 animate-fade-in-up">
            
            <!-- HEADER: Title & Download -->
            <div class="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-stone-200 dark:border-white/10 pb-6">
                <div>
                     <h2 class="text-4xl md:text-6xl font-black italic tracking-tighter text-violet-900 dark:!text-white">
                        CURRICULUM
                    </h2>
                    <p class="text-stone-500 dark:text-stone-300 font-bold uppercase tracking-widest mt-2">Trayectoria & Perfil Profesional</p>
                </div>
                
                <a href="${downloadUrl}" target="_blank" class="mt-6 md:mt-0 group relative inline-flex items-center gap-3 px-8 py-3 bg-stone-900 dark:bg-white text-white dark:text-black rounded-full font-bold hover:bg-violet-700 dark:hover:bg-cyan-300 transition-colors">
                    <span>DESCARGAR PDF</span>
                    <i data-lucide="download" class="w-4 h-4 group-hover:translate-y-1 transition-transform"></i>
                </a>
            </div>

            <!-- GRID LAYOUT -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                <!-- LEFT COLUMN: PROFILE & INFO (4 cols) -->
                <div class="lg:col-span-4 space-y-8">
                    
                    <!-- PHOTO CARD (Text moved below image) -->
                    <div class="${themePanel} border ${themeBorder} rounded-3xl p-6 shadow-2xl relative group">
                        <!-- Image Container -->
                        <div class="aspect-square overflow-hidden rounded-2xl relative mb-6">
                            <img src="${profileImage}" alt="${profile.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        </div>
                        
                        <!-- Info Below Image -->
                        <div>
                            <h3 class="text-2xl font-black leading-tight mb-2 text-stone-900 dark:!text-white">${profile.name}</h3>
                            <p class="text-sm font-bold text-violet-700 dark:text-cyan-300 uppercase tracking-wider">${profile.role}</p>
                        </div>
                    </div>

                    <!-- CONTACT INFO -->
                    <div class="${themePanel} border ${themeBorder} rounded-3xl p-8">
                        <h4 class="text-sm font-black text-stone-400 dark:text-stone-400 uppercase tracking-widest mb-6">Contacto</h4>
                        <ul class="space-y-4 text-sm font-medium text-stone-600 dark:text-stone-200">
                             <li class="flex items-center gap-4">
                                <div class="w-10 h-10 shrink-0 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-300">
                                    <i data-lucide="phone" class="w-5 h-5"></i>
                                </div>
                                <span>${contact.phone}</span>
                            </li>
                            <li class="flex items-center gap-4">
                                <div class="w-10 h-10 shrink-0 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-300">
                                    <i data-lucide="mail" class="w-5 h-5"></i>
                                </div>
                                <span class="break-all">${contact.email}</span>
                            </li>
                            <li class="flex items-center gap-4">
                                <div class="w-10 h-10 shrink-0 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-300">
                                    <i data-lucide="linkedin" class="w-5 h-5"></i>
                                </div>
                                <a href="https://${contact.linkedin}" target="_blank" class="hover:text-violet-600 dark:hover:text-white transition-colors">${contact.user}</a>
                            </li>
                        </ul>
                    </div>

                    <!-- PROFILE SUMMARY -->
                    <div class="${themePanel} border ${themeBorder} rounded-3xl p-8">
                        <h4 class="text-sm font-black text-stone-400 dark:text-stone-400 uppercase tracking-widest mb-4">Perfil Profesional</h4>
                        <p class="text-stone-600 dark:text-stone-200 leading-relaxed text-sm">
                            ${profile.summary}
                        </p>
                    </div>

                </div>

                <!-- RIGHT COLUMN: CONTENT (8 cols) -->
                <div class="lg:col-span-8 space-y-12">

                    <!-- EXPERIENCE SECTION -->
                    <div>
                        <h3 class="flex items-center gap-3 text-2xl font-black italic text-stone-900 dark:!text-white mb-8">
                            <i data-lucide="briefcase" class="w-6 h-6 text-violet-600 dark:text-violet-400"></i>
                            EXPERIENCIA LABORAL
                        </h3>

                        <div class="space-y-8 relative border-l-2 border-stone-200 dark:border-white/10 ml-3 pl-8 md:pl-12 py-2">
                            ${experience.map((job, idx) => `
                                <div class="relative group">
                                    <!-- Timeline Dot -->
                                    <div class="absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 bg-stone-50 border-2 border-violet-500 rounded-full dark:bg-[#151515] group-hover:scale-125 group-hover:bg-violet-500 transition-all z-10"></div>

                                    <div class="${themePanel} border ${themeBorder} rounded-2xl p-6 md:p-8 hover:border-violet-400 dark:hover:border-violet-500/50 transition-colors">
                                        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                                            <div>
                                                <h4 class="text-xl font-bold text-violet-900 dark:!text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">${job.role}</h4>
                                                <p class="text-lg font-medium text-stone-500 dark:text-stone-300">${job.company}</p>
                                            </div>
                                            <span class="inline-block px-3 py-1 bg-violet-50 dark:bg-white/5 rounded-lg text-xs font-bold text-violet-700 dark:text-cyan-300 whitespace-nowrap">
                                                ${job.period}
                                            </span>
                                        </div>
                                        
                                        <ul class="space-y-2">
                                            ${job.tasks.map(task => `
                                                <li class="flex items-start gap-2 text-stone-700 dark:text-stone-200 text-sm leading-relaxed">
                                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0"></span>
                                                    ${task}
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- TWO COLUMN SPLIT FOR EDUCATION & SKILLS -->
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <!-- EDUCATION -->
                        <div>
                             <h3 class="flex items-center gap-3 text-2xl font-black italic text-stone-900 dark:!text-white mb-8">
                                <i data-lucide="graduation-cap" class="w-6 h-6 text-violet-600 dark:text-cyan-400"></i>
                                FORMACIÓN
                            </h3>
                            <div class="space-y-4">
                                ${education.map(edu => `
                                    <div class="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 hover:border-violet-400/50 dark:hover:border-cyan-400/50 transition-colors">
                                        <p class="text-xs font-bold text-violet-600 dark:text-cyan-400 mb-1">${edu.period}</p>
                                        <h5 class="font-bold text-violet-900 dark:text-violet-300 mb-1 leading-tight">${edu.degree}</h5>
                                        <p class="text-sm text-stone-500 dark:text-stone-400">${edu.school}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- SKILLS -->
                        <div>
                             <h3 class="flex items-center gap-3 text-2xl font-black italic text-stone-900 dark:!text-white mb-8">
                                <i data-lucide="cpu" class="w-6 h-6 text-violet-600 dark:text-yellow-400"></i>
                                HABILIDADES
                            </h3>
                            
                            <div class="mb-6">
                                <h5 class="text-xs font-black uppercase text-stone-400 dark:text-stone-500 mb-3 tracking-widest">Técnicas</h5>
                                <div class="flex flex-wrap gap-2">
                                    ${skills.technical.map(skill => `
                                        <span class="px-3 py-1 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-white hover:bg-violet-600 hover:border-violet-600 dark:hover:border-violet-500 transition-colors cursor-default">
                                            ${skill}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="mb-6">
                                <h5 class="text-xs font-black uppercase text-stone-400 dark:text-stone-500 mb-3 tracking-widest">Destrezas</h5>
                                <div class="flex flex-wrap gap-2">
                                    ${skills.soft.map(skill => `
                                        <span class="px-3 py-1 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-white hover:bg-violet-500 hover:border-violet-500 dark:hover:border-cyan-400 transition-colors cursor-default">
                                            ${skill}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div>
                                <h5 class="text-xs font-black uppercase text-stone-400 dark:text-stone-500 mb-3 tracking-widest">Experticia</h5>
                                <div class="space-y-2">
                                     ${skills.areas.map(area => `
                                        <div class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
                                            <i data-lucide="check-circle" class="w-3 h-3 text-green-600 dark:text-green-400"></i>
                                            ${area}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                        </div>

                     </div>

                </div>

            </div>
        </div>
    `;

    container.innerHTML = html;
}
