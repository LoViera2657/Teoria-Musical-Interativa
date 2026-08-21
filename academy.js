/**
 * Academy Logic - Music Theory Course
 */

// Memory state for progress
const academyState = {
    progress: {}, // { "module_id": { "lesson_id": true } }
    currentModule: null,
    currentLesson: null
};

const academyModules = [
    {
        id: "m1",
        title: "Módulo 1 — Fundamentos da linguagem musical",
        description: "Aprenda a linguagem básica: notas, tons, semitons, intervalos e graus.",
        status: "available",
        lessons: [
            {
                id: "l1_1",
                title: "1.1 Notas musicais",
                content: `
                    <h3>O que você vai aprender</h3>
                    <p>Vamos entender o alfabeto da música: as 12 notas do sistema ocidental e como nomeá-las.</p>
                    
                    <h3>A Cifragem</h3>
                    <p>As notas são representadas por letras, um sistema conhecido como cifragem anglo-saxônica:</p>
                    <div class="note-badges" style="margin: 15px 0;">
                        <span>C = Dó</span><span>D = Ré</span><span>E = Mi</span><span>F = Fá</span><span>G = Sol</span><span>A = Lá</span><span>B = Si</span>
                    </div>
                    
                    <h3>As 12 Notas</h3>
                    <p>Entre a maioria das notas naturais, existem notas alteradas (sustenidos # e bemóis b). No total, temos 12 sons diferentes:</p>
                    <div class="note-badges" style="font-weight: bold; margin: 15px 0; background: var(--bg-card); padding: 10px; border-radius: 8px;">
                        <span>C</span><span>C# / Db</span><span>D</span><span>D# / Eb</span><span>E</span><span>F</span><span>F# / Gb</span><span>G</span><span>G# / Ab</span><span>A</span><span>A# / Bb</span><span>B</span>
                    </div>
                    <p>Repare que <strong>C#</strong> e <strong>Db</strong> produzem o mesmo som. Isso se chama <em>equivalência enarmônica</em>. A escolha do nome depende do contexto musical.</p>
                `,
                quiz: {
                    question: "Qual nota equivale enarmonicamente a D#?",
                    options: ["C#", "Eb", "E", "F"],
                    correctIndex: 1,
                    feedbackCorrect: "Exato! D# e Eb representam a mesma nota na prática.",
                    feedbackWrong: "Incorreto. D# está entre D e E, logo equivale ao E 'rebaixado' (Eb)."
                }
            },
            {
                id: "l1_2",
                title: "1.2 Tons e Semitons",
                content: `
                    <h3>O que é um Semitom?</h3>
                    <p>É a menor distância entre duas notas na música ocidental. Por exemplo, de C para C# é 1 semitom.</p>
                    
                    <h3>O que é um Tom?</h3>
                    <p>Um Tom (T) equivale à soma de dois semitons (ST). De C para D temos 1 Tom (C -> C# -> D).</p>
                    
                    <div class="theory-highlight">
                        <strong>Atenção:</strong> As notas <strong>E e F</strong>, assim como <strong>B e C</strong>, não possuem notas acidentadas (sustenidos) entre elas. A distância natural entre elas já é de apenas 1 semitom!
                    </div>
                    
                    <div style="background: var(--bg-card); padding: 15px; border-radius: 8px; margin-top: 15px; font-family: monospace;">
                        C → C# = 1 semitom<br>
                        C → D &nbsp;= 1 tom<br>
                        E → F &nbsp;= 1 semitom<br>
                        B → C &nbsp;= 1 semitom
                    </div>
                `,
                quiz: {
                    question: "Qual é a distância entre E e F?",
                    options: ["1 tom", "1 semitom", "2 tons", "Nenhuma distância"],
                    correctIndex: 1,
                    feedbackCorrect: "Correto! E e F são vizinhos imediatos, não existe 'E#' no uso comum, a distância é 1 semitom.",
                    feedbackWrong: "Incorreto. Lembre-se da regra: E->F e B->C são naturalmente separados por apenas 1 semitom."
                }
            },
            {
                id: "l1_3",
                title: "1.3 Intervalos",
                content: `
                    <p>O intervalo é a distância medida entre duas notas.</p>
                    <ul class="interval-list">
                        <li><strong>Uníssono:</strong> mesma nota</li>
                        <li><strong>2ª menor (2m):</strong> 1 semitom</li>
                        <li><strong>2ª maior (2M):</strong> 1 tom</li>
                        <li><strong>3ª menor (3m):</strong> 1 tom e meio</li>
                        <li><strong>3ª maior (3M):</strong> 2 tons</li>
                        <li><strong>4ª justa (4J):</strong> 2 tons e meio</li>
                        <li><strong>5ª diminuta / 4ª aumentada:</strong> 3 tons (trítono)</li>
                        <li><strong>5ª justa (5J):</strong> 3 tons e meio</li>
                        <li><strong>6ª menor (6m):</strong> 4 tons</li>
                        <li><strong>6ª maior (6M):</strong> 4 tons e meio</li>
                        <li><strong>7ª menor (7m):</strong> 5 tons</li>
                        <li><strong>7ª maior (7M):</strong> 5 tons e meio</li>
                        <li><strong>8ª justa:</strong> 6 tons (repete a nota)</li>
                    </ul>
                `,
                quiz: {
                    question: "O intervalo de 3ª maior corresponde a qual distância?",
                    options: ["1 tom", "2 tons", "3 tons", "1 tom e meio"],
                    correctIndex: 1,
                    feedbackCorrect: "Exato! Uma 3ª maior, como de C para E, possui 2 tons de distância.",
                    feedbackWrong: "Incorreto. Uma 3ª maior são 2 tons. 1 tom e meio seria uma 3ª menor."
                }
            },
            {
                id: "l1_4",
                title: "1.4 Graus da Escala",
                content: `
                    <p>Os graus são as posições das notas dentro de uma escala, representados por algarismos romanos: <strong>I – II – III – IV – V – VI – VII</strong>.</p>
                    
                    <p>Eles nos ajudam a transportar uma ideia (progressão ou melodia) para qualquer tonalidade. Em Dó Maior (C):</p>
                    <div style="background: var(--bg-card); padding: 15px; border-radius: 8px; font-family: monospace;">
                        I &nbsp;= C (Tônica)<br>
                        II = D<br>
                        III= E<br>
                        IV = F<br>
                        V &nbsp;= G<br>
                        VI = A<br>
                        VII= B
                    </div>
                `,
                quiz: {
                    question: "Qual é o V grau na escala de C Maior?",
                    options: ["E", "F", "G", "A"],
                    correctIndex: 2,
                    feedbackCorrect: "Perfeito! C(I) -> D(II) -> E(III) -> F(IV) -> G(V).",
                    feedbackWrong: "Incorreto. Conte a partir do C como 1. O número 5 será o G."
                }
            }
        ]
    },
    {
        id: "m2",
        title: "Módulo 2 — Como as escalas são construídas",
        description: "Descubra como fórmulas matemáticas simples geram escalas inteiras.",
        status: "available",
        lessons: [
            {
                id: "l2_1",
                title: "2.1 Escala Maior",
                content: `
                    <h3>A Fórmula Mestra</h3>
                    <p>Uma escala maior não é uma lista aleatória de notas. Ela é construída aplicando a seguinte fórmula de intervalos a partir de qualquer tônica:</p>
                    <div style="text-align:center; font-size: 1.2rem; margin: 15px 0; color: var(--primary-color); font-weight: bold;">
                        TOM - TOM - SEMITOM - TOM - TOM - TOM - SEMITOM
                    </div>
                    
                    <h3>Exemplo: C Maior</h3>
                    <p>Partindo de C: C (+Tom) D (+Tom) E (+Semitom) F (+Tom) G (+Tom) A (+Tom) B (+Semitom) C.</p>
                    
                    <h3>Exemplo: G Maior</h3>
                    <p>Partindo de G: G (+Tom) A (+Tom) B (+Semitom) C (+Tom) D (+Tom) E (+Tom)... e agora?</p>
                    <p>De E, precisamos de 1 Tom. O F natural está a 1 semitom de E. Para obtermos 1 Tom inteiro, o F precisa virar <strong>F#</strong>. Depois, de F# para G temos o último Semitom. Eis o motivo dos sustenidos existirem na armadura!</p>
                    
                    <div style="text-align: center; margin: 20px;">
                        <button class="btn btn-outline" onclick="goToAppTab('escalas')">Explorar as Escalas</button>
                    </div>
                `,
                quiz: {
                    question: "Por que a escala de G maior possui um F#?",
                    options: [
                        "Porque F# soa mais bonito.",
                        "Para respeitar a distância de 1 Tom entre o 6º e 7º grau.",
                        "Porque G não combina com F natural.",
                        "Foi uma escolha aleatória dos gregos."
                    ],
                    correctIndex: 1,
                    feedbackCorrect: "Exatamente! A fórmula T-T-ST-T-T-T-ST força o F a virar F#.",
                    feedbackWrong: "Incorreto. A alteração existe estritamente para que a fórmula matemática dos intervalos (T-T-ST-T-T-T-ST) seja mantida."
                }
            },
            {
                id: "l2_2",
                title: "2.2 Escalas Menores",
                content: `
                    <h3>A Escala Menor Natural</h3>
                    <p>A fórmula da menor natural é <strong>T - ST - T - T - ST - T - T</strong>. O 3º grau é uma 3ª menor (distância de 1 tom e meio), o que dá o som característico de "tristeza" à escala menor.</p>
                    
                    <h3>Menor Harmônica</h3>
                    <p>Na escala menor natural, do VII grau (ex: G na escala de Am) para a Tônica (A), a distância é de 1 Tom. O ouvido ocidental gosta da tensão de um semitom empurrando para a tônica.</p>
                    <p>Por isso criaram a <strong>Menor Harmônica</strong>, elevando o VII grau em um semitom (G vira G# em Am). O VII grau passa a ser uma nota Sensível!</p>
                `,
                quiz: {
                    question: "Qual é a principal diferença da Escala Menor Harmônica em relação à Menor Natural?",
                    options: [
                        "O 3º grau é elevado.",
                        "O 7º grau é elevado em 1 semitom, criando uma Sensível.",
                        "O 5º grau é diminuto.",
                        "Ela possui apenas 6 notas."
                    ],
                    correctIndex: 1,
                    feedbackCorrect: "Correto! O 7º grau (subtônica) é alterado para criar tensão em direção à tônica.",
                    feedbackWrong: "Incorreto. A marca da menor harmônica é a alteração do VII grau."
                }
            }
        ]
    },
    {
        id: "m3",
        title: "Módulo 3 — Modos",
        status: "available",
        description: "Entenda o que são os modos gregos e como a mesma escala pode ter sete sonoridades diferentes.",
        lessons: [
            {
                id: "l3_1",
                title: "3.1 O que são Modos?",
                content: `
                    <p>Imagine que você tem a escala de C Maior (C - D - E - F - G - A - B). O que acontece se você tocar essas <strong>mesmas notas</strong>, mas der destaque para a nota D como sendo a "Tônica" (a base musical)?</p>
                    <p>Você cria uma escala de D (D - E - F - G - A - B - C), mas que não soa como D Maior nem como D Menor Natural. Ela tem um som próprio. Isso é um <strong>Modo</strong>.</p>
                    <p>Como a escala maior possui 7 notas, existem 7 Modos Gregos:</p>
                    <ol style="margin-left: 20px;">
                        <li><strong>Jônio:</strong> Partindo do I grau (Maior natural)</li>
                        <li><strong>Dórico:</strong> Partindo do II grau (Menor com 6ª maior)</li>
                        <li><strong>Frígio:</strong> Partindo do III grau (Menor com 2ª menor)</li>
                        <li><strong>Lídio:</strong> Partindo do IV grau (Maior com 4ª aumentada)</li>
                        <li><strong>Mixolídio:</strong> Partindo do V grau (Maior com 7ª menor)</li>
                        <li><strong>Eólio:</strong> Partindo do VI grau (Menor natural)</li>
                        <li><strong>Lócrio:</strong> Partindo do VII grau (Menor com 5ª diminuta)</li>
                    </ol>
                `,
                quiz: {
                    question: "Quantos modos gregos existem em uma escala maior?",
                    options: ["5", "7", "12", "Depende da tonalidade"],
                    correctIndex: 1,
                    feedbackCorrect: "Exato! Há um modo para cada grau (nota) da escala maior.",
                    feedbackWrong: "Incorreto. A escala maior tem 7 notas, logo, gera 7 modos."
                }
            },
            {
                id: "l3_2",
                title: "3.2 Modos Maiores e Menores",
                content: `
                    <p>Uma forma fácil de aprender os modos é categorizá-los. Baseado no acorde que geram, 3 modos são Maiores, 3 são Menores e 1 é Meio-Diminuto:</p>
                    
                    <h3>Modos Maiores (Têm 3ª Maior)</h3>
                    <ul class="interval-list">
                        <li><strong>Jônio:</strong> Escala maior padrão (T T ST T T T ST). Som alegre.</li>
                        <li><strong>Lídio:</strong> Escala maior com a 4ª aumentada (#4). Som flutuante e onírico.</li>
                        <li><strong>Mixolídio:</strong> Escala maior com a 7ª menor (b7). Som bluesy, de "estrada".</li>
                    </ul>

                    <h3>Modos Menores (Têm 3ª Menor)</h3>
                    <ul class="interval-list">
                        <li><strong>Eólio:</strong> Escala menor padrão. Som triste, melancólico.</li>
                        <li><strong>Dórico:</strong> Escala menor com a 6ª maior. Som "jazzy", noturno e sofisticado.</li>
                        <li><strong>Frígio:</strong> Escala menor com a 2ª menor (b2). Som ibérico, flamenco, tenso.</li>
                    </ul>
                `,
                quiz: {
                    question: "O modo Dórico é uma variação de qual escala base e qual intervalo o diferencia?",
                    options: [
                        "Escala maior, com 4ª aumentada.",
                        "Escala menor natural, com 6ª maior.",
                        "Escala menor harmônica, com 7ª maior.",
                        "Escala maior, com 7ª menor."
                    ],
                    correctIndex: 1,
                    feedbackCorrect: "Correto! O Dórico é muito parecido com o Eólio (menor natural), mas com a 6M que tira um pouco do tom sombrio.",
                    feedbackWrong: "Incorreto. O Dórico é gerado no 2º grau e é um modo menor. O seu traço distintivo é a sexta maior."
                }
            }
        ]
    },
    {
        id: "m4",
        title: "Módulo 4 — Escalas pentatônicas e blues",
        status: "available",
        description: "A escala mais famosa da guitarra, as 5 notas mágicas e o poder da Blue Note.",
        lessons: [
            {
                id: "l4_1",
                title: "4.1 O que é a Pentatônica?",
                content: `
                    <p>Como o nome sugere (Penta = 5), é uma escala formada por apenas 5 notas. Ela é a escala mais utilizada no rock, blues, pop e folk porque ao remover os semitons (que causam tensão), qualquer nota soa bem quase sempre!</p>
                    
                    <h3>Pentatônica Maior</h3>
                    <p>Formada tirando o 4º e 7º graus da escala maior. Em C: <strong>C, D, E, G, A</strong>.</p>
                    
                    <h3>Pentatônica Menor</h3>
                    <p>Formada tirando o 2º e 6º graus da escala menor. Em Am: <strong>A, C, D, E, G</strong>.</p>
                    
                    <p>Lembra da regra relativa? C Maior tem as mesmas notas de A Menor! Logo, a <strong>Penta Maior de C tem as mesmas notas da Penta Menor de A</strong>. O que muda é a tônica (onde repousamos).</p>
                `,
                quiz: {
                    question: "Quais graus são retirados da escala Menor Natural para formar a Pentatônica Menor?",
                    options: ["1º e 5º", "3º e 7º", "2º e 6º", "4º e 7º"],
                    correctIndex: 2,
                    feedbackCorrect: "Exato! Retirando o 2º grau (ex: B em Am) e o 6º grau (ex: F em Am), evitamos os intervalos de semitom, que geram dissonância.",
                    feedbackWrong: "Incorreto. A Penta Menor tira os graus que gerariam semitons. Na menor natural, esses são o 2º e o 6º."
                }
            },
            {
                id: "l4_2",
                title: "4.2 A Escala Blues (Blue Note)",
                content: `
                    <p>A escala Blues é, essencialmente, a Pentatônica Menor com a adição de uma única nota muito especial: a <strong>Blue Note</strong>.</p>
                    <p>A Blue Note é o intervalo de <strong>quinta diminuta (b5)</strong> ou quarta aumentada (#4). Ela gera uma tensão extremamente expressiva antes de repousar na quarta justa (4J) ou quinta justa (5J).</p>
                    
                    <h3>Blues Menor de A</h3>
                    <div style="background: var(--bg-card); padding: 15px; border-radius: 8px; font-family: monospace;">
                        Am Pentatônica: A - C - D - E - G<br>
                        A Blues: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A - C - D - <strong>D# (b5)</strong> - E - G
                    </div>
                    
                    <p>Essa nota não pertence à tonalidade original, ela existe apenas como uma "nota de passagem" para sujar o som e dar aquele choro característico do blues e rock n' roll.</p>
                `,
                quiz: {
                    question: "Qual intervalo representa a Blue Note clássica adicionada à pentatônica menor?",
                    options: ["Terça Maior (3M)", "Quinta Diminuta (b5)", "Sétima Maior (7M)", "Segunda Menor (b2)"],
                    correctIndex: 1,
                    feedbackCorrect: "Correto! O b5 (trítono) é a famosa Blue Note. No shape de Am, é o Eb (ou D#).",
                    feedbackWrong: "Incorreto. A Blue Note é a quinta diminuta (ou quarta aumentada), conhecida popularmente como 'b5'."
                }
            }
        ]
    },
    {
        id: "m5",
        title: "Módulo 5 — Formação de acordes",
        status: "available",
        description: "Entenda a matemática por trás dos acordes: tríades, tétrades e dissonâncias.",
        lessons: [
            {
                id: "l5_1",
                title: "5.1 Tríades (Acordes básicos)",
                content: `
                    <p>O que define um acorde? Em geral, a execução simultânea de três ou mais notas. A estrutura mais básica é a <strong>Tríade</strong>, formada sempre saltando uma nota na escala (1, 3 e 5).</p>
                    <p>Existem 4 tipos de tríades principais:</p>
                    <ul class="interval-list">
                        <li><strong>Maior:</strong> Tônica + 3ª Maior + 5ª Justa. (Ex: C E G) - Som forte, alegre.</li>
                        <li><strong>Menor:</strong> Tônica + 3ª Menor + 5ª Justa. (Ex: C Eb G) - Som triste, dramático.</li>
                        <li><strong>Diminuta:</strong> Tônica + 3ª Menor + 5ª Diminuta (b5). (Ex: C Eb Gb) - Som de suspense.</li>
                        <li><strong>Aumentada:</strong> Tônica + 3ª Maior + 5ª Aumentada (#5). (Ex: C E G#) - Som de tensão fantasiosa.</li>
                    </ul>
                `,
                quiz: {
                    question: "Quais intervalos formam um acorde Maior?",
                    options: [
                        "Tônica, 3ª menor e 5ª justa.",
                        "Tônica, 3ª maior e 5ª aumentada.",
                        "Tônica, 3ª maior e 5ª justa.",
                        "Tônica, 4ª justa e 5ª justa."
                    ],
                    correctIndex: 2,
                    feedbackCorrect: "Exato! C, E, G em C Maior.",
                    feedbackWrong: "Incorreto. Um acorde maior requer uma terça maior e uma quinta justa."
                }
            },
            {
                id: "l5_2",
                title: "5.2 Tétrades (Acordes com 7ª)",
                content: `
                    <p>Quando adicionamos uma quarta nota à tríade (novamente pulando uma, ou seja, o 7º grau), criamos a <strong>Tétrade</strong>. Isso adiciona "cor" e sofisticação ao acorde, muito usado no jazz, MPB e bossa nova.</p>
                    
                    <h3>Tipos Principais:</h3>
                    <ul class="interval-list">
                        <li><strong>Sétima Maior (maj7 / 7M):</strong> Tríade Maior + 7ª Maior. (Ex: C E G B) - Som sofisticado, aconchegante.</li>
                        <li><strong>Sétima da Dominante (7):</strong> Tríade Maior + 7ª Menor. (Ex: C E G Bb) - Som bluesy, que pede resolução.</li>
                        <li><strong>Menor com Sétima (m7):</strong> Tríade Menor + 7ª Menor. (Ex: C Eb G Bb) - Som relaxado e urbano.</li>
                        <li><strong>Meio Diminuto (m7b5):</strong> Tríade Diminuta + 7ª Menor. (Ex: C Eb Gb Bb) - Tensão, transição.</li>
                    </ul>
                `,
                quiz: {
                    question: "O acorde 'Dominante' (ex: G7) é formado por uma tríade Maior e qual tipo de sétima?",
                    options: ["Sétima Maior", "Sétima Menor", "Sétima Diminuta", "Nenhuma das anteriores"],
                    correctIndex: 1,
                    feedbackCorrect: "Correto! O 7 (ex: G7) indica uma sétima MENOR adicionada a uma tríade MAIOR. Isso gera o famoso trítono entre a 3M e a b7.",
                    feedbackWrong: "Incorreto. A notação '7' sozinha (como em C7) significa sétima menor. Para sétima maior, usaríamos maj7 ou 7M."
                }
            }
        ]
    },
    { id: "m6", title: "Módulo 6 — Campo harmônico", status: "locked", description: "Em breve." },
    { id: "m7", title: "Módulo 7 — Funções harmônicas", status: "locked", description: "Em breve." },
    { id: "m8", title: "Módulo 8 — Progressões e lógica harmônica", status: "locked", description: "Em breve." },
    { id: "m9", title: "Módulo 9 — Ciclo das Quintas", status: "locked", description: "Em breve." },
    { id: "m10", title: "Módulo 10 — Teoria aplicada ao braço", status: "locked", description: "Em breve." },
    { id: "m11", title: "Módulo 11 — Inversões e baixo do acorde", status: "locked", description: "Em breve." },
    { id: "m12", title: "Módulo 12 — Como identificar acordes", status: "locked", description: "Em breve." }
];

