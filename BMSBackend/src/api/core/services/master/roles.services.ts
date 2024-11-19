/* eslint-disable @typescript-eslint/no-explicit-any */
import { RolesFactory } from "@factories/master";
import AuthHelpers from '@utils/authHelpers.utils';
import { Request } from "express";
class RolesService extends AuthHelpers {

    private static instance: RolesService;

    private constructor() {
        super();
    }

    static getInstance(): RolesService {
        if (!RolesService.instance) {
            RolesService.instance = new RolesService();
        }
        return RolesService.instance;
    }

    public async getAllRoles(req: Request | any) {
        const db = (req as any).knex;
        try {
            const rolesFactory = new RolesFactory(db)
            return await rolesFactory.getAllRoles();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async CreateRole(req: Request | any) {
        const db = (req as any).knex;
        try {
            const { name, description } = req.body;
            const rolesFactory = new RolesFactory(db)
            return await rolesFactory.CreateRole({ name, description });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getOneRole(req: Request | any) {
        const db = (req as any).knex;
        const { roleId } = req.params;
        try {
            const rolesFactory = new RolesFactory(db)
            return await rolesFactory.getOneRole(roleId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async updateRole(req: Request | any) {
        const db = (req as any).knex;
        const { roleId } = req.params;
        const { name, description } = req.body;
        const data = { name, description, uuid: roleId };
        try {
            const rolesFactory = new RolesFactory(db)
            return await rolesFactory.updateRole(data);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async deleteRole(req: Request | any) {
        const db = (req as any).knex;
        const { roleId } = req.params;
        try {
            const rolesFactory = new RolesFactory(db)
            return await rolesFactory.deleteRole(roleId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const rolesService = RolesService.getInstance();

export { rolesService as RolesService }