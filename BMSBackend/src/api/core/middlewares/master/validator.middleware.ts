import { IUser } from "@dbinterfaces";
import { NextFunction, Request, Response } from "express";
import { Register, Login, ChangePassword, PostRole, PostPermission, UpdateRole, UpdatePermission, PostRolePermission, UpdateRolePermission, PostRoleName } from "@validations";
import * as  Joi from 'joi';
import Helpers from '@utils/helpers.utils';
import * as jwt from 'jsonwebtoken';
import client from "@config/redis.config";
import RefreshTokenModel from '../../models/refresh.model';
import { PermissionModel } from "@models/master/permission.master";
import { RoleModel } from "@models/master/rolemodel.master";

interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string; } | jwt.JwtPayload;
}

class Validator {
    private static instance: Validator;

    private constructor() { }

    static get(): Validator {
        if (!Validator.instance) {
            Validator.instance = new Validator();
        }
        return Validator.instance;
    }

    sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sanitizeInput = (input: any) => {
            if (typeof input === 'string') {
                // Remove HTML tags from the string input
                return input.replace(/<\/?[^>]+(>|$)/g, "");
            } else if (typeof input === 'object' && input !== null) {
                // If the input is an object, recursively sanitize its properties
                Object.keys(input).forEach(key => {
                    input[key] = sanitizeInput(input[key]);
                });
            }
            return input; // Return sanitized input
        };
        // Sanitize the body, query, and params of the request
        req.body = sanitizeInput(req.body);
        req.query = sanitizeInput(req.query);
        req.params = sanitizeInput(req.params);

        // Pass control to the next middleware
        next();
    }

    validate(api: string) {
        const schemaMap = {
            login: Login,
            register: Register,
            postRole: PostRole,
            updateRole: UpdateRole,
            postRoleName: PostRoleName,
            changePassword: ChangePassword,
            postPermission: PostPermission,
            updatePermission: UpdatePermission,
            postRolePermission: PostRolePermission,
            updateRolePermission: UpdateRolePermission
        };
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const schema = schemaMap[api as keyof typeof schemaMap]; // Get schema based on API name

            if (!schema) {
                // If the API name does not have a corresponding schema, throw an error
                res.status(400).json({ message: 'Invalid API for validation' });
                return;
            }

            try {
                // Validate the request body using the corresponding schema
                const validatedData = await schema.validateAsync(req.body, {
                    presence: 'optional',
                    stripUnknown: true, // Removes unknown fields not in the schema
                    abortEarly: false, // Collects all errors instead of stopping at the first one
                });

                // Overwrite req.body with the validated data
                req.body = validatedData;
                next(); // Proceed to the next middleware

            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    // Send a response with validation error details
                    res.status(400).json({
                        message: 'Validation Error',
                        errors: error.details.map((err) => ({
                            field: err.path.join('.'),
                            message: err.message,
                        })),
                    });
                    return;
                }
                // If any other error occurs, forward it to the next error handler
                next(error);
            }
        };
    }

    async checkingUserAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = (req as any).knex;
        try {
            const tokenId = await client.get("SuperAdminRefreshTokenId");
            const [data] = await new RefreshTokenModel(db).findByUUID(tokenId);
            const token = data.token;
            if (!token) {
                res.status(403).json(Helpers.responseHandler(403, "You have been Logged Out, SignIn First", undefined, 'Token is required'));
                return;
            }
            // Verify the token and decode the payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IUser
            req.user = decoded;  // Store decoded user (with role) in request object
            next();  // Continue to the next middleware/route handler
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
    }
    authorize(requiredPermissions: string[]) {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return async (req: Request | any, res: Response, next: NextFunction) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const db = (req as any).knex;
            try {
                const user = req.user; // Assuming req.user is set after authentication
                if (!user) {
                    throw new Error("You are not authorized to perform this action");
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [roleId] = await new RoleModel(db).find({ name: user.role } as any);
                // Fetch user's permissions based on their role
                const userPermissions = await new PermissionModel(db).getPermissionsForRole(roleId.id);

                // Check if the user has all required permissions
                const hasPermissions = requiredPermissions.every((perm) => userPermissions.includes(perm));

                if (!hasPermissions) {
                    throw new Error("You are not authorized to perform this action");
                }

                // Proceed if authorized
                next();
            } catch (err) {
                next(err);
            }
        };
    }
}

// Singleton pattern for Validator instance
const validator = Validator.get();
export { validator as Validator };
