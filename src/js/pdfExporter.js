
export class PDFExporter {
    constructor(buttonId, planGenerator) {
        this.button = document.getElementById(buttonId);
        this.planGenerator = planGenerator;

        this.button.addEventListener('click', () => this.exportPDF());
    }

    exportPDF() {
        const { jsPDF } = window.jspdf; // Zugriff auf jsPDF aus dem globalen Kontext

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Trainingsplan", 14, 22);

        const daysData = this.planGenerator.groupBy(this.planGenerator.planData, 'day');
        let startY = 30;
        for (let day in daysData) {
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 255);
            doc.text(day, 14, startY);
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);

            const tableColumns = ["Übung", "Sätze", "Wiederholungen", "Dauer"];
            const tableRows = daysData[day].map(row => [row.exercise, row.sets, row.reps, row.duration]);

            doc.autoTable({
                head: [tableColumns],
                body: tableRows,
                startY: startY + 10,
                margin: { top: 32 },
                styles: { fillColor: [233, 30, 99] },
                columnStyles: { 0: { fillColor: [255, 255, 255] } }
            });

            startY = doc.lastAutoTable.finalY + 10;
        }

        doc.save('trainingsplan.pdf');
    }
}
