import type { Knex } from "knex";



// Create subdomain table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('subdomain', (table) => {
        table.increments('id').primary();
        table.string('name', 50).unique().notNullable();
        table.integer('tenant_id').unsigned().notNullable();
        table.foreign('tenant_id').references('id').inTable('tenants');
        table.integer('super_admin_id').unsigned().notNullable();
        table.foreign('super_admin_id').references('id').inTable('super_admin');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('subdomain');
};

