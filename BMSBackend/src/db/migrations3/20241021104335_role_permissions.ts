import type { Knex } from "knex";
// Create role_permissions table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('role_permissions', (table) => {
        table.increments('id').primary();
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
        table.integer('permission_id').unsigned().references('id').inTable('permissions').onDelete('CASCADE');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('role_permissions');
};
