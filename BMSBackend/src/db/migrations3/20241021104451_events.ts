import type { Knex } from "knex";

// Create events table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('events', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('category_id').unsigned().references('id').inTable('event_categories');
        table.integer('staff_id').unsigned().references('id').inTable('staffs');
        table.string('name', 50).notNullable();
        table.text('description');
        table.string('location');
        table.date('event_date').notNullable();
        table.time('start_time').notNullable();
        table.time('end_time').notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.tinyint("status").defaultTo(0).notNullable();
        table.integer('capacity').unsigned().notNullable();
        table.string('timezone').notNullable();
        table.json('tags');
        table.json('custom_fields');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('events');
};
