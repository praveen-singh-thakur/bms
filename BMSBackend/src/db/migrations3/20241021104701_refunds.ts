import type { Knex } from "knex";


// Create refunds table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('refunds', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('payment_id').unsigned().notNullable();
        table.foreign('payment_id').references('id').inTable('payments').onDelete('CASCADE');
        table.decimal('amount', 10, 2).notNullable();
        table.string('reason', 255);
        table.tinyint('status').defaultTo(0).notNullable();
        table.string('refund_transaction_id', 100);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('refunds');
};
