const express = require('express')
const router = express.Router()

const { verifyUser } = require('../middleware/verify')
const { createChildDirectory, getAllFilesAndDirectoriesOfParticularDirectory } = require('../controllers/directoryController')


// To Create Child Directory 
router.post(
    '/:parentDirectory',

    verifyUser,

    createChildDirectory
)

// To get all files and directories from home
router.get(
    '/:parentDirectory',

    verifyUser,

    getAllFilesAndDirectoriesOfParticularDirectory
)

module.exports = router