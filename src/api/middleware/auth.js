const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
    try {
        const token = req.headers["authtoken"]
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' })
        } else {
            const decoded = jwt.verify(token, 'gnewsecret')
            req.user = decoded.user
            next()
        }        
    } catch (err) {
        res.status(500).json({ msg: 'Server Error: ' + err})
    }
}