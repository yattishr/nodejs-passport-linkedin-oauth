const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

// @desc Add Story page
// @route GET /stories/add
router.get('/', ensureAuth, (req, res) => {
    res.render('events/show')
})

module.exports = router