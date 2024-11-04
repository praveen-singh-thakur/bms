import { ITenant } from './interfaces';
import { Model } from './base.model';

class TenantModel extends Model<ITenant> {
	private static instance: TenantModel;

	constructor() {
		super('tenants');
	}

	static getInstance(): TenantModel {
		if (!TenantModel.instance) {
			TenantModel.instance = new TenantModel();
		}
		return TenantModel.instance;
	}

}

const Tenant = TenantModel.getInstance();

export {
	Tenant
}


