const { init } = require('@paralleldrive/cuid2')
// const mongoose = require('mongoose')
// const { ObjectId } = mongoose.Types

const directoryModel = require('../models/directoryModel')
const fileModel = require('../models/fileModel')


const createUrlIdForDirectory = (tenantId) => {
    const urlId = init({
        random: Math.random,
        length: 12,
        fingerprint: tenantId
    })

    return urlId()
}

const createRootDirectory = async (userId, tenantId) => {

        const directory = directoryModel(tenantId)

        const rootDirectory = new directory(
            {
                urlId: createUrlIdForDirectory(),
                owner: userId,
                name: 'root',
            }
        )

        await rootDirectory.save()
}

const createChildDirectory = async (request, response) => {
    const user = request.user 
    let { parentDirectory } = request.params
    const { directoryName } = request.body
    try{

        const directory = directoryModel(user.tenantId)

        if(parentDirectory == 'home') {
            const rootDirectory = await directory.findOne({ name: 'root'})
            parentDirectory = rootDirectory._id
        } else {
            const rootDirectory = await directory.findOne({ urlId: parentDirectory })
            parentDirectory = rootDirectory._id
        }

        const childDirectory = new directory(
            {
                urlId: createUrlIdForDirectory(),
                owner: user._id,
                name: directoryName,
                parentDirectory: parentDirectory
            }
        )

        childDirectory.save()

        response.status(201).send({ message: "Directory created successfully"})
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const getAllFilesAndDirectoriesOfParticularDirectory = async (request, response) => {
    const user = request.user
    const tenantId = user.tenantId
    const parentDirectoryUrlId = request.params.parentDirectory
    try{

        const directory = directoryModel(tenantId)
        
        const parentDirectoryQuery = parentDirectoryUrlId == 'home' 
            ? { name: 'root'}
            : {urlId: parentDirectoryUrlId}

        const parentDirectory = await directory.findOne(parentDirectoryQuery)

        const directories = await directory.aggregate(
            [
                {
                    // $match: mongoose.Types.ObjectId(parentDirectory._id)
                    $match: {
                        parentDirectory: parentDirectory._id
                    }
                }
            ]
        )


        const file = fileModel(tenantId)

        const files = await file.aggregate(
            [
                {
                    $match: {
                        parentDirectory: parentDirectory._id
                    }
                }
            ]
        ) 
        console.log(files)
        response.status(200).send({ message: "Data fetched", directories: directories, files: files})

    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    createRootDirectory,
    createChildDirectory,

    getAllFilesAndDirectoriesOfParticularDirectory
}