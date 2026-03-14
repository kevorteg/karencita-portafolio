
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

// --- Security: sanitize text to prevent XSS / injection ---
function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim()
        .slice(0, 1000); // max length
}

function showContactError(msg) {
    let err = document.getElementById('contact-error');
    if (!err) {
        err = document.createElement('div');
        err.id = 'contact-error';
        err.className = 'mt-4 px-4 py-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl text-sm font-bold';
        const form = document.querySelector('#canvas-content form');
        if (form) form.appendChild(err);
    }
    err.textContent = msg;
    err.style.display = 'block';
    setTimeout(() => { if (err) err.style.display = 'none'; }, 4000);
}

export function sendWhatsApp() {
    const nameRaw = document.getElementById('contact-name')?.value || '';
    const msgRaw = document.getElementById('contact-msg')?.value || '';
    const services = Array.from(document.querySelectorAll('input[name="service"]:checked'))
        .map(el => sanitize(el.value))
        .filter(v => ['Branding', 'Web', 'Social', 'Otro'].includes(v)); // allowlist

    // Sanitize
    const name = sanitize(nameRaw);
    const msg = sanitize(msgRaw);

    // Validations
    if (!name) {
        showContactError('Por favor ingresa tu nombre para continuar 😊');
        return;
    }
    if (name.length < 2 || name.length > 80) {
        showContactError('El nombre debe tener entre 2 y 80 caracteres.');
        return;
    }
    if (/[<>{}"';\\]/.test(nameRaw)) {
        showContactError('El nombre contiene caracteres no permitidos.');
        return;
    }
    if (msg.length > 800) {
        showContactError('El mensaje es demasiado largo (máximo 800 caracteres).');
        return;
    }

    let text = `Cordial saludos Karen, soy *${name}*.`;

    if (window.clientProfile) {
        const profile = sanitize(String(window.clientProfile));
        text += `\n\nHice tu diagnóstico y mi perfil es *${profile}*.`;
    }

    if (services.length > 0) {
        text += `\n\nMe interesa ayuda con: *${services.join(', ')}*.`;
    }

    if (msg) {
        text += `\n\nDetalles: ${msg}`;
    }

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/573164321424?text=${encoded}`, '_blank');
}

// Attach to global scope
window.sendWhatsApp = sendWhatsApp;
