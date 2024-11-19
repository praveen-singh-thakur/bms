import { Router } from "@classes";
import { RolePermissionController } from '@controllers/master';
import { Validator } from "@middlewares/master";

export class RolesPermissionRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Validator;
        this.router.use(checkingUserAuth, authorize(["manage_permissions", "manage_roles"]));
        this.router.get("/", RolePermissionController.getAllRolePermissions);
        this.router.post("/", Validator.validate("postRolePermission"), RolePermissionController.setRolePermissions);
        this.router.get("/id/:rolePermissionId", RolePermissionController.getRolePermissionsById);
        this.router.patch("/id/:rolePermissionId", Validator.validate("updateRolePermission"), RolePermissionController.updateRolePermissions);
        this.router.delete("/id/:rolePermissionId", RolePermissionController.deleteRolePermissions);
        this.router.get("/role", Validator.validate("postRoleName"), RolePermissionController.getPermissionsByRole);
    }
}             
