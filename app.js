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
});
