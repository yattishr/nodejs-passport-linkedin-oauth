const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const axios = require('axios');

// UserSchema model
const User = require('../models/User')

// Function call for LinkedIn API ver 2.00.
const makeGetRequest = async (base_url) => {
  const config = {
    method: 'get',
    url: base_url,      
    headers: {
      'X-RestLi-Protocol-Version': '2.0.0',
      'Authorization': 'Bearer AQXmCofkII5Zq8J0P9amuezBJpM8Tmwq8WLHiQKRFX3qO855gAZ1JnmDbarzP0JqUK12g2xYxrT3ThvyR563s4rh80vL20ac1JvsrA9fDaY1UQMlACs9M6aFlxgV2qBBX7Rxe-44RGfIn8PzwS1ylrGZc45Dx4SXDf-cTkGx_d1KPTvcsr3ZlHga04s_ANPC0HQxeY62LQqniWLO95Vlr5w3hOE0Y1vlHsiODIWepfwYtmFkDAd2CT21dV9rNS3jHyaE6Q7DTMBGaWzihte57b_NQ6sKMVY1EnVuQIawa7eV4ssCaYwxVFxkFb7mJL3uJqC9IhdC0uq0b4blNNiZMwjjOggMRQ',
      'Cookie': 'lidc="b=OB43:s=O:r=O:a=O:p=O:g=2936:u=423:x=1:i=1627662830:t=1627663637:v=2:sig=AQEf6eul1b2yvnxLeLGmnkrUG9jRa7o9"; bcookie="v=2&379576f8-c09f-4580-8954-f09da4c20346"; lissc=1; _ga=GA1.2.1950358762.1626448789; aam_uuid=47155253070540489863377287992130959648; liap=true; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C18825%7CMCMID%7C47377235381028590253319617699886828267%7CMCAAMLH-1627055446%7C6%7CMCAAMB-1627055446%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1626457846s%7CNONE%7CvVersion%7C5.1.1%7CMCCIDH%7C1875071450'
    }      
  }

  try {
    return await axios(config)
  } catch (error) {
    console.error('OOoops, there was an error fetching your LinkedIn profile! ' , err)
  }
}

// @desc Get User Profile
// @route GET /profile
router.get('/', ensureAuth, async (req, res) => {
    try {
          const showData = async (base_url) => {
            try {
              const body = await makeGetRequest(base_url)
              return body
            } catch(error) {
              console.error('OOoops, there was an error fetching your LinkedIn profile! ' , err)
            }
          }

          let body = await showData('https://api.linkedin.com/v2/me')      
          let headline = await body.data.localizedHeadline
          let vanityName = await body.data.vanityName
          console.log(headline)      

          res.render('profile/index', {
              headline,
              vanityName,
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
          // LinkedIn Fetch API
          const showData = async (base_url) => {
            try {
              const body = await makeGetRequest(base_url)
              return body
            } catch(error) {
              console.error('OOoops, there was an error fetching your LinkedIn profile! ' , err)
            }
          }

          let body = await showData('https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(handle~))')      
          console.log(body.data.elements)
          // End LinkedIn Fetch API
          
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


// @desc Update Profile page
// @route PUT /users/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let profile = await User.findOne({
      linkedinId: req.params.id,
    }).lean()
    console.log('this is the user profile:', profile)
    if (!profile) {
      return res.render('error/404')
    }

    if(profile.linkedinId != req.user.linkedinId) {
      res.redirect('/profile')
    } else {
      profile = await User.findOneAndUpdate({ linkedinId: req.params.id }, req.body, {
        new: true,
        runValidators: true
      })
      res.redirect('/dashboard')
    }
  } catch {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router