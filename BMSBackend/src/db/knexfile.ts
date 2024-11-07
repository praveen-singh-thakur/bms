// Import necessary modules and configurations
import 'module-alias/register';

import { DbConfiguration } from '@config/knex.config';

const config = {
    ...DbConfiguration,
    migrations: {
        directory: "./migrations",
    },
    seeds: {
        directory: "./seeds",
    }
}

export default config;
