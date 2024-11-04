import { Knex } from 'knex';
import { KnexConfig } from '@config/knex.config';

class Model<T> {
	public knex: Knex;
	public table: string;
	public queryBuilder: Knex.QueryBuilder;

	constructor(table: string) {
		this.table = table;
		this.knex = KnexConfig;
		this.queryBuilder = this.query();
	}

	query() {
		return this.knex(this.table);
	}

	//* Generic method to find all records
	async find(filter: T): Promise<T[]> {
		if (filter) {
			return this.queryBuilder.where({ ...filter }).select('*');
		}
		return this.queryBuilder.select('*');
	}

	//* Generic method to find a record by filter
	async findOne(filter: T): Promise<T | null> {
		if (filter) {
			return this.queryBuilder.where({ ...filter }).first();
		}
		return this.queryBuilder.first();
	}

	//* Generic method to find a record by ID
	async findById(id: number): Promise<T | undefined> {
		return this.queryBuilder.where({ id }).first();
	}

	//* Generic method to create a new record
	async create(data: T): Promise<T[]> {
		return this.queryBuilder.insert(data).returning('*');
	}

	//* Generic method to update a record by ID
	async update(id: number | string, data: Partial<T>): Promise<T[]> {
		return this.queryBuilder.where({ id }).update(data).returning('*');
	}

	//* Generic method to save a record
	async save(data: T): Promise<T[]> {
		return this.insert(data);
	}

	//* Generic method to insert a record
	async insert(data: T): Promise<T[]> {
		return this.queryBuilder.insert(data).returning('*');
	}

	//* Generic method to delete a record by ID
	async delete(id: number | string): Promise<void> {
		await this.queryBuilder.where({ id }).del();
	}
}

export {
	Model
}