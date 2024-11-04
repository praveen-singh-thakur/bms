
import { IRefreshToken } from './interfaces';
import { Model } from './base.model';

class RefreshTokenModel extends Model<IRefreshToken> {
	private static instance: RefreshTokenModel;

	constructor() {
		super('refresh_tokens');
	}

	static getInstance(): RefreshTokenModel {
		if (!RefreshTokenModel.instance) {
			RefreshTokenModel.instance = new RefreshTokenModel();
		}
		return RefreshTokenModel.instance;
	}

}

const RefreshToken = RefreshTokenModel.getInstance();

export {
	RefreshToken
}


