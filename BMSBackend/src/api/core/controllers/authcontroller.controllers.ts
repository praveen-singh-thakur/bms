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
            res.json(Helpers.responseHandler(200, "User successfully registered", result));
        } catch (error) {
            if (error instanceof Error)
                res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const result = await UserAuthService.login(req);
            res.json(Helpers.responseHandler(200, "Welcome back! You're logged in.", result));
        } catch (error) {
            if (error instanceof Error)
                res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
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
