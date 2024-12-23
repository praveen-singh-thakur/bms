import type { Knex } from "knex";


// Create payment_methods table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('payment_methods', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.string('name', 50).notNullable();
        table.tinyint('is_active').defaultTo(0);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('payment_methods');
};
