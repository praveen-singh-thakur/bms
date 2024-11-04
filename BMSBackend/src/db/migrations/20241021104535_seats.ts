import type { Knex } from "knex";


// Create seats table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('seats', (table) => {
        table.increments('id').primary();
        table.integer('event_id').unsigned().notNullable();
        table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
        table.string('seat_number', 20).notNullable();
        table.tinyint("seat_type").notNullable();
        table.boolean('is_booked').defaultTo(false);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('seats');
};
