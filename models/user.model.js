var mongoose = require('mongoose');

/**
 * User schema
 */

userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    groups: [{
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Groups'
        },
        training: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trainings'
        },
        chapter: [],
        stats: {
            numbers: [],
            values: []
        },
        questions : [{}]

    }]
},{ timestamps: true });

/**
 * Exports
 */
module.exports = mongoose.model('Users', userSchema);