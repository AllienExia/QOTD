var mongoose = require('mongoose');

/**
 * Admin schema
 */

AdminSchema = new mongoose.Schema({
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
    }
},{ timestamps: true });

/**
 * Exports
 */
module.exports = mongoose.model('Admins', AdminSchema);