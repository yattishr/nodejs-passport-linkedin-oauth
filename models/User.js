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
    emailAddress: {
        type: String
    },
    userRole: {
        type: String,
        default: 'normal'
    },    
    createdAt: {
        type: Date,
        default: Date.now
    }          
})

module.exports = mongoose.model('User', UserSchema)