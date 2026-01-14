
import { siteContent } from './data.js';

export function renderContactTool(container, themePanel, themeBorder) {
    const data = siteContent.contactData;

    let html = `
        <div class="max-w-3xl mx-auto mb-24">
             <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
                <div class="absolute top-8 right-8 text-violet-600 opacity-20">
                    <i data-lucide="send" class="w-12 h-12"></i>
                </div>
                
                <h2 class="text-3xl font-serif italic mb-2">${data.title}</h2>
                <p class="text-sm opacity-50 font-bold uppercase tracking-widest mb-10">${data.subtitle}</p>

                <form class="space-y-8">
                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase tracking-widest ml-1 opacity-60">${data.nameLabel}</label>
                        <input type="text" id="contact-name" placeholder="${data.namePlaceholder}" class="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-6 py-4 font-bold focus:ring-2 focus:ring-violet-600 transition-all outline-none" />
                    </div>

                    <div class="space-y-4">
                         <label class="text-xs font-black uppercase tracking-widest ml-1 opacity-60">${data.servicesLabel}</label>
                         <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            ${data.services.map(opt => `
                                <label class="cursor-pointer">
                                    <input type="checkbox" name="service" value="${opt}" class="peer sr-only" />
                                    <div class="h-14 flex items-center justify-center rounded-xl border ${themeBorder} text-sm font-bold peer-checked:bg-violet-600 peer-checked:text-white peer-checked:border-violet-600 transition-all hover:bg-black/5 dark:hover:bg-white/5">
                                        ${opt}
                                    </div>
                                </label>
                            `).join('')}
                         </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase tracking-widest ml-1 opacity-60">${data.msgLabel}</label>
                        <textarea id="contact-msg" rows="4" placeholder="${data.msgPlaceholder}" class="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-6 py-4 font-medium focus:ring-2 focus:ring-violet-600 transition-all outline-none resize-none"></textarea>
                    </div>

                    <button type="button" onclick="window.sendWhatsApp()" class="w-full py-5 bg-violet-600 text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-violet-700 active:scale-[0.98] transition-all shadow-lg shadow-violet-600/20">
                        ${data.btnSend}
                    </button>
                    
                    ${window.clientProfile ? `
                        <div class="text-center">
                            <span class="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-widest">
                                 Tu perfil "${window.clientProfile}" se adjuntará automáticamente
                            </span>
                        </div>
                    ` : ''}
                </form>
             </div>
        </div>
    `;

    container.innerHTML = html;
}

export function sendWhatsApp() {
    const name = document.getElementById('contact-name').value;
    const msg = document.getElementById('contact-msg').value;
    const services = Array.from(document.querySelectorAll('input[name="service"]:checked')).map(el => el.value);

    if (!name) {
        alert("Por favor dime tu nombre :)"); // Could be better but simple for now
        return;
    }

    let text = `Hola Karen, soy *${name}*.`;

    if (window.clientProfile) {
        text += `\n\nHice tu diagnóstico y mi perfil es *${window.clientProfile}*.`;
    }

    if (services.length > 0) {
        text += `\n\nMe interesa ayuda con: *${services.join(', ')}*.`;
    }

    if (msg) {
        text += `\n\nCuéntame más: ${msg}`;
    }

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/5211234567890?text=${encoded}`, '_blank');
}

// Attach to global scope
window.sendWhatsApp = sendWhatsApp;
