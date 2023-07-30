const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students.controller');

/* GET students. */
router.get('/', studentsController.get);

// GET student by id
router.get('/:id', studentsController.getSingle);

/* POST student */
router.post('/', studentsController.create);

/* PUT student */
router.put('/:id', studentsController.update);

/* DELETE student */
router.delete('/:id', studentsController.remove);

module.exports = router;
