import type { Knex } from "knex";


// Create event_series table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('event_series', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('event_id').unsigned().notNullable();
        table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
        table.tinyint("frequency").defaultTo(1).notNullable();
        table.integer('interval').unsigned().defaultTo(1).notNullable();
        table.json('days_of_week');
        table.integer('day_of_month');
        table.integer('month_of_year');
        table.date('series_start_date').notNullable();
        table.date('series_end_date');
        table.integer('occurrences');
        table.json('exception_dates');
        table.json('custom_fields');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('event_series');
};

