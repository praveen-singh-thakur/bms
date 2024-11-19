import { Request, Response } from "express";
import Helpers from "@utils/helpers.utils";
import { RolesService } from "@services/master";

class RoleController {
    private static instance: RoleController;

    private constructor() { }

    static getInstance(): RoleController {
        if (!RoleController.instance) {
            RoleController.instance = new RoleController();
        }
        return RoleController.instance;
    }


    public async getAllRoles(req: Request, res: Response) {
        try {

            const result = await RolesService.getAllRoles(req);
            res.json(Helpers.responseHandler(200, "All Roles are Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async CreateRole(req: Request, res: Response) {
        try {
            const result = await RolesService.CreateRole(req);
            res.json(Helpers.responseHandler(200, "Given Role is Created Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async getOneRole(req: Request, res: Response) {
        try {
            const result = await RolesService.getOneRole(req);
            res.json(Helpers.responseHandler(200, "Role Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async updateRole(req: Request, res: Response) {
        try {
            const result = await RolesService.updateRole(req);
            res.json(Helpers.responseHandler(200, "Role Updated Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async deleteRole(req: Request, res: Response) {
        try {
            const result = await RolesService.deleteRole(req);
            res.json(Helpers.responseHandler(200, "Role deleted Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

}

const roleController = RoleController.getInstance();

export { roleController as RoleController };
