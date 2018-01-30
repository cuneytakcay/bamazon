var Connection = function() {
	this.mysql = require('mysql');

	this.connection = this.mysql.createConnection({
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: '',
		database: 'bamazon'
	});
}

module.exports = Connection;

