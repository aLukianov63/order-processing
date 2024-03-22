import {useClientStorage} from "@/store/store";
import {User} from "@/types/User";
import {createContext, PropsWithChildren, useContext} from "react";

const AuthContext = createContext<User | null>(null);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({children}: AuthProviderProps) {
    const user = useClientStorage((state) => state.user);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
