/* eslint-disable @typescript-eslint/no-explicit-any */
import { PermissionsFactory } from "@factories/master";
import AuthHelpers from '@utils/authHelpers.utils';
import { Request } from "express";
class PermissionService extends AuthHelpers {

    private static instance: PermissionService;

    private constructor() {
        super();
    }

    static getInstance(): PermissionService {
        if (!PermissionService.instance) {
            PermissionService.instance = new PermissionService();
        }
        return PermissionService.instance;
    }

    public async getAllPermissions(req: Request | any) {
        const db = (req as any).knex;
        try {
            const PermissionFactory = new PermissionsFactory(db)
            return await PermissionFactory.getAllPermissions();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async CreatePermission(req: Request | any) {
        const db = (req as any).knex;
        try {
            const { name, description } = req.body;
            const PermissionFactory = new PermissionsFactory(db)
            return await PermissionFactory.CreatePermission({ name, description });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getOnePermission(req: Request | any) {
        const db = (req as any).knex;
        const { permissionId } = req.params;
        try {
            const PermissionFactory = new PermissionsFactory(db)
            return await PermissionFactory.getOnePermission(permissionId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async updatePermission(req: Request | any) {
        const db = (req as any).knex;
        const { permissionId } = req.params;
        const { name, description } = req.body;
        const data = { name, description, uuid: permissionId };
        try {
            const PermissionFactory = new PermissionsFactory(db)
            return await PermissionFactory.updatePermission(data);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async deletePermission(req: Request | any) {
        const db = (req as any).knex;
        const { permissionId } = req.params;
        try {
            const PermissionFactory = new PermissionsFactory(db)
            return await PermissionFactory.deletePermission(permissionId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const permissionService = PermissionService.getInstance();

export { permissionService as PermissionService }