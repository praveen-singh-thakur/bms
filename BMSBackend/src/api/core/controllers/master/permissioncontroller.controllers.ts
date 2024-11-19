import { Request, Response } from "express";
import Helpers from "@utils/helpers.utils";
import { PermissionService } from "@services/master";

class PermissionController {
    private static instance: PermissionController;

    private constructor() { }

    static getInstance(): PermissionController {
        if (!PermissionController.instance) {
            PermissionController.instance = new PermissionController();
        }
        return PermissionController.instance;
    }

    public async getAllPermissions(req: Request, res: Response) {
        try {
            const result = await PermissionService.getAllPermissions(req);
            res.json(Helpers.responseHandler(200, "All Permissions are Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async CreatePermission(req: Request, res: Response) {
        try {
            const result = await PermissionService.CreatePermission(req);
            res.json(Helpers.responseHandler(200, "Given Permission is Created Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async getOnePermission(req: Request, res: Response) {
        try {
            const result = await PermissionService.getOnePermission(req);
            res.json(Helpers.responseHandler(200, "Permission Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async updatePermission(req: Request, res: Response) {
        try {
            const result = await PermissionService.updatePermission(req);
            res.json(Helpers.responseHandler(200, "Permission Updated Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async deletePermission(req: Request, res: Response) {
        try {
            const result = await PermissionService.deletePermission(req);
            res.json(Helpers.responseHandler(200, "Permission deleted Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

}

const permissionController = PermissionController.getInstance();

export { permissionController as PermissionController };
