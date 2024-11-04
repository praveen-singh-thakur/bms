
import type { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('password_reset_tokens', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).notNullable().unique();
        table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE'); // Changed to camelCase
        table.string('token_value').notNullable();
        table.timestamp('expiry_date').notNullable();
    });
};
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('password_reset_tokens');
};