const mysql = require("mysql2");

function database(query, callback, args = []) {
  const connection = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: process.env.INSTANCE_UNIX_SOCKET,
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");

    connection.query(query, args, (err, result) => {
      if (err) {
        console.log(err);
        callback();
      } else {
        callback(result);
      }

      connection.end((err) => {
        if (err) throw err;
        console.log("Connection closed!");
      });
    });
  });
}

module.exports = database;

