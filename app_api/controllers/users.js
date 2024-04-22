var mongoose = require('mongoose');
var Usersmodel = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

  //GET a list of all users
module.exports.usersList = function (req, res) {
    console.log('Getting User list');
    Usersmodel
        .find()
        .exec(function(err, results) {
          if (!results) {
            sendJSONresponse(res, 404, {
              "message": "no Users found"
            });
            return;
          } else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          sendJSONresponse(res, 200, buildUserList(req, res, results));
        }); 
  };

  var buildUserList = function(req, res, results) {
    var userAccounts = [];
    results.forEach(function(doc) {
      userAccounts.push({
        _id: doc._id,
        email: doc.email,
        name: doc.name,
        hash: doc.hash,
        salt: doc.salt,
        isAdmin: doc.isAdmin
      });
    });
    return userAccounts;
  };

   //Get a user by ID
   module.exports.usersReadOne = function(req, res) {
    console.log('Finding User', req.params.userId);
    if (req.params && req.params.userId) {
      Usersmodel
        .findById(req.params.userId)
        .exec(function(err, user) {
          if (!user) {
            sendJSONresponse(res, 404, {
              "message": "User id not found"
            });
            return;
          } else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          sendJSONresponse(res, 200, user);
        });
    } else {
      console.log('No User id specified');
      sendJSONresponse(res, 404, {
        "message": "No User id in request"
      });
    }
  };