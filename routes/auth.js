const express = require('express')
const passport = require('passport')
const router = express.Router()


// @desc Authenticate with LinkedIn
// @route GET /auth/linkedin
router.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile', 'r_basicprofile', 'r_organization_social'],
                                                            profileFields: ['id', 
                                                            'first-name', 
                                                            'last-name', 
                                                            'email-address',
                                                            'public-profile-url']
}))

// @desc LinkedIn Auth callback
// @route GET /auth/linkedin/callback
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }), 
(req, res) => {
    res.redirect('/dashboard')
})


// @desc Logout user
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router