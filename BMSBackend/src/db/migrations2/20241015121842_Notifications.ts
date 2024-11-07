import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('notifications', (table) => {
        table.string("notification_id").primary();
        table.string("user_id").notNullable(); // User ID
        table.string("message", 255).notNullable(); // Notification message
        table.timestamp("notification_date").defaultTo(knex.fn.now()); // Notification date
        table.boolean("is_read").defaultTo(false); // Read status
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Created timestamp
        table.timestamp("updated_at").defaultTo(knex.fn.now()); // Updated timestamp
        table.foreign("user_id").references("user_id").inTable("users").onDelete('CASCADE'); // Foreign key
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("notifications");
}
