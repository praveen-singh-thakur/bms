import type { Knex } from "knex";


// Create tickets table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tickets', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('event_id').unsigned().notNullable();
        table.foreign('event_id').references('id').inTable(' events').onDelete('CASCADE');
        table.string('name', 50).notNullable();
        table.text('description');
        table.decimal('price', 10, 2).notNullable();
        table.integer('quantity').unsigned().notNullable();
        table.integer('max_per_order').defaultTo(5);
        table.datetime('sales_start').notNullable();
        table.datetime('sales_end').notNullable();
        table.tinyint("status").defaultTo(0).notNullable();
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('tickets');
};

