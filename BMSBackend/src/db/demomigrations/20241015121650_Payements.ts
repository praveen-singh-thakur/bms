import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('payments', (table) => {
        table.string("payment_id").primary();
        table.string("booking_id").notNullable(); // Booking ID
        table.decimal("amount", 10, 2).notNullable(); // Amount of the payment
        table.string("payment_method", 100).notNullable(); // Payment method (e.g., credit card, PayPal)
        table.string("payment_status", 100).notNullable(); // Payment status
        table.timestamp("payment_date").defaultTo(knex.fn.now()); // Payment date
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Created timestamp
        table.timestamp("updated_at").defaultTo(knex.fn.now()); // Updated timestamp
        table.foreign("booking_id").references("booking_id").inTable("bookings").onDelete('CASCADE'); // Foreign key
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("payments");
}
