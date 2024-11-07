import type { Knex } from "knex";


// Create waitlist table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('waitlist', (table) => {
        table.increments('id').primary();
        table.integer('event_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.timestamp('added_at').defaultTo(knex.fn.now());
        table.timestamp('notified_at');
        table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('waitlist');
};

