export class Stepper {
    constructor(modulesIds, nextButtonsIds, progressBarId, progressTextId) {

        const modules = document.querySelectorAll(modulesIds);
        const nextButtons = document.querySelectorAll(nextButtonsIds);
        const progressBar = document.getElementById(progressBarId);
        const progressText = document.getElementById(progressTextId);

        let currentStep = 1;
        const totalSteps = modules.length;

        function updateProgress(step) {
            const percent = (step / totalSteps) * 100;
            progressBar.style.width = percent + "%";
            progressText.textContent = `Schritt ${step} von ${totalSteps}`;
        }

        nextButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                console.log("nextBtn clicked");
                const currentModule = btn.closest(".module");
                const currentIndex = parseInt(currentModule.dataset.module);

                currentModule.classList.add("hidden");
                const nextModule = document.querySelector(`.module[data-module="${currentIndex + 1}"]`);

                if (nextModule) {
                    nextModule.classList.remove("hidden");
                    currentStep++;
                    updateProgress(currentStep);
                } else {
                    updateProgress(totalSteps);
                    alert("🎉 Du hast alle Module abgeschlossen!");
                }
            });
        });

    // Initial Progress
        updateProgress(currentStep);
    }
};
