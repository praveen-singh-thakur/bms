import type { Knex } from "knex";

// Create tenants table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tenants', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('name', 50).notNullable();
        table.integer('created_by').unsigned().notNullable();
        table.foreign('created_by').references('id').inTable('staffs');
        table.string("logo_url").notNullable().defaultTo("");
        table.integer('contact_phone', 10).notNullable();
        table.string('contact_email').notNullable();
        table.json('tenant_custom_settings').notNullable();
        table.integer("tenant_max_events").unsigned().notNullable().defaultTo(10);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('tenants');
};
