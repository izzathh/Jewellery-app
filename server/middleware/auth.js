const { Forbidden } = require('../utils/errors');
const { ADMINTYPES } = require('../config/constants');
const { tokenDecoder } = require('../utils/helper');

module.exports = (page, action) => {
    return (req, res, next) => {
        try {
            const token = req.cookies['token']
            const decoded = tokenDecoder(token)
            console.log(decoded.adminType);
            if (decoded.adminType !== ADMINTYPES.Admin && decoded.adminType !== ADMINTYPES.Superadmin)
                throw new Forbidden('Access denied.')
            req.user = decoded;
            next();
        } catch (err) {
            console.error('Authorization error:', err);
            next(err);
        }
    };
}