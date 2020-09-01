const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");


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
          console.log('token generated', token)
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

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    token_type: "Bearer",
  };

 
  const options = {
    expiresIn: "2h"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
