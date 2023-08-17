const config = require("../../config.json");
const sqlite3 = require('sqlite3');

const databasePath = config.database.path;
async function checkBlacklist(uuid) {
    return new Promise((resolve, reject) => {
        const database = new sqlite3.Database(databasePath);
        const query = `SELECT * FROM "BANNED" WHERE uuid=?`;

        database.all(query, uuid, function(err, rows) {
            console.log(rows);
            if (err) {
                console.log(err);
                throw err;
            } else {
                resolve(rows.length > 0);
            }
            database.close();
        });
    });
}

module.exports = {
    checkBlacklist
};

