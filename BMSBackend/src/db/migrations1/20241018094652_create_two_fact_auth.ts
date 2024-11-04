import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('two_factor_auth', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).notNullable().unique();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.boolean('is_enabled').defaultTo(false);
        table.string('secret'); // Could be the secret key for 2FA apps like Google Authenticator
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('two_factor_auth');
}
