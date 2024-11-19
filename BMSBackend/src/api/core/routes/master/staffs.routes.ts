import { Router } from "@classes";
import { UserController } from "@controllers/master";
import { Validator } from "@middlewares/master";

export class StaffsRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Validator;
        this.router.use(checkingUserAuth, authorize(["manage_users"]));
        this.router.get("/staffs", UserController.getAllStaffs);
        this.router.patch("/:userId", UserController.updateStaffs);
        this.router.get("/:userId", UserController.getOneStaffs);
    }
}
