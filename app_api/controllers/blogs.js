var mongoose = require('mongoose');
var Blogsmodel = mongoose.model('blog');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

//GET a list of all blogs
module.exports.blogsList = function (req, res) {
    console.log('Getting Blog list');
    Blogsmodel
        .find()
        .exec(function(err, results) {
          if (!results) {
            sendJSONresponse(res, 404, {
              "message": "no blogs found"
            });
            return;
          } else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          //console.log(results);
          sendJSONresponse(res, 200, buildBlogList(req, res, results));
        }); 
  };
  
  var buildBlogList = function(req, res, results) {
    var blogs = [];
    results.forEach(function(doc) {
      blogs.push({
        _id: doc._id,
        title: doc.title,
        text: doc.text,
        createdOn: doc.createdOn
      });
    });
    return blogs;
};

// POST a new blog
module.exports.blogsCreate = function (req, res) {
    console.log(req.body);
    Blogsmodel
     .create({
        title: req.body.title,
        text: req.body.text,
       }, function(err, blog) {
         if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
         } else {
            console.log(blog);
            sendJSONresponse(res, 201, blog);
         }
       }
     );
};

//Get a blog by ID

module.exports.blogsReadOne = function(req, res) {
    console.log('Finding Blog', req.params.blogId);
    if (req.params && req.params.blogId) {
      Blogsmodel
        .findById(req.params.blogId)
        .exec(function(err, blog) {
          if (!blog) {
            sendJSONresponse(res, 404, {
              "message": "blogid not found"
            });
            return;
          } else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          sendJSONresponse(res, 200, blog);
        });
    } else {
      console.log('No blogid specified');
      sendJSONresponse(res, 404, {
        "message": "No blogid in request"
      });
    }
  };


//PUT update a blog by id
module.exports.blogsUpdateOne = function (req, res) {
    console.log("Updating a blog entry with id of " + req.params.blogId);
    console.log(req.body);
    Blogsmodel
  	  .findOneAndUpdate(
	     { _id: req.params.blogId },
 	     { $set: {"title": req.body.title, "text": req.body.text}, "createdOn": req.body.createdOn},
	     function(err, response) {
	         if (err) {
	  	         sendJSONresponse(res, 400, err);
	         } else {
		        sendJSONresponse(res, 201, response);
	        }
	    }
    );
};

//DELETE a blog by id
module.exports.blogsDeleteOne = function (req, res) {
    console.log("Deleting blog entry with id of " + req.params.blogId);
    console.log(req.body);
    Blogsmodel
        .findByIdAndRemove(req.params.blogId)
        .exec (
            function(err, response) {
                if (err) {
                            sendJSONresponse(res, 404, err);
                } else {
                            sendJSONresponse(res, 204, null);
                }
            }
        );
};