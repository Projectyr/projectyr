
//db exports created on server load
//future updates to the DB need new migration files or drop the database, hardcode changes, reconnect, and implement changes.

exports.up = function(knex, Promise) {
  //knex asynchronous creation: Promisify the array of queries.
  
  return Promise.all([

    //USERS table
    //USER has users_time aggregate of time in app (?) || remainder.

    knex.schema.createTable('users', function(table) {
      table.increments('users_id').primary();
      table.string('username');
      table.string('password');
      table.integer('users_time');
    }),

    //PROJECTS table: actual_time vs estimated_time; one user many projects; one proj one est/act time
    //PROJECT has estimated time; project actual aggregate of skill.
    //To Do: estimated time percentage of aggregate?
    //To Do: customizable skill as oppposed to three skills

     knex.schema.createTable('projects', function(table) {
      table.increments('projects_id').primary();
      table.string('project_name');
      table.integer('est_time');
      table.string('skill1');
      table.string('skill2');
      table.string('skill3');
      table.boolean('done');
      table.integer('users_id')
                  .references('users_id')
                  .inTable('users');
    }),

    //SKILLS table

    knex.schema.createTable('skills', function(table) {
      table.increments('skills_id').primary();
      table.string('skills_name');
    }),

    //SKILL TIMES: join table many skills many projects; one user many skills; one skill one est/act time
    //SKILL has actual time;
    //To Do: float bug increments do not show up without serverside configuration. May need decimal in a migration update.

    knex.schema.createTable('skill_times', function(table) {
      table.increments('skill_times_id').primary();
      table.float('act_time');
      table.integer('users_id')
                  .references('users_id')
                  .inTable('users');
      table.integer('projects_id')
                  .references('projects_id')
                  .inTable('projects');
      table.integer('skills_id')
                  .references('skills_id')
                  .inTable('skills');
    })

  ])
};

//DROP tables

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('users'),
      knex.schema.dropTable('projects'),
      knex.schema.dropTable('skills'),
      knex.schema.dropTable('skill_times')
  ])  
};
