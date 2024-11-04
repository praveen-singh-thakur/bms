import { IUser } from "@dbinterfaces";
import { NextFunction, Request, Response } from "express";
import { Register } from "@validations";
import * as  Joi from 'joi';
import Helpers from '@utils/helpers.utils';
import * as jwt from 'jsonwebtoken';

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

    async validateMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            // Validate request body asynchronously
            const result: IUser = await Register.validateAsync(req.body, {
                presence: 'optional',
                stripUnknown: true  // This removes any unknown keys not defined in the schema
            });

            // Pass validated result to the next middleware, if needed
            req.body = { ...req.body, ...result }; // Optionally replace the request body with the validated result
            next(); // Call next middleware on success 

        } catch (error) {
            if (error instanceof Joi.ValidationError) {
                // If validation error, send a response with the error details
                res.status(400).json({
                    message: 'Validation Error',
                    details: error.details.map((err) => err.message), // List validation error messages
                });
                return;
            }

            // If other errors, pass to the next error handler
            next(error);
        }
    }


    checkingUserAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const token = req.cookies.refreshtoken;  // Get token from cookies

        if (!token) {
            res.status(403).json(Helpers.responseHandler(403, "You have been Logged Out, SignIn First", undefined, 'Token is required'));
            return;
        }

        try {
            // Verify the token and decode the payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IUser

            req.user = decoded;  // Store decoded user (with role) in request object
            req.body.email = decoded.email;
            next();  // Continue to the next middleware/route handler
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
    }
}

// Singleton pattern for Validator instance
const validator = Validator.get();
export { validator as Validator };
