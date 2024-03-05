import {PropsWithChildren} from "react";
import {useAuth} from "./AuthProvider";

type LayoutProps = PropsWithChildren;

const Layout = ({children}: LayoutProps) => {
    const user = useAuth();

    return (
        <div className="flex flex-col h-screen font-app">
            <header className="flex h-14 bg-black text-white items-center justify-between">
                <p>shop-name</p>
                <p>{user?.username}</p>
            </header>
            <div className="h-full">{children}</div>
            <footer>footer</footer>
        </div>
    );
};

export default Layout;
