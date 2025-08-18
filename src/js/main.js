import DarkMode from './darkMode.js';
import { PlanGenerator } from './planGenerator.js';
import { PDFExporter } from './pdfExporter.js';
import { CalorieCalculator } from './calorieCalculator.js';
import {FitnessQuiz} from "./quiz/quiz.js";

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('./src/js/quiz/quiz.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('fitnessQuiz').innerHTML = data;
            // Initialisiere die Quiz-Instanz, nachdem HTML geladen wurde
            const quiz = new FitnessQuiz("quiz", "nextBtn", "result");
        })
        .catch(error => console.error('Fehler beim Laden:', error));

    const darkMode = new DarkMode('darkToggle');
    const planGenerator = new PlanGenerator('planForm', 'result', 'loader');
    const pdfExporter = new PDFExporter('exportPDF', planGenerator);
    const calorieCalculator = new CalorieCalculator('berechneKalorien', 'kalorienResult');
});
