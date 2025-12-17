import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/verifyToken";

interface DecodedToken {
    id: string;
    email: string;
    name: string;
    roles: string[];
    iat: number;
    exp: number;
    aud?: string;
    iss?: string;
    sub?: string;
}

export const config = {
    runtime: 'nodejs',
    matcher: [
        '/admin/:path*',
        '/',
    ],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get("pizza-art-admin")?.value;
    const path = request.nextUrl.pathname;

    // // If no token
    // if (!token) {
    //     // If trying to access admin routes without token, redirect to login
    //     if (path.startsWith("/admin")) {
    //         return NextResponse.redirect(new URL("/", request.url));
    //     }
    //     // Allow access to other routes
    //     return NextResponse.next();
    // }

    // // If token exists, verify it
    // try {
    //     const decodedToken = verifyToken(token, process.env.JWT_ACCESS_SECRET!);

    //     if (!decodedToken) {
    //         // Invalid token - clear and redirect
    //         const response = NextResponse.redirect(new URL("/", request.url));
    //         response.cookies.delete("accessToken");
    //         response.cookies.delete("refreshToken");
    //         return response;
    //     }

    //     // Check if token has expiration and if it's expired
    //     if (decodedToken.exp) {
    //         const currentTime = Math.floor(Date.now() / 1000);
    //         if (decodedToken.exp < currentTime) {
    //             // Token expired - clear and redirect
    //             const response = NextResponse.redirect(new URL("/", request.url));
    //             response.cookies.delete("accessToken");
    //             response.cookies.delete("refreshToken");
    //             return response;
    //         }
    //     }

    //     // Check role-based access
    //     if (path.startsWith("/admin")) {
    //         if (!decodedToken.roles?.includes("ADMIN")) {
    //             // Not admin - redirect to home
    //             return NextResponse.redirect(new URL("/", request.url));
    //         }
    //         // Is admin - allow access
    //         return NextResponse.next();
    //     }

    //     // If already logged in and trying to access root/login page
    //     if (path === "/" && decodedToken.roles?.includes("ADMIN")) {
    //         // Redirect to admin dashboard
    //         return NextResponse.redirect(new URL("/admin", request.url));
    //     }

    //     return NextResponse.next();

    // } catch (err) {
    //     console.error("Middleware error:", err);
    //     // Clear cookies and redirect on any error
    //     const response = NextResponse.redirect(new URL("/", request.url));
    //     response.cookies.delete("accessToken");
    //     response.cookies.delete("refreshToken");
    //     return response;
    // }
}