const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitors.controller');

/* GET visitors. */
router.get('/', visitorController.get);

/* GET visitor by id. */
router.get('/:id', visitorController.getSingle);
  
/* POST visitor */
router.post('/', visitorController.create);

/* PUT visitor */
router.put('/:id', visitorController.update);

/* DELETE visitor */
router.delete('/:id', visitorController.remove);

module.exports = router;