// Navigation from academy to other tools
window.goToAppTab = function(tabId) {
    const tabLink = document.querySelector(`.nav-links li[data-target="${tabId}"]`);
    if (tabLink) {
        tabLink.click();
    }
}

// Render the dashboard
function renderAcademyDashboard() {
    const dashboard = document.getElementById("academy-dashboard");
    const lessonView = document.getElementById("academy-lesson-view");
    
    dashboard.style.display = "grid";
    lessonView.style.display = "none";
    
    dashboard.innerHTML = ""; // Clear
    
    academyModules.forEach(mod => {
        const card = document.createElement("div");
        card.className = "card academy-card " + (mod.status === "locked" ? "locked" : "");
        
        // Count progress
        let lessonsCompleted = 0;
        let totalLessons = mod.lessons ? mod.lessons.length : 0;
        if(mod.lessons && academyState.progress[mod.id]) {
            lessonsCompleted = Object.keys(academyState.progress[mod.id]).length;
        }
        
        let progressHtml = "";
        if (totalLessons > 0) {
            let percentage = Math.round((lessonsCompleted / totalLessons) * 100);
            progressHtml = `
                <div class="progress-bar-bg" style="background: var(--bg-color); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 15px;">
                    <div class="progress-bar-fill" style="background: var(--primary-color); height: 100%; width: ${percentage}%"></div>
                </div>
                <div style="font-size: 0.8rem; text-align: right; margin-top: 5px; color: var(--text-muted);">${percentage}% concluído</div>
            `;
        }

        card.innerHTML = `
            <h3>${mod.title}</h3>
            <p>${mod.description}</p>
            ${progressHtml}
            ${mod.status === "available" ? `<button class="btn btn-outline" style="margin-top:15px; width:100%" onclick="openModule('${mod.id}')">Acessar Módulo</button>` : `<p style="color: var(--text-muted); font-weight: bold; margin-top:15px;">Em breve...</p>`}
        `;
        dashboard.appendChild(card);
    });
}

