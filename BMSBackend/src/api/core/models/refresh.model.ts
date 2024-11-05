
import { Knex } from 'knex';
class RefreshTokenModel {

    private db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    public async findByEmail(email: string) {
        try {
            return await this.db("super_admin_refresh_tokens").where({ email: email }).first();
        } catch (error) {

            throw new Error(`RefreshTokenModel findByEmail error: ${error}`);
        }
    }

    public async insertToken(uuid: string, token: string, userId: number, expires: string) {
        try {
            const [insertedId] = await this.db("super_admin_refresh_tokens").insert({ uuid, token, user_id: userId, expires });
            return await this.db("super_admin_refresh_tokens")
                .where({ id: insertedId })
                .select('uuid')
                .first();

        } catch (error) {
            throw new Error(`RefreshTokenModel insertToken error: ${error}`);
        }
    }

    public async findByUUID(uuid: string) {
        try {
            return await this.db("super_admin_refresh_tokens").where({ uuid }).first();
        } catch (error) {
            throw new Error(`RefreshTokenModel findByUUID error: ${error}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async updatebyUUID(uuid: string, data: any) {
        try {
            return await this.db("super_admin_refresh_tokens").where({ uuid }).update(data);
        } catch (error) {
            throw new Error(`UserModel updatebyEmail error: ${error}`);
        }
    }
}

export default RefreshTokenModel;