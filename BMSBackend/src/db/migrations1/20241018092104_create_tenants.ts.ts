import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tenants', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('name').notNullable();
        table.string('contact_email').notNullable(); // The contact email is crucial for communication with tenants, especially for notifications, confirmations, or customer support.
        table.timestamps(true, true);
    });
};
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('tenants');
};
