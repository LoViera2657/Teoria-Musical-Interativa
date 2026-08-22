/**
 * Music Theory Logic & App Interaction
 */

// --- MUSIC THEORY ENGINE ---

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Scale Formulas (T = 2 semitones, ST = 1 semitone)
const formulas = {
    "Maior": [2, 2, 1, 2, 2, 2, 1],
    "Menor Natural": [2, 1, 2, 2, 1, 2, 2],
    "Menor Harmônica": [2, 1, 2, 2, 1, 3, 1],
    "Menor Melódica": [2, 1, 2, 2, 2, 2, 1],
    "Dórico": [2, 1, 2, 2, 2, 1, 2],
    "Frígio": [1, 2, 2, 2, 1, 2, 2],
    "Lídio": [2, 2, 2, 1, 2, 2, 1],
    "Mixolídio": [2, 2, 1, 2, 2, 1, 2],
    "Lócrio": [1, 2, 2, 1, 2, 2, 2],
    "Pentatônica Maior": [2, 2, 3, 2, 3],
    "Pentatônica Menor": [3, 2, 2, 3, 2],
    "Pentatônica Blues": [3, 2, 1, 1, 3, 2],
    "Tons Inteiros": [2, 2, 2, 2, 2, 2],
    "Diminuta": [2, 1, 2, 1, 2, 1, 2, 1]
};

// Degrees in Roman Numerals
const degrees = ["I", "II", "III", "IV", "V", "VI", "VII"];

/**
 * Gets the note at a specific interval from a root note.
 */
function getNote(root, semitones) {
    let rootIndex = notes.indexOf(root);
    if (rootIndex === -1) return "?";

    let targetIndex = (rootIndex + semitones) % 12;
    return notes[targetIndex];
}

/**
 * Generates a scale given a root note and a formula.
 */
function generateScale(root, formula) {
    let scale = [root];
    let currentSemitones = 0;

    // We only iterate up to formula.length - 1 to get 7 notes for heptatonic (last interval completes octave)
    for (let i = 0; i < formula.length - 1; i++) {
        currentSemitones += formula[i];
        scale.push(getNote(root, currentSemitones));
    }
    return scale;
}

/**
 * Generates harmonic field (Triads) for Major and Minor scales.
 * Simplified for demonstration (ignores some enharmonic spelling rules).
 */
function generateHarmonicField(root, type) {
    const scale = generateScale(root, formulas[type]);
    const field = [];

    if (type === "Maior") {
        // I, ii, iii, IV, V, vi, vii°
        const qualities = ["", "m", "m", "", "", "m", "dim"];
        for (let i = 0; i < 7; i++) {
            field.push({ degree: degrees[i], chord: scale[i] + qualities[i] });
        }
    } else if (type === "Menor Natural") {
        // i, ii°, III, iv, v, VI, VII
        const qualities = ["m", "dim", "", "m", "m", "", ""];
        for (let i = 0; i < 7; i++) {
            field.push({ degree: degrees[i].toLowerCase(), chord: scale[i] + qualities[i] });
        }
    }
    return field;
}

// --- AUDIO ENGINE ---
let audioCtx = null;

function playFrequency(freq) {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle'; // Closer to string pluck than sine
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Simple ADSR envelope for string pluck effect
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.125, audioCtx.currentTime + 0.02); // attack (lower volume)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5); // decay

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
}

function playNote(stringIdx, fret) {
    // Standard tuning frequencies from High E (row 0) to Low E (row 5)
    const baseFrequencies = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41];
    const freq = baseFrequencies[stringIdx] * Math.pow(2, fret / 12);
    playFrequency(freq);
}

function playAbstractScale(scaleNotes, speedMs = 500, onNotePlay = null, onComplete = null) {
    let delay = 0;
    let currentOctave = 3;
    let lastNoteIndex = -1;
    
    scaleNotes.forEach((noteName, idx) => {
        let cleanNoteName = noteName;
        // Se houver opções alternativas de enarmonia, tente a primeira (ex: C#/Db -> C#)
        if (cleanNoteName.includes("/")) cleanNoteName = cleanNoteName.split("/")[0];
        
        let noteIndex = notes.indexOf(cleanNoteName);
        if (noteIndex === -1) {
            // Em caso de erro com bemóis que não estão no array 'notes' (que usa sustenidos)
            // Tenta forçar a conversão ou ignora
            noteIndex = 0; // Fallback
        }

        if (noteIndex < lastNoteIndex) {
            currentOctave++; // cruzou o Dó, subiu de oitava
        }
        lastNoteIndex = noteIndex;
        
        // C3 é ~130.81Hz
        let c3Freq = 130.81;
        let freq = c3Freq * Math.pow(2, noteIndex / 12) * Math.pow(2, currentOctave - 3);
        
        setTimeout(() => {
            playFrequency(freq);
            if (onNotePlay) onNotePlay(noteName, idx);
        }, delay);
        
        delay += speedMs;
    });
    
    if (onComplete) {
        setTimeout(onComplete, delay);
    }
}

