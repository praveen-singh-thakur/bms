import type { Knex } from "knex";


// Create staff table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('staffs', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('first_name', 50).notNullable();
        table.string('last_name', 50).notNullable();
        table.string('email').unique().notNullable();
        table.tinyint("countryCode", 8);
        table.integer('phone', 10).nullable();
        table.string('password_hash').notNullable();
        table.string("profile_url").notNullable().defaultTo("");
        table.timestamp("date_register").notNullable().defaultTo(knex.fn.now());
        table.timestamp("last_login").nullable();
        table.tinyint("status").notNullable();
        table.integer('role_permissions_id').unsigned().nullable();
        table.foreign("role_permissions_id")
            .references('id')
            .inTable('role_permissions')
            .onDelete('SET NULL');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('staffs');
};

