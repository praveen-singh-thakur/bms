import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('roles', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.string('name').notNullable();
        table.text('description');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('roles');
};