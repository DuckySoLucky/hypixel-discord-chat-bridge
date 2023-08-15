const config = require("../../config.json");
const sqlite3 = require('sqlite3');
const Logger = require("../.././Logger.js");

async function checkBlacklist(uuid) {
    const databasePath = config.database.path;
    const database = sqlite3.Database(databasePath, (err) => {
        Logger.error(err.message);
    });
    let sql = ` SELECT * FROM "BANNED" WHERE uuid=?`;
    database.get(sql, uuid, (err, row) => {
        if (err != null) {
            Logger.error(err.message)
        }
        return row
            ? row
            : null
    });
}

module.exports = {
    checkBlacklist
};