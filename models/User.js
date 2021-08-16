const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    linkedinId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },        
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    headline: {
        type: String
    },
    vanityname: {
        type: String
    },
    emailAddress: {
        type: String
    },
    userRole: {
        type: String,
        default: 'normal'
    },    
    profileType: {
        type: String,
        default: 'public'
    },
    body: {
        type: String
    },
    payRate: {
        type: Number,
        default: 0.00
    },
    videoLinks: [{
        type: String
    }],
    categoriesInterest: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }          
})

module.exports = mongoose.model('User', UserSchema)