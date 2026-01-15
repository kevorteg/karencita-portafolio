
import { siteContent } from './data.js';

let currentQuizStep = 0;
let quizAnswers = {
    brand: 0,
    growth: 0
};

export function renderStrategyTool(container, themePanel, themeBorder) {
    const data = siteContent.quizData;

    let html = `
        <div class="max-w-4xl mx-auto mb-24 font-sans">
            <!-- Main Container -->
            <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500">
                
                <!-- Progress Bar (Dynamic Width) -->
                <div id="quiz-progress-bar" class="absolute top-0 left-0 h-1.5 bg-violet-600 transition-all duration-500" style="width: 0%"></div>

                <!-- Intro Screen -->
                <div id="quiz-intro" class="text-center py-10">
                    <h2 class="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-6">${data.intro.label}</h2>
                    <h1 class="text-4xl md:text-5xl font-serif italic mb-6 leading-tight">${data.intro.title}</h1>
                    <p class="text-lg opacity-60 max-w-lg mx-auto mb-12 leading-relaxed">${data.intro.description}</p>
                    
                     <button onclick="window.startQuiz()" class="group relative px-10 py-4 bg-violet-600 text-white rounded-full font-bold uppercase text-xs tracking-widest overflow-hidden shadow-lg shadow-violet-600/30 hover:scale-105 transition-transform active:scale-95">
                        <span class="relative z-10 flex items-center gap-3">
                            ${data.intro.btnStart} <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                        </span>
                        <div class="absolute inset-0 bg-violet-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                </div>

                <!-- Questions -->
                ${data.questions.map((q, index) => `
                    <div id="quiz-${q.id}" class="hidden">
                        <div class="flex justify-between items-end mb-10 border-b ${themeBorder} pb-6">
                            <div>
                                <span class="text-xs font-black uppercase tracking-widest text-violet-600 mb-2 block">Paso ${q.step}/03</span>
                                <h3 class="text-2xl font-bold">${q.title}</h3>
                            </div>
                            <span class="text-4xl opacity-10 font-serif italic">${q.step}</span>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            ${q.options.map(opt => `
                                <button onclick="window.nextQuiz('${q.id}', '${opt.value}', ${index === data.questions.length - 1})" class="text-left group relative p-8 rounded-[2rem] border ${themeBorder} hover:border-violet-600 hover:shadow-xl hover:shadow-violet-600/5 transition-all bg-stone-50/50 dark:bg-white/5 hover:text-stone-900 dark:hover:text-white">
                                    <div class="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm border ${themeBorder} group-hover:scale-110 transition-transform">
                                        <i data-lucide="${opt.icon}" class="w-6 h-6 text-violet-600"></i>
                                    </div>
                                    <h4 class="text-lg font-bold mb-2 group-hover:text-violet-600 transition-colors">${opt.title}</h4>
                                    <p class="text-sm opacity-60 leading-relaxed">${opt.desc}</p>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}

                <!-- Result -->
                <div id="quiz-result" class="hidden text-center py-8">
                     <div class="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
                        Diagnóstico Completado
                     </div>
                     <h2 class="text-4xl md:text-5xl font-serif italic mb-6">Tu hoja de ruta:</h2>
                     
                     <div class="p-8 rounded-[2rem] bg-violet-600 text-white mb-10 shadow-2xl shadow-violet-600/40 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div class="relative z-10">
                            <div class="mb-4 opacity-80 text-xs font-bold uppercase tracking-widest">Salud de Marca Actual</div>
                            <div id="health-score" class="text-6xl font-black mb-6">0%</div>
                            <h4 id="result-title" class="text-2xl font-bold mb-4">Analizando...</h4>
                            <p id="result-desc" class="text-white/80 leading-relaxed font-medium">Procesando tus respuestas para darte la mejor estrategia.</p>
                        </div>
                     </div>

                     <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                         <button onclick="window.setActiveTool('contact')" class="w-full sm:w-auto px-10 py-5 bg-black dark:bg-violet-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl">
                            Agendar Asesoría
                         </button>
                         <button onclick="window.startQuiz()" class="w-full sm:w-auto px-10 py-5 border border-stone-300 dark:border-white/10 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            Repetir Test
                         </button>
                     </div>
                </div>

            </div>
        </div>
    `;

    container.innerHTML = html;
}

export function startQuiz() {
    currentQuizStep = 0;
    quizAnswers = { brand: 0, growth: 0 };
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-q1').classList.remove('hidden');
    updateProgress(1);

    // Reset global state
    window.clientProfile = null;
}

export function nextQuiz(currentId, value, isLast) {
    quizAnswers[value]++;

    document.getElementById(`quiz-${currentId}`).classList.add('hidden');

    if (isLast) {
        finishQuiz();
    } else {
        // Simple logic to find next question, assumes q1 -> q2 -> q3 structure
        const nextNum = parseInt(currentId.replace('q', '')) + 1;
        document.getElementById(`quiz-q${nextNum}`).classList.remove('hidden');
        updateProgress(nextNum);
    }
}

function updateProgress(step) {
    const percentage = (step / 3) * 100;
    document.getElementById('quiz-progress-bar').style.width = `${percentage}%`;
}

function finishQuiz() {
    document.getElementById('quiz-result').classList.remove('hidden');
    document.getElementById('quiz-progress-bar').style.width = '100%';

    const data = siteContent.quizData.results;
    let resultKey = 'hybrid';

    if (quizAnswers.brand > quizAnswers.growth) resultKey = 'brand';
    else if (quizAnswers.growth > quizAnswers.brand) resultKey = 'growth';

    const result = data[resultKey];

    // Save to global scope for Contact tool
    window.clientProfile = result.title.replace('Arquetipo: ', '');

    // Animate numbers
    let score = parseInt(result.health);
    let current = 0;
    const counter = setInterval(() => {
        current += 5;
        if (current > score) {
            current = score;
            clearInterval(counter);
        }
        document.getElementById('health-score').innerText = `${current}%`;
    }, 50);

    document.getElementById('result-title').innerText = result.title;
    document.getElementById('result-desc').innerText = result.desc;
}

// Attach to window so onclick handlers work
window.startQuiz = startQuiz;
window.nextQuiz = nextQuiz;
