"use client";
import { Navbar } from "@/components/Navbar";
import "@/styles/globals.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="min-h-screen h-screen">
            {/* Seção dinâmica (Login ou Register) */}
            <section className="min-h-screen w-full bg-white text-black flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10">
                {children} <ToastContainer />
            </section>
        </main>
    );
}
