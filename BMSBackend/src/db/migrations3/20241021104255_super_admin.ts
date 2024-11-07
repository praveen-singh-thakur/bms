import type { Knex } from "knex";

// Create super_admin table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('super_admin', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('first_name', 50).notNullable();
        table.string('last_name', 50).notNullable();
        table.string('email').unique().notNullable();
        table.string("country_code", 8);
        table.string('phone', 10).nullable();
        table.string('password').notNullable();
        table.string("profile_url").notNullable().defaultTo("");
        table.timestamp("date_register").notNullable().defaultTo(knex.fn.now());
        table.timestamp("last_login").nullable();
        table.tinyint("status").notNullable().defaultTo(1);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('super_admin');
}





