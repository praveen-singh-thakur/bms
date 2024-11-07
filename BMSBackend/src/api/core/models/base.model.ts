import { Knex } from 'knex';

class Model<T> {
	protected knex: Knex;
	protected table: string;

	constructor(db: Knex, table: string) {
		this.knex = db;
		this.table = table;
	}

	//* Create a fresh query builder for each operation to avoid conflicts
	protected query() {
		return this.knex(this.table);
	}

	//* Find multiple records based on a filter
	async find(filter?: Partial<T>, transaction?: Knex.Transaction): Promise<T[]> {
		try {
			let query = this.query().select('*');
			if (transaction) query = query.transacting(transaction);
			if (filter) query = query.where(filter);
			return await query;
		} catch (error) {
			console.error('Error in find:', error);
			throw error;
		}
	}

	//* Find a single record based on a filter
	async findOne(filter: Partial<T>, transaction?: Knex.Transaction): Promise<T | null> {
		try {
			let query = this.query().first();
			if (transaction) query = query.transacting(transaction);
			return await query.where(filter);
		} catch (error) {
			console.error('Error in findOne:', error);
			throw error;
		}
	}

	//* Find a single record by ID

	async findById(id: number | string, transaction?: Knex.Transaction): Promise<T | undefined> {
		try {
			let query = this.query().where({ id }).first();
			if (transaction) query = query.transacting(transaction);
			return await query;
		} catch (error) {
			console.error('Error in findById:', error);
			throw error;
		}
	}

	//* Create a new record
	async create(data: T, transaction?: Knex.Transaction): Promise<number[]> {
		try {
			let query = this.query().insert(data).select("*");
			if (transaction) query = query.transacting(transaction);
			return await query;
		} catch (error) {
			console.error('Error in create:', error);
			throw error;
		}
	}

	//* Update a record by ID
	async update(ids: { id?: number | string; uuid?: string; }, data: Partial<T>, transaction?: Knex.Transaction): Promise<number[]> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any 
			let query: any;
			if (ids.id) {
				query = this.query().where({ id: ids.id }).update(data).select('*');
			} else {
				query = this.query().where({ uuid: ids.uuid }).update(data).select('*');
			}
			if (transaction) query = query.transacting(transaction);
			return await query;
		} catch (error) {
			console.error('Error in update:', error);
			throw error;
		}
	}

	//* Save a record (insert or update based on ID presence)
	async upsert(data: T & { id?: number | string, uuid?: string }, transaction?: Knex.Transaction): Promise<number[]> {
		if (data.id) {
			return this.update({ id: data.id }, data, transaction);
		} else if (data.uuid) {
			return this.update({ uuid: data.uuid }, data, transaction);
		}
		else {
			return this.create(data, transaction);
		}
	}

	//* Delete a record by ID
	async delete(id: number | string, transaction?: Knex.Transaction): Promise<void> {
		try {
			let query = this.query().where({ id }).del();
			if (transaction) query = query.transacting(transaction);
			await query;
		} catch (error) {
			console.error('Error in delete:', error);
			throw error;
		}
	}

	//* Utility for flexible query conditions
	async findWithConditions(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		conditions: { [key: string]: any },
		transaction?: Knex.Transaction
	): Promise<T[]> {
		try {
			let query = this.query().select('*').where(conditions);
			if (transaction) query = query.transacting(transaction);
			return await query;
		} catch (error) {
			console.error('Error in findWithConditions:', error);
			throw error;
		}
	}
}

export { Model };
