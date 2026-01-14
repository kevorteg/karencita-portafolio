
export function renderGallery(container) {
    const moods = [
        { color: '#FF6B6B', title: 'Urban Sunset', size: 'h-64' },
        { color: '#4ECDC4', title: 'Neon Dreams', size: 'h-96' },
        { color: '#45B7D1', title: 'Deep Ocean', size: 'h-80' },
        { color: '#96CEB4', title: 'Mint Fresh', size: 'h-64' },
        { color: '#FFEEAD', title: 'Golden Hour', size: 'h-96' },
        { color: '#D4A5A5', title: 'Dusty Rose', size: 'h-80' }
    ];

    const html = `
        <div class="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 mb-24">
            ${moods.map((m, i) => `
                <div class="break-inside-avoid rounded-[2rem] overflow-hidden relative group cursor-zoom-in">
                    <div class="${m.size} w-full transition-transform duration-700 group-hover:scale-110" style="background-color: ${m.color}; opacity: 0.8">
                        <div class="w-full h-full bg-[url('assets/images/projects/neon.jpg')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
                    </div>
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-8">
                        <div class="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <h3 class="text-white font-serif italic text-2xl">${m.title}</h3>
                            <p class="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">Moodboard 0${i + 1}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}
