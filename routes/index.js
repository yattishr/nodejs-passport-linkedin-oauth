const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    // res.send('Login')
    res.render('login', {
        layout: 'login'
    })
})

// @desc Dashboard page
// @route GET /dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    // res.send('Dashboard')
    res.render('dashboard', {
        name: req.user.displayName
    })
})

module.exports = router