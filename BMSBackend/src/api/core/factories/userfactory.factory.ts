import { IUser } from '@dbinterfaces';
import UserModel from '@models/master/usermodel.master';
import AuthHelpers from '@utils/authHelpers.utils';
import { Knex } from 'knex';
import Helpers from '@utils/helpers.utils';
import * as bcrypt from 'bcrypt';


export class UserFactory extends AuthHelpers {

    private userModel: UserModel;

    constructor(db: Knex) {
        super();
        this.userModel = new UserModel(db);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async register(userDetails: IUser, isTenant: boolean) {
        try {
            const model = this.userModel;
            const existingUser = await model.findByEmail(userDetails.email);

            if (existingUser) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(userDetails.password, 10);

            const data = {
                ...userDetails,
                password: hashedPassword,
            };

            const createuser = await model.createUser(data);


            if (!createuser) {
                throw new Error("Internal server error, unable to create user");

            }


            const accessTokenExpiry = Helpers.calculateTokenExpiry("a");
            const refreshTokenExpiry = Helpers.calculateTokenExpiry("r");
            const payload = { id: createuser.uuid, email: createuser.email };
            const accessToken = this.generateToken(payload, accessTokenExpiry);
            const refreshToken = this.generateToken(payload, refreshTokenExpiry);

            return {
                userId: createuser.uuid,
                firstName: createuser.first_name,
                lastName: createuser.last_name,
                emailId: createuser.email,
                profilePic: createuser.profile_url || null,
                tokens: {
                    accessToken: accessToken,
                    accessTokenExpiry,
                    refreshToken: refreshToken,
                    refreshTokenExpiry,
                },
            };
        } catch (err) {
            console.log(err);
            if (err instanceof Error)
                throw new Error("Internal server error", err);
        }

    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async login(userDetails: { email: string; password: string }, isTenant: boolean) {
        try {
            const model = this.userModel;
            const existingUser = await model.findByEmail(userDetails.email);

            if (!existingUser) {
                throw new Error("Incorrect username or password. Please try again.!");
            }
            // Compare provided password with stored password
            const passMatch = await this.comparePassword(userDetails.password, existingUser.password);
            if (!passMatch) {
                throw new Error("Incorrect username or password. Please try again.!");
            }


            const accessTokenExpiry = Helpers.calculateTokenExpiry("a");
            const refreshTokenExpiry = Helpers.calculateTokenExpiry("r");
            const payload = { id: existingUser.uuid, email: existingUser.email };
            const accessToken = this.generateToken(payload, accessTokenExpiry);
            const refreshToken = this.generateToken(payload, refreshTokenExpiry);

            return {
                userId: existingUser.uuid,
                firstName: existingUser.first_name,
                lastName: existingUser.last_name,
                emailId: existingUser.email,
                profilePic: existingUser.profile_url || null,
                tokens: {
                    accessToken: accessToken,
                    accessTokenExpiry,
                    refreshToken: refreshToken,
                    refreshTokenExpiry,
                },
            };

        } catch (err) {
            console.log(err);
            if (err instanceof Error)
                throw new Error("Internal server error", err);
        }
    };


    public async refreshAccessToken(userId: string, isTenant: boolean, refreshToken: string) {
        const id = userId;
        try {
            const model = this.userModel;

            const user = await model.findByUUID(id);
            if (!user) {
                throw new Error("Internal server Error, please try again");
            }

            const decoded = this.verifyToken(refreshToken);

            const userId = decoded.id;

            // Generate a new access token with the extracted payload
            const payload = { id: userId, email: decoded.email };
            const accessToken = this.generateToken(payload, Helpers.calculateTokenExpiry("a"));

            // Return the new access token
            return {
                accessToken: accessToken,
                accessTokenExpiry: Helpers.calculateTokenExpiry("a")
            };
        } catch (error) {
            // Throw error if user is not found or if the token is invalid
            throw new Error(`Internal server error: ${error.message}`);

        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async changePassword(email: string, passwords: { oldPassword: string; password: string; }, isTenant: boolean) {
        try {

            const model = this.userModel;

            const existingUser = await model.findByEmail(email);

            if (!existingUser) {
                throw new Error("Incorrect username or password. Please try again.!");
            }


            // Compare alds provided password with stored password
            const passMatch = await this.comparePassword(passwords.password, existingUser.password);

            if (passMatch) {
                throw new Error("Your Password is same as your old password, Please use another password.!");
            }

            const oldpassmatch = await this.comparePassword(passwords.oldPassword, existingUser.password);

            const hashedPassword = await bcrypt.hash(passwords.password, 10);

            if (oldpassmatch)
                await model.updatebyEmail(email, { password: hashedPassword });

            return { message: "Password updated successfully" };

        } catch (err) {
            throw new Error(err.message);
        }
    }

}