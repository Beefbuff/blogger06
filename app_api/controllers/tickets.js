var mongoose = require('mongoose');
var Ticketsmodel = mongoose.model('ticket');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

//GET a list of all tickets
module.exports.ticketsList = function (req, res) {
    console.log('Getting Ticket list');
    Ticketsmodel
        .find()
        .exec(function(err, results) {
          if (!results) {
            sendJSONresponse(res, 404, {
              "message": "no Tickets found"
            });
            return;
          } else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          sendJSONresponse(res, 200, buildTicketList(req, res, results));
        }); 
  };
  
  var buildTicketList = function(req, res, results) {
    var tickets = [];
    results.forEach(function(doc) {
      tickets.push({
        _id: doc._id,
        title: doc.title,
        details: doc.details,
        resolved: doc.resolved,
        createdBy: doc.createdBy,
        createdOn: doc.createdOn,
        assignedTo: doc.assignedTo,
        resolvedOn: doc.resolvedOn
      });
    });
    return tickets;
  };
  
  // POST a new ticket
  module.exports.ticketsCreate = function (req, res) {
    console.log(req.body);
    Ticketsmodel
     .create({
        title: req.body.title,
        details: req.body.details,
        resovled: req.body.resolved,
        assignedTo: {"userEmail": "", "name": ""},
        createdBy: req.body.createdBy
       }, function(err, ticket) {
         if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
         } else {
            console.log(ticket);
            sendJSONresponse(res, 201, ticket);
         }
       }
     );
  };
  
  //Get a ticket by ID
  
  module.exports.ticketsReadOne = function(req, res) {
    console.log('Finding Ticket', req.params.ticketId);
    if (req.params && req.params.ticketId) {
      Ticketsmodel
        .findById(req.params.ticketId)
        .exec(function(err, ticket) {
          if (!ticket) {
            sendJSONresponse(res, 404, {
              "message": "ticket id not found"
            });
            return;
          } else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          sendJSONresponse(res, 200, ticket);
        });
    } else {
      console.log('No ticket id specified');
      sendJSONresponse(res, 404, {
        "message": "No ticket id in request"
      });
    }
  };
  
  
  //PUT update a ticket by id; text and details
  module.exports.ticketsUpdateOne = function (req, res) {
    console.log("Updating a ticket entry with id of " + req.params.ticketId);
    console.log(req.body);
    Ticketsmodel
      .findOneAndUpdate(
       { _id: req.params.ticketId },
        { $set: {"title": req.body.title, "details": req.body.details}},
       function(err, response) {
           if (err) {
               sendJSONresponse(res, 400, err);
           } else {
            sendJSONresponse(res, 201, response);
          }
      }
    );
  };
  
  //Put  update a ticket; assign ticket to user 
  module.exports.ticketsAssignOne = function (req, res) {
    console.log("Assigning a ticket entry with id of " + req.params.ticketId);
    console.log(req.body);
    Ticketsmodel
      .findOneAndUpdate(
       { _id: req.params.ticketId },
        { $set: {"assignedTo": req.body.assignedTo}},
       function(err, response) {
           if (err) {
               sendJSONresponse(res, 400, err);
           } else {
            sendJSONresponse(res, 201, response);
          }
      }
    );
  };
  
  //Put update a ticket; resolved
  module.exports.ticketsResolveOne = function (req, res) {
    console.log("resolving a ticket entry with id of " + req.params.ticketId);
    Ticketsmodel
      .findOneAndUpdate(
       { _id: req.params.ticketId },
        { $set: {"resolved": true, "resolvedOn": Date.now()}},
       function(err, response) {
           if (err) {
               sendJSONresponse(res, 400, err);
           } else {
            sendJSONresponse(res, 201, response);
          }
      }
    );
  };

  //Put update a ticket; re-open
  module.exports.ticketsReOpenOne = function (req, res) {
    console.log("re-opening a ticket entry with id of " + req.params.ticketId);
    Ticketsmodel
      .findOneAndUpdate(
       { _id: req.params.ticketId },
        { $set: {"resolved": false}},
       function(err, response) {
           if (err) {
               sendJSONresponse(res, 400, err);
           } else {
            sendJSONresponse(res, 201, response);
          }
      }
    );
  };
  
  //DELETE a ticket by id
  module.exports.ticketsDeleteOne = function (req, res) {
    console.log("Deleting ticket entry with id of " + req.params.ticketId);
    console.log(req.body);
    Ticketsmodel
        .findByIdAndRemove(req.params.ticketId)
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