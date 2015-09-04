
//db exports created on server load

exports.up = function(knex, Promise) {
  
  return Promise.all([

  	//USERS table

    knex.schema.createTable('users', function(table) {
      table.increments('users_id').primary();
      table.string('username');
      table.string('password');
    }),

    //PROJECTS table: actual_time vs estimated_time; one user many projects; one proj one est/act time

     knex.schema.createTable('projects', function(table) {
      table.increments('projects_id').primary();
      table.string('project_name');
      table.time('act_time');
      table.time('est_time');
      table.integer('users_id');
    }),

    //SKILLS table

    knex.schema.createTable('skills', function(table) {
      table.increments('skills_id').primary();
      table.string('skills_name');;
    }),

    //SKILL TIMES: join table many skills many projects; one user many skills; one skill one est/act time
    
    knex.schema.createTable('skill_times', function(table) {
      table.increments('skill_times_id').primary();
      table.time('act_time');
      table.time('est_time');
      table.integer('users_id');
      table.integer('projects_id');
      table.integer('skills_id');
    })

])
};

//DROP tables

exports.down = function(knex, Promise) {
	return Promise.all([
		  knex.schema.dropTable('users'),
      knex.schema.dropTable('projects'),
      knex.schema.dropTable('skills'),
      knex.schema.dropTable('skill_times'),
		])  
};
