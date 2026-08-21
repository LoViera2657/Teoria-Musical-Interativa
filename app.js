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

// --- UI INTERACTION ---

document.addEventListener("DOMContentLoaded", () => {
    
    // Navigation
    const navLinks = document.querySelectorAll(".nav-links li");
    const sections = document.querySelectorAll(".section");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Remove active class from all
            navLinks.forEach(nav => nav.classList.remove("active"));
            sections.forEach(sec => sec.classList.remove("active"));

            // Add active class to clicked
            link.classList.add("active");
            const targetId = link.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        });
    });

    // Populate Selects
    const selectEscala = document.getElementById("root-note-escala");
    const selectCampo = document.getElementById("root-note-campo");

    notes.forEach(note => {
        let opt1 = document.createElement("option");
        opt1.value = note;
        opt1.textContent = note;
        selectEscala.appendChild(opt1);

        let opt2 = document.createElement("option");
        opt2.value = note;
        opt2.textContent = note;
        selectCampo.appendChild(opt2);
    });

    // Render Functions
    function renderScales() {
        const root = selectEscala.value;
        const container = document.getElementById("escalas-results");
        container.innerHTML = "";

        for (const [name, formula] of Object.entries(formulas)) {
            const scaleNotes = generateScale(root, formula);
            
            const groupDiv = document.createElement("div");
            groupDiv.className = "scale-group";
            
            const title = document.createElement("h4");
            title.textContent = `Escala ${name}`;
            groupDiv.appendChild(title);
            
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
        const root = selectCampo.value;
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

    // Event Listeners for Selects
    selectEscala.addEventListener("change", renderScales);
    selectCampo.addEventListener("change", renderHarmonicFields);

    // --- SHAPES LOGIC ---
    const selectShapeRoot = document.getElementById("root-note-shape");
    const selectShapeScale = document.getElementById("scale-type-shape");
    const fretboardContainer = document.getElementById("fretboard");

    // Populate shape root select
    notes.forEach(note => {
        let opt = document.createElement("option");
        opt.value = note;
        opt.textContent = note;
        selectShapeRoot.appendChild(opt);
    });

    // Populate shape scale select
    Object.keys(formulas).forEach(scaleName => {
        let opt = document.createElement("option");
        opt.value = scaleName;
        opt.textContent = scaleName;
        selectShapeScale.appendChild(opt);
    });

    const guitarStrings = ["E", "B", "G", "D", "A", "E"]; // High E to Low E
    const numFrets = 15; // 0 (nut) to 14

    function renderFretboard() {
        const root = selectShapeRoot.value;
        const scaleType = selectShapeScale.value;
        
        const scaleNotes = generateScale(root, formulas[scaleType]);
        
        fretboardContainer.innerHTML = "";
        const board = document.createElement("div");
        board.className = "fretboard";
        
        guitarStrings.forEach(stringOpenNote => {
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
                }
                
                stringDiv.appendChild(fretDiv);
            }
            
            board.appendChild(stringDiv);
        });
        
        fretboardContainer.appendChild(board);
    }

    selectShapeRoot.addEventListener("change", renderFretboard);
    selectShapeScale.addEventListener("change", renderFretboard);

    // Initial Render
    renderScales();
    renderHarmonicFields();
    renderFretboard();

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
    const chordRootSelect = document.getElementById("chord-root");
    notes.forEach(note => {
        let opt = document.createElement("option");
        opt.value = note;
        opt.textContent = note;
        chordRootSelect.appendChild(opt);
    });

    const movableShapesDB = [
        // CAGED System - MAIOR
        { suffix: "", quality: "Maior", name: "Formato C", rootStr: 4, frets: [-3, -2, -3, -1, 0, "X"] },
        { suffix: "", quality: "Maior", name: "Formato A", rootStr: 4, frets: [0, 2, 2, 2, 0, "X"] },
        { suffix: "", quality: "Maior", name: "Formato G", rootStr: 5, frets: [0, 0, -3, -3, -1, 0] },
        { suffix: "", quality: "Maior", name: "Formato E", rootStr: 5, frets: [0, 0, 1, 2, 2, 0] },
        { suffix: "", quality: "Maior", name: "Formato D", rootStr: 3, frets: [2, 3, 2, 0, "X", "X"] },

        // MENOR
        { suffix: "m", quality: "Menor", name: "Formato E", rootStr: 5, frets: [0, 0, 0, 2, 2, 0] },
        { suffix: "m", quality: "Menor", name: "Formato A", rootStr: 4, frets: [0, 1, 2, 2, 0, "X"] },
        { suffix: "m", quality: "Menor", name: "Formato D", rootStr: 3, frets: [1, 3, 2, 0, "X", "X"] },

        // Power Chords
        { suffix: "5", quality: "Power Chord", name: "Raiz na 6ª", rootStr: 5, frets: ["X", "X", "X", 2, 2, 0] },
        { suffix: "5", quality: "Power Chord", name: "Raiz na 5ª", rootStr: 4, frets: ["X", "X", 2, 2, 0, "X"] },
        { suffix: "5", quality: "Power Chord", name: "Raiz na 4ª", rootStr: 3, frets: ["X", 3, 2, 0, "X", "X"] },

        // DOMINANTE (7)
        { suffix: "7", quality: "Dominante", name: "Formato E", rootStr: 5, frets: [0, 0, 1, 0, 2, 0] },
        { suffix: "7", quality: "Dominante", name: "Formato A", rootStr: 4, frets: [0, 2, 0, 2, 0, "X"] },
        { suffix: "7", quality: "Dominante", name: "Formato C", rootStr: 4, frets: ["X", -2, -2, -1, 0, "X"] },
        { suffix: "7", quality: "Dominante", name: "Formato D", rootStr: 3, frets: [2, 1, 2, 0, "X", "X"] },

        // MENOR 7 (m7)
        { suffix: "m7", quality: "Menor com 7ª", name: "Formato E", rootStr: 5, frets: [0, 0, 0, 0, 2, 0] },
        { suffix: "m7", quality: "Menor com 7ª", name: "Formato A", rootStr: 4, frets: [0, 1, 0, 2, 0, "X"] },
        { suffix: "m7", quality: "Menor com 7ª", name: "Formato D", rootStr: 3, frets: [1, 1, 2, 0, "X", "X"] },

        // MAIOR 7 (maj7)
        { suffix: "maj7", quality: "Maior com 7ª", name: "Formato E", rootStr: 5, frets: ["X", 0, 1, 1, "X", 0] },
        { suffix: "maj7", quality: "Maior com 7ª", name: "Formato A", rootStr: 4, frets: [0, 2, 1, 2, 0, "X"] },
        { suffix: "maj7", quality: "Maior com 7ª", name: "Formato C", rootStr: 4, frets: [-3, -3, -3, -1, 0, "X"] }
    ];

    function renderChordDictionary() {
        const root = chordRootSelect.value;
        const container = document.getElementById("chord-dict-results");
        container.innerHTML = "";

        movableShapesDB.forEach(shape => {
            const rootOpenNote = guitarStrings[shape.rootStr];
            let rootOffset = -1;
            // Encontra a nota tônica na corda base (tentando até a 24ª casa para cobrir acordes com posições relativas negativas)
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

            const box = document.createElement("div");
            box.className = "chord-dict-box";
            
            box.innerHTML = `<h4>${root}${shape.suffix}</h4>
                             <div class="chord-fret-start">${shape.quality}<br/>${rootOffset === 0 ? "Posição Aberta" : "Inicia na Casa " + rootOffset}</div>`;

            // Draw diagram
            const diagContainer = document.createElement("div");
            diagContainer.className = "diagram-container";

            const nutControls = document.createElement("div");
            nutControls.className = "diagram-nut-controls";

            // Figure out min/max fret for drawing
            let actualFrets = [];
            shape.frets.forEach(f => {
                actualFrets.push(f === "X" ? "X" : rootOffset + f);
            });

            // Find lowest fret > 0 to start drawing
            let startFret = 1;
            let highestFret = 4;
            let fretsPlayed = actualFrets.filter(f => f !== "X" && f > 0);
            if (fretsPlayed.length > 0) {
                startFret = Math.min(...fretsPlayed);
                highestFret = Math.max(...fretsPlayed);
            }
            if (startFret > 2) {
                // Not open chords, show standard 4 frets box
                highestFret = Math.max(startFret + 3, highestFret);
            } else {
                startFret = 1;
                highestFret = Math.max(4, highestFret);
            }

            // Draw Nut/X/O
            // Order for display: Low E (index 5) to High E (index 0)
            for (let i = 5; i >= 0; i--) {
                const ctrl = document.createElement("span");
                if (actualFrets[i] === "X") {
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
                grid.style.borderTop = "2px solid var(--border)"; // Normal border instead of thick nut
            }

            for (let f = startFret; f <= highestFret; f++) {
                const fretRow = document.createElement("div");
                fretRow.className = "diagram-fret";
                
                for (let i = 5; i >= 0; i--) {
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

    chordRootSelect.addEventListener("change", renderChordDictionary);

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
            intervals.sort((a,b) => a - b);
            
            for (let [chordName, formula] of Object.entries(chordFormulas)) {
                if (intervals.length === formula.length) {
                    let match = true;
                    for (let i=0; i<formula.length; i++) {
                        if (intervals[i] !== formula[i]) match = false;
                    }
                    if (match) {
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
        
        let activeNotes = [];

        guitarStrings.forEach((stringOpenNote, strIdx) => {
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
                activeNotes.push(stringOpenNote);
            } else {
                ctrl.textContent = "-";
            }
            
            ctrl.addEventListener("click", () => {
                if (identState[strIdx] === "X") identState[strIdx] = 0;
                else if (identState[strIdx] === 0) identState[strIdx] = "X";
                else identState[strIdx] = "X";
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
                    activeNotes.push(noteAtFret);
                }
                
                fretDiv.addEventListener("click", () => {
                    identState[strIdx] = fret;
                    updateIdentState();
                });
                
                stringDiv.appendChild(fretDiv);
            }
            container.appendChild(stringDiv);
        });
        
        let uniqueNotes = [...new Set(activeNotes)];
        
        document.getElementById("identified-notes-list").textContent = uniqueNotes.length > 0 ? "Notas: " + uniqueNotes.join(", ") : "Selecione notas no braço abaixo";
        document.getElementById("identified-chord-name").textContent = identifyChordLogic(uniqueNotes);
    }

    function updateIdentState() {
        renderIdentFretboard();
    }

    renderChordDictionary();
    renderIdentFretboard();
});
