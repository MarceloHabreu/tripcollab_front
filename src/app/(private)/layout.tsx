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
        <main className="min-h-screen h-screen">
            <Navbar navItems={userNavItems} />
            {/* Seção dinâmica (Login ou Register) */}
            <section className="min-h-screen w-full bg-white text-black flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10">
                {children} <ToastContainer />
            </section>
        </main>
    );
}
