import type { Knex } from "knex";


// Create media table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('media', (table) => {
        table.string('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.string('field_name');
        table.string('file_name');
        table.string('path');
        table.string('mime_type');
        table.string('original_name');
        table.integer('size');
        table.integer('user_id').unsigned().references('id ').inTable('users').onDelete('SET NULL');
        table.string('user_name', 50);
        table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('media');
};
