const { getAdminByEmail } = require('../../services/admins');
const { UnAuthorized, Forbidden, BadRequest } = require('../../utils/errors');
const { ENV, ORIGINS } = require('../../config/constants');
const jwt = require('jsonwebtoken')

module.exports = {
    logoutAdmin: (req, res, next) => {
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === ENV.Production,
            sameSite: process.env.NODE_ENV === ENV.Production ? 'none' : 'lax'
        };
        // if (process.env.NODE_ENV === ENV.Production)
        //     cookieOptions.domain = ORIGINS.Live.split('gc')[1]
        res.clearCookie('connect.sid');
        res.clearCookie('token', cookieOptions)
        res.success(null, 'Logout successful');
    },

    loginAdmin: async (req, res, next) => {
        const { rememberMe, email, password } = req.body
        try {
            const admin = await getAdminByEmail(email);

            if (admin && admin.accountLockedUntil && admin.accountLockedUntil > Date.now())
                throw new Forbidden("Account temporarily locked. Try again later.")

            if (!admin || !(await admin.comparePass(password))) {
                if (admin) await admin.increLoginAttempts();
                throw new BadRequest("Incorrect email or password")
            }

            await admin.resetLoginAttempt();

            admin.lastLogin = Date.now();
            await admin.save();

            const payload = {
                adminId: admin._id,
                email: admin.email,
                adminType: admin.role
            }

            const expiresIn = rememberMe ? '90d' : '7d'
            const maxAge = rememberMe ? 90 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
            const cookieOptions = {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === ENV.Production,
                sameSite: process.env.NODE_ENV === ENV.Production ? 'none' : 'lax',
                maxAge
            };

            // if (process.env.NODE_ENV === ENV.Production)
            //     cookieOptions.domain = ORIGINS.Live.split('gc')[1]

            res.cookie('token', token, cookieOptions)
            res.success(payload, 'Admin sign-in successful')

        } catch (e) {
            next(e)
        }
    }
}