
import { IUser } from '@dbinterfaces';
import { Knex } from 'knex';
import { Model } from '@models/base.model';
class UserModel extends Model<IUser> {

    private db: Knex;

    constructor(db: Knex) {
        super(db, "staffs");
        this.db = db;
    }

    public async findByEmail(email: string) {
        try {
            return await this.findOne({ email });
        } catch (error) {

            throw new Error(`UserModel findByEmail error: ${error}`);
        }
    }

    public async createUser(user: IUser) {
        try {

            const [insertedUserId] = await this.create(user)
            return await this.query()
                .where({ id: insertedUserId })
                .select('id', 'uuid', 'first_name', 'last_name', 'email', 'profile_url')
                .first();

        } catch (error) {
            throw new Error(`UserModel createUser error: ${error}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async findByUUID(uuid: any) {
        try {
            return await this.findOne({ uuid });

        } catch (error) {
            throw new Error(`UserModel findByUUID error: ${error}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async updatebyEmail(email: string, data: any) {
        try {
            return await this.query().where({ email }).update(data);
        } catch (error) {
            throw new Error(`UserModel updatebyEmail error: ${error}`);
        }
    }
}

export default UserModel;