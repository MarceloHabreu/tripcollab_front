// (Root Layout)
"use client";
import "@/styles/globals.css";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <title>TripCollab</title>
                <link rel="icon" href="/TripCollab-logo/vector/logo-green.svg" sizes="any" />
            </head>
            <body>{children}</body>
        </html>
    );
}
