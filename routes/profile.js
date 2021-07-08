const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

// @desc Add Story page
// @route GET /stories/add
router.get('/', ensureAuth, (req, res) => {
    console.log('logging user request', req)
    res.render('profile/index'), {
        linkedinId: req.user.linkedinId,
        name: req.user.displayName,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        profileImg: req.user.image        
    }
})


// @desc Edit Profile Page
// @route GET /profile/edit
// @desc Add Story page
// @route GET /stories/add
router.get('/edit', ensureAuth, (req, res) => {
    res.render('profile/edit')
})

module.exports = router