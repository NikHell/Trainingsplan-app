// calorieCalculator.js

export class CalorieCalculator {
    constructor(buttonId, resultId) {
        this.button = document.getElementById(buttonId);
        let resultDiv = document.getElementById(resultId);
        this.button.addEventListener('click', () => this.calculateCalories(resultDiv));
    }

    calculateCalories(resultDiv) {
        const alter = parseInt(document.getElementById('alter').value, 10);
        const gewicht = parseFloat(document.getElementById('gewicht').value);
        const groesse = parseInt(document.getElementById('groesse').value, 10);
        const geschlecht = document.getElementById('geschlecht').value;
        const aktiv = parseFloat(document.getElementById('aktivitaet').value);

        if (!alter || !gewicht || !groesse || !aktiv) {
            resultDiv.textContent = 'Bitte alle Felder korrekt ausfüllen.';
            return;
        }
        const bmr = (geschlecht === 'm')
            ? (10 * gewicht + 6.25 * groesse - 5 * alter + 5)
            : (10 * gewicht + 6.25 * groesse - 5 * alter - 161);

        const tdee = Math.round(bmr * aktiv);
        resultDiv.textContent = `Geschätzter Tagesbedarf (TDEE): ~ ${tdee} kcal/Tag.`;

    }
}
