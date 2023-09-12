const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
    try {
        //code
        const token = req.headers["gnewtoken"]
        if (!token) {
            return res.status(401).json({ msg: 'No Token, Authorization Denied' })
        }

        const decoded = jwt.verify(token, 'gnewsecret')
        req.user = await decoded
        
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' + err})
    }
}