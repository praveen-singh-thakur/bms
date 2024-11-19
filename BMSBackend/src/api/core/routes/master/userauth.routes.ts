import { Router } from "@classes";
import { AuthController } from "@controllers/master";
import { Validator } from "@middlewares/master";

export class UserAuthRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        this.router.post("/register", Validator.checkingUserAuth, Validator.sanitizeMiddleware, Validator.validate("register"), Validator.authorize(["manage_users"]), AuthController.register);
        this.router.post("/login", Validator.sanitizeMiddleware, Validator.validate("login"), AuthController.login);
        this.router.post("/change-password", Validator.checkingUserAuth, Validator.sanitizeMiddleware, Validator.validate("changePassword"), Validator.authorize(["manage_users"]), AuthController.changePassword);
        this.router.post("/refresh-access-token", Validator.checkingUserAuth, Validator.sanitizeMiddleware, AuthController.refreshAccessToken);
    }
}
