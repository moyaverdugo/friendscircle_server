/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('user_id').primary().unsigned();
        table.timestamp('user_createdate').defaultTo(knex.fn.now());
        table.timestamp('user_closedate').defaultTo(null)
        table.string('user_status').notNullable('inactive');
        table.string('user_phonenumber').notNullable();
        table.string('user_password').notNullable();
        table.string('user_name').notNullable();
        table.string('user_lastname').notNullable();
        table.string('user_address').notNullable();
        table.string('user_postalcode').notNullable();
        table.string('user_email').notNullable();
        table.date('user_birthdate').notNullable();
        table.string('user_profileimage');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('users'); // Always ensure the 'down' method drops the table.
  };
