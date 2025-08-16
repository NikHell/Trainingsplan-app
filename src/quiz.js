const quizData = [
  {
    question: "Was ist dein Hauptziel?",
    options: ["Muskelaufbau", "Abnehmen", "Gesund & fit bleiben", "Wieder einsteigen nach Pause"]
  },
  {
    question: "Wie würdest du dein Level einschätzen?",
    options: ["Einsteiger", "Fortgeschritten", "Experte"]
  },
  {
    question: "Wo möchtest du trainieren?",
    options: ["Zuhause (Bodyweight / wenige Geräte)", "Fitnessstudio", "Beides möglich"]
  },
  {
    question: "Kleiner Fitnesstest (optional): Wie viele Liegestütze schaffst du?",
    options: ["< 5", "5–10", "11–20", "20+"]
  }
];

let currentQuestion = 0;
let answers = [];

const quizContainer = document.getElementById("quiz");
const nextBtn = document.getElementById("nextBtn");
const resultDiv = document.getElementById("result");

function showQuestion() {
  const q = quizData[currentQuestion];
  quizContainer.innerHTML = `
    <h2 class="text-lg font-semibold mb-4">${q.question}</h2>
    ${q.options
      .map(
        (opt, idx) => `
        <label class="block mb-2">
          <input type="radio" name="answer" value="${opt}" class="mr-2">
          ${opt}
        </label>
      `
      )
      .join("")}
  `;
}

function showResult() {
  let summary = `
    <h2 class="text-xl font-bold mb-2">Deine Ergebnisse</h2>
    <ul class="list-disc pl-5 text-gray-700 mb-4">
      ${answers.map((a, i) => `<li><strong>${quizData[i].question}</strong>: ${a}</li>`).join("")}
    </ul>
  `;

  // Einfache Logik für Motivation
  if (answers.includes("Einsteiger")) {
    summary += `<p class="text-green-600 font-semibold">Perfekt! Dein Plan wird dich Schritt für Schritt aufbauen.</p>`;
  }
  if (answers.includes("20+")) {
    summary += `<p class="text-blue-600 font-semibold">Starke Leistung! Dein Plan wird dich weiter fordern.</p>`;
  }

  resultDiv.innerHTML = summary;
  resultDiv.classList.remove("hidden");
  quizContainer.classList.add("hidden");
  nextBtn.classList.add("hidden");
}

nextBtn.addEventListener("click", () => {
  const selected = document.querySelector("input[name='answer']:checked");
  if (!selected) {
    alert("Bitte eine Antwort auswählen!");
    return;
  }

  answers.push(selected.value);

  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// Start mit erster Frage
showQuestion();
