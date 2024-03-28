var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 

var auth = jwt({   // Lab 6
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlBlogList = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');  // Lab 6

/*API Routes*/
router.get('/blogs', ctrlBlogList.blogsList);
router.post('/blogs',auth,ctrlBlogList.blogsCreate); // lab 6
router.get('/edit/:blogId',ctrlBlogList.blogsReadOne);
router.put('/edit/:blogId',auth,ctrlBlogList.blogsUpdateOne); // lab 6
router.delete('/delete/:blogId',auth,ctrlBlogList.blogsDeleteOne); // lab 6
router.post('/register',ctrlAuth.register);
router.post('/login',ctrlAuth.login);

module.exports = router;