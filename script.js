
// ================ Dark Mode =================

const darkBtn = document.getElementById('darkToggle');
(function initDark() {
    const enabled = localStorage.getItem('dark') === '1';
    document.body.classList.toggle('dark', enabled);
    darkBtn.textContent = enabled ? '☀️ Light Mode' : '🌙 Dark Mode';
})();
darkBtn.addEventListener('click', () => {
    const now = !document.body.classList.contains('dark');
    document.body.classList.toggle('dark', now);
    localStorage.setItem('dark', now ? '1' : '0');
    darkBtn.textContent = now ? '☀️ Light Mode' : '🌙 Dark Mode';
});// ================ Elemente & State =================

const form = document.getElementById('planForm');
const resultDiv = document.getElementById('result');
const loader = document.getElementById('loader');
const exportBtn = document.getElementById('exportPDF');
const kcalBtn = document.getElementById('berechneKalorien');
const kcalOut = document.getElementById('kalorienResult');

let DB = null; // uebungen.json wird hier geladen

let planData = []; // Globale Variable für Trainingsplandaten

// ================ Datenbank laden =================

async function loadDB() {
    const res = await fetch('uebungen.json');
    if (!res.ok) throw new Error('uebungen.json konnte nicht geladen werden');
    DB = await res.json();
}

loadDB().catch(err => {
    console.error(err);
    resultDiv.innerHTML = `<div class="muted">Fehler: ${err.message}</div>`;
});// ================ Utils =================

const rnd = (arr, n) => {
    const copy = [...arr];
    const out = [];
    while (copy.length && out.length < n) {
        const i = Math.floor(Math.random() * copy.length);
        out.push(copy.splice(i, 1)[0]);
    }
    return out;
};
const ensureArray = v => Array.isArray(v) ? v : [v];

function pickByGroup(group, equipment) {
    const list = DB.exercises.filter(x =>
        x.group === group &&
        (equipment === 'any' || x.equipment.includes(equipment) || x.equipment.includes('any'))
    );
    return list;
}

function setsRepsByLevel(level, ziel) {
    // Basis-Schemata

    const map = {
        einsteiger: {sets: 3, reps: "8–12", rest: "60–90s"},
        fortgeschritten: {sets: 4, reps: "6–10", rest: "90s"},
        profi: {sets: 5, reps: "4–8", rest: "120s"}
    };
    const base = map[level] || map.einsteiger;

    // Ziel-Anpassung

    if (ziel === 'fettabbau') return {...base, rest: "45–75s"};
    if (ziel === 'kraft') return {...base, reps: "3–6", rest: "120–180s"};
    return base; // muskelaufbau / allgemein

}

function progressionNote(week) {
    if (week === 1) return "Woche 1: Technik & moderat (RPE 6–7).";
    if (week === 2) return "Woche 2: +1 Wdh. pro Satz (oder +2.5% Last).";
    if (week === 3) return "Woche 3: +1 Satz bei Hauptübungen.";
    return "Woche 4: Deload – -20% Volumen/Intensität, Fokus Technik.";
}

function renderLine(txt, cls) {
    return `<div class="${cls || ''}">${txt}</div>`;
}

