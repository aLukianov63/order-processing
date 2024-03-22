import api from "./configs/axiosConfig";

export const BasketAPI = {
    getById: async function (id: number | undefined, token: string) {
        const response = await api.request({
            url: `/users/${id}/basket`,
            method: "GET",
            headers: {
                Authorization: "Basic " + token,
            },
        });

        return response.data.payload;
    },
};
