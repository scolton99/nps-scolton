const preload = (images, callbacks) => {
    if (images.length !== callbacks.length) {
        console.error('Images array and callbacks array must be of the same length');
        return;
    }

    for (let i = 0; i < images.length; i++) {
        const img = new Image();
        img.src = images[i];
        img.onload = callbacks[i];
        img.onerror = callbacks[i];
    }
};
