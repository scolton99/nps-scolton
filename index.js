const Express = require('express');
const Util = require('./util');
const ParksRouter = require('./routers/parks');

const app = Express();
const port = 3000;

// Setup pug as view engine
app.set('view engine', 'pug');

app.use(Express.static('public'));

app.use('/parks', ParksRouter);

app.get('/', (_req, res) => {
    res.render('main/index', {background: Util.getRandomBackgroundImage()});
});

app.listen(port);
