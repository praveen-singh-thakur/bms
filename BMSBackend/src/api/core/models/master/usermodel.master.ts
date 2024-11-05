
import { IUser } from '@dbinterfaces';
import { Knex } from 'knex';

class UserModel {

    private db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    public async findByEmail(email: string) {
        try {
            return await this.db("super_admin").where({ email: email }).first();
        } catch (error) {

            throw new Error(`UserModel findByEmail error: ${error}`);
        }
    }

    public async createUser(user: Partial<IUser>) {
        try {
            const [insertedUserId] = await this.db('super_admin').insert(user);
            return await this.db('super_admin')
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
            return await this.db('super_admin').where({ uuid }).first();
        } catch (error) {
            throw new Error(`UserModel findByUUID error: ${error}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async updatebyEmail(email: string, data: any) {
        try {
            return await this.db('super_admin').where({ email }).update(data);
        } catch (error) {
            throw new Error(`UserModel updatebyEmail error: ${error}`);
        }
    }
}

export default UserModel;