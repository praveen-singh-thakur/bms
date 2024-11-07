import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.string("user_id").primary();
        table.string("tenant_id").notNullable(); // Removed length, using string type without length
        table.enu("role", ["user", "subadmin", "superadmin"]).notNullable(); // Unified role definition
        table.foreign("tenant_id").references("tenant_id").inTable("tenants").onDelete('CASCADE'); // Added onDelete rule
        table.string("email", 255).unique().notNullable();
        table.string("password_hash", 255).notNullable();
        table.string("first_name", 100).notNullable();
        table.string("last_name", 100).notNullable();
        table.string("social_id", 255);
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Set default timestamp
        table.timestamp("updated_at").defaultTo(knex.fn.now()); // Update timestamp on change
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}

