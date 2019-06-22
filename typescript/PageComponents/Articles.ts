/// <reference path="PageComponent.ts" />

namespace NPS {
    export class Articles extends PageComponent {
        constructor(data: Array<any>, container: HTMLElement) {
            super(data, container);

            this.render();
        }

        render = () => {
            this.clear();

            const header = document.createElement("header");
            const heading = document.createElement("h1");
            heading.textContent = "Articles";

            header.appendChild(heading);
            this.container.appendChild(header);

            for (const article of this.data) {
                const {
                    listingdescription: article_desc,
                    listingimage: {
                        altText: image_alt,
                        url: image_url
                    },
                    title: article_title,
                    url: article_url
                } = article;

                const article_display = document.createElement("div");
                article_display.classList.add("article-display");

                const image = document.createElement("img");
                image.src = image_url;
                image.alt = image_alt;

                article_display.appendChild(image);

                const title_description = document.createElement("div");
                title_description.classList.add("title-description");

                const title_a = document.createElement("a");
                title_a.target = "_blank";
                title_a.href = article_url;
                title_a.textContent = article_title;

                const title = document.createElement("h4");
                title.appendChild(title_a);

                const description = document.createElement("div");
                description.textContent = article_desc;

                title_description.appendChild(title);
                title_description.appendChild(description);

                article_display.appendChild(title_description);

                this.container.appendChild(article_display);
            }
        };
    }
}