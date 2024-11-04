import { Request, Response } from "express";
import Helpers from "@utils/helpers.utils";
import { UserAuthService } from "@services/auth.services";

class AuthController {
    private static instance: AuthController;

    private constructor() { }

    static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public async register(req: Request, res: Response) {
        try {
            const result = await UserAuthService.register(req);

            const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } = result.tokens;

            res.cookie("accesstoken", accessToken, {
                httpOnly: true,  // Prevent access by client-side scripts
                expires: new Date(Date.now() + accessTokenExpiry),  // Set expiration to 7 days from now
                secure: process.env.NODE_ENV === 'development',  // Secure in production
                sameSite: 'strict',  // Helps prevent CSRF attacks
            });

            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,  // Prevent access by client-side scripts
                expires: new Date(Date.now() + refreshTokenExpiry),  // Set expiration to 7 days from now
                secure: process.env.NODE_ENV === 'development',  // Secure in production
                sameSite: 'strict',  // Helps prevent CSRF attacks
            });

            res.json(Helpers.responseHandler(200, "User successfully registered", result));
        } catch (error) {
            if (error instanceof Error)
                res.json(Helpers.responseHandler(500, undefined, undefined, "Internal server error"));
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const result = await UserAuthService.login(req);
            const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } = result.tokens;

            res.cookie("accesstoken", accessToken, {
                httpOnly: true,  // Prevent access by client-side scripts
                expires: new Date(Date.now() + accessTokenExpiry),  // Set expiration to 7 days from now
                secure: process.env.NODE_ENV === 'development',  // Secure in production
                sameSite: 'strict',  // Helps prevent CSRF attacks
            });

            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,  // Prevent access by client-side scripts
                expires: new Date(Date.now() + refreshTokenExpiry),  // Set expiration to 7 days from now
                secure: process.env.NODE_ENV === 'development',  // Secure in production
                sameSite: 'strict',  // Helps prevent CSRF attacks
            });

            res.json(Helpers.responseHandler(200, "Welcome back! You're logged in.", result));
        } catch (error) {
            if (error instanceof Error)
                res.json(Helpers.responseHandler(500, undefined, undefined, "Internal server error"));
        }
    }

    public async changePassword(req: Request, res: Response) {
        try {
            const result = await UserAuthService.changePassword(req);

            res.json(Helpers.responseHandler(200, "Your password has been updated.", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }

    }

}

const authController = AuthController.getInstance();

export { authController as AuthController };
