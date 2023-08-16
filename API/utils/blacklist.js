const config = require("../../config.json");
const sqlite3 = require('sqlite3');
const Logger = require("../../src/Logger.js");

const databasePath = config.database.path;
async function checkBlacklist(uuid) {
    return new Promise((resolve, reject) => {
        const database = new sqlite3.Database(databasePath);
        const query = `SELECT * FROM "BANNED" WHERE uuid=?`;

        database.all(query, uuid, function(err, rows) {
            console.log(rows);
            if (err) {
                reject(err);
            } else {
                const isBlacklisted = rows.length > 0;
                resolve(isBlacklisted);
            }
            database.close();
        });
    });
}

module.exports = {
    checkBlacklist
};

