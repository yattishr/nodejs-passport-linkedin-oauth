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
router.get('/edit', ensureAuth, (req, res) => {
    res.render('profile/edit')
})


// @desc Show Edit page
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {

    try {
        const profile = await User.findOne({
            linkedinId: req.params.id,
        }).lean()
    
        if (!profile) {
          return res.render('error/404')
        }
    
        if (profile.linkedinId != req.user.linkedinId) {
          res.redirect('/profile')
        } else {
          res.render('profile/edit', {
            profile,
          })
        }
      } catch (err) {
        console.error(err)
        return res.render('error/500')
      }    

})


module.exports = router