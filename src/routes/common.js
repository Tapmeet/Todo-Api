const express = require('express');
const Common = require('../controllers/common');
const router = express.Router();

// Post
router.post('/support', Common.support);


module.exports = router;


 