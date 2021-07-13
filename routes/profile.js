const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

// UserSchema model
const User = require('../models/User')

// @desc Get User Profile
// @route GET /profile
router.get('/', ensureAuth, async (req, res) => {
    try {
        res.render('profile/index', {
            name: req.user.firstName,
            displayName: req.user.displayName,
            image: req.user.image,            
            linkedinId: req.user.linkedinId,
        })        
    } catch (err) {
        console.error('OOoops, there was an error fetching your user profile! ' , err)
        res.render('error/500')
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