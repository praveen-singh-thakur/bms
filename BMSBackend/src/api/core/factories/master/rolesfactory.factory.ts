
import AuthHelpers from '@utils/authHelpers.utils';
import { Knex } from 'knex';
import { RoleModel } from '@models/master/rolemodel.master';
import { IRole } from '@dbinterfaces';

export class RolesFactory extends AuthHelpers {

    private roleModel: RoleModel;

    constructor(db: Knex) {
        super();
        this.roleModel = new RoleModel(db);
    }

    public async getAllRoles() {
        try {
            const roleModel = this.roleModel;
            const result = await roleModel.find();
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async CreateRole(role: { name: string; description: string }) {
        try {
            const roleModel = this.roleModel;

            const havingRole = await roleModel.findOne({ name: role.name });
            if (havingRole) {
                throw new Error("Role Already Exist");
            }
            const data = {
                ...role,
                uuid: this.generateUUID()
            }
            const [result] = await roleModel.create(data);
            const userResult = await roleModel.findOne({ id: result });
            return userResult;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getOneRole(uuid: string) {
        try {
            const roleModel = this.roleModel;
            const result = await roleModel.findOne({ uuid })
            if (!result) {
                throw new Error("Role not Found");
            }
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async updateRole(data: IRole) {
        try {

            const roleModel = this.roleModel;

            const findId = await roleModel.findOne({ uuid: data.uuid });

            if (!findId) {
                throw new Error("Role not Found");
            }

            await roleModel.upsert(data);

            const result = await roleModel.find({ uuid: data.uuid });

            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async deleteRole(uuid: string) {
        try {
            const roleModel = this.roleModel;
            const findId = await roleModel.findOne({ uuid });
            if (!findId) {
                throw new Error("Role not Found or Already Deleted");
            }
            const result = await roleModel.delete(findId.id)
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

}