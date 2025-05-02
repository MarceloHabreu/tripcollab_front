"use client";

import "@/styles/globals.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { JSX, ReactNode, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import logoTitle from "../../public/TripCollab-logo/vector/default-monochrome-white.svg";

interface NavbarProps {
    navItems?: ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ navItems }) => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await axios.post(
                "http://localhost:8080/api/tripcollab/auth/logout",
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                }
            );

            // limpar localstorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("tokenExpiresAt");

            // Limpar cookies
            document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
            document.cookie = "tokenExpiresAt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict"; // seta data de expiração no passado e automaticamente fica invalida e exclue

            toast.success("Successful logout");
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Try again in a few moments!");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex justify-between items-center p-4 px-14 bg-customBlue h-20 w-full shadow-sm">
            <div>
                <Link href="/">
                    <h2>
                        <Image
                            className="hover:text-customGreen"
                            src={logoTitle}
                            alt="logoTitleHome"
                            height={90}
                            width={90}
                        />
                    </h2>
                </Link>
            </div>
            <div className="flex gap-2">
                <nav className="flex ">{navItems}</nav>
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center mr-2 gap-2 text-gray-50 font-medium bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    <FiLogOut className="" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
};

interface NavItemsProps {
    href?: string;
    label?: string;
    icon?: JSX.Element;
}

export const NavItem: React.FC<NavItemsProps> = ({ href, label, icon }) => {
    const thisPage = usePathname();
    const isActive = thisPage === href;

    return (
        <Link
            href={href || ""}
            className={`flex items-center m-1 px-4 py-2 gap-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? "text-customGreen bg-customBlue/20"
                    : "text-gray-50 hover:text-teal-500 hover:bg-customBlue/10"
            }`}
        >
            {icon}
            <span className="">{label}</span>
        </Link>
    );
};
