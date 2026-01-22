import { tools } from '../data.js';

export function renderCVSection(container, themePanel, themeBorder) {
    const cvTool = tools.find(t => t.id === 'cv');
    if (!cvTool) return;

    // Merge & Sort Timeline
    const getYear = (str) => {
        const match = str.match(/20\d{2}/);
        return match ? parseInt(match[0]) : 0;
    };

    const timelineItems = [
        ...cvTool.experience.map(e => ({ type: 'work', ...e, title: e.role, subtitle: e.company, year: e.period, icon: 'briefcase' })),
        ...cvTool.education.map(e => ({ type: 'edu', ...e, title: e.degree, subtitle: e.school, year: e.year, icon: 'graduation-cap' }))
    ].sort((a, b) => getYear(b.year) - getYear(a.year)); // Newest first for impact


    let html = `
        <div class="max-w-7xl mx-auto pb-24 font-sans text-white animate-fade-in-up">
            
            <!-- ROW 0: TOP HEADER (Title & Download) -->
            <div class="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8 border-b-4 border-white/10 pb-8 relative">
                <div class="absolute bottom-[-4px] left-0 w-32 h-1 bg-cyan-400"></div>

                <!-- TITLE -->
                <div class="relative z-10">
                    <h1 class="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-white drop-shadow-[0_4px_0_rgba(139,92,246,0.5)] leading-[0.9]">
                        KAREN<br>JIMÉNEZ
                    </h1>
                    <p class="text-xl font-bold text-cyan-300 uppercase tracking-[0.4em] mt-4 ml-2">Creative & Strategist</p>
                </div>

                <!-- DOWNLOAD BUTTON (Moved Up) -->
                <div class="relative group w-full lg:w-auto">
                    <div class="absolute -inset-1 bg-gradient-to-r from-violet-600 via-cyan-400 to-violet-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-[pulse_3s_infinite]"></div>
                    <a href="${cvTool.downloadUrl}" target="_blank" class="relative block bg-black border-2 border-white/20 rounded-lg px-8 py-4 flex items-center justify-between gap-6 hover:border-cyan-400 transition-colors transform group-hover:-translate-y-1">
                        <div class="text-left">
                            <h4 class="text-lg font-black italic text-white leading-none">DESCARGAR CV</h4>
                            <p class="text-[10px] font-bold text-cyan-300 uppercase tracking-widest mt-1">PDF • 2.5MB</p>
                        </div>
                        <i data-lucide="download" class="w-6 h-6 text-white group-hover:scale-125 transition-transform"></i>
                    </a>
                </div>
            </div>

            <!-- ROW 1: PROFILE & INTRO (Aligned for Harmony) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-center">
                
                <!-- AVATAR (Left) -->
                <div class="lg:col-span-4 flex justify-center lg:justify-start">
                    <div class="cv-sketch-box w-64 h-64 p-2 relative z-10 group cursor-pointer rotate-2 hover:rotate-0 transition-transform">
                        <img src="${cvTool.profileImage}" class="w-full h-full object-cover rounded-[50px] group-hover:scale-105 transition-transform duration-500 filter contrast-125">
                        <div class="absolute -right-6 -bottom-2 bg-yellow-400 text-black font-black text-xs px-4 py-2 -rotate-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black">OPEN TO WORK</div>
                    </div>
                </div>

                <!-- SPEECH BUBBLE (Right - Wider) -->
                <div class="lg:col-span-8 relative pl-0 lg:pl-8">
                    <div class="cv-comic-bubble text-xl md:text-2xl leading-relaxed text-black font-bold relative z-10">
                        <span class="text-violet-600 text-6xl absolute -top-8 -left-4 font-serif">“</span>
                        ${cvTool.intro ? cvTool.intro.summary.substring(0, 160) + '...' : cvTool.manifesto}
                        <span class="text-violet-600 text-6xl absolute -bottom-10 -right-4 font-serif rotate-180">“</span>
                    </div>
                    <!-- Decorative scribbles -->
                    <div class="absolute -top-10 right-10 w-20 h-20 border-4 border-dashed border-cyan-400 rounded-full opacity-50 animate-[spin_10s_linear_infinite]"></div>
                </div>
            </div>


            <!-- ROW 2: TIMELINE STREAM -->
            <div class="mb-24 relative">
                <div class="flex items-end gap-4 mb-12">
                     <h3 class="text-4xl font-black italic uppercase text-white leading-none">
                        Trayectoria
                    </h3>
                    <div class="h-1 bg-white/20 flex-grow mb-2 rounded-full relative overflow-hidden">
                        <div class="absolute inset-0 bg-cyan-400 w-1/3 animate-[shimmer_3s_infinite]"></div>
                    </div>
                </div>

                <div class="cv-timeline-container overflow-x-auto pb-16 hide-scrollbar">
                    <div class="flex gap-10 px-4 min-w-max items-center relative py-12">
                        <!-- Glowing Line -->
                        <div class="absolute top-1/2 left-0 w-full h-2 bg-violet-900/50 rounded-full"></div>
                        <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>

                        ${timelineItems.map((item, index) => `
                            <div class="relative flex-none group w-[320px]" style="margin-top: ${index % 2 === 0 ? '-60px' : '60px'}">
                                
                                <!-- Connection Pin -->
                                <div class="absolute left-1/2 -translate-x-1/2 w-0.5 bg-cyan-400/50 h-[80px] 
                                    ${index % 2 === 0 ? 'top-[100%] origin-top' : 'bottom-[100%] origin-bottom'}">
                                </div>
                                <div class="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-2 border-cyan-400 rounded-full z-10 
                                     ${index % 2 === 0 ? 'top-[100%] -mt-1.5' : 'bottom-[100%] -mb-1.5'}">
                                </div>

                                <!-- Sticky Note Card -->
                                <div class="cv-sticker-card rounded-2xl p-6 relative hover:scale-105 transition-transform duration-300 cursor-pointer bg-[#151515] border border-white/10 hover:border-violet-500 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                    <div class="absolute -top-4 left-6 px-3 py-1 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-md shadow-sm transform -rotate-2 group-hover:rotate-0 transition-transform">
                                        ${item.year}
                                    </div>
                                    
                                    <div class="mt-2 mb-3">
                                        <h4 class="text-xl font-black leading-tight uppercase text-white mb-1 group-hover:text-cyan-300 transition-colors">${item.title}</h4>
                                        <p class="text-xs font-bold uppercase tracking-wider text-stone-400">${item.subtitle}</p>
                                    </div>
                                    
                                    <p class="text-sm font-medium text-stone-300 leading-relaxed border-t border-white/5 pt-3">
                                        ${item.desc.substring(0, 85)}...
                                    </p>
                                </div>

                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>


            <!-- ROW 3: SKILLS & ARSENAL -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                <!-- SOFTWARE BAR (Left) -->
                <div class="lg:col-span-5">
                     <h3 class="text-3xl font-black italic uppercase text-white mb-8 flex items-center gap-3">
                        <i data-lucide="cpu" class="w-8 h-8 text-violet-500"></i>
                         Arsenal
                    </h3>
                    <div class="space-y-5">
                         ${cvTool.skills.tech.map(skill => `
                            <div class="group">
                                <div class="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-stone-400 group-hover:text-white transition-colors">
                                    <span>${skill}</span>
                                    <span class="text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">Mastery</span>
                                </div>
                                <div class="cv-liquid-bar-container">
                                    <div class="cv-liquid-bar shadow-[0_0_15px_rgba(139,92,246,0.4)]" style="width: ${Math.floor(Math.random() * (100 - 85) + 85)}%"></div>
                                </div>
                            </div>
                         `).join('')}
                    </div>
                </div>

                <!-- SOFT SKILLS (Right) -->
                 <div class="lg:col-span-7">
                     <h3 class="text-3xl font-black italic uppercase text-white mb-8 flex items-center gap-3">
                        <i data-lucide="zap" class="w-8 h-8 text-yellow-400"></i>
                         Superpoderes
                    </h3>
                     
                     <div class="flex flex-wrap gap-4">
                        ${cvTool.skills.soft.map(skill => `
                            <div class="relative group cursor-default">
                                <div class="absolute inset-0 bg-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-60 transition-opacity"></div>
                                <div class="relative bg-black border border-white/20 px-6 py-4 rounded-lg text-sm font-bold uppercase tracking-wider text-white hover:border-cyan-400 transition-colors flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                                    ${skill}
                                </div>
                            </div>
                        `).join('')}
                     </div>

                     <!-- Footer Note -->
                     <div class="mt-12 p-6 border-l-4 border-yellow-400 bg-white/5 rounded-r-xl">
                        <p class="text-sm font-medium text-stone-300 italic">"Siempre buscando la siguiente gran idea. ¿Creamos algo juntos?"</p>
                     </div>
                </div>

            </div>

        </div>
    `;

    container.innerHTML = html;
}
