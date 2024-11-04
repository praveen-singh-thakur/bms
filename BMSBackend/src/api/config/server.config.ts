import { Server as HTTPServer, createServer } from 'https';
import { Application } from 'express';
import { readFileSync } from 'fs';

import { SSL, ENV, PORT } from "@config/environment.config";

export class ServerConfiguration {
    private static instance: ServerConfiguration;
    private server!: HTTPServer | Application;
    private options = {
        credentials: {
            key: SSL.IS_ACTIVE ? readFileSync(SSL.KEY, 'utf8') : '',
            cert: SSL.IS_ACTIVE ? readFileSync(SSL.CERT, 'utf8') : '',
        },
        port: PORT
    }

    private constructor() { };

    static get(): ServerConfiguration {
        if (!ServerConfiguration.instance) {
            ServerConfiguration.instance = new ServerConfiguration();
        }
        return ServerConfiguration.instance;
    }

    init(app: Application): ServerConfiguration {
        this.server = !this.server ? SSL.IS_ACTIVE ? createServer(this.options.credentials, app) : app : this.server;
        return this;
    }

    listen(): void {
        const port = SSL.IS_ACTIVE ? 443 : PORT;
        const protocol = SSL.IS_ACTIVE ? 'HTTPS' : 'HTTP';
        this.server.listen(port, () => {
            console.log('info', `${protocol} server is now running on port ${port} (${ENV})`);
        });
    }
}

const Server = ServerConfiguration.get();

export { Server };