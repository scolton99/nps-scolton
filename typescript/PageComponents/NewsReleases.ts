/// <reference path="PageComponent.ts" />

namespace NPS {
    export class NewsReleases extends PageComponent {
        constructor(data: Array<any>, container: HTMLElement) {
            super(data, container);

            this.render();
        }

        static formatDate = (date: Date): string => {
            const year = date.getFullYear();
            const month_num = date.getMonth();

            let month;
            switch (month_num) {
                case 0: {
                    month = "January";
                    break;
                }
                case 1: {
                    month = "February";
                    break;
                }
                case 2: {
                    month = "March";
                    break;
                }
                case 3: {
                    month = "April";
                    break;
                }
                case 4: {
                    month = "May";
                    break;
                }
                case 5: {
                    month = "June";
                    break;
                }
                case 6: {
                    month = "July";
                    break;
                }
                case 7: {
                    month = "August";
                    break;
                }
                case 8: {
                    month = "September";
                    break;
                }
                case 9: {
                    month = "October";
                    break;
                }
                case 10: {
                    month = "November";
                    break;
                }
                case 11: {
                    month = "December";
                    break;
                }
                default: {
                    month = null;
                }
            }

            const day = date.getDate();
            
            return `${month} ${day}, ${year}`;
        };

        render = () => {
            this.clear();

            const header = document.createElement("header");
            const heading = document.createElement("h1");
            heading.textContent = "News Releases";

            header.appendChild(heading);
            this.container.appendChild(header);

            console.log(this.data);
            for (const news_release of this.data) {
                const {
                    image: {
                        altText: image_alt,
                        url: image_url,
                        credit: image_credit
                    },
                    title: news_release_title,
                    url: news_release_url,
                    releasedate: news_release_date,
                    abstract: news_release_abstract
                } = news_release;

                const display = document.createElement("div");
                display.classList.add("news-release-display");
    
                const preview_image = document.createElement("img");
                if (image_credit !== "") {
                    preview_image.alt = image_alt;
                    preview_image.src = image_url;
                } else {
                    preview_image.alt = "No image";
                    preview_image.src = "/images/placeholder.jpg";
                }

                display.appendChild(preview_image);

                const title_abstract = document.createElement("div");
                title_abstract.classList.add("title-abstract");

                const title = document.createElement("h4");
                title.classList.add("title");

                const title_a = document.createElement("a");
                title_a.href = news_release_url;
                title_a.textContent = news_release_title;

                title.appendChild(title_a);

                const date = document.createElement("div");
                date.classList.add("date");

                const date_parts = news_release_date.replace(/\.0/g, "").split(" ")[0].split("-");
                const year = parseInt(date_parts[0]);
                const month = parseInt(date_parts[1]) - 1;
                const day = parseInt(date_parts[2]);

                date.textContent = NewsReleases.formatDate(new Date(year, month, day));

                const abstract = document.createElement("div");
                abstract.classList.add("abstract");
                abstract.textContent = news_release_abstract;

                title_abstract.appendChild(title);
                title_abstract.appendChild(date);
                title_abstract.appendChild(abstract);
                display.appendChild(title_abstract);

                this.container.appendChild(display);
            }
        }
    }
}