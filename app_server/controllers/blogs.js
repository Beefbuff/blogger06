var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};

module.exports.angularApp = function(req,res){
    res.render('layout', {title: 'BlogApp'});
  };

// GET blog list
// module.exports.list = function(req, res){
//     var requestOptions, path;
//     path = '/api/blogs';
//     requestOptions = { 
//         url : apiOptions.server + path,
//         method : "GET",
//         json : {},
//         qs : {} 
//         };
//     request(
//         requestOptions,
//         function(err, response, body) {
//             renderListPage(req, res, body);
//         }
//     );
// };

// Render the blog list page 
// var renderListPage = function(req, res, responseBody){
//     res.render('blogs-list', {
//         title: 'Blog List',
//         pageHeader: {
//             title: 'Blog List'
//         },
//         blogs: responseBody
//     });
// };  

// Blog add
// module.exports.add = function(req, res){
//     res.render('blogAdd', {title: 'Add Blog'});
// }

// Blog add POST
// module.exports.addPost = function(req, res){
//     var requestOptions, path, postdata;
//     path = '/api/blogs/';

//     postdata = {
//         title: req.body.title,
//         text: req.body.text,
//     }; 

//     requestOptions = {
//       url : apiOptions.server + path,
//       method : "POST",
//       json : postdata
//     };
    
//     request(
//       requestOptions,
//       function(err, response, body) {
//          if (response.statusCode === 201) {
//               res.redirect('/list');
//          } else {
//               _showError(req, res, response.statusCode);
//          } 
//       }
//     ); 
// };

// Get blog edit page
// module.exports.edit = function(req, res){
//     var requestOptions, path;
//     path = "/api/edit/" + req.params.blogId;
//     console.log(path);
//     requestOptions = {
//         url : apiOptions.server + path,
//         method : "GET",
//         json : {}
//     }; 
//     request(
//         requestOptions,
//         function(err, response, body) {
//                 renderEditPage(req, res, body);
// 	}
//     );
// }

/* Render the blog edit page */
// var renderEditPage = function(req, res, responseBody){
//     console.log(responseBody);
//     res.render('blogEdit', {
//         title: 'Edit Blog',
//         pageHeader: {
//                 title: 'Blog info'
//         },
//         blog: responseBody
//     });
// };

// Blog Edit Post
// module.exports.editPost = function(req, res){
//     var requestOptions, path, postdata;
//     var id = req.params.blogId;
//     path = '/api/edit/' + id;

//     postdata = {
//         title: req.body.title,
//         text: req.body.text,
//     };

//     requestOptions = {
//         url : apiOptions.server + path,
//         method : "PUT",
//         json : postdata
//     };

//     request(
// 	requestOptions,
//         function(err, response, body) {
//             if (response.statusCode === 201) {
//                 res.redirect('/list');
//             } else {
//                 _showError(req, res, response.statusCode);
//             }
//         }
//     );
// };

// Blogs delete
// module.exports.delete = function(req, res){
//     var requestOptions, path;
//     path = "/api/edit/" + req.params.blogId;
//     requestOptions = {
//         url : apiOptions.server + path,
//         method : "GET",
//         json : {}
//     };
//     request(
// 	requestOptions,
//         function(err, response, body) {
//             renderDeletePage(req, res, body);
//         }
//     );
// }

// Render the blog delete page
// var renderDeletePage = function(req, res, responseBody){
//     res.render('blogDelete', {
//         title: 'Blog Delete',
//         pageHeader: {
//                 title: 'Blog Delete'
//         },
//         blog: responseBody
//         }
//     );
// };

// Blog Delete Post
// module.exports.deletePost = function(req, res){
//     var requestOptions, path, postdata;
//     var id = req.params.blogId;
//     path = '/api/delete/' + id;

//     requestOptions = {
// 	url : apiOptions.server + path,
//         method : "DELETE",
//         json : {}
//     };

//     request(
//         requestOptions,
//         function(err, response, body) {
//             if (response.statusCode === 204) {
//                 res.redirect('/list');
//             } else {
//                 _showError(req, res, response.statusCode);
//             }
//         }
//     );
// };