import api from "./configs/axiosConfig";

export const UserAPI = {
  me: async function (token: string) {
    const response = await api.request({
      url: "/users/me",
      method: "GET",
      headers: {
        Authorization: "Basic " + token,
      },
    });

    return {
      id: response.data.payload.principal.id,
      username: response.data.payload.principal.username,
      email: response.data.payload.principal.email,
      avatarImage: response.data.payload.principal.avatarImage,
      role: response.data.payload.principal.role,
      createAt: response.data.payload.principal.createAt,
    };
  },
};
