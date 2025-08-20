import DarkMode from './darkMode.js';
import { PlanGenerator } from './planGenerator/planGenerator.js';
import { PDFExporter } from './pdfExporter.js';
import { CalorieCalculator } from './calorieCalculator/calorieCalculator.js';
import {FitnessQuiz} from "./quiz/quiz.js";
import {Stepper} from "./stepper.js";


document.addEventListener('DOMContentLoaded', (event) => {
    const urls = [
        './src/modules/quiz/quiz.html',
        './src/modules/planGenerator/planGenerator.html',
        './src/modules/calorieCalculator/calorieCalculator.html'
    ];

    Promise.all(urls.map(url => fetch(url).then(response => response.text())))
        .then(data => {
            const darkMode = new DarkMode('darkToggle');
            // quiz.html
            document.getElementById('fitnessQuiz').innerHTML = data[0];
            const quiz = new FitnessQuiz('quiz', 'nextQuizQuestionBtn', 'result');
            const stepper = new Stepper('.module', '.nextBtn', 'progress-bar', 'progress-text');

            // planGenerator.html
            document.getElementById('planGenerator').innerHTML = data[1];
            const planGenerator = new PlanGenerator('planForm', 'result', 'loader');
            const pdfExporter = new PDFExporter('exportPDF', planGenerator);

            // calorieCalculator.html
            document.getElementById('calorienRechner').innerHTML = data[2];
            const calorieCalculator = new CalorieCalculator('berechneKalorien', 'kalorienResult');
        })
        .catch(error => console.error('Fehler beim Laden der Module:', error));
});

    
