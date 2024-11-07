import { Router } from "@classes";
import { AuthController } from "@controllers/master";
import { Validator } from "@middlewares/master";

export class UserAuthRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        this.router.post("/register", Validator.checkingUserAuth, Validator.sanitizeMiddleware, Validator.validateMiddleware, AuthController.register);
        this.router.post("/login", Validator.sanitizeMiddleware, Validator.validateMiddleware, AuthController.login);
        this.router.post("/change-password", Validator.checkingUserAuth, Validator.sanitizeMiddleware, Validator.validateMiddleware, AuthController.changePassword);
        this.router.post("/refresh-access-token", Validator.checkingUserAuth, Validator.sanitizeMiddleware, AuthController.refreshAccessToken);
    }
}
