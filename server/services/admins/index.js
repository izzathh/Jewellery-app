const Admin = require("../../models/Admin")

module.exports = {
    getAdminById: async (id) => {
        const admin = await Admin.findById(id)
        return admin
    },

    getAdminByEmail: async (email) => {
        const admin = await Admin.findOne({ email }).select('+password')
        return admin
    },

    getAllAdmins: async () => {
        const admin = await Admin.find().lean()
        return admin
    },

    deleteAdminById: async (id) => {
        const admin = await Admin.findByIdAndDelete(id)
        return admin
    }
}