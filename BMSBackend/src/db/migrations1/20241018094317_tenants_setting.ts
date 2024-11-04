import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tenant_settings', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.string('key').notNullable(); // Represents the name of the setting or configuration option(e.g., "theme", "notification_enabled").
        table.text('value').notNullable(); // Stores the actual value associated with the key. This could be a string, a JSON object, or any text-based configuration.
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('tenant_settings');
};
