
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("tenants", (table) => {
        table.string("tenant_id", 255).primary().unique();  // Correct spelling of "tenant"
        table.string("name", 255).notNullable();
        table.string("contact_email", 255).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());  // Set default timestamp
        table.timestamp("updated_at").defaultTo(knex.fn.now());  // Set default timestamp
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("tenants");
}
