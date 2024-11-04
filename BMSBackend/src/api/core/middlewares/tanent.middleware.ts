import { KnexConfig, DbDefaultConfig, getDbConfig } from '@config/knex.config';
import { Request, Response, NextFunction } from 'express';
import { Knex } from 'knex';

const knexInstances: Map<string, Knex> = new Map(); // Store Knex instances by config string 

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const domainName = req.body.domain || (req.headers['x-request-origin'] || req.query.domain || req.params.domain as string);
        const identifiedTenant: string | undefined = req.body.domain ? req.body.domain : domainName;
        let knexInstance = KnexConfig; // Start with default Knex instance
        let isTenant = false;
        if (identifiedTenant) {
            const tenantDbConfig = {
                ...DbDefaultConfig,
                database: identifiedTenant
            }

            const configString = JSON.stringify(tenantDbConfig);
            if (!knexInstances.has(configString)) {
                knexInstance = getDbConfig(tenantDbConfig);
                knexInstances.set(configString, knexInstance);
                console.log(`New connection established for tenant: ${identifiedTenant}`);
            } else {
                knexInstance = knexInstances.get(configString)!;
                console.log(`Connection reused for tenant: ${identifiedTenant}`);
            }
            isTenant = true;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).knex = knexInstance;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).isTenant = isTenant;

        next();
    }
    catch (error) {
        console.error(`Tenant middleware error: ${error}`);
        res.status(500).send(`Middleware error: ${error}`);
    }
};