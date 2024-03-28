var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    title: String,
    text: String,
    createdOn: {
        type: Date,
        "default": Date.now
    }
});  

module.exports = mongoose.model('blog',blogSchema);
