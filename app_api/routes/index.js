var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({   // Lab 6
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlBlogList = require('../controllers/blogs');
var ctrlTicketList = require('../controllers/tickets');//lab 8
var ctrlUsersList = require('../controllers/users');//lab 8
var ctrlAuth = require('../controllers/authentication');  // Lab 6

/*Blog API Routes*/
router.get('/blogs', ctrlBlogList.blogsList);
router.post('/blogs', auth, ctrlBlogList.blogsCreate); // lab 6
router.get('/edit/:blogId', ctrlBlogList.blogsReadOne); //lab 6
router.put('/edit/:blogId', auth, ctrlBlogList.blogsUpdateOne); // lab 6
router.delete('/delete/:blogId', auth, ctrlBlogList.blogsDeleteOne); // lab 6
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

/*Ticket API Routes*/
router.get('/tickets', ctrlTicketList.ticketsList); //lab 8
router.post('/tickets', ctrlTicketList.ticketsCreate); // lab 8
router.get('/editTicket/:ticketId', ctrlTicketList.ticketsReadOne); //lab 8
router.put('/editTicket/:ticketId', ctrlTicketList.ticketsUpdateOne); // lab 8

router.put('/assign/:ticketId', ctrlTicketList.ticketsAssignOne); //lab 8
router.put('/resolve/:ticketId', ctrlTicketList.ticketsResolveOne);// lab 8
router.put('/re-open/:ticketId', ctrlTicketList.ticketsReOpenOne);// lab 8

router.delete('/deleteTicket/:ticketId',ctrlTicketList.ticketsDeleteOne); // lab 8

/*User API Routes */
router.get('/users', ctrlUsersList.usersList); //lab 8
router.get('/users/:userId', ctrlUsersList.usersReadOne); //lab 8

module.exports = router;