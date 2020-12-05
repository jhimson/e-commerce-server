const {Pool} = require('pg')

const pool = new Pool({
    "host": process.env.PGHOST,
    "port": process.env.PGPORT,
    "user":process.env.PGUSER,
    "password" : process.env.PGPASSWORD,
    "database" : process.env.PGDATABASE,
    // sslmode: require,
    ssl: true,
    ssl: { rejectUnauthorized: false },
    "max": 20,
    "connectionTimeoutMillis" : 0,
    "idleTimeoutMillis": 0
})

module.exports = pool