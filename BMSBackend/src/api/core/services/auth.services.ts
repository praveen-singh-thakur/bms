/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@dbinterfaces";
import { UserFactory } from "@factories/userfactory.factory";
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


    public async register(req: Request) {
        const { uuid, first_name, last_name, email, country_code, phone, password, profile_url, status }: IUser = req.body;

        const data: IUser = {
            uuid,
            first_name,
            last_name,
            email,
            country_code,
            phone,
            password,
            profile_url,
            status
        };

        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;

        try {
            const userFactory = new UserFactory(db);
            return await userFactory.register(data, isTenant);

        } catch (error) {
            throw new Error("Internal server error", error);
        }
    }

    public async login(req: Request) {
        const { email, password } = req.body;
        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;
        try {
            const userFactory = new UserFactory(db);
            return await userFactory.login({ email, password }, isTenant);

        } catch (error) {
            throw new Error("Internal server error", error);
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
            const userFactory = new UserFactory(db)
            const decoded = this.verifyToken(refreshToken); // Verify the refresh token
            const userId = decoded.id;
            return await userFactory.refreshAccessToken(userId, isTenant, refreshToken);
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
            const userFactory = new UserFactory(db)
            return await userFactory.changePassword(email, { oldPassword, password }, isTenant);
        } catch (error) {
            throw new Error(error.message);
        }

    }


}

const userAuthService = UserAuthService.getInstance();

export { userAuthService as UserAuthService }