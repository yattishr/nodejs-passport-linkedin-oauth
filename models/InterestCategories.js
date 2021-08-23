const mongoose = require('mongoose')

const CategoriesSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    displayName: {
        type: String
    },
    tagName: {
        type: String
    },    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Categories', CategoriesSchema)