/* eslint-disable @typescript-eslint/no-explicit-any */
import { RolePermissionsFactory } from "@factories/master";
import AuthHelpers from '@utils/authHelpers.utils';
import { Request } from "express";
class RolePermissionService extends AuthHelpers {

    private static instance: RolePermissionService;

    private constructor() {
        super();
    }

    static getInstance(): RolePermissionService {
        if (!RolePermissionService.instance) {
            RolePermissionService.instance = new RolePermissionService();
        }
        return RolePermissionService.instance;
    }

    public async getAllRolePermissions(req: Request | any) {
        const db = (req as any).knex;
        try {
            const PermissionFactory = new RolePermissionsFactory(db)
            return await PermissionFactory.getAllRolePermissions();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async setRolePermissions(req: Request | any) {
        const db = (req as any).knex;
        const { role_name, permission_names } = req.body;
        try {
            const PermissionFactory = new RolePermissionsFactory(db)
            return await PermissionFactory.setRolePermissions({ role_name, permission_names });
        } catch (error) {
            throw new Error(error.message);
        }
    }
    public async getRolePermissionsById(req: Request | any) {
        const db = (req as any).knex;
        const { rolePermissionId } = req.params;
        try {
            const PermissionFactory = new RolePermissionsFactory(db)
            return await PermissionFactory.getRolePermissionsById(rolePermissionId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async updateRolePermissions(req: Request | any) {
        const db = (req as any).knex;
        const { rolePermissionId } = req.params;
        const { role_name, permission_names } = req.body;
        try {
            const PermissionFactory = new RolePermissionsFactory(db)
            return await PermissionFactory.updateRolePermissions(rolePermissionId, { role_name, permission_names });
        } catch (error) {
            throw new Error(error.message);
        }
    }
    public async deleteRolePermissions(req: Request | any) {
        const db = (req as any).knex;
        const { rolePermissionId } = req.params;
        try {
            const PermissionFactory = new RolePermissionsFactory(db)
            return await PermissionFactory.deleteRolePermissions(rolePermissionId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getPermissionsByRole(req: Request | any) {
        const db = (req as any).knex;
        const { role_name } = req.body;
        try {
            const PermissionFactory = new RolePermissionsFactory(db)
            return await PermissionFactory.getPermissionsByRole(role_name);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const rolePermissionService = RolePermissionService.getInstance();

export { rolePermissionService as RolePermissionService }