interface ITwoFactorAuthentication {
	id: number;
	user_id: number;
	method: string;
	verification_code: string;
	expiry_date: Date;
}

export { ITwoFactorAuthentication };
