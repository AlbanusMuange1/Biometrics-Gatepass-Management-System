const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entries.controller');

/* GET entries. */
router.get('/', entryController.get);

/* GET entry by id. */
router.get('/:id', entryController.getSingle);

/* POST entry */
router.post('/', entryController.create);

/* PUT entry */
router.put('/:id', entryController.update);

/* DELETE entry */
router.delete('/:id', entryController.remove);

module.exports = router;
