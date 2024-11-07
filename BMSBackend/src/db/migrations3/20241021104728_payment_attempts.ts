import type { Knex } from "knex";

// Create payment_attempts table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('payment_attempts', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('payment_id').unsigned().notNullable();
        table.foreign('payment_id').references('id').inTable('payments').onDelete('CASCADE');
        table.integer('attempt_number').notNullable();
        table.tinyint('status').defaultTo(0);
        table.string('error_message', 255);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('payment_attempts');
};
