const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const axios = require('axios');
const flash = require('connect-flash');

// UserSchema model
const User = require('../models/User')

// CategoriesSchema model
const Categories = require('../models/InterestCategories')

// define errors array.
let errors = [];

// Function call for LinkedIn API ver 2.00.
const makeGetRequest = async (base_url) => {
  const config = {
    method: 'get',
    url: base_url,      
    headers: {
      'X-RestLi-Protocol-Version': '2.0.0',
      'Authorization': 'Bearer AQVvHE4eOXv6jBZMuu9RUEBor2uDWauOhUBDboRoAo3HmqcHOF8vDTBHbUjjoc8i8x73TSeb8UmCF9dSqEW3B3cPQ7V6rQV06QB2IP6i2QTZTmQSrr7o-qHbW7NRQx2SZ4iqM0u4PaA2xCAkiw1dBhFp7WLIn0iefAa0e-IGzsXRotuSJ49ZBoPfpGLjakizLd4ZszRMJd-3YtpybHFFP53Rmh_AA4T0RtxIkpxhLNWbNCec_kuY9Hdu3R8GxvNoG7HCL82Y9co1KKNB2tXNqMQznwgHiV-jsid5PcrkF6Lhsfz1bf9RbWnGDt-HhRW2bjsmHR-j2QfTrj1oJgueajP6hOZRpw',
      'Cookie': 'lidc="b=OB43:s=O:r=O:a=O:p=O:g=2936:u=423:x=1:i=1627662830:t=1627663637:v=2:sig=AQEf6eul1b2yvnxLeLGmnkrUG9jRa7o9"; bcookie="v=2&379576f8-c09f-4580-8954-f09da4c20346"; lissc=1; _ga=GA1.2.1950358762.1626448789; aam_uuid=47155253070540489863377287992130959648; liap=true; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C18825%7CMCMID%7C47377235381028590253319617699886828267%7CMCAAMLH-1627055446%7C6%7CMCAAMB-1627055446%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1626457846s%7CNONE%7CvVersion%7C5.1.1%7CMCCIDH%7C1875071450'
    }      
  }

  try {
    console.log(`LinkedIn API GET Request Calling ${base_url}...` )
    return await axios(config)
  } catch (error) {
    console.error('OOoops, there was an error fetching your LinkedIn profile! ' , error)
  }
}

// @desc Get User Profile
// @route GET /profile
router.get('/', ensureAuth, async (req, res) => {
    try {
          const showData = async (base_url) => {
            try {
              const body = await makeGetRequest(base_url)
              // console.log(`my body data is: ${body.data}`)
              return body
            } catch(error) {
              console.error('OOoops, there was an error fetching your LinkedIn profile! ' , error)
            }
          }
          let urlStr = `https://api.linkedin.com/v2/people/(id:${req.user.linkedinId})`
          let profileImageStr = `https://api.linkedin.com/v2/people/(id:${req.user.linkedinId})?projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams))`
          let body = await showData(urlStr)
          let profileImagebody = await showData(profileImageStr)
          
          console.log('data returned from image string is: ', profileImagebody.data.profilePicture['displayImage~']['elements'][0][0])
          let headline = await body.data.localizedHeadline
          let vanityName = await body.data.vanityName
          console.log('the current profile image is: ', req.user.image)
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
              console.error('OOoops, there was an error fetching your LinkedIn profile! ' , error)
            }
          }

          // retrieve users email address from LinkedIn. LinkedIn Retrieve Email Address API not working. 06 Jan 2022
          // let body = await showData('https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(handle~))')
          // let emailAddress = body.data.elements[0]['handle~']['emailAddress']
          // console.log(emailAddress)
          // End LinkedIn Fetch API

          // lets load the categories data
          const categories = await Categories.find()
          .sort({ categoryName: 'asc' })
          .lean()
          
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
              categories,
              errors,
              profile              
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

    // error checking and validation
    if(req.body.firstName.length < 0 || req.body.lastName.length < 0 || req.body.displayName.length < 0 || req.body.emailAddress.length < 0) {
      errors.push({ msg : 'Please fill in all required fields.'})
    }    

    let profile = await User.findOne({
      linkedinId: req.params.id,
    }).lean()
    
    if (!profile) {
      return res.render('error/404')
      console.log(`Error! User profile ${linkedinId} not found...`)            
    }

    if(profile.linkedinId != req.user.linkedinId) {
      res.redirect('/profile')
    } else {      
      // lets do our validation checking here.
      if (errors.length > 0) {
        res.render('profile/edit', {
          errors,
          profile          
        })        
      } else {
      
        // validation for video Links array
        let videoLinks = []
        console.log('video links array length is: ', req.body.videoLinks.length)
        if (req.body.videoLinks.length < 0) {
          req.body.videoLinks = videoLinks
        }        

        profile = await User.findOneAndUpdate({ linkedinId: req.params.id }, req.body, {
          new: true,
          runValidators: true
        })
        console.log("the request body: ", req.body)
        res.redirect('/dashboard')
      }
    }
  } catch {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router