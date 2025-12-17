import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Forward login request to backend
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),

        })

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json(
                { message: data.message || "Login failed" },
                { status: backendRes.status },
            );
        }

        // Browser এর জন্য response
        const response = NextResponse.json(
            {
                success: true,
                user: data.data.user,
            },
            { status: 200 },
        );

        // 🔥 মূল জিনিস: backend যে Set-Cookie পাঠিয়েছে, সেটা Browser-এ পাঠিয়ে দাও
        const setCookie = backendRes.headers.get("set-cookie");
        if (setCookie) {
            response.headers.set("set-cookie", setCookie);
        }

        return response;

        // Set HTTP-only cookie
        // const cookieStore = await cookies();
        // const isProd = process.env.NODE_ENV === 'production';

        // Access token (short-lived)
        // cookieStore.set({
        //     name: "accessToken",
        //     value: data?.data?.token?.accessToken,
        //     httpOnly: true,
        //     secure: isProd,                     // must be true on HTTPS
        //     sameSite: isProd ? 'none' : 'lax',
        //     path: "/",
        //     // maxAge: 30, // 30 seconds for testing, can be 15*60 for 15 mins
        //     maxAge: 7 * 24 * 60 * 60, //  7 days in seconds (NOT ms)
        // });

        // Refresh token (long-lived)
        // cookieStore.set({
        //     name: "refreshToken",
        //     value: data?.data?.token?.refreshToken,
        //     httpOnly: true,
        //     secure: isProd,                     // must be true on HTTPS
        //     sameSite: isProd ? 'none' : 'lax',
        //     path: "/",
        //     maxAge: 30 * 24 * 60 * 60, //  30 days in seconds
        // });

        // //  Store user info in HttpOnly cookie for SSR
        // cookieStore.set({
        //     name: "userInfo",
        //     value: JSON.stringify(data?.data?.user),
        //     httpOnly: true,
        //     sameSite: "strict",
        //     secure: process.env.NODE_ENV === "production",
        //     path: "/",
        //     maxAge: 7 * 24 * 60 * 60, // match refresh token lifetime
        // });


        // return NextResponse.json({ user: data?.data?.user }, { status: 200 })
    } catch (err) {
        console.error("Login error:", err)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
