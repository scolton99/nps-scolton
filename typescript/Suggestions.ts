namespace NPS {
    export class Suggestions {
        private readonly element: HTMLElement;
        private suggestions: object[] = null;
        private params: object = {};

        constructor(domEl: HTMLElement) {
            this.element = domEl;
        }

        public update = (suggestions: object[], params: object): void => {
            this.suggestions = suggestions;
            this.params = params;
            this.render();
        };

        private render = () => {
            this.clear();

            if (this.suggestions == null)
                return;

            if (this.suggestions.length == 0) {
                const empty_suggestions: HTMLElement = document.createElement("div");
                empty_suggestions.classList.add("suggestions-empty");

                empty_suggestions.textContent = "No results found.";

                this.element.appendChild(empty_suggestions);

                return;
            }

            console.log(this.params);

            for (const suggestion of this.suggestions) {
                let failed: boolean = false;
                for (const key of Object.keys(this.params)) {
                    if (typeof (this.params[key]) === "undefined")
                        continue;

                    if (!suggestion[key]) {
                        failed = true;
                        break;
                    }

                    console.log(suggestion);
                    console.log(this.params);
                    console.log(key);

                    if (suggestion[key].toLowerCase() !== this.params[key].toLowerCase()) {
                        failed = true;
                        break;
                    }
                }
                if (failed)
                    continue;

                const suggestion_div: HTMLElement = document.createElement("div");
                suggestion_div.classList.add("suggestion");

                const h3 = document.createElement("h3");
                const p = document.createElement("p");

                h3.textContent = suggestion["name"];
                p.textContent = suggestion["description"];

                suggestion_div.appendChild(h3);
                suggestion_div.appendChild(p);

                this.element.appendChild(suggestion_div);
            }
        };

        public show_loading = (): void => {
            const first_child: Element = this.element.firstElementChild;
            if (first_child && first_child.classList.contains("suggestion-loading-container"))
                return;

            this.clear();

            const loading_div: HTMLElement = document.createElement("div");
            loading_div.classList.add("suggestion-loading-container");

            const spinner: HTMLElement = document.createElement("span");
            spinner.classList.add("spinner");

            loading_div.appendChild(spinner);

            this.element.appendChild(loading_div);
        };

        public clear = (): void => {
            while (this.element.firstChild)
                this.element.removeChild(this.element.firstChild);
        };

        public empty = (): boolean => {
            return !this.element.firstChild;
        };
    }
}
