
import UserModel from '@models/master/usermodel.master';
import AuthHelpers from '@utils/authHelpers.utils';
import { Knex } from 'knex';
import RefreshTokenModel from '../../models/refresh.model';
import { RoleModel } from '@models/master/rolemodel.master';
import { IUser } from '@dbinterfaces';

export class UserFactory extends AuthHelpers {

    private userModel: UserModel;
    private refreshTokenModel: RefreshTokenModel;
    private roleModel: RoleModel;

    constructor(db: Knex) {
        super();
        this.userModel = new UserModel(db);
        this.refreshTokenModel = new RefreshTokenModel(db);
        this.roleModel = new RoleModel(db);
    }

    public async getAllStaffs() {
        try {
            const model = this.userModel;
            const result = await model.find();
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getOneStaffs(uuid: string) {
        try {
            const model = this.userModel;
            const result = await model.findByUUID(uuid);
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async updateStaffs(data: IUser) {
        try {
            const roleModel = this.roleModel;
            const model = this.userModel;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [roleId] = await roleModel.find({ name: data.role } as any);
            data = {
                ...data, role: roleId.id
            }
            const result = await model.upsert(data);
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

}