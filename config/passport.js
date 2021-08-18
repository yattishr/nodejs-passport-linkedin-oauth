const GoogleStrategy = require('passport-google-oauth20').Strategy
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: '/auth/linkedin/callback'
    }, async(accessToken, refreshToken, profile, done) => {
        console.log('The current user profile is: ', profile)
        const newUser = {
            linkedinId: profile.id,        
            displayName: profile.displayName,
            image: profile.photos[1].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            emailAddress: profile.emailAddress
            // image: profile.photos[0].value
        }
        console.log('The new user profile is: ', newUser)

        try {
            let user = await User.findOne({ linkedinId: profile.id })
            if(user) {
                done(null, user) // if user is found, then continue with no error.
            } else {
                user = await User.create(newUser) // create a new User.
                done(null, user)
            }
        } catch(err) {
            console.error('Oooops, there was an error logging in!', err)
        }

    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}