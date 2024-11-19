/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserFactory } from "@factories/master";
import AuthHelpers from '@utils/authHelpers.utils';
import { Request } from "express";
class UserService extends AuthHelpers {

    private static instance: UserService;

    private constructor() {
        super();
    }

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async getAllStaffs(req: Request | any) {
        const db = (req as any).knex;
        try {
            const userFactory = new UserFactory(db)
            return await userFactory.getAllStaffs();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getOneStaffs(req: Request | any) {
        const db = (req as any).knex;
        const { userId } = req.params;
        try {
            const userFactory = new UserFactory(db)
            return await userFactory.getOneStaffs(userId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async updateStaffs(req: Request | any) {
        const db = (req as any).knex;
        const { userId } = req.params;
        const { email, role, first_name, last_name, country_code, phone, profile_url, status } = req.body;
        const data = { email, role, first_name, last_name, country_code, phone, profile_url, uuid: userId, status };
        try {
            const userFactory = new UserFactory(db)
            return await userFactory.updateStaffs(data);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const userService = UserService.getInstance();

export { userService as UserService }