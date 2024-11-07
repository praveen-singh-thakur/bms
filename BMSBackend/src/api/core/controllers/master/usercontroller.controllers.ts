import { Request, Response } from "express";
import Helpers from "@utils/helpers.utils";
import { UserService } from "@services/master";

class UserController {
    private static instance: UserController;

    private constructor() { }

    static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }


    public async getAllStaffs(req: Request, res: Response) {
        try {
            const result = await UserService.getAllStaffs(req);
            res.json(Helpers.responseHandler(200, "All Staffs are Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async getOneStaffs(req: Request, res: Response) {
        try {
            const result = await UserService.getOneStaffs(req);
            res.json(Helpers.responseHandler(200, "Staff Fetched Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

}

const userController = UserController.getInstance();

export { userController as UserController };
