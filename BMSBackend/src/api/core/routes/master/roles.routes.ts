import { Router } from "@classes";
import { RoleController } from "@controllers/master";
import { Validator } from "@middlewares/master";

export class RolesRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Validator;
        this.router.use(checkingUserAuth, authorize(["manage_roles"]));
        this.router.get("/", RoleController.getAllRoles);
        this.router.post("/", Validator.validate("postRole"), RoleController.CreateRole);
        this.router.get("/:roleId", RoleController.getOneRole);
        this.router.patch("/:roleId", Validator.validate("updateRole"), RoleController.updateRole);
        this.router.delete("/:roleId", RoleController.deleteRole);
    }
}
