interface IUser {
	uuid: string;
	first_name: string;
	last_name: string;
	email: string;
	country_code: string;
	phone?: string;
	password: string;
	profile_url: string;
	status?: number;
}

export { IUser };
