/// <reference path="Dependencies.ts" />

namespace NPS {
    export class Application {
        private page_name = null;
        private page_elements: any = {};

        constructor() {
            this.addGlobalListeners();
        }

        private setup_page_name = (): void => {
            const page_name_meta_tag = document.querySelector('meta[name="page-name"]');
            this.page_name = page_name_meta_tag.getAttribute('content');
        };

        private pre_init = (): void => {
            this.setup_page_name();

            switch (this.page_name) {
                case "homepage": {
                    // Perform all the JS setup specific to the homepage
                    this.page_elements.suggestions = new Suggestions(document.getElementById("suggestions"));
                    this.page_elements.debounced_search = new DebouncedSearch(200, this.page_elements.suggestions);

                    const drawer_dom: HTMLElement = document.getElementById("side-panel");
                    const shade_dom: HTMLElement = document.getElementById("nav-shade");

                    this.page_elements.drawer = new Drawer(drawer_dom, shade_dom);

                    const {
                        drawer,
                        debounced_search
                    }: {
                        debounced_search: DebouncedSearch,
                        drawer: Drawer
                    } = this.page_elements;

                    const search = document.getElementById("search");
                    if (search)
                        search.addEventListener("input", debounced_search.search);

                    drawer.set_toggle(document.getElementById("menu-button"));
                    drawer.set_toggle(document.getElementById("nav-shade"));

                    const background_container: HTMLElement = document.getElementById("background-image");
                    const background_image: HTMLImageElement = <HTMLImageElement>background_container.firstElementChild;
                    this.page_elements.background = new Background(background_container, background_image);

                    break;
                }
                case "park": {

                    break;
                }
            }
        };

        private init = (): void => {

        };

        addGlobalListeners = (): void => {
            window.addEventListener("DOMContentLoaded", this.pre_init);
            window.addEventListener("load", this.init);
        };
    }
}

declare var app;
app = new NPS.Application();
