const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String,
        required: true

    },
    topics: {
        type: Array
    },
    duration: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports=mongoose.model('courses',courseSchema);