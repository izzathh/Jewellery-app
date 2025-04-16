const mongoose = require('mongoose')

module.exports = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Mongo db connected on ${conn.connection.host}`)
    } catch (e) {
        console.error('MongoDB connection error:', e);
        process.exit(1)
    }
}