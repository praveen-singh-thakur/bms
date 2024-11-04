import { Knex, knex } from 'knex';

class Database {
    private db: Knex | null = null;
    private config: Knex.Config;

    constructor(config: Knex.Config) {
        this.config = config;
    }


    public async getConnection(Ntimes = 2): Promise<Knex> {
        if (!this.db) {
            for (let attempt = 1; attempt <= Ntimes; attempt++) {
                try {
                    this.db = knex({
                        ...this.config,
                        migrations: {
                            directory: "./src/db/migrations"
                        }
                    });
                    await this.db.raw('SELECT 1');
                    this.db.migrate.latest();
                    console.log('Connected to database');
                    break;
                } catch (err) {
                    console.log(`Attempt ${attempt} failed: ${err.message}`);
                    if (attempt == Ntimes) {
                        throw new Error('Unable to connect to the database after multiple attempts');
                    }
                    await this.delay(500);
                }
            }
        }
        return this.db!;
    }

    public static async withConnection<T>(
        config: Knex.Config,
        operation: (db: Knex) => Promise<T>,
    ): Promise<T> {
        const database = new Database(config);
        try {
            const db = await database.getConnection();
            return await operation(db);
        } catch (err) {
            console.error('Error during database operation:', err);
            throw err;
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}


export default Database;