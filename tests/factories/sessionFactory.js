const Buffer = require('buffer').Buffer;
const keys = require('../../config/keys');
const Keygrip = require('keygrip');
 
module.exports = (user) => {

    const sessionObject = {
        passport: {
            user: user._id.toString() // Mongoose model _id property is an object
        }
    };

    const session = Buffer.from(
        JSON.stringify(sessionObject)
    ).toString('base64');


    const key = new Keygrip([keys.cookieKey]);

    const sig = key.sign("session=" + session);

    return {session, sig};
}
