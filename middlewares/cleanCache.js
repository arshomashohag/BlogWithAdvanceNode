const redis = require('redis');

const redisUrl = "redis://localhost:6379";
const redisClient = redis.createClient(redisUrl);

module.exports = {
    async cleanCache(req, res, next){
        await next();

        redisClient.del(req.user.id);
    }
}