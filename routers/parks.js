const Express = require('express');
const router = Express.router();

router.get('/:name', (req, res) => {
    res.render('main/park', {
        name: req.params.name
    });
});

module.exports = router;
