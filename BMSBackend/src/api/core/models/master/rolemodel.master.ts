import { IRole } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from 'knex';

export class RoleModel extends Model<IRole> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "roles");
        this.db = db;
    }

    public async getAllRoleAndPermissions(): Promise<{ role_name: string; permissions: string }[]> {
        const permissions = await this.query()
            .join('role_permissions', 'roles.id', 'role_permissions.role_id')
            .join('permissions', 'permissions.id', 'role_permissions.permission_id')
            .select('roles.uuid as role_id')
            .select('roles.name as role_name')
            .select(
                this.db.raw('GROUP_CONCAT(DISTINCT permissions.name ORDER BY permissions.name SEPARATOR ", ") as permissions')
            )
            .select(
                this.db.raw('GROUP_CONCAT(role_permissions.uuid ORDER BY permissions.name SEPARATOR ", ") as uuids')
            )
            .groupBy('roles.id', 'roles.name')
            .orderBy('roles.id');

        // Return the result as an array of objects with `role_name` and `permissions`
        return permissions;
    }

}
