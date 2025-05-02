import "@/styles/globals.css";
import { Navbar, NavItem } from "@/components/Navbar";
import { FiSearch, FiUser } from "react-icons/fi";
import { ToastContainer } from "react-toastify";

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Itens para navbar
    const userNavItems = (
        <>
            <NavItem href="/" label="Explore" icon={<FiSearch />} />
            <NavItem href="/profile" label="Profile" icon={<FiUser />} />
        </>
    );

    return (
        <main className="">
            <Navbar navItems={userNavItems} />
            <section className="">
                {children} <ToastContainer />
            </section>
        </main>
    );
}
