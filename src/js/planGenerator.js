
export class PlanGenerator {
    constructor(formId, resultId, loaderId) {
        this.form = document.getElementById(formId);
        this.resultDiv = document.getElementById(resultId);
        this.loader = document.getElementById(loaderId);
        this.planData = [];
        this.DB = null;

        this.loadDB();
        this.form.addEventListener('submit', (e) => this.generatePlan(e));
    }

    async loadDB() {
        try {
            const res = await fetch('uebungen.json');
            if (!res.ok) throw new Error('uebungen.json konnte nicht geladen werden');
            this.DB = await res.json();
        } catch (err) {
            console.error(err);
            this.resultDiv.innerHTML = `<div class="muted">Fehler: ${err.message}</div>`;
        }
    }

    generatePlan(e) {
        e.preventDefault();
        if (!this.DB) {
            this.resultDiv.innerHTML = '<div class="muted">Übungsdaten werden noch geladen…</div>';
            return;
        }

        const ziel = document.getElementById('ziel').value;
        const level = document.getElementById('level').value;
        const tage = parseInt(document.getElementById('tage').value, 10);
        const planTyp = document.getElementById('planTyp').value;
        const equipment = document.getElementById('equipment').value;
        const dauer = parseInt(document.getElementById('dauer').value, 10);

        this.loader.classList.remove('hide');
        this.resultDiv.innerHTML = '';

        const schema = this.setsRepsByLevel(level, ziel);
        const weeks = 4;
        const out = [];
        this.planData = []; // Neu initialisieren für aktuelle Plangenerierung

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
            out.push(this.renderLine(`Woche ${w}`, 'week'));
            out.push(this.renderLine(this.progressionNote(w), 'hint'));

            for (let d = 1; d <= tage; d++) {
                const tagName = dayTag(d - 1);
                out.push(this.renderLine(`Tag ${d} – ${tagName}`, 'day'));

                let exList = this.selectExercises(tagName, planTyp, equipment);

                const lines = exList.map((ex, idx) => {
                    const sets = schema.sets + (w === 3 && idx < 2 ? 1 : 0) - (w === 4 ? 1 : 0);
                    const reps = (w === 2 && ziel !== 'kraft') ? (schema.reps.replace('8–12', '9–13').replace('6–10', '7–11')) : schema.reps;
                    const rest = (w === 4) ? (schema.rest.toString().replace('120–180s', '90–150s').replace('90s', '75s').replace('60–90s', '45–75s')) : schema.rest;
                    this.planData.push({ day: `Tag ${d} – ${tagName}`, exercise: ex.name, sets, reps, duration: rest });
                    return `${ex.name} — ${sets}×${reps} — Pause ${rest}`;
                });

                out.push(this.renderList(lines));
            }
        }

        this.resultDiv.innerHTML = out.join('');
        this.loader.classList.add('hide');
    }

    selectExercises(tagName, planTyp, equipment) {
        let exList = [];
        if (planTyp === 'ppl') {
            if (tagName === 'Push') {
                const chest = this.pickByGroup('push', equipment);
                exList = this.rnd(chest, 5);
            } else if (tagName === 'Pull') {
                const pull = this.pickByGroup('pull', equipment);
                exList = this.rnd(pull, 5);
            } else {
                const legs = this.pickByGroup('legs', equipment);
                exList = this.rnd(legs, 5);
            }
        } else if (planTyp === 'upper_lower') {
            if (tagName === 'Upper') {
                const upper = [...this.pickByGroup('push', equipment), ...this.pickByGroup('pull', equipment)];
                exList = this.rnd(upper, 5);
            } else {
                const lower = this.pickByGroup('legs', equipment);
                exList = this.rnd(lower, 5);
            }
        } else { // fullbody

            const sel = [
                this.rnd(this.pickByGroup('push', equipment), 1),
                this.rnd(this.pickByGroup('pull', equipment), 1),
                this.rnd(this.pickByGroup('legs', equipment), 1),
                this.rnd(this.pickByGroup('core', equipment), 1),
                this.rnd(this.pickByGroup('misc', equipment), 1)
            ].flat().filter(Boolean);

            exList = sel.slice(0, 5);
            if (exList.length < 5) {
                const pool = [...this.pickByGroup('push', equipment), ...this.pickByGroup('pull', equipment), ...this.pickByGroup('legs', equipment)];
                exList = [...exList, ...this.rnd(pool, 5 - exList.length)];
            }
        }
        return exList;
    }

    setsRepsByLevel(level, ziel) {
        const map = {
            einsteiger: { sets: 3, reps: "8–12", rest: "60–90s" },
            fortgeschritten: { sets: 4, reps: "6–10", rest: "90s" },
            profi: { sets: 5, reps: "4–8", rest: "120s" }
        };
        const base = map[level] || map.einsteiger;

        if (ziel === 'fettabbau') return { ...base, rest: "45–75s" };
        if (ziel === 'kraft') return { ...base, reps: "3–6", rest: "120–180s" };
        return base;
    }

    progressionNote(week) {
        if (week === 1) return "Woche 1: Technik & moderat (RPE 6–7).";
        if (week === 2) return "Woche 2: +1 Wdh. pro Satz (oder +2.5% Last).";
        if (week === 3) return "Woche 3: +1 Satz bei Hauptübungen.";
        return "Woche 4: Deload – -20% Volumen/Intensität, Fokus Technik.";
    }

    renderLine(txt, cls) {
        return `<div class="${cls || ''}">${txt}</div>`;
    }

    renderList(items) {
        return `<ul class="list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    }

    rnd(arr, n) {
        const copy = [...arr];
        const out = [];
        while (copy.length && out.length < n) {
            const i = Math.floor(Math.random() * copy.length);
            out.push(copy.splice(i, 1)[0]);
        }
        return out;
    }

    pickByGroup(group, equipment) {
        const list = this.DB.exercises.filter(x =>
            x.group === group &&
            (equipment === 'any' || x.equipment.includes(equipment) || x.equipment.includes('any'))
        );
        return list;
    }

    groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }
}
