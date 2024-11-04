import type { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('media', (table) => {
        table.string('id').primary(); // Consider using UUIDs if appropriate 
        table.string('uuid', 64).unique().notNullable();
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.string('field_name'); // Changed to camelCase
        table.string('file_name'); // Changed to camelCase
        table.string('path');
        table.string('mime_type'); // Changed to camelCase   
        table.string('original_name'); // Changed to camelCase
        table.integer('size');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
        table.string('user_name');
        table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('media');
};