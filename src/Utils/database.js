const mysql = require('mysql2');

function database(query, callback, args = []) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'lofar'
    });

    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to the database!');

        connection.query(query, args, (err, result) => {
            if (err) throw err;
            callback(result);

            connection.end((err) => {
                if (err) throw err;
                console.log('Connection closed!');
            });
        });
    });
}

module.exports = database;