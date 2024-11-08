import { Router } from "@classes";
import { UserController } from "@controllers/master";
import { Validator } from "@middlewares/master";

export class StaffsRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        this.router.get("/staffs", Validator.checkingUserAuth, UserController.getAllStaffs);
        this.router.patch("/:userId", Validator.checkingUserAuth, UserController.updateStaffs);
        this.router.get("/:userId", Validator.checkingUserAuth, UserController.getOneStaffs);
    }
}
