/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@dbinterfaces";
import { AuthFactory } from "@factories/master";
import AuthHelpers from '@utils/authHelpers.utils';
import { Request } from "express";
class UserAuthService extends AuthHelpers {

    private static instance: UserAuthService;

    private constructor() {
        super();
    }

    static getInstance(): UserAuthService {
        if (!UserAuthService.instance) {
            UserAuthService.instance = new UserAuthService();
        }
        return UserAuthService.instance;
    }


    public async register(req: Request | any) {
        const { uuid, first_name, last_name, email, country_code, phone, password, profile_url, status, role }: IUser = req.body;

        const data: IUser = {
            uuid,
            first_name,
            last_name,
            email,
            country_code,
            phone,
            password,
            profile_url,
            status,
            role
        };

        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;
        const userrole = req.user.role;
        try {
            if (userrole === "superadmin") {
                const authFactory = new AuthFactory(db);
                return await authFactory.register(data, isTenant);
            } else {
                throw new Error("You are not authorized to perform this action");
            }

        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async login(req: Request) {
        const { email, password } = req.body;
        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;
        try {
            const authFactory = new AuthFactory(db);
            return await authFactory.login({ email, password }, isTenant);

        } catch (error) {
            throw new Error(error.message);
        }

    }

    public async refreshAccessToken(req: Request) {
        const { refreshToken }: any = req.body; // Extract refresh token from the request body
        const db = (req as any).knex; // Retrieve the Knex instance from the request
        const isTenant = (req as any).isTenant;
        if (!refreshToken) {
            throw new Error("Refresh Token Not  Found");
        }

        try {
            const authFactory = new AuthFactory(db)
            const decoded = this.verifyToken(refreshToken); // Verify the refresh token 
            return await authFactory.refreshAccessToken(decoded, isTenant, refreshToken);
        } catch (error) {
            throw new Error("Invalid RefreshToken", error);
        }
    }

    public async changePassword(req: Request | any) {
        const { oldPassword, password } = req.body;
        const { email } = req.user;
        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;
        try {
            const authFactory = new AuthFactory(db)
            return await authFactory.changePassword(email, { oldPassword, password }, isTenant);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const userAuthService = UserAuthService.getInstance();

export { userAuthService as UserAuthService }