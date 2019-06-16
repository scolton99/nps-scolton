namespace NPS {
    export class Util {
        public static preload_images = (paths: string[], callbacks: (() => any)[]) => {
            if (paths.length !== callbacks.length) {
                console.error('Images array and callbacks array must be of the same length');
                return;
            }

            for (let i = 0; i < paths.length; i++) {
                const img = new Image();
                img.src = paths[i];
                img.onload = callbacks[i];
                img.onerror = callbacks[i];
            }
        };


    }
}
