interface IAuditLog {
	id: number;
	user_id: number;
	activity_type: string;
	timestamp: Date;
	description?: string;
}

export { IAuditLog };
