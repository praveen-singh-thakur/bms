import { IAuditLog } from './interfaces';
import { Model } from './base.model';

class AuditLogModel extends Model<IAuditLog> {

	private static instance: AuditLogModel;

	constructor() {
		super('audit_logs');
	}

	static get(): AuditLogModel {
		if (!this.instance) {
			this.instance = new AuditLogModel();
		}
		return this.instance;
	}

}

export { AuditLogModel };