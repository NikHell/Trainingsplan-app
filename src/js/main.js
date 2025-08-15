import DarkMode from './darkMode.js';
import { PlanGenerator } from './planGenerator.js';
import { PDFExporter } from './pdfExporter.js';
import { CalorieCalculator } from './calorieCalculator.js';

document.addEventListener('DOMContentLoaded', (event) => {
    const darkMode = new DarkMode('darkToggle');
    const planGenerator = new PlanGenerator('planForm', 'result', 'loader');
    const pdfExporter = new PDFExporter('exportPDF', planGenerator);
    const calorieCalculator = new CalorieCalculator('berechneKalorien', 'kalorienResult');
});