// Global functions for inline HTML event handlers
window.openModule = function(moduleId) {
    const mod = academyModules.find(m => m.id === moduleId);
    if(!mod || mod.status === "locked") return;
    
    academyState.currentModule = mod;
    
    // Find first incomplete lesson, or just start at first
    let lessonToOpen = mod.lessons[0];
    if(academyState.progress[mod.id]) {
        for(let l of mod.lessons) {
            if(!academyState.progress[mod.id][l.id]) {
                lessonToOpen = l;
                break;
            }
        }
    }
    
    openLesson(lessonToOpen.id);
};

window.openLesson = function(lessonId) {
    const mod = academyState.currentModule;
    const lesson = mod.lessons.find(l => l.id === lessonId);
    if(!lesson) return;
    
    academyState.currentLesson = lesson;
    
    const dashboard = document.getElementById("academy-dashboard");
    const lessonView = document.getElementById("academy-lesson-view");
    const container = document.getElementById("lesson-content-container");
    
    dashboard.style.display = "none";
    lessonView.style.display = "block";
    
    // Find index for next button
    const lessonIndex = mod.lessons.findIndex(l => l.id === lesson.id);
    const hasNext = lessonIndex < mod.lessons.length - 1;
    
    container.innerHTML = `
        <h2>${lesson.title}</h2>
        <div class="lesson-text">
            ${lesson.content}
        </div>
        
        ${lesson.quiz ? renderQuiz(lesson.quiz) : ''}
        
        <div class="lesson-navigation" style="margin-top: 40px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 20px;">
            <button class="btn" id="btn-complete-lesson">${hasNext ? "Concluir e Próxima Aula" : "Concluir Módulo"}</button>
        </div>
    `;
    
    if(lesson.quiz) {
        setupQuizListeners(lesson.quiz);
    }
    
    document.getElementById("btn-complete-lesson").onclick = () => {
        // Mark progress
        if(!academyState.progress[mod.id]) academyState.progress[mod.id] = {};
        academyState.progress[mod.id][lesson.id] = true;
        
        if(hasNext) {
            openLesson(mod.lessons[lessonIndex + 1].id);
        } else {
            renderAcademyDashboard();
        }
    };
};

