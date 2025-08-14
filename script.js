const form = document.getElementById('planForm');
const resultDiv = document.getElementById('result');
const exportBtn = document.getElementById('exportPDF');
const loader = document.getElementById('loader');
const kalorienBtn = document.getElementById('berechneKalorien');
const kalorienResult = document.getElementById('kalorienResult');

// OpenAI API-Key
const OPENAI_API_KEY = "DEIN_API_KEY_HIER";

// Trainingsplan generieren
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    loader.classList.remove('hidden');
    loader.textContent = "Generiere Plan…";
    resultDiv.innerHTML = "";

    const ziel = document.getElementById('ziel').value;
    const level = document.getElementById('level').value;
    const trainingstage = document.getElementById('trainingstage').value;
    const equipment = document.getElementById('equipment').value;

    const prompt = `Erstelle einen 4-Wochen-Trainingsplan für Ziel: ${ziel}, Level: ${level}, Trainingstage pro Woche: ${trainingstage}, Equipment: ${equipment}. 
  Strukturiere den Plan nach Wochen und Tagen mit Übungen, Sätzen, Wiederholungen und Pausen.`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: prompt}],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const planText = data.choices[0].message.content.trim();
        resultDiv.innerHTML = formatPlan(planText);
        loader.textContent = "Plan generiert!";
    } catch (error) {
        resultDiv.textContent = "Fehler bei der Planerstellung. Bitte später erneut versuchen.";
        loader.textContent = "";
        console.error(error);
    }
});

// Plan farbig formatieren
function formatPlan(text) {
    const lines = text.split('\n');
    return lines.map(line => {
        if (line.toLowerCase().includes('woche')) {
            return `<span class="font-bold text-blue-600">${line}</span>`;
        } else if (line.toLowerCase().includes('tag')) {
            return `<span class="font-semibold text-green-600">${line}</span>`;
        } else {
            return line;
        }
    }).join('<br>');
}

// Kalorienrechner
kalorienBtn.addEventListener('click', () => {
    const alter = parseInt(document.getElementById('alter').value);
    const gewicht = parseFloat(document.getElementById('gewicht').value);
    const groesse = parseInt(document.getElementById('groesse').value);
    const geschlecht = document.getElementById('geschlecht').value;
    const aktivitaet = parseFloat(document.getElementById('aktivitaet').value);

    if (!alter || !gewicht || !groesse) {
        kalorienResult.textContent = "Bitte alle Felder korrekt ausfüllen.";
        return;
    }

    let bmr;
    if (geschlecht === 'm') {
        bmr = 10 * gewicht + 6.25 * groesse - 5 * alter + 5;
    } else {
        bmr = 10 * gewicht + 6.25 * groesse - 5 * alter - 161;
    }

    const tdee = Math.round(bmr * aktivitaet);
    kalorienResult.textContent = `Dein geschätzter Tagesbedarf (TDEE) liegt bei ca. ${tdee} kcal.`;
});

// PDF-Export
exportBtn.addEventListener('click', () => {
    const planText = resultDiv.innerText;
    if (!planText) {
        alert("Bitte zuerst einen Trainingsplan generieren.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Trainingsplan", 10, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(planText, 180);
    doc.text(lines, 10, 30);
    doc.save("Trainingsplan.pdf");
});
