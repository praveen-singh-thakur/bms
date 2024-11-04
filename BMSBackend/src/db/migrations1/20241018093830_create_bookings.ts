import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('bookings', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
        table.enu('status', ['confirmed', 'cancelled', 'pending']).defaultTo('pending');
        table.timestamps(true, true);
    });
};
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('bookings');
};
