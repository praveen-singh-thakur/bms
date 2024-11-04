// import { Model } from './base.model';
// import { IUser } from './interfaces';

// import * as Dayjs from 'dayjs';
// import * as Jwt from 'jwt-simple';

// import bcrypt from 'bcrypt';
// import { loadEnvironment } from '@config/datasource.config';

// const { ACCESS_TOKEN } = loadEnvironment();


// class UserModel extends Model<IUser> {
// 	static instance: UserModel;

// 	constructor() {
// 		super('users');
// 	}

// 	static get(): UserModel {
// 		if (!this.instance) {
// 			this.instance = new UserModel();
// 		}
// 		return this.instance;
// 	}

// 	//* Check if the password matches the user's password
// 	async passwordMatches(id: number | string, password: string): Promise<boolean> {
// 		const user = await this.findOne({ id } as IUser);
// 		return await bcrypt.compare(password, user?.password);
// 	}

// 	token(id: string | number, duration: number = null): string {
// 		const payload = {
// 			exp: Dayjs().add(duration || ACCESS_TOKEN.DURATION, 'minutes').unix(),
// 			iat: Dayjs().unix(),
// 			sub: id
// 		};
// 		return Jwt.encode(payload, ACCESS_TOKEN.SECRET);
// 	}

// 	//* Fetch user roles
// 	async getRoles(userId: number) {
// 		return this.knex('roles')
// 			.join('user_roles', 'roles.id', 'user_roles.role_id')
// 			.where('user_roles.user_id', userId)
// 			.select('roles.*');
// 	}

// 	//* Check if the user has a specific role
// 	async hasRole(userId: number, roleName: string) {
// 		const roles = await this.getRoles(userId);
// 		return roles.some(role => role.name === roleName);
// 	}

// 	//* Fetch user permissions
// 	async getPermissions(userId: number) {
// 		return this.knex('permissions')
// 			.join('role_permissions', 'permissions.id', 'role_permissions.permission_id')
// 			.join('roles', 'roles.id', 'role_permissions.role_id')
// 			.join('user_roles', 'roles.id', 'user_roles.role_id')
// 			.where('user_roles.user_id', userId)
// 			.select('permissions.*');
// 	}

// 	//* Check if the user has a specific permission
// 	async hasPermission(userId: number, action: string) {
// 		const permissions = await this.getPermissions(userId);
// 		return permissions.some(permission => permission.action === action);
// 	}
// }

// const User = UserModel.get()

// export { User };
