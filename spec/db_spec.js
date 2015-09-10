var config = {  
  database: {
    client: 'pg',
    connection: {
      host     : '127.0.0.1',
      user     : 'my_name',
      password : 'my_pass',
      database : 'DB_test',
      charset  : 'utf8'
    }
  },

  directory: __dirname + '/migrations',

  // this table will be populated with some information about your
  // migration files.  it will be automatically created, if it
  // doesn't already exist.
  tableName: 'migrations'
};

var Knex = require('knex');  
var knex = Knex.initialize(config.database);  // You might need to npm install the request module!
var expect = require('../../node_modules/chai/chai').expect;
var query = require('/server/models/users.js')
describe('Users model', function() {  
  before(function(done) {
    knex.migrate.rollback(config);
    done();
  });


  beforeEach(function(done) {
    return knex.migrate.latest(config)
      .then(function() {
        return knex('users').insert(
          {
            username: 'Bob',
            password: 'Roberts',
            users_time: '23:00'
          }
        );
      })
      .then(function() {
        done();
      });
  });

afterEach(function(done) {  
  return knex.migrate.rollback(config)
  .then(function() {
    done();
  });
})



it("Should retrieve a user", function(done){

  expect(query.findUser('Bob')).to.be(typeof 'string');
  expect(query.findUser('Bob')).to.be('Bob')
});


});
