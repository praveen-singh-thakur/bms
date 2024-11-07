import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('bookings', (table) => {
        table.string("booking_id").primary();
        table.string("user_id").notNullable(); // User ID
        table.string("event_id").notNullable(); // Event ID
        table.timestamp("booking_date").defaultTo(knex.fn.now()); // Booking date
        table.decimal("amount_paid", 10, 2).notNullable(); // Amount paid
        table.string("payment_status", 100).notNullable(); // Payment status (e.g., completed, pending)
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Created timestamp
        table.timestamp("updated_at").defaultTo(knex.fn.now()); // Updated timestamp
        table.foreign("user_id").references("user_id").inTable("users").onDelete('CASCADE'); // Foreign key
        table.foreign("event_id").references("event_id").inTable("events").onDelete('CASCADE'); // Foreign key
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("bookings");
}
