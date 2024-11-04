import { MomentUnit } from "@types";

type EnvSSL = { IS_ACTIVE: boolean, CERT: string, KEY: string };
type EnvKnex = {
    DB_HOST: string,
    DB_USER: string,
    DB_PASSWORD: string,
    DB_NAME: string,
    DB_PORT: number
}
type EnvAccessToken = { DURATION: number, SECRET: string, UNIT: MomentUnit };
export { EnvSSL, EnvKnex, EnvAccessToken };