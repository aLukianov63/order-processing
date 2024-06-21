import { PropsWithChildren } from "react";
import { useAuth } from "./AuthProvider";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "./ui/toaster";

type LayoutProps = PropsWithChildren;

const Layout = ({ children }: LayoutProps) => {
  const user = useAuth();

  return (
    <div className="flex flex-col h-screen font-app">
      <Header user={user} />
      <div className="h-full">{children}</div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
