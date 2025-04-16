const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'super-admin'],
        default: 'admin'
    },
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    accountLockedUntil: Date
}, { timestamps: true })

AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

AdminSchema.methods.increLoginAttempts = function () {
    this.loginAttempts += 1
    if (this.loginAttempts >= 5) this.accountLockedUntil = Date.now() + 15 * 60 * 1000
    return this.save()
}

AdminSchema.methods.resetLoginAttempt = function () {
    this.loginAttempts = 0
    this.accountLockedUntil = undefined
    return this.save()
}

AdminSchema.methods.comparePass = async function (password) {
    console.log(password);
    return await bcrypt.compare(password, this.password)
}

const Admin = mongoose.model('Admin', AdminSchema, 'admins')
module.exports = Admin