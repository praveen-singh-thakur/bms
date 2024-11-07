import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('event_series', (table) => {
        table.string("series_id").primary();
        table.string("event_id").notNullable(); // Event ID
        table.string("recurrence_pattern", 255).notNullable(); // Recurrence pattern (e.g., daily, weekly)
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Created timestamp
        table.timestamp("updated_at").defaultTo(knex.fn.now()); // Updated timestamp
        table.foreign("event_id").references("event_id").inTable("events").onDelete('CASCADE'); // Foreign key
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("event_series");
}
