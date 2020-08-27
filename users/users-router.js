const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");
const checkRole = require('../auth/check-role-middleware.js');

//----------------------------------------------------------------------------//
// This is where we use checkRole(). "1" is the ID for the "Admin" role. Calling
// checkRole(1) returns a middleware function that checks to see 1) if the
// decoded token on the req object has a "role" property, and 2, if that
// property has the value of "1". 
//----------------------------------------------------------------------------//
router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});



module.exports = router;