function renderQuiz(quiz) {
    let optionsHtml = quiz.options.map((opt, idx) => `
        <button class="btn-quiz-option" data-idx="${idx}">${opt}</button>
    `).join('');
    
    return `
        <div class="quiz-container">
            <h3>Teste Rápido</h3>
            <p class="quiz-question">${quiz.question}</p>
            <div class="quiz-options">
                ${optionsHtml}
            </div>
            <div class="quiz-feedback" style="display:none; padding: 15px; margin-top: 15px; border-radius: 8px; font-weight: bold;"></div>
        </div>
    `;
}

function setupQuizListeners(quiz) {
    const options = document.querySelectorAll('.btn-quiz-option');
    const feedbackBox = document.querySelector('.quiz-feedback');
    
    options.forEach(opt => {
        opt.onclick = (e) => {
            // clear previous selections
            options.forEach(o => {
                o.classList.remove('selected', 'correct', 'wrong');
                o.disabled = true; // disable after answer
            });
            
            const selectedIdx = parseInt(e.target.getAttribute('data-idx'));
            e.target.classList.add('selected');
            
            feedbackBox.style.display = "block";
            
            if(selectedIdx === quiz.correctIndex) {
                e.target.classList.add('correct');
                feedbackBox.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
                feedbackBox.style.color = '#2ecc71';
                feedbackBox.style.border = '1px solid #2ecc71';
                feedbackBox.innerHTML = '✅ ' + quiz.feedbackCorrect;
            } else {
                e.target.classList.add('wrong');
                options[quiz.correctIndex].classList.add('correct'); // Show correct one
                feedbackBox.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
                feedbackBox.style.color = '#e74c3c';
                feedbackBox.style.border = '1px solid #e74c3c';
                feedbackBox.innerHTML = '❌ ' + quiz.feedbackWrong;
                
                // Allow try again if wrong
                setTimeout(() => {
                    options.forEach(o => {
                        o.classList.remove('selected', 'correct', 'wrong');
                        o.disabled = false;
                    });
                    feedbackBox.style.display = "none";
                }, 4000);
            }
        };
    });
}

// Initialize listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-back-academy").onclick = () => {
        renderAcademyDashboard();
    };
    
    // Initial render if academy is active
    if(document.getElementById("academy").classList.contains("active")) {
        renderAcademyDashboard();
    }
    
    // Bind to the nav links to render dashboard when clicking "Academy"
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(link.getAttribute('data-target') === 'academy') {
                renderAcademyDashboard();
            }
        });
    });
});
