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
        let newString = ""
        newString = req.body.categoryName.replace(/[^A-Z0-9]+/ig, "_");
        console.log('the newString value is: ', newString.toLowerCase().trim())
        req.body.tagName = newString.toLowerCase().trim()
        await Categories.create(req.body)
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
// @route GET /categories/edit/:id. NOT NEEDED NOW.
router.get('/edit/:id', ensureAuth, async (req, res) => {

    try {
        const profile = await User.findOne({
            linkedinId: req.params.id,
        }).lean()
    
        if (!profile) {
          return res.render('error/404')
        }
    
        if (profile.linkedinId != req.user.linkedinId) {
          res.redirect('/categories')
        } else {
          res.render('categories/edit', {
            profile,
          })
        }
      } catch (err) {
        console.error(err)
        return res.render('error/500')
      }    

})


// @desc DELETE Categories
// @route DELETE /categories/:id. NOT NEEDED NOW.
router.delete('/delete/:id', ensureAuth, async (req, res) => {
  try {
      await categories.remove({_id: req.params.id})
      res.redirect('/dashboard')
  } catch(err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router