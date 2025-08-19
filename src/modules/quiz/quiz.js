export class FitnessQuiz {
  constructor(containerId, nextQuizQuestionBtnId, resultId) {
    this.quizData = [
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

    this.currentQuestion = 0;
    this.answers = [];

    this.quizContainer = document.getElementById(containerId);
    this.nextQuizQuestionBtnId = document.getElementById(nextQuizQuestionBtnId);
    this.resultDiv = document.getElementById(resultId);

    this.init();
  }

  init() {
    this.showQuestion();

    this.nextQuizQuestionBtnId.addEventListener("click", () => {
      const selected = document.querySelector("input[name='answer']:checked");
      if (!selected) {
        alert("Bitte eine Antwort auswählen!");
        return;
      }

      this.answers.push(selected.value);

      this.currentQuestion++;
      if (this.currentQuestion < this.quizData.length) {
        this.showQuestion();
      } else {
        this.showResult();
      }
    });
  }

  showQuestion() {
    const q = this.quizData[this.currentQuestion];
    this.quizContainer.innerHTML = `
      <h2 class="text-lg font-semibold mb-4">${q.question}</h2>
      ${q.options
        .map(
          (opt, idx) => `
          <div class="row">
              <span class="value">${opt}</span>
              <input type="checkbox" name="answer" value="${opt}" class="mr-2"> 
          </div>
        `
        )
        .join("")}
    `;
  }

  showResult() {
    let summary = `
      <h2 class="text-xl font-bold mb-2">Deine Ergebnisse</h2>
      <ul class="list-disc pl-5 text-gray-700 mb-4">
        ${this.answers.map((a, i) => `<li><strong>${this.quizData[i].question}</strong>: ${a}</li>`).join("")}
      </ul>
    `;

    // Einfache Logik für Motivation
    if (this.answers.includes("Einsteiger")) {
      summary += `<p class="text-green-600 font-semibold">Perfekt! Dein Plan wird dich Schritt für Schritt aufbauen.</p>`;
    }
    if (this.answers.includes("20+")) {
      summary += `<p class="text-blue-600 font-semibold">Starke Leistung! Dein Plan wird dich weiter fordern.</p>`;
    }

    this.resultDiv.innerHTML = summary;
    this.resultDiv.classList.remove("hidden");
    this.quizContainer.classList.add("hidden");
    this.nextQuizQuestionBtnId.classList.add("hidden");
  }
}
