const { StatusCodes } = require('http-status-codes');
const authRoutes = require('../../routes/authRoutes')
const productRoutes = require('../../routes/productRoutes');
const { tokenDecoder } = require('../../utils/helper');

module.exports = (app) => {
    app.use('/api/v1/auth/admin', authRoutes)

    app.use('/api/v1/verify/admin', (req, res, next) => res.success(tokenDecoder(req.cookies['token'])))

    app.use('/api/v1/product', productRoutes)

    app.get('/health', (req, res) => {
        res.status(StatusCodes.OK).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
        });
    });
}