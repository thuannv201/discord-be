const express = require('express');
const PesonalControllers = require('../../controller/user/personal');
const router = express.Router();
router.get('/', PesonalControllers.getPersonalData);

module.exports = router;
