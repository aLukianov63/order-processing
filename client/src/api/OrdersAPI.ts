import api from "./configs/axiosConfig";

export const OrdersAPI = {
    getAll: async function (token: string) {
        const response = await api.request({
            url: "/orders",
            method: "GET",
            headers: {
                Authorization: "Basic " + token,
            },
        });
        return response.data.payload;
    },
    getByUserId: async function (id: number, token: string) {
        const response = await api.request({
            url: `/users/${id}/orders`,
            method: "GET",
            headers: {
                Authorization: "Basic " + token,
            },
        });
        return response.data.payload;
    },
    updateById: async function (id: number, token: string, data: object) {
        await api.request({
            url: `/orders/${id}`,
            method: "PUT",
            data: {
                status: data.status,
                message: data.message,
                deliveryDate: data.deliveryDate,
            },
            headers: {
                Authorization: "Basic " + token,
            },
        });
    },
};
