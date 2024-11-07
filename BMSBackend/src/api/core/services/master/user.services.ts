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
        const userdata = req.user;
        try {
            if (userdata.role === "superadmin") {
                const userFactory = new UserFactory(db)
                return await userFactory.getAllStaffs();
            } else {
                throw new Error("You are not authorized to perform this action");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getOneStaffs(req: Request | any) {
        const db = (req as any).knex;
        const userdata = req.user;
        const { userId } = req.params;
        try {
            if (userdata.role === "superadmin") {
                const userFactory = new UserFactory(db)
                return await userFactory.getOneStaffs(userId);
            } else {
                throw new Error("You are not authorized to perform this action");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const userService = UserService.getInstance();

export { userService as UserService }