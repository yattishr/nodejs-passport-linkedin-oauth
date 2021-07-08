const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

// @desc Add Story page
// @route GET /stories/add
router.get('/', ensureAuth, (req, res) => {
    res.render('profile/index')
})

module.exports = router