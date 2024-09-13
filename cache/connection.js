const { createClient } = require('redis');

// Redis client setup
const redisClient = createClient({
    password: 'rvEglPm8Mp1I6ndD7eeFaKHPRUUaGvGb',
    socket: {
        host: 'redis-11656.c93.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 11656
    }
});

const connectToRedis = async () => {
    try {
        await redisClient.connect(); // Connect to Redis
        console.log("Connected successfully to Redis Cloud");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
        throw error;
    }
};

module.exports = {
    redisClient,
    connectToRedis
};
