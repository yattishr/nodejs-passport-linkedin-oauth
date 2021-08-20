const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

// UserSchema model
const Categories = require('../models/InterestCategories')

// @desc Get User Profile
// @route GET /profile 
router.get('/', ensureAuth, async (req, res) => {
    try {
      const categories = await Categories.find()
        .sort({ createdAt: 'desc' })
        .lean()      
      console.log('the categories are: ', categories)
        res.render('categories/index', {
          categories
        })        
    } catch (err) {
        console.error('OOoops, there was an error fetching your user profile! ' , err)
        res.render('error/500')
    }
    
})

// @desc Process add form
// @route POST /categories
router.post('/', ensureAuth, async (req, res) => {
  try {      
        await Categories.create(req.body)
        console.log('the request body is: ', req.body)
        res.redirect('/categories')
  } catch(err) {
        console.log('OOOoops, and error occured! ' ,err)
        res.render('error/500')
  }
})

// @desc Edit Categories Page
// @route GET /categories/edit
router.get('/edit', ensureAuth, (req, res) => {
    res.render('categories/edit')
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