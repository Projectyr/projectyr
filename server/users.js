var db = require('./db')

knex.select('username', 'password').from('users');

module.exports = Users;