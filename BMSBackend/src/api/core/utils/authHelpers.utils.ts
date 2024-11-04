import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET!;
import { v4 as uuidv4 } from 'uuid';

abstract class AuthHelpers {

    /* it takes the password as a plaintext, and returns the hash for these  password */
    protected async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    /* It takes two parameter one is password and other is hashpassword, 
    then it comapres and gives the  boolean value */
    public async comparePassword(password: string, hashPassword: string): Promise<boolean> {

        try {
            return bcrypt.compare(password, hashPassword);
        } catch (error) {
            console.error('Error while comparing password', error);
            throw error; // or handle the error as appropriate
        }
    }

    /*  it takes the user payload as a object & expiry time , then it will returns the token */
    public generateToken(payload: object, expiresIn: number): string {
        try {
            return jwt.sign(payload, jwtSecret, { expiresIn });
        } catch (error) {
            console.error('Error generating token:', error);
            throw error; // or handle the error as appropriate
        }
    }


    /* verifies the Json Web Token and returns  the decoded payload */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected verifyToken(token: string): any {
        return jwt.verify(token, jwtSecret);
    }

    /* Generates a unique UUID. */
    protected generateUUID(): string {
        return uuidv4();
    }

}

class Auth extends AuthHelpers { }

export default Auth;