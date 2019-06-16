const Express = require('express');
const router = Express.Router();

router.get('/:name', (req, res) => {
    res.render('main/park', {
        park: req.params.name
    });
});

module.exports = router;
