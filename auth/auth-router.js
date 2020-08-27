const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");

//----------------------------------------------------------------------------//
// We didn't do this in class, but it makes sense to return a token when someone
// registers... why make them log in when they just barely provided a new
// username and password? Just return them a token, so they can begin using it
// right away... unless, of course,  you need to validate their email address
// first... 
//----------------------------------------------------------------------------//
router.post("/register", (req, res) => {
  const credentials = req.body;
  console.log("register credentials", credentials)

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    Users.add(credentials)
      .then(user => {
        // const token = genToken(saved);
        res.status(201).json({ data: user });
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

//----------------------------------------------------------------------------//
// When someone successfully authenticates, reward them with a token, so they
// don't have to authenticate again. 
//----------------------------------------------------------------------------//
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: "Welcome to our API",
            token
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

//----------------------------------------------------------------------------//
// This is a helper method that helps us stay DRY (we generate tokens in both
// the POST /api/auth/register handler, and the POST /ap/auth/login handler).
// Uses the same pattern as our test handler for GET /token in server.js. 
//----------------------------------------------------------------------------//
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    // this could be more sophisticated. A hierarchy of privileges could be
    // established as, and an entire library for managing rights. This is not a
    // new problem, and many creative patterns and packages have been created to
    // solve it (the ability to manage privileges/roles, etc.) If you are
    // interested, look up these topics:
    //    * Role-based access control (RBAC)
    //      https://en.wikipedia.org/wiki/Role-based_access_control
    //    * Access Control List (ACL)
    //      https://en.wikipedia.org/wiki/Access-control_list 
    // role: user.role
  };

  // the syntax for specifing an expiration time with jsonwebtoken package is
  // somewhat intuitive. In addition to this ASCII/text method, you could
  // calculate "Seconds Since Epoch", which is known through Unix-like systems
  // as the number of elapsed seconds since midnight, January 1, 1970, in the
  // UTC timezone (aka GMT). See https://en.wikipedia.org/wiki/Epoch_(computing)
  // Note that specifying an "expires in" value specifies an amount of time that
  // must elapse for the token to be considered "expired". 
  //
  // For instructions you should follow (both on the client and server side)
  // with respect to JWT's,  you should read the RFC (Request For Comments)
  // document that defines the JWT format and use. See
  // https://tools.ietf.org/html/rfc7519. 
  // 
  // For an understanding of what an RFC is, enjoy this little bit of light
  // reading: https://en.wikipedia.org/wiki/Request_for_Comments 
  // 
  // See section 4.1.4, as well as the definition of "NumericDate" in Section 2.
  // If you think that managing time on computers and across the Internet and
  // around the world is simple, you have not studied the topic... dive in, have
  // fun! 
  const options = {
    expiresIn: "2h"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
