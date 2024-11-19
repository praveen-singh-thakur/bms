import { Request, Response } from "express";
import Helpers from "@utils/helpers.utils";
import { RolePermissionService } from "@services/master";

class RolePermissionController {
    private static instance: RolePermissionController;

    private constructor() { }

    static getInstance(): RolePermissionController {
        if (!RolePermissionController.instance) {
            RolePermissionController.instance = new RolePermissionController();
        }
        return RolePermissionController.instance;
    }

    public async getAllRolePermissions(req: Request, res: Response) {
        try {
            const result = await RolePermissionService.getAllRolePermissions(req);
            res.json(Helpers.responseHandler(200, "All roles and their Permissions are Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async setRolePermissions(req: Request, res: Response) {
        try {
            const result = await RolePermissionService.setRolePermissions(req);
            res.json(Helpers.responseHandler(200, " role and their Permissions are assigned Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async getRolePermissionsById(req: Request, res: Response) {
        try {
            const result = await RolePermissionService.getRolePermissionsById(req);
            res.json(Helpers.responseHandler(200, "Role and their Permission are Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async updateRolePermissions(req: Request, res: Response) {
        try {
            const result = await RolePermissionService.updateRolePermissions(req);
            res.json(Helpers.responseHandler(200, "Role and their Permission are Updated Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async deleteRolePermissions(req: Request, res: Response) {
        try {
            const result = await RolePermissionService.deleteRolePermissions(req);
            res.json(Helpers.responseHandler(200, "Role and their Permission are Deleted Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async getPermissionsByRole(req: Request, res: Response) {
        try {
            const result = await RolePermissionService.getPermissionsByRole(req);
            res.json(Helpers.responseHandler(200, "Role and their Permissions are Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }
}

const rolePermissionController = RolePermissionController.getInstance();

export { rolePermissionController as RolePermissionController };
