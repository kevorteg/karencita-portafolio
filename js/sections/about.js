
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
                     <div class="absolute top-0 right-0 w-64 h-64 bg-stone-100 dark:bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                     
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
                            ${aboutTool.intro.map(p => `<p>${p}</p>`).join('')}
                        </div>
                     </div>
                </div>

                <!-- SERVICES GRID -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${aboutTool.whatIDo.map((item, i) => `
                        <div class="${themePanel} border ${themeBorder} rounded-[2rem] p-8 hover:bg-stone-50 dark:hover:bg-white/5 transition-all group hover:-translate-y-1">
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
                        <span>7+ Años</span>
                    </div>
                </div>

                <!-- SKILLS (Simplified) -->
                <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8">
                    <h3 class="text-xs font-black uppercase tracking-widest opacity-40 mb-6">${data.skillsCore}</h3>
                    <div class="flex flex-wrap gap-2">
                        ${[...aboutTool.skills.creative, ...aboutTool.skills.technical].slice(0, 8).map(s => `
                            <span class="px-3 py-1.5 border border-stone-200 dark:border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-violet-50 dark:hover:bg-white/10 transition-colors cursor-default">
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

        <!-- PROCESS SECTION -->
        <div class="mb-24">
             <div class="flex items-end justify-between mb-12 px-2">
                <h2 class="text-4xl md:text-6xl font-serif italic text-stone-300 dark:text-stone-700 select-none">${data.processTitle}</h2>
                <div class="hidden sm:block h-px flex-1 bg-stone-200 dark:bg-stone-800 mx-8 mb-4"></div>
                <span class="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Methodology v2.0</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                ${aboutTool.process.map((step, i) => `
                    <div class="relative group">
                        <div class="h-full ${themePanel} border ${themeBorder} rounded-[2rem] p-6 hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 flex flex-col justify-between min-h-[200px]">
                            <span class="text-[10px] font-black uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity mb-4 block">${data.processPhasePrefix} 0${i + 1}</span>
                            <p class="font-bold text-lg leading-tight group-hover:translate-x-1 transition-transform">${step}</p>
                            <div class="mt-4 w-8 h-8 rounded-full border border-current flex items-center justify-center opacity-20 group-hover:opacity-100 transition-all">
                                <i data-lucide="arrow-down" class="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform"></i>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;
}
