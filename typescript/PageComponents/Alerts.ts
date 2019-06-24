/// <reference path="PageComponent.ts" />

namespace NPS {
    export class Alerts extends PageComponent {
        constructor(data: Array<any>, container: HTMLElement) {
            super(data, container);

            this.render();
        }

        render = () => {
            this.clear();

            const header = document.createElement("header");
            const heading = document.createElement("h1");
            heading.textContent = "Alerts";

            header.appendChild(heading);
            this.container.appendChild(header);

            for (const alert of this.data) {
                const {
                    abstract: alert_abstract,
                    title: alert_title,
                    url: alert_url
                } = alert;

                const title = document.createElement("h4");
                const title_a = document.createElement("a");
                title_a.textContent = alert_title;
                title_a.href = alert_url;
                title_a.target = "_blank";

                title.appendChild(title_a);
                title.classList.add("alert-display");

                this.container.appendChild(title);
            }
        };
    }
}