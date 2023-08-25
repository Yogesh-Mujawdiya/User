const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        // const token = req.headers('Authorization').replace('Bearer ', '')
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'yogasecrettext')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user){
            throw new Error()
        }

        req.token = token 
        req.user = user
        next()
    }
    catch (e) {
        res.status(401).send('Please authenticate.')
    }
}

module.exports = auth