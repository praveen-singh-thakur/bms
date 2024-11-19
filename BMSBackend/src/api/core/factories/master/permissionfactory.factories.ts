
import AuthHelpers from '@utils/authHelpers.utils';
import { Knex } from 'knex';
import { IPermission } from '@dbinterfaces';
import { PermissionModel } from '@models/master/permission.master';

export class PermissionsFactory extends AuthHelpers {

    private PermissionModel: PermissionModel;

    constructor(db: Knex) {
        super();
        this.PermissionModel = new PermissionModel(db);
    }

    public async getAllPermissions() {
        try {
            const PermissionModel = this.PermissionModel;
            const result = await PermissionModel.find();
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async CreatePermission(permission: { name: string; description: string }) {
        try {
            const PermissionModel = this.PermissionModel;

            const havingpermission = await PermissionModel.findOne({ name: permission.name });
            if (havingpermission) {
                throw new Error("Permission Already Exist");
            }
            const data = {
                ...permission,
                uuid: this.generateUUID()
            }
            const [result] = await PermissionModel.create(data);
            const userResult = await PermissionModel.findOne({ id: result });
            return userResult;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getOnePermission(uuid: string) {
        try {
            const PermissionModel = this.PermissionModel;

            const result = await PermissionModel.findOne({ uuid })
            if (!result) {
                throw new Error("Permission not Found");
            }
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async updatePermission(data: IPermission) {
        try {

            const PermissionModel = this.PermissionModel;

            const findId = await PermissionModel.findOne({ uuid: data.uuid });

            if (!findId) {
                throw new Error("Permission not Found");
            }

            await PermissionModel.upsert(data);

            const result = await PermissionModel.find({ uuid: data.uuid });

            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async deletePermission(uuid: string) {
        try {
            const PermissionModel = this.PermissionModel;
            const findId = await PermissionModel.findOne({ uuid });
            if (!findId) {
                throw new Error("Permission not Found or Already Deleted");
            }
            const result = await PermissionModel.delete(findId.id)
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

}