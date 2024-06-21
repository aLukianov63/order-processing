import api from "./configs/axiosConfig";

export const PaymentAPI = {
  create: async function (
    amount: number,
    token: string,
    description: string,
    userId: string
  ) {
    const response = await api.request({
      url: "/payments/create",
      method: "POST",
      data: {
        userId: userId,
        amount: amount,
        currency: "RUB",
        description: description,
      },
      headers: {
        Authorization: "Basic " + token,
      },
    });
    return response.data;
  },
};
