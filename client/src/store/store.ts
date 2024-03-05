import {User} from "@/types/User";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type ClientStorage = {
    user: User | null;
    userToken: string;
    updateUser: (temp: User) => void;
    updateToken: (token: string) => void;
};

export const useClientStorage = create<
    ClientStorage,
    [["zustand/persist", unknown]]
>(
    persist(
        (set) => ({
            user: null,
            userToken: "",
            updateUser: (temp: User) => set(() => ({user: temp})),
            updateToken: (token: string) => set(() => ({userToken: token})),
        }),
        {
            name: "client_data",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
