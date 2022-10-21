const Router = require('express');
const superherosController = require('../controllers/superherosController');

const router = new Router();

router.post('/', superherosController.create);
router.get('/', superherosController.getAll);
router.get('/chunk/', superherosController.getChunk);
router.get('/:superheroId', superherosController.getOne);
router.delete('/:superheroId', superherosController.delete);
router.put('/:superheroId', superherosController.change);

module.exports = router;
