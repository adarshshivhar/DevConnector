const express = require('express');
const router = express.Router();

//Custom Auth Middleware
const auth = require('../../middleware/auth');

//User Model
const User = require('../../models/User');

const { check, validationResult } = require('express-validator');
//Bcrypt
const bcrypt = require('bcryptjs');

//JWT
const jwt = require('jsonwebtoken');

//Bring jwt secret
const config = require('config');

// ===================================================================== //

// ===================================================================== //

// @route    GET api/auth
// @desc     Get data of authenticate user
// @access   Public

//After adding 'auth' as parameter this route get protected
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  res.send('Auth route');
});



// @route    POST api/auth
// @desc     Authenticate/Login User
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //Find user using email
      let user = await User.findOne({ email });

      // See if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credientials' }] });
      }

      // See if password match
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credientials' }] });
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
module.exports = router;
