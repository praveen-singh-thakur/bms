import type { Knex } from "knex";

// Create roles table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('roles', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('name', 50).notNullable();
        table.text('description');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('roles');
};