// --- UI INTERACTION ---

let playbackTimeouts = [];

function stopPlayback() {
    playbackTimeouts.forEach(id => clearTimeout(id));
    playbackTimeouts = [];
    
    document.querySelectorAll(".playing-note").forEach(el => el.classList.remove("playing-note"));
    
    const playBtn = document.getElementById("btn-play-shape");
    const stopBtn = document.getElementById("btn-stop-shape");
    if (playBtn) playBtn.style.display = "inline-block";
    if (stopBtn) stopBtn.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {

    // Navigation
    const navLinks = document.querySelectorAll(".nav-links li");
    const sections = document.querySelectorAll(".section");

    navLinks.forEach(link => {
        const handleClick = () => {
            // Remove active class from all
            navLinks.forEach(nav => nav.classList.remove("active"));
            sections.forEach(sec => sec.classList.remove("active"));

            // Add active class to clicked
            link.classList.add("active");
            const targetId = link.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        };

        link.addEventListener("click", handleClick);
        
        // Keyboard accessibility
        link.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
            }
        });
    });

    // Populate Selects
    let activeState = {
        escala: "C",
        campo: "C",
        shape: "C",
        chord: "C",
        prog: "C"
    };

    function createNoteSelector(containerId, stateKey, callback) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const flatMap = { "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb" };
        
        notes.forEach(note => {
            const btn = document.createElement("button");
            btn.className = "note-btn";
            
            let displayNote = flatMap[note] ? `${note}/${flatMap[note]}` : note;
            let ariaLabel = flatMap[note] ? `Nota ${note} ou ${flatMap[note]}` : `Nota ${note}`;
            
            btn.setAttribute("aria-label", ariaLabel);
            
            if (note === "C") {
                btn.classList.add("active");
                btn.setAttribute("aria-pressed", "true");
            } else {
                btn.setAttribute("aria-pressed", "false");
            }
            
            btn.textContent = displayNote;
            btn.onclick = () => {
                container.querySelectorAll('.note-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                activeState[stateKey] = note;
                callback();
            };
            container.appendChild(btn);
        });
    }

    createNoteSelector("root-note-escala", "escala", renderScales);
    createNoteSelector("root-note-campo", "campo", renderHarmonicFields);

    // Render Functions
    function renderScales() {
        const root = activeState.escala;
        const container = document.getElementById("escalas-results");
        container.innerHTML = "";

        for (const [name, formula] of Object.entries(formulas)) {
            const scaleNotes = generateScale(root, formula);

            const groupDiv = document.createElement("div");
            groupDiv.className = "scale-group";

            const title = document.createElement("h4");
            title.textContent = `Escala ${name}`;
            
            const playScaleBtn = document.createElement("button");
            playScaleBtn.className = "play-scale-btn";
            playScaleBtn.innerHTML = '🔊 Tocar';
            playScaleBtn.onclick = () => {
                const boxes = groupDiv.querySelectorAll(".note-box");
                playAbstractScale(scaleNotes, 600, (noteName, idx) => {
                    boxes.forEach(b => b.classList.remove("playing-note"));
                    if (boxes[idx]) boxes[idx].classList.add("playing-note");
                }, () => {
                    boxes.forEach(b => b.classList.remove("playing-note"));
                });
            };
            
            const headerDiv = document.createElement("div");
            headerDiv.style.display = "flex";
            headerDiv.style.justifyContent = "space-between";
            headerDiv.style.alignItems = "center";
            headerDiv.appendChild(title);
            headerDiv.appendChild(playScaleBtn);
            
            groupDiv.appendChild(headerDiv);

            const notesRow = document.createElement("div");
            notesRow.className = "notes-row";

            scaleNotes.forEach((n, idx) => {
                const noteBox = document.createElement("div");
                noteBox.className = "note-box";

                const deg = document.createElement("span");
                deg.className = "degree";
                deg.textContent = idx + 1; // numeric degree

                noteBox.appendChild(deg);
                noteBox.appendChild(document.createTextNode(n));
                notesRow.appendChild(noteBox);
            });

            groupDiv.appendChild(notesRow);
            container.appendChild(groupDiv);
        }
    }

    function renderHarmonicFields() {
        const root = activeState.campo;
        const container = document.getElementById("campos-results");
        container.innerHTML = "";

        const types = ["Maior", "Menor Natural"];

        types.forEach(type => {
            const field = generateHarmonicField(root, type);

            const groupDiv = document.createElement("div");
            groupDiv.className = "field-group";

            const title = document.createElement("h4");
            title.textContent = `Campo Harmônico ${type}`;
            groupDiv.appendChild(title);

            const chordsRow = document.createElement("div");
            chordsRow.className = "chords-row";

            field.forEach((item) => {
                const chordBox = document.createElement("div");
                chordBox.className = "chord-box";

                const deg = document.createElement("span");
                deg.className = "degree";
                deg.textContent = item.degree;

                chordBox.appendChild(deg);
                chordBox.appendChild(document.createTextNode(item.chord));
                chordsRow.appendChild(chordBox);
            });

            groupDiv.appendChild(chordsRow);
            container.appendChild(groupDiv);
        });
    }

    // --- PROGRESSIONS LOGIC ---
    const progressionsDB = [
        { name: "Progressão Pop (Axis)", numerals: ["I", "V", "vi", "IV"], description: "A progressão mais famosa da música pop. Presente em sucessos como 'Let It Be' e 'Don't Stop Believin'." },
        { name: "Doo-Wop (Anos 50)", numerals: ["I", "vi", "IV", "V"], description: "Clássica do Rock and Roll dos anos 50 e baladas românticas." },
        { name: "Jazz Base (ii-V-I)", numerals: ["ii", "V", "I"], description: "A fundação da harmonia do Jazz, cria forte tensão e resolução." },
        { name: "Andalusa (Flamenco)", numerals: ["vi", "V", "IV", "III"], description: "Progressão descendente característica da música flamenca e espanhola (aqui descrita em relação ao tom Maior)." },
        { name: "Empréstimo e Substituto", numerals: ["IV", "iii", "vi", "v", "I"], description: "Progressão rica que usa o 'v' menor (empréstimo mixolídio) criando tensão melancólica antes de resolver." },
        { name: "Classic Rock", numerals: ["I", "bVII", "IV"], description: "Sonoridade típica do Classic Rock usando o bVII do modo Mixolídio (ex: Sweet Home Alabama)." },
        { name: "Estradas Reais (Royal Road / J-Pop)", numerals: ["IVmaj7", "V7", "iii", "vi"], description: "A 'Oudo Shinko' ou Estrada Real. Progressão onipresente em Anime Songs e música japonesa, carrega um sentimento nostálgico e épico." },
        { name: "Épica Melancólica (Estilo 'Creep')", numerals: ["I", "III7", "IV", "iv"], description: "Usa o acorde maior do III grau (dominante secundária) e finaliza com o iv (empréstimo modal menor), criando um som denso e triste." },
        { name: "Cadência Nintendo (Heróica)", numerals: ["bVI", "bVII", "I"], description: "Super comum em trilhas de videogame (como Mario ou Zelda). Usa acordes 'emprestados' da escala menor para criar um final triunfante." },
        { name: "Canon de Pachelbel", numerals: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"], description: "Uma progressão erudita do século 17 que provou ser tão eficiente que é reciclada até hoje na música Pop." },
        { name: "Cadência Plagal Menor (Magia)", numerals: ["I", "IV", "iv", "I"], description: "A famosa mudança do acorde Maior para o Menor (IV - iv). Cria uma sensação mágica, doce e melancólica, muito usada por John Williams, Disney e Beatles." },
        { name: "R&B / Neo-Soul Sofisticado", numerals: ["ii7", "V7", "iii7", "vi7"], description: "Uma cadeia de acordes com sétima menor. O iii7 atuando no lugar do I grau cria um balanço contínuo sem repouso definitivo." }
    ];

    function resolveRomanNumeral(root, numeral, keyType) {
        // keyType: "Maior" or "Menor"
        // Base structure relies on Major scale intervals:
        // I, ii, iii, IV, V, vi, vii°
        // If keyType is Menor, the relative root is 3 semitones up, but it's easier to just compute from the selected root treating it as I.
        // Wait, if user selects "Am" as Menor, we treat A as the root.
        // To parse numeral:
        let isMinor = numeral === numeral.toLowerCase() && !numeral.includes("°");
        let isDim = numeral.includes("°");
        let hasFlat = numeral.startsWith("b");
        let hasSharp = numeral.startsWith("#");
        
        let baseNumeral = numeral.replace(/[^IV]/gi, "").toUpperCase();
        
        const romanToInt = { "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7 };
        let degree = romanToInt[baseNumeral];
        
        // Major scale intervals from root (1 to 7)
        const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
        
        let semitonesFromRoot = majorIntervals[degree - 1];
        if (hasFlat) semitonesFromRoot -= 1;
        if (hasSharp) semitonesFromRoot += 1;
        
        // If the key itself is Minor, the root is treated as "i" usually.
        // But in our UI, if the user selects Key: C Minor, and we ask for "vi", in a minor key "vi" usually means the 6th degree of minor (which is Ab).
        // It's much simpler to evaluate the Roman Numerals relative to the MAJOR parallel, OR to adjust if keyType="Menor".
        // Often, Roman Numerals for minor keys are written relative to the minor scale (i, ii°, III, iv, v, VI, VII).
        // Let's adjust intervals if keyType is "Menor":
        const minorIntervals = [0, 2, 3, 5, 7, 8, 10]; // 1, 2, b3, 4, 5, b6, b7
        
        if (keyType === "Menor") {
            semitonesFromRoot = minorIntervals[degree - 1];
            if (hasFlat) semitonesFromRoot -= 1;
            if (hasSharp) semitonesFromRoot += 1;
        }
        
        // Calculate the chord root note
        let rootIdx = notes.indexOf(root);
        let chordRootIdx = (rootIdx + semitonesFromRoot + 12) % 12;
        let chordRootNote = notes[chordRootIdx];
        
        // Convert to flat if the numeral asks for a flat (e.g. bVII -> Bb instead of A#)
        const flatMap = { "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb" };
        if (hasFlat && chordRootNote.includes("#")) {
            chordRootNote = flatMap[chordRootNote];
        }
        
        // Quality
        let quality = "";
        if (isMinor) quality = "m";
        if (isDim) quality = "dim";
        
        // Extensions
        if (numeral.includes("maj7")) quality += "maj7";
        else if (numeral.includes("m7")) {
            if (!quality.includes("m")) quality = "m7";
            else quality += "7";
        }
        else if (numeral.includes("7")) quality += "7";
        
        return chordRootNote + quality;
    }

    function renderProgressions() {
        const root = activeState.prog;
        const keyTypeSelect = document.getElementById("key-type-prog");
        if (!keyTypeSelect) return;
        const keyType = keyTypeSelect.value;
        
        const container = document.getElementById("progressoes-results");
        container.innerHTML = "";

        progressionsDB.forEach(prog => {
            const card = document.createElement("div");
            card.className = "progression-card";
            
            card.innerHTML = `
                <h4>${prog.name}</h4>
                <p>${prog.description}</p>
            `;
            
            const chordsRow = document.createElement("div");
            chordsRow.className = "progression-chords";
            
            prog.numerals.forEach(numeral => {
                const chordName = resolveRomanNumeral(root, numeral, keyType);
                
                const box = document.createElement("div");
                box.className = "progression-chord-box";
                
                box.innerHTML = `
                    <span class="numeral">${numeral}</span>
                    <span class="chord-name">${chordName}</span>
                `;
                chordsRow.appendChild(box);
            });
            
            card.appendChild(chordsRow);
            container.appendChild(card);
        });
    }

    createNoteSelector("root-note-prog", "prog", renderProgressions);
    const keyTypeProgSelect = document.getElementById("key-type-prog");
    if (keyTypeProgSelect) {
        keyTypeProgSelect.addEventListener("change", renderProgressions);
    }

    // --- SHAPES LOGIC ---
    createNoteSelector("root-note-shape", "shape", renderFretboard);
    const selectShapeScale = document.getElementById("scale-type-shape");
    const fretboardContainer = document.getElementById("fretboard");

    // Populate shape scale select
    Object.keys(formulas).forEach(scaleName => {
        let opt = document.createElement("option");
        opt.value = scaleName;
        opt.textContent = scaleName;
        selectShapeScale.appendChild(opt);
    });

    const guitarStrings = ["E", "B", "G", "D", "A", "E"]; // High E to Low E
    const numFrets = 15; // 0 (nut) to 14

    function createFretMarkersRow() {
        const row = document.createElement("div");
        row.className = "markers-row";
        
        for (let fret = 0; fret <= numFrets; fret++) {
            const cell = document.createElement("div");
            cell.className = "marker-cell";
            if (fret === 0) {
                cell.style.flex = "0.5";
            }
            
            if ([5, 9, 15].includes(fret)) {
                cell.innerHTML = '<div class="inlay-bottom"></div>';
            } else if ([7, 12].includes(fret)) {
                cell.innerHTML = '<div class="inlay-bottom"></div><div class="inlay-bottom"></div>';
            }
            
            row.appendChild(cell);
        }
        return row;
    }

    function renderFretboard() {
        stopPlayback(); // Stop any ongoing playback when re-rendering
        
        const root = activeState.shape;
        const scaleType = selectShapeScale.value;

        const scaleNotes = generateScale(root, formulas[scaleType]);
        let fretboardNotes = [];

        fretboardContainer.innerHTML = "";
        const board = document.createElement("div");
        board.className = "fretboard";

        guitarStrings.forEach((stringOpenNote, rowIdx) => {
            const stringDiv = document.createElement("div");
            stringDiv.className = "string";

            for (let fret = 0; fret <= numFrets; fret++) {
                const fretDiv = document.createElement("div");
                fretDiv.className = "fret";

                let noteAtFret = getNote(stringOpenNote, fret);

                if (scaleNotes.includes(noteAtFret)) {
                    const marker = document.createElement("div");
                    marker.className = "fret-marker";
                    if (noteAtFret === root) {
                        marker.classList.add("root");
                    }
                    marker.textContent = noteAtFret;
                    fretDiv.appendChild(marker);
                    
                    const baseFrequencies = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41];
                    const freq = baseFrequencies[rowIdx] * Math.pow(2, fret / 12);
                    
                    fretboardNotes.push({
                        noteName: noteAtFret,
                        stringIdx: rowIdx,
                        fret: fret,
                        freq: freq,
                        element: marker
                    });
                }
                
                fretDiv.addEventListener("click", () => {
                    playNote(rowIdx, fret);
                });

                stringDiv.appendChild(fretDiv);
            }

            board.appendChild(stringDiv);
        });

        board.appendChild(createFretMarkersRow());
        fretboardContainer.appendChild(board);
        
        // Setup shape player
        const playBtn = document.getElementById("btn-play-shape");
        const stopBtn = document.getElementById("btn-stop-shape");
        const speedInput = document.getElementById("shapes-speed");
        const speedVal = document.getElementById("shapes-speed-val");
        
        if (speedInput && speedVal) {
            speedInput.oninput = () => {
                speedVal.textContent = speedInput.value;
            };
        }
        
        if (stopBtn) {
            stopBtn.onclick = () => stopPlayback();
        }
        
        if (playBtn) {
            playBtn.onclick = () => {
                stopPlayback();
                
                playBtn.style.display = "none";
                if (stopBtn) stopBtn.style.display = "inline-block";
                
                const bpm = parseInt(speedInput.value, 10);
                const delayMs = 60000 / bpm; // quarter note duration in ms
                
                // Extract CAGED-like positional shapes based on Low E string
                let lowENotes = fretboardNotes.filter(n => n.stringIdx === 5);
                lowENotes.sort((a, b) => a.fret - b.fret);
                
                let sequenceToPlay = [];
                
                lowENotes.forEach(rootNote => {
                    let startFret = rootNote.fret;
                    let minFret = Math.max(0, startFret - 1);
                    let maxFret = startFret + 3;
                    
                    let shapeNotes = fretboardNotes.filter(n => n.fret >= minFret && n.fret <= maxFret);
                    
                    // Sort shape notes: String (Low E to High E), then Fret (Low to High)
                    shapeNotes.sort((a, b) => {
                        if (a.stringIdx !== b.stringIdx) {
                            return b.stringIdx - a.stringIdx; // 5 -> 0 (Low E to High E)
                        }
                        return a.fret - b.fret; // Ascending frets
                    });
                    
                    sequenceToPlay.push(shapeNotes);
                });
                
                let delay = 0;
                sequenceToPlay.forEach((shapeNotes, shapeIdx) => {
                    shapeNotes.forEach((noteData) => {
                        let tid = setTimeout(() => {
                            playFrequency(noteData.freq);
                            fretboardNotes.forEach(n => n.element.classList.remove("playing-note"));
                            noteData.element.classList.add("playing-note");
                        }, delay);
                        playbackTimeouts.push(tid);
                        delay += delayMs;
                    });
                    
                    // Add an extra pause between shapes to distinguish them
                    delay += delayMs * 2;
                });
                
                // Cleanup at the end
                let tidEnd = setTimeout(() => {
                    fretboardNotes.forEach(n => n.element.classList.remove("playing-note"));
                    playBtn.style.display = "inline-block";
                    if (stopBtn) stopBtn.style.display = "none";
                }, delay);
                playbackTimeouts.push(tidEnd);
            };
        }
    }

    // (selectShapeRoot is handled by buttons)
    selectShapeScale.addEventListener("change", renderFretboard);

    // Initial Render
    renderScales();
    renderHarmonicFields();
    renderFretboard();
    renderProgressions();

    // --- CHORDS TAB LOGIC ---

    // Mode toggling
    const btnModeDict = document.getElementById("btn-mode-dict");
    const btnModeIdent = document.getElementById("btn-mode-ident");
    const modeDictContainer = document.getElementById("mode-dict-container");
    const modeIdentContainer = document.getElementById("mode-ident-container");

    btnModeDict.addEventListener("click", () => {
        btnModeDict.classList.add("active");
        btnModeIdent.classList.remove("active");
        modeDictContainer.style.display = "block";
        modeIdentContainer.style.display = "none";
    });

    btnModeIdent.addEventListener("click", () => {
        btnModeIdent.classList.add("active");
        btnModeDict.classList.remove("active");
        modeIdentContainer.style.display = "block";
        modeDictContainer.style.display = "none";
    });

    // --- DICTIONARY MODE ---
    createNoteSelector("chord-root", "chord", renderChordDictionary);

    const movableShapesDB = [
        // MAIOR
        { suffix: "", quality: "Maior", name: "Formato E", rootStr: 0, frets: [0, 2, 2, 1, 0, 0] },
        { suffix: "", quality: "Maior", name: "Formato A", rootStr: 1, frets: ["X", 0, 2, 2, 2, 0] },
        { suffix: "", quality: "Maior", name: "Formato C", rootStr: 1, frets: ["X", 0, -1, -3, -2, -3] },
        { suffix: "", quality: "Maior", name: "Formato G", rootStr: 0, frets: [0, -1, -3, -3, -3, 0] },
        { suffix: "", quality: "Maior", name: "Formato D", rootStr: 2, frets: ["X", "X", 0, 2, 3, 2] },

        // MENOR
        { suffix: "m", quality: "Menor", name: "Formato Em", rootStr: 0, frets: [0, 2, 2, 0, 0, 0] },
        { suffix: "m", quality: "Menor", name: "Formato Am", rootStr: 1, frets: ["X", 0, 2, 2, 1, 0] },
        { suffix: "m", quality: "Menor", name: "Formato Dm", rootStr: 2, frets: ["X", "X", 0, 2, 3, 1] },

        // INVERSÕES (Maior/3ª)
        { suffix: "/3", quality: "Maior/Baixo na 3ª", name: "Formato C/E", rootStr: 1, frets: [-3, 0, -1, -3, -2, -3] },
        { suffix: "/3", quality: "Maior/Baixo na 3ª", name: "Formato D/F#", rootStr: 2, frets: [2, 0, 0, 2, 3, 2] },
        { suffix: "/3", quality: "Maior/Baixo na 3ª", name: "Formato G/B", rootStr: 3, frets: ["X", 2, 0, 0, 0, 3] },
        { suffix: "/3", quality: "Maior/Baixo na 3ª", name: "Formato A/C#", rootStr: 3, frets: ["X", 2, 0, 0, 0, "X"] },

        // INVERSÕES (Maior/5ª)
        { suffix: "/5", quality: "Maior/Baixo na 5ª", name: "Formato E/B", rootStr: 0, frets: [2, 2, 2, 1, 0, 0] }, // E shape, root on 6th, but played starting 5th string? No, E/B means B in the bass. Standard E/B: 7th fret [7, 7, 9, 9, 9, 7]? Open E/B is [X, 2, 2, 1, 0, 0] where 5th string (B) is bass. 
        // Let's adjust E/B (open: X, 2, 2, 1, 0, 0) - root is E on 4th string fret 2
        { suffix: "/5", quality: "Maior/Baixo na 5ª", name: "Formato E/B (Aberto)", rootStr: 2, frets: ["X", 0, 0, -1, -2, -2] },
        { suffix: "/5", quality: "Maior/Baixo na 5ª", name: "Formato C/G", rootStr: 1, frets: [0, 0, -1, -3, -2, -3] },
        
        // Power Chords
        { suffix: "5", quality: "Power Chord", name: "Raiz na 6ª", rootStr: 0, frets: [0, 2, 2, "X", "X", "X"] },
        { suffix: "5", quality: "Power Chord", name: "Raiz na 5ª", rootStr: 1, frets: ["X", 0, 2, 2, "X", "X"] },
        { suffix: "5", quality: "Power Chord", name: "Raiz na 4ª", rootStr: 2, frets: ["X", "X", 0, 2, 3, "X"] },

        // DOMINANTE (7)
        { suffix: "7", quality: "Dominante", name: "Formato E7", rootStr: 0, frets: [0, 2, 0, 1, 0, 0] },
        { suffix: "7", quality: "Dominante", name: "Formato A7", rootStr: 1, frets: ["X", 0, 2, 0, 2, 0] },
        { suffix: "7", quality: "Dominante", name: "Formato C7", rootStr: 1, frets: ["X", 0, -1, 0, -2, "X"] },
        { suffix: "7", quality: "Dominante", name: "Formato D7", rootStr: 2, frets: ["X", "X", 0, 2, 1, 2] },

        // MENOR 7 (m7)
        { suffix: "m7", quality: "Menor com 7ª", name: "Formato Em7", rootStr: 0, frets: [0, 2, 0, 0, 0, 0] },
        { suffix: "m7", quality: "Menor com 7ª", name: "Formato Am7", rootStr: 1, frets: ["X", 0, 2, 0, 1, 0] },
        { suffix: "m7", quality: "Menor com 7ª", name: "Formato Dm7", rootStr: 2, frets: ["X", "X", 0, 2, 1, 1] },

        // MAIOR 7 (maj7)
        { suffix: "maj7", quality: "Maior com 7ª", name: "Formato Emaj7", rootStr: 0, frets: [0, 2, 1, 1, 0, 0] },
        { suffix: "maj7", quality: "Maior com 7ª", name: "Formato Amaj7", rootStr: 1, frets: ["X", 0, 2, 1, 2, 0] },
        { suffix: "maj7", quality: "Maior com 7ª", name: "Formato Cmaj7", rootStr: 1, frets: ["X", 0, -1, -3, 0, -3] }
    ];

    function renderChordDictionary() {
        const root = activeState.chord;
        const container = document.getElementById("chord-dict-results");
        container.innerHTML = "";

        const dictStrings = ["E", "A", "D", "G", "B", "E"];

        movableShapesDB.forEach(shape => {
            const rootOpenNote = dictStrings[shape.rootStr];
            let rootOffset = -1;
            // Encontra a nota tônica na corda base
            for (let i = 0; i <= 24; i++) {
                if (getNote(rootOpenNote, i) === root) {
                    let validOffset = true;
                    shape.frets.forEach(f => {
                        if (f !== "X" && i + f < 0) validOffset = false;
                    });

                    if (validOffset) {
                        rootOffset = i;
                        break;
                    }
                }
            }

            // Se não encontrou uma posição válida no braço, ignora este shape para esta tônica
            if (rootOffset === -1) return;

            // Figure out min/max fret for drawing
            let actualFrets = [];
            shape.frets.forEach(f => {
                actualFrets.push(f === "X" ? "X" : rootOffset + f);
            });

            let bassNoteStr = "";
            for (let i = 0; i <= 5; i++) {
                if (actualFrets[i] !== "X") {
                    bassNoteStr = getNote(dictStrings[i], actualFrets[i]);
                    break;
                }
            }

            let displayTitle = `${root}${shape.suffix}`;
            if (shape.suffix.startsWith("/")) {
                displayTitle += ` (${bassNoteStr})`;
            }

            const box = document.createElement("div");
            box.className = "chord-dict-box";

            box.innerHTML = `<h4>${displayTitle}</h4>
                             <div class="chord-fret-start">${shape.quality}<br/>${rootOffset === 0 ? "Posição Aberta" : "Inicia na Casa " + rootOffset}</div>`;

            const playBtn = document.createElement("button");
            playBtn.className = "play-chord-btn";
            playBtn.innerHTML = '🔊';
            playBtn.setAttribute("aria-label", `Ouvir acorde ${displayTitle}`);
            playBtn.onclick = () => {
                let delay = 0;
                for (let i = 0; i <= 5; i++) {
                    if (actualFrets[i] !== "X") {
                        setTimeout(() => playNote(5 - i, actualFrets[i]), delay);
                        delay += 40; // strum effect
                    }
                }
            };
            box.appendChild(playBtn);

            // Draw diagram
            const diagContainer = document.createElement("div");
            diagContainer.className = "diagram-container";

            let lowestFret = 999;
            let highestFret = -1;
            actualFrets.forEach(f => {
                if (f !== "X" && f > 0) {
                    if (f < lowestFret) lowestFret = f;
                    if (f > highestFret) highestFret = f;
                }
            });

            let startFret = 1;
            if (highestFret > 4) {
                startFret = lowestFret;
            }
            if (highestFret === -1) highestFret = 4; // All open strings or muted

            const nutControls = document.createElement("div");
            nutControls.className = "diagram-nut-controls";

            for (let i = 0; i <= 5; i++) {
                const ctrl = document.createElement("span");
                if (startFret > 1 && i === 0) {
                    ctrl.textContent = startFret + "fr";
                    ctrl.style.fontSize = "0.7rem";
                    ctrl.style.color = "var(--text-muted)";
                } else if (actualFrets[i] === "X") {
                    ctrl.className = "muted";
                    ctrl.textContent = "X";
                } else if (actualFrets[i] === 0) {
                    ctrl.className = "open";
                    ctrl.textContent = "O";
                } else {
                    ctrl.textContent = " ";
                }
                nutControls.appendChild(ctrl);
            }
            diagContainer.appendChild(nutControls);

            const grid = document.createElement("div");
            grid.className = "diagram-grid";

            if (startFret > 1) {
                grid.style.borderTop = "2px solid var(--border)";
            }

            for (let f = startFret; f <= Math.max(startFret + 3, highestFret); f++) {
                const fretRow = document.createElement("div");
                fretRow.className = "diagram-fret";

                for (let i = 0; i <= 5; i++) {
                    const stringCol = document.createElement("div");
                    stringCol.className = "diagram-string";

                    if (actualFrets[i] === f) {
                        const marker = document.createElement("div");
                        marker.className = "diagram-marker";
                        if (i === shape.rootStr && shape.frets[i] === 0) {
                            marker.classList.add("root");
                        }
                        stringCol.appendChild(marker);
                    }
                    fretRow.appendChild(stringCol);
                }
                grid.appendChild(fretRow);
            }

            diagContainer.appendChild(grid);
            box.appendChild(diagContainer);
            container.appendChild(box);
        });
    }

    // (chordRootSelect handled by buttons)
    // --- IDENTIFIER MODE (Reverse Finder) ---
    let identState = ["X", "X", "X", "X", "X", "X"];

    function identifyChordLogic(selectedNotes) {
        if (selectedNotes.length < 3) return "---";

        const chordFormulas = {
            "Maior": [4, 7],
            "Menor (m)": [3, 7],
            "Aumentado (aug)": [4, 8],
            "Diminuto (dim)": [3, 6],
            "Sétima Maior (maj7)": [4, 7, 11],
            "Sétima Menor (m7)": [3, 7, 10],
            "Dominante (7)": [4, 7, 10],
            "Meio Diminuto (m7b5)": [3, 6, 10],
            "Diminuto 7 (dim7)": [3, 6, 9]
        };

        let lowestNote = selectedNotes[0];
        let result = "Desconhecido";

        for (let root of selectedNotes) {
            let rootIdx = notes.indexOf(root);

            let intervals = [];
            for (let n of selectedNotes) {
                if (n !== root) {
                    let nIdx = notes.indexOf(n);
                    let diff = (nIdx - rootIdx + 12) % 12;
                    intervals.push(diff);
                }
            }
            intervals.sort((a, b) => a - b);

            for (let [chordName, formula] of Object.entries(chordFormulas)) {
                if (intervals.length === formula.length) {
                    let match = true;
                    for (let i = 0; i < formula.length; i++) {
                        if (intervals[i] !== formula[i]) match = false;
                    }
                    if (match) {
                        if (root !== lowestNote) {
                            return `${root} ${chordName} (${root}/${lowestNote})`;
                        }
                        return `${root} ${chordName}`;
                    }
                }
            }
        }
        return result;
    }

    function renderIdentFretboard() {
        const container = document.getElementById("interactive-fretboard");
        container.innerHTML = "";

        let activeNotes = new Array(6).fill(null);
        const dictStrings = ["E", "A", "D", "G", "B", "E"];
        
        let rowIdx = 0;
        for (let strIdx = 5; strIdx >= 0; strIdx--) {
            let stringOpenNote = dictStrings[strIdx];
            const stringDiv = document.createElement("div");
            stringDiv.className = "string";

            const nutDiv = document.createElement("div");
            nutDiv.className = "fret";
            nutDiv.style.flex = "0.5";

            const ctrl = document.createElement("span");
            ctrl.className = "string-control";

            let currentState = identState[strIdx];
            if (currentState === "X") {
                ctrl.classList.add("muted");
                ctrl.textContent = "X";
            } else if (currentState === 0) {
                ctrl.classList.add("open");
                ctrl.textContent = "O";
                activeNotes[strIdx] = stringOpenNote;
            } else {
                ctrl.textContent = "-";
            }

            ctrl.addEventListener("click", () => {
                if (identState[strIdx] === "X") identState[strIdx] = 0;
                else if (identState[strIdx] === 0) identState[strIdx] = "X";
                else identState[strIdx] = "X";
                
                if (identState[strIdx] === 0) {
                    playNote(5 - strIdx, 0); // Play open string
                }
                
                updateIdentState();
            });

            nutDiv.appendChild(ctrl);
            stringDiv.appendChild(nutDiv);

            for (let fret = 1; fret <= numFrets; fret++) {
                const fretDiv = document.createElement("div");
                fretDiv.className = "fret";

                let noteAtFret = getNote(stringOpenNote, fret);

                if (currentState === fret) {
                    const marker = document.createElement("div");
                    marker.className = "fret-marker selected";
                    marker.style.backgroundColor = "var(--success)";
                    marker.textContent = noteAtFret;
                    fretDiv.appendChild(marker);
                    activeNotes[strIdx] = noteAtFret;
                }

                fretDiv.addEventListener("click", () => {
                    playNote(5 - strIdx, fret);
                    identState[strIdx] = fret;
                    updateIdentState();
                });

                stringDiv.appendChild(fretDiv);
            }
            container.appendChild(stringDiv);
            rowIdx++;
        }
        
        container.appendChild(createFretMarkersRow());

        let validNotes = activeNotes.filter(n => n !== null);
        let uniqueNotes = [...new Set(validNotes)];

        document.getElementById("identified-notes-list").textContent = uniqueNotes.length > 0 ? "Notas: " + uniqueNotes.join(", ") : "Selecione notas no braço abaixo";
        document.getElementById("identified-chord-name").textContent = identifyChordLogic(uniqueNotes);
    }

    function updateIdentState() {
        renderIdentFretboard();
    }

    renderChordDictionary();
    renderIdentFretboard();
});
