import { Router } from "@classes";
import { PermissionController } from "@controllers/master";
import { Validator } from "@middlewares/master";

export class PermissionRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Validator;
        this.router.use(checkingUserAuth, authorize(["manage_permissions"]));
        this.router.get("/", PermissionController.getAllPermissions);
        this.router.post("/", Validator.validate("postPermission"), PermissionController.CreatePermission);
        this.router.get("/:permissionId", PermissionController.getOnePermission);
        this.router.patch("/:permissionId", Validator.validate("updatePermission"), PermissionController.updatePermission);
        this.router.delete("/:permissionId", PermissionController.deletePermission);
    }
}
