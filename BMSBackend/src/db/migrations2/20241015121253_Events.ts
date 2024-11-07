import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('events', (table) => {
        table.string("event_id").primary();
        table.string("tenant_id").notNullable(); // Tenant ID
        table.string("title", 255).notNullable(); // Event title
        table.text("description").notNullable(); // Event description
        table.date("event_date").notNullable(); // Event date
        table.time("event_time").notNullable(); // Event time
        table.string("location", 255).notNullable(); // Event location
        table.decimal("price", 10, 2).notNullable(); // Event price
        table.integer("capacity").notNullable(); // Maximum participants
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Created timestamp
        table.timestamp("updated_at").defaultTo(knex.fn.now()); // Updated timestamp
        table.foreign("tenant_id").references("tenant_id").inTable("tenants").onDelete('CASCADE'); // Foreign key
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("events");
}
