namespace NPS {
    export class Drawer {
        private readonly element: HTMLElement;
        private readonly shade: HTMLElement;

        constructor(domEl: HTMLElement, shade: HTMLElement) {
            this.element = domEl;
            this.shade = shade;
        };

        public toggle = (): void => {
            if (this.element.classList.contains("open")) {
                this.element.classList.remove("open");
                this.shade.classList.remove("open");
            } else {
                this.element.classList.add("open");
                this.shade.classList.add("open");
            }
        };

        public set_toggle = (element: HTMLElement): void => {
            element.addEventListener("click", this.toggle);
        };
    }
}
