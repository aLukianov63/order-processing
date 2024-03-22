import {User} from "@/types/User";
import {Button} from "./ui/button";
import {DoorOpen, ShoppingBasket} from "lucide-react";

type HeaderProps = {
    user: User | null;
};

const ProfileSection = ({user}: HeaderProps) => {
    function leave() {
        localStorage.clear();
        window.location.reload();
    }

    if (user === null) {
        return (
            <div className="flex flex-row gap-2">
                <Button variant="secondary" asChild>
                    <a href="/auth/signin">Войти</a>
                </Button>
                <Button asChild>
                    <a href="/auth/signup">Регистрация</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-row items-center gap-2">
            <a href="/users/me" className="hover:underline underline-offset-2">
                {user.username}
            </a>
            <Button className="hover:cursor-pointer" size="icon" asChild>
                <a href="/users/me/busket">
                    <ShoppingBasket size={20}/>
                </a>
            </Button>
            <Button onClick={leave} size="icon" asChild>
        <span>
          <DoorOpen size={20}/>
        </span>
            </Button>
        </div>
    );
};

const Header = ({user}: HeaderProps) => {
    return (
        <header>
            <nav className="bg-black h-16 px-4 lg:px-6 py-4 text-white">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <p className="text-xl">
                        <a href="/">shop-name</a>
                    </p>
                    <div>
                        <ProfileSection user={user}/>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
