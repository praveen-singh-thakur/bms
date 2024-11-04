import type { Knex } from "knex";




// Create bookings table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('bookings', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('event_id').unsigned().notNullable();
        table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
        table.timestamp('booking_date').defaultTo(knex.fn.now());
        table.tinyint("status").defaultTo(0);
        table.decimal('amount_paid', 10, 2).notNullable();
        table.string('payment_status', 100).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('bookings');
};