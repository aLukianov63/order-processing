import api from "./configs/axiosConfig";

export const AuthAPI = {
    login: async function (username: string, password: string) {
        const response = await api.request({
            url: "/auth/signin",
            method: "POST",
            data: {
                username: username,
                password: password,
            },
        });

        return response.data.payload;
    },
    register: async function (username: string, email: string, password: string) {
        const response = await api.request({
            url: "/auth/signup",
            method: "POST",
            data: {
                username: username,
                email: email,
                password: password,
            },
        });

        return response.data.payload;
    },
};
