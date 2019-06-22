/// <reference path="PageComponent.ts" />

namespace NPS {
    export class ParkInfo extends PageComponent {
        constructor(data: Array<object>, container: HTMLElement) {
            super(data, container);

            this.render();
        }

        // Business logic for rendering park info goes here
        render = () => {
            // Get a clean slate for rendering
            this.clear();

            const {
                fullName: name,
                latLong: lat_long_raw,
                description,
                images: [
                    {
                        url: img_src,
                        altText: img_alt,
                        caption: img_caption,
                        credit: img_credit
                    }
                ],
                weatherInfo: weather_info,
                directionsUrl: directions_url
            } = this.data[0];

            const header = document.createElement("header");
            const heading = document.createElement("h1");
            heading.textContent = name;

            header.appendChild(heading);
            this.container.appendChild(header);

            const image_container = document.createElement("section");
            image_container.classList.add("image");
            image_container.style.background = `url(${img_src})`;
            image_container.style.backgroundSize = "cover";
            image_container.title = img_alt;

            const image_caption = document.createElement("div");
            image_caption.innerHTML = img_caption + "<br><br>Credit: " + img_credit;

            image_container.appendChild(image_caption);

            this.container.appendChild(image_container);

            const desc_map = document.createElement("section");
            desc_map.classList.add("desc-map");
            const map = document.createElement("iframe");
            const lat_long_arr = lat_long_raw.split(",");
            
            const lat_long = {
                lat: lat_long_arr[0].split(":")[1].trim(),
                long: lat_long_arr[1].split(":")[1].trim()
            };

            const {lat, long} = lat_long;

            let map_src = "https://www.google.com/maps/embed/v1/view?key=AIzaSyB-M5tJXFIL2ANThjOaCNcYl2DyJsPastI";
            map_src += `&center=${lat},${long}`;
            map_src += `&zoom=10`;

            map.src = map_src;
            map.setAttribute("frameborder", "0");
            map.style.border = "none";
            map.width = "250";
            map.height = "250";

            const desc = document.createElement("div");
            desc.textContent = description;

            desc_map.appendChild(desc);
            desc_map.appendChild(map);

            this.container.appendChild(desc_map);

            const footer = document.createElement("footer");
            this.container.appendChild(footer);

            const weather = document.createElement("a");
            weather.href = weather_info;
            weather.textContent = "Get Weather";

            const directions = document.createElement("a");
            directions.href = directions_url;
            directions.textContent = "Get Directions";

            footer.appendChild(weather);
            footer.appendChild(directions);

            this.container.appendChild(footer);
        };
    }
}