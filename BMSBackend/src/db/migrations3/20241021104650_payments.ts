import type { Knex } from "knex";

// Create payments table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('payments', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.integer('booking_id').unsigned();
        table.foreign('booking_id').references('id').inTable('bookings').onDelete('CASCADE');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.decimal('amount', 10, 2).notNullable();
        table.string('currency', 3).notNullable();
        table.integer('payment_method').unsigned();
        table.foreign("payment_method").references("id").inTable("payment_methods");
        table.tinyint('payment_status').defaultTo(0);
        table.string('transaction_id', 100).unique();
        table.integer('payment_gateway_id').unsigned().notNullable(); // Define the column first
        table.foreign("payment_gateway_id").references("id").inTable("payment_gateways"); // Then apply the foreign key constraint
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('payments');
}
