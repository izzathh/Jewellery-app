import api from "../../api";
import { ApiEndpoints } from "../../api/endpoints"

export const productsService = {
    list: async (query) => {
        const { data } = await api.get(ApiEndpoints.LIST_PRODUCT, query)
        return data
    },

    autoCompleteCategory: async (query) => {
        const { data } = await api.get(ApiEndpoints.AUTO_PRODUCT, query)
        return data
    },

    create: async (payload) => {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };
        const { data } = await api.post(ApiEndpoints.ADD_PRODUCT, payload, config)
        return data
    },

    update: async (payload, id) => {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };
        const { data } = await api.put(`${ApiEndpoints.UPDATE_PRODUCT}/${id}`, payload, config);
        return data;
    },

    delete: async (id) => {
        const { data } = await api.delete(ApiEndpoints.DELETE_PRODUCT + `/${id}`)
        return data
    }
}