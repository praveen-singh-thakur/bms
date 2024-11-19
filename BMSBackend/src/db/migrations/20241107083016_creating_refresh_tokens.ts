
import type { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('refresh_tokens', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).notNullable().unique();
        table.text('token').notNullable();
        table.integer('user_id').unsigned().references('id').inTable('staffs').onDelete('CASCADE'); // Changed to camelCase
        table.timestamp('expires').notNullable();
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('refresh_tokens');
}; 