import type { Knex } from "knex";

// Create booking_ticket_map table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('booking_ticket_map', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('booking_id').unsigned().notNullable();
        table.foreign('booking_id').references('id').inTable('bookings').onDelete('CASCADE');
        table.integer('ticket_id').unsigned().notNullable();
        table.foreign('ticket_id').references('id').inTable('tickets').onDelete('CASCADE');
        table.integer('quantity').unsigned().notNullable();
        table.decimal('unit_price', 10, 2).notNullable();
        table.decimal('total_price', 10, 2).notNullable();
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('booking_ticket_map');
};