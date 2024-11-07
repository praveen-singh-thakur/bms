import * as Express from 'express'
import { ProxyRouter } from '@services/master';
import { NextFunction, Request, Response } from 'express';
import Helpers from '@utils/helpers.utils';
import * as morgan from 'morgan';
import { tenantMiddleware } from '@middlewares/master';
import * as  cookieParser from 'cookie-parser';

export class ExpressConfiguration {
    private static instance: ExpressConfiguration;
    application: Express.Application;

    private constructor() { };

    static get(): ExpressConfiguration {
        if (!ExpressConfiguration.instance) {
            ExpressConfiguration.instance = new ExpressConfiguration();
        }
        return ExpressConfiguration.instance;
    }

    init(): ExpressConfiguration {
        if (!this.application) {
            this.application = Express();
        }
        return this;
    }
    plug(): ExpressConfiguration {
        this.application.use(cookieParser());
        this.application.use(morgan("dev"));
        this.application.use(Express.urlencoded({ extended: false }));
        this.application.use(Express.json());
        this.application.use(tenantMiddleware);
        this.application.use("/", ProxyRouter.map());
        // Not Found Middleware
        this.application.use((req: Request, res: Response, next: NextFunction) => {
            const error = new Error("Not Found") as { status?: number };
            error.status = 404; // Set the status to 404 for not found errors
            next(error);
        });

        // Error Handling Middleware
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.application.use((err: { status?: number; message: string }, req: Request, res: Response, next: NextFunction) => {
            const status = err.status || 500; // Default to 500 if status is not set
            res.status(status).json(Helpers.responseHandler(status, undefined, undefined, err.message));
        });
        return this;
    }
}

const Application = ExpressConfiguration.get()
    .init()
    .plug()
    .application;
export {
    Application
};