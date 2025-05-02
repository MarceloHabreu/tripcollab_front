import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**", // Permite todos os caminhos no domínio
            },
        ],
    },
};

export default nextConfig;
