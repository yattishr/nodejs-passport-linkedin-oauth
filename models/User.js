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
    phone: {
        type: String
    },
    userRole: {
        type: String,
        default: 'normal'
    },    
    profileType: {
        type: String,
        default: 'private'
    },
    body: {
        type: String
    },
    payRate: {
        type: Number,
        default: 0.00
    },
    payType: {
        type: String,
        default: 'Hourly',
        enum: ['Hourly', 'Daily', 'No charge']        
    },    
    country: {
        type: String
    },
    city: {
        type: String
    },
    town: {
        type: String
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