// calorieCalculator.js

export class CalorieCalculator {
    constructor(buttonId, resultId) {
        this.button = document.getElementById(buttonId);
        this.resultDiv = document.getElementById(resultId);
        this.button.addEventListener('click', () => this.calculateCalories());
    }

    calculateCalories() {
        // Kalorienrechner-Logik implementieren

    }
}
