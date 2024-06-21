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
  processById: async function (id: number, token: string, admin: number) {
    await api.request({
      url: `/orders/${id}/process`,
      method: "PUT",
      data: {
        adminId: admin,
      },
      headers: {
        Authorization: "Basic " + token,
      },
    });
  },
  canselById: async function (id: number, token: string) {
    await api.request({
      url: `/orders/${id}/cansel`,
      method: "PUT",
      headers: {
        Authorization: "Basic " + token,
      },
    });
  },
};
