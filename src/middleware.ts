import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, importSPKI } from "jose";

const publicRoutes = [
    { path: "/register", whenAuthenticated: "redirect" },
    { path: "/login", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || "";

async function verifyJWT(token: string) {
    try {
        const publicKey = await importSPKI(PUBLIC_KEY, "RS256");
        const { payload } = await jwtVerify(token, publicKey, {
            algorithms: ["RS256"],
        });

        // Valida o payload
        if (!payload.sub || !payload.exp) {
            throw new Error("Invalid JWT payload");
        }

        if (process.env.NODE_ENV !== "production") {
            console.log("Token válido!", payload);
        }
        return payload;
    } catch (error) {
        console.error("Token inválido", error);
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const publicRoute = publicRoutes.find((route) => route.path === path);
    const authToken = request.cookies.get("accessToken")?.value;

    // Se não há token e a rota é pública, pode continuar
    if (!authToken && publicRoute) {
        return NextResponse.next();
    }

    // Se não há token e a rota é privada, redireciona para login
    if (!authToken && !publicRoute) {
        const redirectUrl = new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url);
        if (path.startsWith("/")) {
            redirectUrl.searchParams.set("redirect", path);
        }
        return NextResponse.redirect(redirectUrl);
    }

    // Se há token e está tentando acessar rota pública, redireciona para home
    if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
        const payload = await verifyJWT(authToken);

        if (!payload) {
            const redirectUrl = new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url);
            if (path.startsWith("/")) {
                redirectUrl.searchParams.set("redirect", path);
            }
            redirectUrl.searchParams.set("error", "Invalid or expired token");
            return NextResponse.redirect(redirectUrl);
        }

        const redirectUrl = new URL("/", request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Se há token e está em rota privada, validar o token
    if (authToken && !publicRoute) {
        const payload = await verifyJWT(authToken);

        if (!payload) {
            const redirectUrl = new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url);
            redirectUrl.searchParams.set("error", "Invalid or expired token");
            const response = NextResponse.redirect(redirectUrl);
            response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
            response.cookies.set("tokenExpiresAt", "", { maxAge: 0, path: "/" });
            return response;
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
