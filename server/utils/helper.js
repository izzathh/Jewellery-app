const jwt = require('jsonwebtoken')
const { UnAuthorized } = require("./errors");

module.exports = {
    tokenDecoder: (t) => {
        if (!t) throw new UnAuthorized('Please login to continue.')
        const decoded = jwt.verify(t, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) throw new UnAuthorized('Please login again to continue.')
            return decodedToken
        });
        return decoded
    }
}