/// <reference path="Util.ts" />

namespace NPS {
    export class Background {
        private readonly container: HTMLElement;
        private readonly image: HTMLImageElement;
        private readonly background_number: number;

        constructor(container: HTMLElement, image: HTMLImageElement) {
            this.container = container;
            this.image = image;

            this.background_number = Background.get_background_number();

            Util.preload_images([
                `/images/background/background-${this.background_number}.jpg`
            ], [
                this.show_background
            ]);
        }

        private show_background = () => {
            this.container.classList.add("loaded");
            this.image.src = `/images/background/background-${this.background_number}.jpg`;
        };

        public static get_background_number = (): number => {
            const background_number_meta_tag = document.querySelector('meta[name="background-number"]');
            return parseInt(background_number_meta_tag.getAttribute('content'));
        };
    }
}
