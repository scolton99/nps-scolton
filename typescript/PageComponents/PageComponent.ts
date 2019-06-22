namespace NPS {
    export abstract class PageComponent {
        protected data: Array<any>;
        protected readonly container: HTMLElement;

        constructor(data: Array<any>, container: HTMLElement) {
            this.data = data;
            this.container = container;
        }

        abstract render(): void;

        clear() {
            while (this.container.firstChild)
                this.container.removeChild(this.container.firstChild);
        }

        hide() {
            this.container.classList.add("hidden");
        }

        showLoading() {
            this.clear();

            const loading_container: HTMLElement = document.createElement("div");
            loading_container.classList.add("loading-container");

            const spinner: HTMLElement = document.createElement("span");
            spinner.classList.add("spinner");
            spinner.classList.add("dark");

            loading_container.appendChild(spinner);
            this.container.appendChild(loading_container);
        }
    }
}