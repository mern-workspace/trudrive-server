const jwt = require('jsonwebtoken')

const { ACCESS_TOKEN } = require('../configuration/config')
const userModel = require('../models/userModel')
const { redisClient } = require('../cache/connection')

const verifyUser = async (request, response, next) => {
    try {
        const authHeader = request.headers['cookie']

        if(!authHeader) {
            return response.status(401).send({ message: 'Token not found'})

        }

        const cookie = authHeader.split('=')[1]
        
        jwt.verify(cookie, ACCESS_TOKEN, async (error, decode) => {
            if(error) {
                return response.status(401).send({ message: 'Session Expired'})
            }

            const { id } = decode

            // Check the id in redis 
            const cacheUser = await redisClient.get(id)

            if(cacheUser) {
                request.user = JSON.parse(cacheUser)
                return next()
            }

            const existingUser = await userModel.findOne(
                { _id: id}
            ).select('+tenantId')
            request.user = existingUser 
            next()
            
        })
    }
    catch(error) {
        response.status(500).send({ message: error.message })
    }
}

module.exports = {
    verifyUser
}