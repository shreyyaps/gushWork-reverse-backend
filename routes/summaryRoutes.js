const express = require('express');
const router = express.Router();
const {summary} = require("../controllers/summaryController.js")

router.post('/', summary);


module.exports = router;