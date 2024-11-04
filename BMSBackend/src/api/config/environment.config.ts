import { EnvAccessToken, EnvKnex, EnvSSL } from '@types';
import { existsSync } from 'fs';
import { ENVIRONMENT } from '@enums';
import { config as Dotenv } from 'dotenv';

export class Environment {
    private static instance: Environment;
    cluster!: Record<string, unknown>;
    errors: string[] = [];
    variables: Record<string, string | undefined> = {};
    environment: ENVIRONMENT = ENVIRONMENT.development;

    private constructor() { }

    // Define all keys to be validated, including Knex (DB) configuration
    get keys(): string[] {
        return [
            'PORT',
            'SSL_CERT',
            'SSL_KEY',
            'ENV',
            'DB_HOST',
            'DB_USER',
            'DB_PASSWORD',
            'DB_NAME',
            'DB_PORT'
        ];
    }

    // Validation rules for environment variables
    get rules(): Record<string, (value: string | undefined) => unknown> {
        return {
            PORT: (value: string | undefined): number => {
                const port = parseInt(value || '', 10);
                if (isNaN(port) || port > 65535 || port < 1) {
                    this.errors.push('PORT bad value: please provide a valid TCP port number.');
                    return 8101; // Default port
                }
                return port;
            },
            SSL_CERT: (value: string | undefined): string => {
                if (value && !existsSync(value)) {
                    this.errors.push('SSL_CERT bad value or SSL certificate not found.');
                    this.exit(this.errors); // Exit if SSL_CERT is invalid
                }
                return value || '';
            },
            SSL_KEY: (value: string | undefined): string => {
                if (value && !existsSync(value)) {
                    this.errors.push('SSL_KEY bad value or SSL key not found.');
                    this.exit(this.errors); // Exit if SSL_KEY is invalid
                }
                return value || '';
            },
            DB_HOST: (value: string | undefined): string => {
                if (!value) {
                    this.errors.push('DB_HOST is required.');
                    return '';
                }
                return value;
            },
            DB_USER: (value: string | undefined): string => {
                if (!value) {
                    this.errors.push('DB_USER is required.');
                    return '';
                }
                return value;
            },
            DB_PASSWORD: (value: string | undefined): string => value || '',
            DB_NAME: (value: string | undefined): string => {
                if (!value) {
                    this.errors.push('DB_NAME is required.');
                    return '';
                }
                return value;
            },
            DB_PORT: (value: string | undefined): number => {
                const port = parseInt(value || '', 10);
                if (isNaN(port)) {
                    this.errors.push('DB_PORT bad value: please provide a valid port number.');
                    return 3306; // Default MySQL port
                }
                return port;
            },
        };
    }

    // Singleton pattern to ensure a single instance
    static get(): Environment {
        if (!Environment.instance) {
            Environment.instance = new Environment();
        }
        return Environment.instance;
    }

    // Extract environment variables
    extracts(args: Record<string, string | undefined>): Environment {
        this.variables = this.keys.reduce((acc, key) => {
            acc[key] = args[key];
            return acc;
        }, {} as Record<string, string | undefined>);
        return this;
    }

    // Validate environment variables using the rules
    validates(): Environment {
        this.keys.forEach((key: string) => {
            const rule = this.rules[key];
            if (rule) {
                this.variables[key] = rule(this.variables[key]) as string;
            }
        });
        return this;
    }

    // Aggregate all variables into a structured cluster object
    aggregates(): Environment {
        // Define the KNEX configuration
        this.cluster = {
            PORT: this.variables.PORT,
            SSL: {
                IS_ACTIVE: !!this.variables.SSL_CERT && !!this.variables.SSL_KEY,
                CERT: this.variables.SSL_CERT,
                KEY: this.variables.SSL_KEY,
            },
            ENV: this.environment,
            KNEX: {
                DB_HOST: process.env.DB_HOST || '',
                DB_USER: process.env.DB_USER || '',
                DB_PASSWORD: process.env.DB_PASSWORD || '',
                DB_NAME: process.env.DB_NAME || '',
                DB_PORT: Number(process.env.DB_PORT) || 3306, // Default to 3306
            } as EnvKnex
        };
        return this;
    }

    // Check if there are validation errors
    isValid(): boolean {
        return this.errors.length === 0;
    }

    // Exit the process with error messages
    exit(messages: string[] | string): void {
        process.stdout.write('\n\x1b[41m[ERROR]\x1b[40m\n\n');
        process.stdout.write([""].concat(messages).join('\n') + '\n');
        process.exit(1);
    }

    // Load the environment and check Node.js version
    loads(nodeVersion: string): Environment {
        const [major, minor] = nodeVersion.split('.').map(parseFloat);

        if (major < 14 || (major === 14 && minor < 16)) {
            this.exit('The Node.js version is too low. Please use at least v14.16.0.');
        }

        if (process.argv.includes('--env')) {
            const envArg = process.argv[process.argv.indexOf('--env') + 1];
            this.environment = ENVIRONMENT[envArg as keyof typeof ENVIRONMENT] || ENVIRONMENT.development;
        } else if (process.env.RUNNER) {
            this.environment = ENVIRONMENT.test;
        } else if (process.env.NODE_ENV) {
            this.environment = ENVIRONMENT[process.env.NODE_ENV as keyof typeof ENVIRONMENT] || ENVIRONMENT.development;
        }

        // 'src' tak ka path lene ke liye 'src' ke aage ka part remove karenge
        const trimmedPath = process.cwd().split("\\src")[0];

        const envFilePath = `${trimmedPath}/dist/env/${this.environment}.env`;

        if (!existsSync(envFilePath)) {
            this.exit(`Environment file not found at ${envFilePath}`);
        }

        Dotenv({ path: envFilePath });
        return this;
    }
}

const environment = Environment.get()
    .loads(process.versions.node)
    .extracts(process.env)
    .validates()
    .aggregates();

// Check if the environment is valid, throw an error if not
if (!environment.isValid()) {
    throw new Error(`Environment validation failed: ${environment.errors}`);
}

// Safely extract values from environment.cluster
const SSL = environment.cluster.SSL as EnvSSL;
const ENV = environment.cluster.ENV as string;
const PORT = environment.cluster.PORT as number;
const KNEX = environment.cluster.KNEX as EnvKnex;
const ACCESS_TOKEN = environment.cluster.ACCESS_TOKEN as EnvAccessToken;
// Return the extracted environment variables in a structured format
export { SSL, ENV, PORT, KNEX, ACCESS_TOKEN };
