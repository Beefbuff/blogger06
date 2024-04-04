var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    title: String,
    text: String,
    createdBy: {
        userEmail: {
            type: String,
            required: true
          },
          name: {
            type: String,
            required: true
          }
    },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});  

module.exports = mongoose.model('blog',blogSchema);
