
import AuthHelpers from '@utils/authHelpers.utils';
import { Knex } from 'knex';
import { RoleModel } from '@models/master/rolemodel.master';
import { PermissionModel } from '@models/master/permission.master';
import { RolePermissionModel } from '@models/master/rolePermission.master';
export class RolePermissionsFactory extends AuthHelpers {

    private RoleModel: RoleModel;
    private PermissionModel: PermissionModel;
    private RolePermissionModel: RolePermissionModel;
    constructor(db: Knex) {
        super();
        this.RoleModel = new RoleModel(db);
        this.PermissionModel = new PermissionModel(db);
        this.RolePermissionModel = new RolePermissionModel(db);
    }

    public async getAllRolePermissions() {
        try {
            const roleModel = this.RoleModel;
            const result = await roleModel.getAllRoleAndPermissions();
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async setRolePermissions(names: { role_name: string, permission_names: string[] }) {
        try {
            const roleModel = this.RoleModel;
            const permissionModel = this.PermissionModel;
            const rolePermissionModel = this.RolePermissionModel;
            const role = await roleModel.findOne({ name: names.role_name });
            if (!role) throw new Error(`Role ${names.role_name} not found`);
            const roleId = role.id;

            // Validate and fetch permission IDs
            const permissionIds = [];
            for (const name of names.permission_names) {
                const permission = await permissionModel.findOne({ name });
                if (!permission) throw new Error(`Permission ${name} not found`);
                permissionIds.push(permission.id);
            }

            // Check and filter permission IDs
            const remainingpermissionIds = [];
            for (const id of permissionIds) {
                if (!(await rolePermissionModel.isPermissionExist(roleId, id))) {
                    remainingpermissionIds.push(id);
                }
            }

            if (remainingpermissionIds.length === 0) {
                throw new Error('No new permissions to add, The Given Permissions are Already assinged');
            }

            const permissionsassigned = [];
            for (const id of remainingpermissionIds) {
                try {
                    await rolePermissionModel.create({ uuid: this.generateUUID(), role_id: roleId, permission_id: id });
                    const perission = await permissionModel.findById(id);
                    if (perission) permissionsassigned.push(perission.name);
                } catch (err) {
                    console.log(err);
                    throw new Error(err.message);
                }
            }

            const permissionstring = permissionsassigned.toString();

            return {
                message: `Role ${names.role_name} has been assigned with the following permissions (${permissionstring})`
            }
        } catch (err) {
            throw new Error(err.message);
        }

    }

    public async getRolePermissionsById(uuid: string) {
        try {

            const rolePermissionModel = this.RolePermissionModel;

            const uuidExist = await rolePermissionModel.findOne({ uuid });

            if (!uuidExist) {
                throw new Error("Role Permission not exist on these Id");
            }

            const result = await rolePermissionModel.getRolePermissionById(uuid);

            if (!result) {
                throw new Error("RolePermission not Found");
            }

            return result;

        } catch (err) {
            throw new Error(err.message);
        }

    }

    public async updateRolePermissions(
        uuid: string,
        name: { role_name: string; permission_names: string }
    ) {
        try {
            const { role_name, permission_names } = name;
            const { RoleModel, PermissionModel, RolePermissionModel } = this;

            const uuidExist = await RolePermissionModel.findOne({ uuid });
            if (!uuidExist) {
                throw new Error("Role Permission not exist on these Id");
            }

            // Fetch role and permission IDs in parallel if needed
            const [role, permission] = await Promise.all([
                role_name ? RoleModel.findOne({ name: role_name }) : null,
                permission_names ? PermissionModel.findOne({ name: permission_names }) : null,
            ]);

            // Throw errors if role or permission is not found
            if (role_name && !role) throw new Error("Role not found");
            if (permission_names && !permission) throw new Error("Permission not found");

            const updates: { role_id?: number; permission_id?: number } = {};
            if (role) updates.role_id = role.id;
            if (permission) updates.permission_id = permission.id;

            // Update role-permission mapping
            const result = await RolePermissionModel.update({ uuid }, updates);
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async deleteRolePermissions(uuid: string) {
        try {
            const rolePermissionModel = this.RolePermissionModel;
            const exist = await rolePermissionModel.findOne({ uuid });
            if (!exist) {
                throw new Error("Role Permissions Not found")
            }
            const result = await rolePermissionModel.delete(exist.id);
            return result;

        } catch (err) {
            throw new Error(err.message);
        }


    }

    public async getPermissionsByRole(role_name: string) {
        try {
            const { RoleModel, RolePermissionModel } = this;

            const roleExist = await RoleModel.findOne({ name: role_name });

            if (!roleExist) {
                throw new Error("The Given Role is not Exist");
            }

            const rolePermissionexist = await RolePermissionModel.findOne({ role_id: roleExist.id });

            if (!rolePermissionexist) {
                throw new Error("The Given Role has Never assigned");
            }

            const result = RolePermissionModel.getPermissionByRole(roleExist.id);
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }
}