
interface IRefreshToken {
	id?: number,
	uuid: string,
	token: string;
	user_id: number;
	expires: string;
}

export {
	IRefreshToken
}