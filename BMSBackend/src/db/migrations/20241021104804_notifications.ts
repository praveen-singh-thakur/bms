import type { Knex } from "knex";

// Create notifications table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('notifications', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
        table.tinyint("type").notNullable();
        table.text('message').notNullable();
        table.tinyint("status").defaultTo(0);
        table.timestamp('sent_at');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('notifications');
};
