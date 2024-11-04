import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tenant_user', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL');
        table.timestamps(true, true);
    });
};


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('tenant_user');
};
