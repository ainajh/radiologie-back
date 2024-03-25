const mysqlPromise = require("mysql2/promise");
const dbPromise = mysqlPromise.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  pool: {
    handleDisconnect: ()=>{
        return dbPromise;
    },
  },
  port: process.env.DB_PORT,
});

module.exports = dbPromise;
