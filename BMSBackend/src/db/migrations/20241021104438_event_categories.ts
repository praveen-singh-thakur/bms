import type { Knex } from "knex";



// Create event_categories table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('event_categories', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('category_name', 50).notNullable();
        table.text('description');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('event_categories');
};
