import { Router } from "express";
import { IRoute } from '@interfaces';

import { UserAuthRoutes } from '@routes';

class ProxyRouter {
    private static instance: ProxyRouter;
    private router: Router = Router();


    private readonly routes = [
        { segment: "/auth", provider: UserAuthRoutes }
    ]

    private constructor() { }

    static get(): ProxyRouter {
        if (!ProxyRouter.instance) {
            ProxyRouter.instance = new ProxyRouter();
        }
        return ProxyRouter.instance;
    }

    map(): Router {
        this.routes.forEach((route: IRoute) => {
            const instance = new route.provider() as { router: Router };
            this.router.use(route.segment, instance.router);
        });
        return this.router;
    }
}

const proxyRouter = ProxyRouter.get();

export { proxyRouter as ProxyRouter }