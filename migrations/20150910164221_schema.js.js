
//adds boolean column done to projects table
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.table('projects', function (table){
  		table.boolean('done');
  	})
  	])
};

exports.down = function(knex, Promise) {
  
};
