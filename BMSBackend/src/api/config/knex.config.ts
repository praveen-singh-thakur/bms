import knex, { Knex } from 'knex';
import { KNEX } from "@config/environment.config";

export const DbDefaultConfig = {
    host: KNEX.DB_HOST,
    user: KNEX.DB_USER,
    password: KNEX.DB_PASSWORD,
    database: KNEX.DB_NAME,
    port: Number(KNEX.DB_PORT) || 3306, // Default to 3306 if not provided
};

export const DbConfiguration = {
    client: 'mysql2',
    connection: {
        ...DbDefaultConfig,
    },
    pool: {
        min: parseInt(process.env.DB_POOL_MIN || '2', 10),
        max: parseInt(process.env.DB_POOL_MAX || '20', 10),
        acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '10000', 10),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    },
}

export const getDbConfig = (
    credentials: {
        host: string;
        user: string;
        password: string;
        database: string;
        port: number;
    },
    migrationDirectory?: string
) => {

    const config: Knex.Config = {
        client: 'mysql2', // Make sure this is a string
        connection: {
            host: credentials.host,
            user: credentials.user,
            password: credentials.password,
            database: credentials.database,
            port: credentials.port,
        },
        pool: {
            min: parseInt(process.env.DB_POOL_MIN || '2', 10),
            max: parseInt(process.env.DB_POOL_MAX || '20', 10),
            acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '10000', 10),
            idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
        },
    };


    if (migrationDirectory) {
        config.migrations = {
            directory: migrationDirectory,
        };
    }

    return knex(config);
};

const config = getDbConfig(DbDefaultConfig)!;

export { config as KnexConfig };
