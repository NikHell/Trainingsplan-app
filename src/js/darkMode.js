
// darkMode.js

export default class DarkMode {
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        this.init();
    }

    init() {
        const enabled = localStorage.getItem('dark') === '1';
        document.body.classList.toggle('dark', enabled);
        this.button.textContent = enabled ? '☀️ Light Mode' : '🌙 Dark Mode';
        this.button.addEventListener('click', () => this.toggle());
    }

    toggle() {
        const now = !document.body.classList.contains('dark');
        document.body.classList.toggle('dark', now);
        localStorage.setItem('dark', now ? '1' : '0');
        this.button.textContent = now ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}
