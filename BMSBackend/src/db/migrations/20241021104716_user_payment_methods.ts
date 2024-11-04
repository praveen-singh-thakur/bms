import type { Knex } from "knex";

// Create user_payment_methods table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user_payment_methods', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('payment_method_id').unsigned().notNullable();
        table.foreign('payment_method_id').references('id').inTable('payment_methods').onDelete('CASCADE');
        table.string('token', 255).notNullable();
        table.boolean('is_default').defaultTo(false);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('user_payment_methods');
};


