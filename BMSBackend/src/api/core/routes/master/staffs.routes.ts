import { Router } from "@classes";
import { UserController } from "@controllers/master";
import { Validator } from "@middlewares/master";

export class StaffsRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        this.router.get("/get-all-staffs", Validator.checkingUserAuth, UserController.getAllStaffs);
        this.router.get("/:userId", Validator.checkingUserAuth, UserController.getOneStaffs);
    }
}
