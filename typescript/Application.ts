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
                    const park_code = document.querySelector("meta[name='park-name']").getAttribute('content');

                    const campgrounds_args = {
                        parkCode: park_code
                    };
                    const campgrounds_search = new APICall('/campgrounds', campgrounds_args, data => {
                        console.log(data);
                    });

                    const visitor_centers_args = {
                        parkCode: park_code
                    };
                    const visitor_centers_search = new APICall('/visitorcenters', visitor_centers_args, data => {
                        console.log(data);
                    });

                    const alerts_args = {
                        parkCode: park_code
                    };
                    const alerts_search = new APICall('/alerts', alerts_args, data => {
                        console.log(data);
                    });

                    const events_args = {
                        parkCode: park_code
                    };
                    const events_search = new APICall('/events', events_args, data => {
                        console.log(data);
                    });

                    const articles_args = {
                        parkCode: park_code
                    };
                    const articles_search = new APICall('/articles', articles_args, data => {
                        console.log(data);
                    });

                    const news_releases_args = {
                        parkCode: park_code
                    };
                    const news_releases_search = new APICall('/newsreleases', news_releases_args, data => {
                        console.log(data);
                    });

                    const people_args = {
                        parkCode: park_code
                    };
                    const people_search = new APICall('/people', people_args, data => {
                        console.log(data);
                    });

                    const lesson_plans_args = {
                        parkCode: park_code
                    };
                    const lesson_plans_search = new APICall('/events', lesson_plans_args, data => {
                        console.log(data);
                    });

                    const places_args = {
                        parkCode: park_code
                    };
                    const places_search = new APICall('/events', places_args, data => {
                        console.log(data);
                    });

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
