var db = require('../db.js');

module.exports = {
  //fill me in
  findUser = knex.select('username', 'users_id').from('users');
  findPassword = knex.select('password');

}