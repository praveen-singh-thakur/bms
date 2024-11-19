import { IPermission } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from 'knex';

export class PermissionModel extends Model<IPermission> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "permissions");
        this.db = db;
    }

    // Utility to fetch permissions for a given role
    public async getPermissionsForRole(roleId: number): Promise<string[]> {
        const permissions = await this.query()
            .join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            .where('role_permissions.role_id', roleId)
            .select('permissions.name');

        // Return an array of permission names
        return permissions.map((permission) => permission.name);
    }
} 