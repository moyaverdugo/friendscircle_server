/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('posts', (table) => {
        table.increments('post_id').primary();
        table.timestamp('post_createdate').defaultTo(knex.fn.now());
        table.timestamp('post_closedate').defaultTo(null);
        table.string('post_status').notNullable();
        table.integer('post_createuser').notNullable();
        table.string('post_category').notNullable();
        table.string('post_type').notNullable();
        table.string('post_title').notNullable();
        table.string('post_description').notNullable();
        table.date('post_duedate').notNullable();
        table.string('post_sharedwith').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('posts');
  
};



