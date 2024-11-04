import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('event_report', (table) => {
        table.string("report_id").primary(); // Unique ID for each report
        table.string("event_id").notNullable(); // Foreign key referencing events
        table.integer("total_bookings").defaultTo(0); // Total bookings for the event
        table.decimal("total_revenue", 10, 2).defaultTo(0); // Total revenue generated
        table.timestamp("report_date").defaultTo(knex.fn.now()); // Date of the report creation

        // Foreign key constraint
        table.foreign("event_id").references("event_id").inTable("events").onDelete('CASCADE'); // Reference to events table
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("event_report");
}
