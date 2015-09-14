//client configuration for the db.js connection file. knex expects an object for the connection.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'projectyr_dev'
    }
  }
}