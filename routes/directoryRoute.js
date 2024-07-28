const express = require('express')
const router = express.Router()

const { verifyUser } = require('../middleware/verify')
const { createChildDirectory, getAllFilesAndDirectoriesOfParticularDirectory } = require('../controllers/directoryController')
const { check } = require('express-validator')


// To get all files and directories from home
router.get(
    '/:parentDirectory',

    verifyUser,

    getAllFilesAndDirectoriesOfParticularDirectory
)

// To Create Child Directory 
router.post(
    '/:parentDirectory',

    check('directoryName')
        .not()
        .isEmpty()
        .withMessage('Enter a valid Directory name'),

    verifyUser,

    createChildDirectory
)

module.exports = router