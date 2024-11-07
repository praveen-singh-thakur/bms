import type { Knex } from "knex";


// Create calendar_integration table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('calendar_integration', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.integer('event_id').unsigned().notNullable();
        table.tinyint("calendar_type").notNullable();
        table.tinyint("sync_status").defaultTo(0);
        table.timestamp('last_synced_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('calendar_integration');
};

