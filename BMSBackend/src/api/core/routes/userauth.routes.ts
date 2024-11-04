import { Router } from "@classes";
import { AuthController } from "@controllers/authcontroller.controllers";
import { Validator } from "@middlewares/validator.middleware";

export class UserAuthRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        this.router.post("/register", Validator.sanitizeMiddleware, Validator.validateMiddleware, AuthController.register);
        this.router.post("/login", Validator.sanitizeMiddleware, Validator.validateMiddleware, AuthController.login);
        this.router.post("/change-password", Validator.checkingUserAuth, Validator.sanitizeMiddleware, Validator.validateMiddleware, AuthController.changePassword)
    }
}
