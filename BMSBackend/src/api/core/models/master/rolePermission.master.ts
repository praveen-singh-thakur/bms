import { IRolePermission } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from 'knex';

export class RolePermissionModel extends Model<IRolePermission> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "role_permissions");
        this.db = db;
    }
    public async isPermissionExist(role_id: number, permission_id: number): Promise<boolean> {
        const exists = await this.query().where({ role_id, permission_id }).first();
        return !!exists;
    }

    public async getRolePermissionById(uuid: string): Promise<{
        id: number;
        uuid: string;
        role_name: string;
        permission_names: string;
        created_at: Date;
        updated_at: Date;
    } | null> {
        const result = await this.query()
            .from('role_permissions as rp')
            .join('roles as r', 'r.id', 'rp.role_id')
            .join('permissions as p', 'p.id', 'rp.permission_id')
            .select(
                'rp.id',
                'rp.uuid',
                'r.name as role_name',
                this.db.raw('GROUP_CONCAT(p.name SEPARATOR ", ") as permission_names'),
                'rp.created_at',
                'rp.updated_at'
            )
            .where('rp.uuid', uuid)
            .groupBy('rp.id', 'rp.uuid', 'r.name', 'rp.created_at', 'rp.updated_at')
            .first();

        return result || null;
    }

    public async getPermissionByRole(role_id: number) {
        return await this.query()
            .select('r.name as role_name')
            .join('roles as r', 'r.id', 'role_permissions.role_id')
            .join('permissions as p', 'p.id', 'role_permissions.permission_id')
            .where('r.id', role_id)
            .groupBy('r.name')
            .select(
                this.knex.raw("GROUP_CONCAT(p.name SEPARATOR ', ') AS permissions")
            );
    }

} 