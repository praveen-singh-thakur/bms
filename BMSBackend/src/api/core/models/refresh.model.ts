
import { Knex } from 'knex';
import { Model } from '@models/base.model';
import { IRefreshToken } from '@dbinterfaces';

class RefreshTokenModel extends Model<IRefreshToken> {

    private db: Knex;

    constructor(db: Knex) {
        super(db, "refresh_tokens");
        this.db = db;
    }

    public async insertToken(uuid: string, token: string, userId: number, expires: string) {
        try {
            const [id] = await this.create({ uuid, token, user_id: userId, expires });
            return this.findById(id);
        } catch (error) {
            throw new Error(`RefreshTokenModel insertToken error: ${error}`);
        }
    }

    public async findByUUID(uuid: string) {
        try {
            return await this.find({ uuid });
        } catch (error) {
            throw new Error(`RefreshTokenModel findByUUID error: ${error}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async updatebyUUID(uuid: string, data: any) {
        try {
            return await this.update({ uuid }, data);
        } catch (error) {
            throw new Error(`RefreshTokenModel updatebyEmail error: ${error}`);
        }
    }
}

export default RefreshTokenModel;