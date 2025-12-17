import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
    iat?: number;
    exp?: number;
}

export const getUser = (): DecodedUser | null => {
    const token = Cookies.get("refreshToken");

    if (!token) return null;

    try {
        const decoded: DecodedUser = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
