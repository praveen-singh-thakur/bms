import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('payments', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('booking_id').unsigned().references('id').inTable('bookings').onDelete('CASCADE');
        table.decimal('amount', 10, 2).notNullable();
        table.string('currency').notNullable();
        table.enu('status', ['pending', 'completed', 'failed']).defaultTo('pending');
        table.string('payment_method').notNullable();
        table.string('transaction_id');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('payments');
};
