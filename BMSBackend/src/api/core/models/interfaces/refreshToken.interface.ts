import { IUser } from './user.interface';

interface IRefreshToken {
	token: string;
	user: IUser;
	expires: Date;
}

export {
	IRefreshToken
}