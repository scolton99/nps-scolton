exports.getRandomBackgroundImage = () => (
    Math.floor(Math.random() * 9) + 1
);

exports.getBackgroundBlurb = number => {
    switch (number) {
        // Bryce Canyon
        case 1:
        case 6: {
            return "This photo was taken at <a href='/park/brca'>Bryce Canyon</a> in Utah.";
        }

        // Grand Canyon
        case 2: {
            return "This photo was taken at the Grand Canyon in Arizona.";
        }

        // Arches National Park
        case 3: {
            return "This photo was taken at Arches National Park in Utah."
        }

        // Death Valley National Park
        case 4: {
            return "This photo was taken near Death Valley National Park in Nevada.";
        }

        // Rocky Mountain National Park
        case 5:
        case 7: {
            return "This photo was taken in Rocky Mountain National Park in Colorado.";
        }

        // Crater Lake National Park
        case 8: {
            return "This photo was taken in Crater Lake National Park in Oregon.";
        }

        // Yellowstone National Park
        case 9: {
            return "This photo was taken near Yellowstone National Park.";
        }
    }
};
