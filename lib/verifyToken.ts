import jwt, { JwtPayload } from "jsonwebtoken";

export interface DecodedToken extends JwtPayload {
    id: string;
    email: string;
    roles: string[];
    
}

export const verifyToken = (token: string, secret: string): DecodedToken | null => {
    try {
        const decoded = jwt.verify(token, secret) as DecodedToken;
        return decoded;
    } catch (error) {
        console.error("❌ Token verification failed:", error);
        return null;
    }
};
