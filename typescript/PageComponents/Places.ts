/// <reference path="PageComponent.ts" />

namespace NPS {
    export class Places extends PageComponent {
        constructor(data: Array<object>, container: HTMLElement) {
            super(data, container);

            this.render();
        }

        render = () => {
            // Get a clean slate for rendering
            while (this.container.firstChild)
                this.container.removeChild(this.container.firstChild);
        };
    }
}