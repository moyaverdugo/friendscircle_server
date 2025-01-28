/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('post_user_accepts', (table) => {
        table.increments('id').primary();
        table.integer('post_id').unsigned().notNullable()
            .references('post_id').inTable('posts').onDelete('CASCADE');
        table.integer('user_id').unsigned().notNullable()
            .references('user_id').inTable('users').onDelete('CASCADE');
        table.timestamp('accepted_at').defaultTo(knex.fn.now());
        table.string('post_user_response').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('post_user_accepts');
};
