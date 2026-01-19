export { default } from "next-auth/middleware";

export const config = {
    // Protect all routes except auth-related ones and the landing page
    matcher: [
        "/home/:path*",
        "/account/:path*",
        "/days/:path*",
        "/api/((?!auth).)*", // Protect all APIs except /api/auth
    ],
};
