const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { signup, login } = require('../controllers/authController')
const { verifyUser } = require('../middleware/verify')
const { authenticateUser } = require('../controllers/userController')
const upload = require('../middleware/upload')

// Signup route
router.post(
    '/signup', 
    
    check('firstName')
        .not()
        .isEmpty()
        .isLength({min: 2})
        .withMessage('Enter a valid First name'),
    check('lastName')
        .not()
        .isEmpty()
        .isLength({min: 1})
        .withMessage('Enter a valid Last name'),
    check('email')
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty()
        .isLength({min: 8})
        .withMessage('Password length is at least 8 character'),
    
    signup
)

// Login route
router.post(
    '/login', 
    
    check('email')
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty()
        .isLength({min: 8})
        .withMessage('Password length is at least 8 character'),
    
    login
)

// Authenticate User
router.get(
    '/authenticate',

    verifyUser,

    authenticateUser
)

router.post(
    '/add',
    verifyUser,
    upload.single('image'),
    (request, response) => {
        console.log(request.file)
        response.send("done")
    }
)

module.exports = router