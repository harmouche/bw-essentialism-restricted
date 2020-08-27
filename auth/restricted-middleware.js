// The old method of verifying that the user is authenticated was to take the
// username/password from headers, and look the user up in the DB... then verify
// the password with bcrype. We needed the bcryptjs package for that. The new
// method doesn't do that, so we don't need it anymore... 
//
// const bcrypt = require('bcryptjs');

// the new way! JWT! 
// And... secrets... 
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

//----------------------------------------------------------------------------//
// A method to verify that an authorization token is included as a header, and
// that the token is 1) valid, and 2) not expired. (jsonwebtoken checks for
// expired tokens automatically.)
//----------------------------------------------------------------------------//
module.exports = (req, res, next) => {

  // we put this all in a try..catch block so that we can do better error
  // handling. 
  try {
    // get the token from the authorization header. Remember that typically, the
    // client will include the "type" directive (typically "bearer") in
    // addition to the token. So we need to strip off the type directive. If we
    // didn't do that, then when it is included (like it almost always is),
    // verification will fail, because we will be trying to verify "Bearer
    // {token}" instead of just "{token}". 
    //
    // See https://www.rfc-editor.org/rfc/rfc6750.html for information on
    // "bearer" tokens. 
    //
    // See https://tools.ietf.org/html/rfc2617 for information on "basic" and
    // "digest" authorization headers. 
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ you: "can't touch this" });
        } else {
          req.decodedJwt = decodedToken;
          console.log(req.decodedJwt);
          next();
        }
      })
    } else {
      throw new Error('invalid auth data');
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }

};
