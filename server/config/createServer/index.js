const express = require('express');
const app = express()
const cors = require('cors');
const helmet = require('helmet');
const endpoints = require('../endpoints');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const handleSuccess = require('../../middleware/handleSuccess')
const handleErrors = require('../../middleware/handleErrors')
const connectDb = require('../dbConnection');
const cookieParser = require('cookie-parser')
const path = require('path')

app.use((req, res, next) => {
    console.log(req.url);
    next()
})

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}))

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "blob:", "http://localhost:5000", process.env.CORS_ORIGIN || '*'],
            "media-src": ["'self'", "http://localhost:5000"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cookieParser())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(handleSuccess)

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many requests from this IP, please try again later'
})

app.use('/api/v1/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    next();
}, express.static("./uploads"));

connectDb()

app.use('/api/v1/auth/admin', authLimiter)

endpoints(app)

app.use(handleErrors)
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})