import DarkMode from './darkMode.js';
import { PlanGenerator } from './planGenerator/planGenerator.js';
import { PDFExporter } from './pdfExporter.js';
import { CalorieCalculator } from './calorieCalculator/calorieCalculator.js';
import {FitnessQuiz} from "./quiz/quiz.js";
import {Stepper} from "./stepper.js";

document.addEventListener('DOMContentLoaded', (event) => {
    const darkMode = new DarkMode('darkToggle');
    const stepper = new Stepper(".module", ".nextBtn", "progress-bar", "progress-text" )

    fetch('./src/modules/quiz/quiz.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('fitnessQuiz').innerHTML = data;
            // Initialisiere die Quiz-Instanz, nachdem HTML geladen wurde
            const quiz = new FitnessQuiz("quiz", "nextQuizQuestionBtn", "result");
        })
        .catch(error => console.error('Fehler beim Laden:', error));


     fetch('./src/modules/planGenerator/planGenerator.html')
         .then(response => response.text())
         .then(data => {
            document.getElementById('planGenerator').innerHTML = data;
             // Initialisiere die Quiz-Instanz, nachdem HTML geladen wurde
               const planGenerator = new PlanGenerator('planForm', 'result', 'loader');
             const pdfExporter = new PDFExporter('exportPDF', planGenerator);
         })
         .catch(error => console.error('Fehler beim Laden:', error));

    fetch('./src/modules/calorieCalculator/calorieCalculator.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('calorienRechner').innerHTML = data;
            // Initialisiere die Quiz-Instanz, nachdem HTML geladen wurde
            const calorieCalculator = new CalorieCalculator('berechneKalorien', 'kalorienResult');
        })
        .catch(error => console.error('Fehler beim Laden:', error));
});
