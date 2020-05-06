const jwt = require("koa-jwt")


const token = jwt.sign({
    name: result.name,
    _id: result._id
}, 'my_token', { expiresIn: '2h' });