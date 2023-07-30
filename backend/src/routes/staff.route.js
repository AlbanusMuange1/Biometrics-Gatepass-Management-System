const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');

/* GET staff. */
router.get('/', staffController.get);

/* GET staff by id. */
router.get('/:id', staffController.getSingle);

/* POST staff */
router.post('/', staffController.create);

/* Staff login */
router.post('/login', staffController.login);

/* PUT staff */
router.put('/:id', staffController.update);

/* DELETE staff */
router.delete('/:id', staffController.remove);

module.exports = router;
