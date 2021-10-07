const mongoose = require('mongoose');
const Query = mongoose.Query;
const Blog = mongoose.model('Blog');

const keys = require('../config/keys');

const redis = require('redis');

const redisUrl = keys['redisUrl'];

const redisClient = redis.createClient(redisUrl);

const util = require('util');
redisClient.hget = util.promisify(redisClient.hget);


const mainExec = Query.prototype.exec;

Query.prototype.checkCache = function (options = {}) {
    this.shouldCheckCashe = true;
    this.hashKey = options.key || 'default';
    return this;
}

Query.prototype.exec = async function () {

    if (!this.shouldCheckCashe) { 

        return mainExec.apply(this, arguments);

    }
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );
    const cachedBlogs = await redisClient.hget(this.hashKey, key);

    //console.log(cachedBlogs, this.hashKey, key);

    if (cachedBlogs && cachedBlogs.length > 2) {

        console.log('Serving from cache');
        const result = JSON.parse(cachedBlogs);

        return Array.isArray(result) ?
            result.map(d => new this.model(d))
            :
            new this.model(result);

    }

    console.log('Serving from DB');
    const blogs = await mainExec.apply(this, arguments);

    redisClient.hset(this.hashKey, key, JSON.stringify(blogs));

    return blogs;


}