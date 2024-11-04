import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('events', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.string('name').notNullable();
        table.text('description');
        table.string('location');
        table.timestamp('start_time').notNullable();
        table.timestamp('end_time').notNullable();
        table.decimal('price', 10, 2);
        table.enu('status', ['scheduled', 'cancelled']).defaultTo('scheduled');
        table.timestamps(true, true);
    });
};


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('events');
};
