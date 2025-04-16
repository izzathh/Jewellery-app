const baseURL = import.meta.env.VITE_API_URL;

export const ApiEndpoints = {
    ADMIN_AUTH: `${baseURL}/verify/admin`,
    ADMIN_LOGIN: `${baseURL}/auth/admin/login`,
    ADMIN_LOGOUT: `${baseURL}/auth/admin/logout`,

    LIST_PRODUCT: `${baseURL}/product/list`,
    AUTO_PRODUCT: `${baseURL}/product/autocomplete`,
    ADD_PRODUCT: `${baseURL}/product/add`,
    UPDATE_PRODUCT: `${baseURL}/product/update`,
    DELETE_PRODUCT: `${baseURL}/product/delete`,
}