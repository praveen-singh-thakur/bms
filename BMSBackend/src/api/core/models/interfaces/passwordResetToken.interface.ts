interface IPasswordResetToken {
	id: number;
	user_id: number;
	token_value: string;
	expiry_date: Date;
}

export { IPasswordResetToken };
