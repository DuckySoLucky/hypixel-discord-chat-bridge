// useage

//var DB = require('./jsonPull.js');

//DB.AddUser(UserID, Data)
///DB.GetUser(UserID)
///DB.RemoveUser(UserID)

fs = require('fs')
let json = require('./db.json')

module.exports = {
	AddUser: function (UserID, Data) {
		json[UserID] = Data
		var json_str = JSON.stringify(json)
		fs.writeFile('db.json', json_str, function (err) {
			if (err) return console.log(err)
		})
		return '200'
	},
	GetUser: function (UserID) {
		return json[UserID]
	},
	RemoveUser: function (UserID) {
		delete json[UserID]
		var json_str = JSON.stringify(json)
		fs.writeFile('db.json', json_str, function (err) {
			if (err) return console.log(err)
		})
		return '200'
	},
}