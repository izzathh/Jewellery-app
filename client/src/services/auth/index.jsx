import api from "../../api";
import { ApiEndpoints } from "../../api/endpoints"

export const authService = {
    authCheck: async () => {
        const { data } = await api.post(ApiEndpoints.ADMIN_AUTH)
        return data
    },

    login: async (creds) => {
        const { data } = await api.post(ApiEndpoints.ADMIN_LOGIN, creds)
        return data
    },

    logout: async () => {
        const { data } = await api.post(ApiEndpoints.ADMIN_LOGOUT)
        return data
    }
}