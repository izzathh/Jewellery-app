const { body, validationResult } = require('express-validator')
const { BadRequest } = require('../utils/errors')

const validate = (method) => {
    const options = {
        "login": [
            body('email')
                .notEmpty()
                .withMessage('Email is required')
                .isEmail().normalizeEmail(),

            body('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters')
                .notEmpty()
                .withMessage('Password is required')
        ],
        "createProduct": [
            body('name')
                .trim()
                .notEmpty().withMessage('Name is required')
                .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),

            body('price')
                .isFloat({ min: 1 }).withMessage('Price must be a positive number')
                .custom(value => {
                    if (value <= 0) throw new Error('Price must be non-negative.')
                    return true
                }),

            body('stock')
                .isNumeric().withMessage('Stock must be a number.'),

            body('description')
                .optional()
                .trim()
                .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),

            body('category')
                .trim()
                .notEmpty().withMessage('Category is required'),

            body('manufacturingDate')
                .isISO8601().withMessage('Invalid manufacturing date'),

            body('image')
                .custom((value, { req }) => {
                    if (!req.file) {
                        throw new Error('Image is required');
                    }
                    return true;
                })
        ],
        "updateProduct": [
            body('name')
                .optional()
                .isString().withMessage('Name must be a string.')
                .trim()
                .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters.'),

            body('price')
                .optional()
                .isNumeric().withMessage('Price must be a number.')
                .custom(value => {
                    if (value <= 0) throw new Error('Price must be non-negative.')
                    return true
                }),

            body('stock')
                .optional()
                .isNumeric().withMessage('Stock must be a number.'),

            body('description')
                .optional()
                .isString().withMessage('Description must be a string.')
                .trim()
                .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),

            body('category')
                .optional()
                .trim()
                .isString().withMessage('Category must be a string.'),

            body('manufacturingDate')
                .optional()
                .isISO8601().toDate().withMessage('Manufacturing Date must be a valid date.'),
        ]
    }
    return options[method] || []
}

const handleValidation = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new BadRequest(errors.array()[0].msg)
        next()
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    handleValidation,
    validate
}