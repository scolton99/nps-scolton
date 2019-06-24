/// <reference path="PageComponent.ts" />

namespace NPS {
    export class VisitorCenters extends PageComponent {
        constructor(data: Array<any>, container: HTMLElement) {
            super(data, container);

            this.render();
        }

        render = () => {
            this.clear();

            const header = document.createElement("header");
            const heading = document.createElement("h1");
            heading.textContent = "Visitor Centers";
            
            header.appendChild(heading);
            this.container.appendChild(header);

            for (const visitor_center of this.data) {
                const {
                    description: vc_desc,
                    name: vc_name,
                    directionsInfo: vc_directions
                } = visitor_center;

                const title = document.createElement("h4");
                title.textContent = vc_name;

                const description = document.createElement("div");
                description.classList.add("vc-desc");
                description.textContent = vc_desc;
                
                const directions = document.createElement("div");
                directions.classList.add("vc-directions");
                directions.textContent = "Directions: " + vc_directions;

                this.container.appendChild(title);
                this.container.appendChild(description);
                this.container.appendChild(directions);
            }
        };
    }
}