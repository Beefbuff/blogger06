var express = require('express');
var router = express.Router();
var ctrlBlogList = require('../controllers/blogs');

//var ctrlHome = require('../controllers/home');
//router.get('/', ctrlHome.home);

router.get('/blogs', ctrlBlogList.blogsList);
router.post('/blogs',ctrlBlogList.blogsCreate);
router.get('/edit/:blogId',ctrlBlogList.blogsReadOne);
router.put('/edit/:blogId',ctrlBlogList.blogsUpdateOne);
router.delete('/delete/:blogId',ctrlBlogList.blogsDeleteOne);

module.exports = router;