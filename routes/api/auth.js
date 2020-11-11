const express = require('express');
const router = express.Router();

//Custom Auth Middleware
const auth = require('../../middleware/auth');

//User Model
const User = require('../../models/User');

// @route    GET api/auth
// @desc     Test route
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
    res.send('Auth route')
});

module.exports = router;
