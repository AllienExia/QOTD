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
        group_id: mongoose.Schema.Types.ObjectId,
        questions : [{}]

    }]
},{ timestamps: true });

/**
 * Exports
 */
module.exports = mongoose.model('Users', userSchema);