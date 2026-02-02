
import { tools, siteContent } from '../data.js';

export function renderAboutSection(container, themePanel, themeBorder) {
    const data = siteContent.about;
    const aboutTool = tools.find(t => t.id === 'about');

    // Safety check
    if (!aboutTool || !aboutTool.intro) return;

    let html = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
            
            <!-- Bento Box Layout - Left Column -->
            <div class="lg:col-span-8 flex flex-col gap-8">
                <!-- BIO CARD -->
                <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                     <div class="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                     
                     <div class="relative z-10">
                        <div class="flex items-start justify-between mb-8">
                            <span class="inline-block px-4 py-1.5 rounded-full bg-stone-100 dark:bg-white/10 text-stone-500 dark:text-stone-300 text-[10px] font-bold uppercase tracking-widest">
                                ${aboutTool.role}
                            </span>
                        </div>

                        <h2 class="text-3xl md:text-5xl font-serif italic mb-8 leading-tight">
                            ${aboutTool.title}
                        </h2>

                        <div class="space-y-6 text-lg leading-relaxed opacity-80 max-w-2xl font-medium">
                            <p>${aboutTool.intro.summary}</p>
                            
                            <!-- Accordion Sections -->
                            <div class="space-y-4 mt-6">
                                ${aboutTool.intro.sections.map(section => `
                                    <details class="group bg-stone-50 dark:bg-white/5 rounded-2xl overflow-hidden transition-all duration-300 open:bg-violet-50 dark:open:bg-violet-900/20">
                                        <summary class="flex items-center justify-between p-4 cursor-pointer select-none list-none marker:hidden">
                                            <span class="font-bold text-violet-700 dark:text-violet-300 group-open:text-violet-800 dark:group-open:text-violet-200 text-sm uppercase tracking-wider">
                                                ${section.title}
                                            </span>
                                            <div class="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 transition-transform duration-300 group-open:rotate-180">
                                                <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                            </div>
                                        </summary>
                                        <div class="px-6 pb-6 pt-2 text-[15px] leading-relaxed text-stone-700 dark:text-stone-300 border-t border-violet-100 dark:border-white/5 mx-0 mt-2">
                                            ${section.content}
                                        </div>
                                    </details>
                                `).join('')}
                            </div>
                        </div>
                     </div>
                </div>

                <!-- SERVICES GRID -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${aboutTool.whatIDo.map((item, i) => `
                        <div class="${themePanel} border ${themeBorder} rounded-[2rem] p-8 hover:bg-stone-50 hover:text-stone-900 dark:hover:bg-white/5 dark:hover:text-white transition-all group hover:-translate-y-1">
                            <div class="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 mb-6 group-hover:scale-110 transition-transform">
                                <span class="font-serif italic font-bold">0${i + 1}</span>
                            </div>
                            <h3 class="text-xl font-bold mb-3 group-hover:text-violet-600 transition-colors">${item.title}</h3>
                            <p class="text-sm opacity-60 leading-relaxed">${item.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Right Column -->
            <div class="lg:col-span-4 flex flex-col gap-8">
                
                <!-- PROFILE STATUS -->
                <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
                    <div class="w-full aspect-square rounded-[2rem] overflow-hidden mb-8 relative group">
                        <img src="assets/images/profile/perfil.png" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100">
                        <div class="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <span class="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2">
                                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                ${data.statusTitle}
                            </span>
                        </div>
                    </div>
                    
                    <h3 class="text-2xl font-bold mb-1">Karen</h3>
                    <p class="text-xs font-bold uppercase tracking-widest text-violet-600 mb-6">${data.badge}</p>
                    
                    <div class="w-full h-px bg-stone-200 dark:bg-white/10 mb-6"></div>

                    <div class="w-full flex justify-between items-center text-xs font-bold opacity-60">
                        <span>EXP</span>
                        <span>3+ Años</span>
                    </div>
                </div>

                <!-- SKILLS (Simplified) -->
                <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8">
                    <h3 class="text-xs font-black uppercase tracking-widest opacity-40 mb-6">${data.skillsCore}</h3>
                    <div class="flex flex-wrap gap-2">
                        ${[...aboutTool.skills.creative, ...aboutTool.skills.technical].slice(0, 8).map(s => `
                            <span class="px-3 py-1.5 border border-stone-200 dark:border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors cursor-default">
                                ${s}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <!-- CONTACT MINI -->
                <div class="bg-violet-600 rounded-[2.5rem] p-8 text-white text-center shadow-2xl shadow-violet-600/30 relative overflow-hidden group cursor-pointer hover:bg-violet-700 transition-colors" onclick="window.setActiveTool('contact')">
                     <i data-lucide="arrow-up-right" class="absolute top-8 right-8 w-6 h-6 opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                     <h3 class="text-2xl font-serif italic mb-2">Start Project</h3>
                     <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Agenda tu sesión</p>
                </div>

            </div>
        </div>

        <!-- EXPERIENCE SECTION -->
        <div class="mb-24">
             <div class="flex items-end justify-between mb-12 px-2">
                <h2 class="text-4xl md:text-6xl font-serif italic text-stone-300 dark:text-stone-700 select-none">${data.processTitle}</h2>
                <div class="hidden sm:block h-px flex-1 bg-stone-200 dark:bg-stone-800 mx-8 mb-4"></div>
                <span class="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Trajectory</span>
            </div>

            <div class="space-y-6">
                ${aboutTool.experience.map((job, i) => `
                    <div class="group relative pl-8 sm:pl-0">
                        <!-- Timeline Line (Mobile) -->
                        <div class="absolute left-0 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800 sm:hidden"></div>
                        <div class="absolute left-[-4px] top-6 w-2 h-2 rounded-full bg-violet-600 sm:hidden"></div>

                        <div class="${themePanel} border ${themeBorder} rounded-[2rem] p-8 hover:border-violet-600/50 transition-colors group-hover:shadow-lg">
                            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                                <div>
                                    <span class="inline-block px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 text-[10px] font-bold uppercase tracking-widest mb-3">
                                        ${job.period}
                                    </span>
                                    <h3 class="text-2xl font-bold mb-1 group-hover:text-violet-600 transition-colors">${job.role}</h3>
                                    <h4 class="text-sm font-black uppercase tracking-widest opacity-60">${job.company}</h4>
                                </div>
                                <div class="hidden md:block opacity-20 group-hover:opacity-100 transition-opacity">
                                    <i data-lucide="briefcase" class="w-6 h-6"></i>
                                </div>
                            </div>
                            
                            <ul class="space-y-3">
                                ${job.tasks.map(task => `
                                    <li class="flex items-start gap-3 text-sm leading-relaxed opacity-80">
                                        <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600 shrink-0 group-hover:bg-violet-500 transition-colors"></div>
                                        <span>${task}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;
}
