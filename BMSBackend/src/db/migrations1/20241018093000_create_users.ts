import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.integer('tenant_id').unsigned();
        table.foreign("tenant_id").references('id').inTable('tenants').onDelete('CASCADE');
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').unique().notNullable();
        table.string('phone');
        table.string('password_hash').notNullable();
        table.integer('role_id').unsigned();
        table.foreign("role_id").references('id').inTable('roles').onDelete('SET NULL');
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
};
