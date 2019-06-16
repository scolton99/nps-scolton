const Express = require('express');
const Util = require('./util');
const ParksRouter = require('./routers/parks');

const app = Express();
const port = 3000;

// Setup pug as view engine
app.set('view engine', 'pug');

app.use(Express.static('public'));

app.use('/park', ParksRouter);

app.get('/', (_req, res) => {
    const background_number = Util.getRandomBackgroundImage();

    res.render('main/index', {
        background: background_number,
        blurb: Util.getBackgroundBlurb(background_number)
    });
});

app.listen(port);
