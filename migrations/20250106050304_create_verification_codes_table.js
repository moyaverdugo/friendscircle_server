/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('verification_codes', (table) => {
      table.increments('id').primary(); // Primary key
      table.string('phone_number').notNullable().unique(); // Phone number
      table.string('code').notNullable(); // 6-digit verification code
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for record creation
      table.timestamp('expires_at').notNullable(); // Expiration time for the code
      table.boolean('verified').defaultTo(false); // Indicates if the code has been verified
    });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export async function down(knex) {
    return knex.schema.dropTable('verification_codes');
  }