function renderList(items) {
    return `<ul class="list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}// Funktion zum Gruppieren der Übungen nach Tagen

function groupBy(array, key) {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}// ================ Plan-Generator =================

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!DB) {
        resultDiv.innerHTML = '<div class="muted">Übungsdaten werden noch geladen…</div>';
        return;
    }

    const ziel = document.getElementById('ziel').value;
    const level = document.getElementById('level').value;
    const tage = parseInt(document.getElementById('tage').value, 10);
    const planTyp = document.getElementById('planTyp').value;
    const equipment = document.getElementById('equipment').value;
    const dauer = parseInt(document.getElementById('dauer').value, 10);

    loader.classList.remove('hide');
    resultDiv.innerHTML = '';

    const schema = setsRepsByLevel(level, ziel);
    const weeks = 4;
    const out = [];
    planData = []; // Leere Array für neue Datensammlung

    // Tages-Tags je nach Plan

    const dayTag = (i) => {
        if (planTyp === 'ppl') {
            const m = i % 3;
            return m === 0 ? 'Push' : m === 1 ? 'Pull' : 'Legs';
        }
        if (planTyp === 'upper_lower') {
            return (i % 2 === 0) ? 'Upper' : 'Lower';
        }
        return 'Fullbody';
    };

    for (let w = 1; w <= weeks; w++) {
        out.push(renderLine(`Woche ${w}`, 'week'));
        out.push(renderLine(progressionNote(w), 'hint'));

        for (let d = 1; d <= tage; d++) {
            const tagName = dayTag(d - 1);
            out.push(renderLine(`Tag ${d} – ${tagName}`, 'day'));

            // Übungen auswählen

            let exList = [];
            if (planTyp === 'ppl') {
                if (tagName === 'Push') {
                    const chest = pickByGroup('push', equipment);
                    exList = rnd(chest, 5);
                } else if (tagName === 'Pull') {
                    const pull = pickByGroup('pull', equipment);
                    exList = rnd(pull, 5);
                } else {
                    const legs = pickByGroup('legs', equipment);
                    exList = rnd(legs, 5);
                }
            } else if (planTyp === 'upper_lower') {
                if (tagName === 'Upper') {
                    const upper = [...pickByGroup('push', equipment), ...pickByGroup('pull', equipment)];
                    exList = rnd(upper, 5);
                } else {
                    const lower = pickByGroup('legs', equipment);
                    exList = rnd(lower, 5);
                }
            } else { // fullbody

                const sel = [
                    rnd(pickByGroup('push', equipment), 1),
                    rnd(pickByGroup('pull', equipment), 1),
                    rnd(pickByGroup('legs', equipment), 1),
                    rnd(pickByGroup('core', equipment), 1),
                    rnd(pickByGroup('misc', equipment), 1)
                ].flat().filter(Boolean);
                // ggf. auf 5 kürzen / auffüllen

                exList = sel.slice(0, 5);
                if (exList.length < 5) {
                    const pool = [...pickByGroup('push', equipment), ...pickByGroup('pull', equipment), ...pickByGroup('legs', equipment)];
                    exList = [...exList, ...rnd(pool, 5 - exList.length)];

                }
            }

            // Sätze/Wdh/Rest + Week-Progression anwenden

            const lines = exList.map((ex, idx) => {
                const sets = schema.sets + (w === 3 && idx < 2 ? 1 : 0) - (w === 4 ? 1 : 0);
                const reps = (w === 2 && ziel !== 'kraft') ? (schema.reps.replace('8–12', '9–13').replace('6–10', '7–11')) : schema.reps;
                const rest = (w === 4) ? (schema.rest.toString().replace('120–180s', '90–150s').replace('90s', '75s').replace('60–90s', '45–75s')) : schema.rest;
                planData.push({ day: `Tag ${d} – ${tagName}`, exercise: ex.name, sets, reps, duration: rest });
                return `${ex.name} — ${sets}×${reps} — Pause ${rest}`;
            });

            out.push(renderList(lines));
        }
    }

    resultDiv.innerHTML = out.join('');
    loader.classList.add('hide');
});

// ================ Kalorienrechner =================

kcalBtn.addEventListener('click', () => {
    const alter = parseInt(document.getElementById('alter').value, 10);
    const gewicht = parseFloat(document.getElementById('gewicht').value);
    const groesse = parseInt(document.getElementById('groesse').value, 10);
    const geschlecht = document.getElementById('geschlecht').value;
    const aktiv = parseFloat(document.getElementById('aktivitaet').value);

    if (!alter || !gewicht || !groesse || !aktiv) {
        kcalOut.textContent = 'Bitte alle Felder korrekt ausfüllen.';
        return;
    }
    const bmr = (geschlecht === 'm')
        ? (10 * gewicht + 6.25 * groesse - 5 * alter + 5)
        : (10 * gewicht + 6.25 * groesse - 5 * alter - 161);

    const tdee = Math.round(bmr * aktiv);
    kcalOut.textContent = `Geschätzter Tagesbedarf (TDEE): ~ ${tdee} kcal/Tag.`;
});// ================ PDF-Export =================

exportBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        alert('jsPDF nicht geladen. Du kannst alternativ die Browser-Druckfunktion (Strg/Cmd+P) → „Als PDF speichern“ verwenden.');
        return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Trainingsplan", 14, 22);

    const daysData = groupBy(planData, 'day');
    let startY = 30;
    for (let day in daysData) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 255); // Farbe für die Tagesüberschrift

        doc.text(day, 14, startY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Standard Farbe für den Text

        const tableColumns = ["Übung", "Sätze", "Wiederholungen", "Dauer"];
        const tableRows = daysData[day].map(row => [row.exercise, row.sets, row.reps, row.duration]);

        doc.autoTable({
            head: [tableColumns],
            body: tableRows,
            startY: startY + 10,
            margin: { top: 32 },
            styles: { fillColor: [233, 30, 99] },
            columnStyles: { 0: { fillColor: [255, 255, 255] } }
        });

        startY = doc.lastAutoTable.finalY + 10;
    }

    doc.save('trainingsplan.pdf');
});
