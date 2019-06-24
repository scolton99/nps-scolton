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
                        // console.log(data);
                    });

                    const visitor_centers_args = {
                        parkCode: park_code,
                        limit: 5
                    };
                    new APICall('/visitorcenters', visitor_centers_args, data => {
                        new VisitorCenters(data.data, document.getElementById("park-visitor-centers"));
                    });

                    const alerts_args = {
                        parkCode: park_code,
                        limit: 10
                    };
                    new APICall('/alerts', alerts_args, data => {
                        new Alerts(data.data, document.getElementById("park-alerts"));
                    });

                    const events_args = {
                        parkCode: park_code,
                        limit: 10
                    };
                    const events_search = new APICall('/events', events_args, data => {
                        // console.log(data);

                        new Events(data.data, document.getElementById("park-events"));
                    });

                    const articles_args = {
                        parkCode: park_code,
                        limit: 7
                    };
                    new APICall('/articles', articles_args, data => {
                        new Articles(data.data, document.getElementById("park-articles"));
                    });

                    const news_releases_args = {
                        parkCode: park_code,
                        limit: 6
                    };
                    new APICall('/newsreleases', news_releases_args, data => {
                        new NewsReleases(data.data, document.getElementById("park-news-releases"));
                    });

                    const people_args = {
                        parkCode: park_code
                    };
                    const people_search = new APICall('/people', people_args, data => {
                        // console.log(data);
                    });

                
                    const lesson_plans_args = {
                        parkCode: park_code
                    };
                    new APICall('/lessonplans', lesson_plans_args, data => {
                        new LessonPlans(data.data, document.getElementById("park-lesson-plans"));
                    });

                    // Not sure this exists?
                    const places_args = {
                        parkCode: park_code
                    };
                    new APICall('/places', places_args, data => {
                        // console.log(data);

                        new Places(data, document.getElementById("park-places"));
                    });

                    const park_data_args = {
                        parkCode: park_code,
                        fields: 'images'
                    };
                    new APICall('/parks', park_data_args, data => {
                        new ParkInfo(data.data, document.getElementById("park-info"));
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
