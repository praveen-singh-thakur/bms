import { ITenantUser } from './interfaces';
import { Model } from './base.model';

class TenantUserModel extends Model<ITenantUser> {
	private static instance: TenantUserModel;

	constructor() {
		super('tenant_users');
	}

	static getInstance(): TenantUserModel {
		if (!TenantUserModel.instance) {
			TenantUserModel.instance = new TenantUserModel();
		}
		return TenantUserModel.instance;
	}

	async getTenantUsers(tenantId: number) {
		return this.knex(this.table).where({ tenant_id: tenantId });
	}

	async getUserTenants(userId: number) {
		return this.knex(this.table).where({ user_id: userId });
	}

	async createTenantUser(data: ITenantUser) {
		return this.knex(this.table).insert(data).returning('*');
	}

	async deleteTenantUser(id: number) {
		return this.knex(this.table).where({ id }).delete();
	}

	async updateTenantUser(id: number, data: ITenantUser) {
		return this.knex(this.table).where({ id }).update(data).returning('*');
	}

}

const TenantUser = TenantUserModel.getInstance();

export {
	TenantUser
}


