const express = require('express');
const {imagekitAuth} = require("../uploads/imagekit-server");
const router = express.Router();

router.get('/auth', imagekitAuth);

module.exports = router;
