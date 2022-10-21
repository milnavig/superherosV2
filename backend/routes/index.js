const Router = require('express');

const router = new Router();

const superherosRouter = require('./superherosRouter');

router.use('/superhero', superherosRouter);

module.exports = router;
