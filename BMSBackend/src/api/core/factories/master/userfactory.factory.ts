
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
            if (!result) {
                throw new Error("Staff Not Found");
            }
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async updateStaffs(data: IUser) {
        try {
            const roleModel = this.roleModel;
            const model = this.userModel;
            const tokenModel = this.refreshTokenModel;

            const uuidExist = await model.findByUUID(data.uuid);

            if (!uuidExist) {
                throw new Error("Staff Not Found");
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any 
            const [roleId] = await roleModel.find({ name: data.role } as any);

            if (data.status === -1) {
                const userdata = await model.findByEmail(data.email);
                await tokenModel.deleteByUserId(userdata.id);
            }

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