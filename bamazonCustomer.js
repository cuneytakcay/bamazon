var mysql = require('mysql');
var inquirer = require("inquirer");
var {table} = require('table');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	displayItems();
});

function displayItems() {
	var data, output, dataRow;
	data = [['ITEM #', 'ITEM NAME', 'PRICE']];
	var query = 'SELECT * FROM products';
	connection.query(query, function(err, res) {
	    for (var i = 0; i < res.length; i++) {
	      dataRow = [res[i].item_id, res[i].product_name, '$' + res[i].price];
	      data.push(dataRow);
	    }
	    output = table(data);
	    console.log(output);
	    runSearch();
	});
}

function runSearch() {
	inquirer
		.prompt([
			{
				type: 'input',
				message: 'Please enter the item number that you want to purchase.',
				name: 'item'
			},
			{
				type: 'input',
				message: 'How many units of this product you want to purchase?',
				name: 'unit'
			}
		])
		.then(function(answer) {
			selectProduct(answer.item, answer.unit);
		});
}

function selectProduct(item, unit) {
	var price, quantity;
	var query = 'SELECT * FROM products WHERE item_id=?';
	connection.query(query, [item], function(err, res) {
		for (var i = 0; i < res.length; i++) {
			price = res[i].price;
			quantity = res[i].stock_quantity;
			if (unit > quantity) {
				console.log('Sorry, we have only ' + quantity +' in the stock.');
			} else {
				updateProduct(item, unit, price, quantity);
			}
		}
	});
}

function updateProduct(iID, iUnit, iPrice, iQuantity) {
	var newQuantity = iQuantity - iUnit;
	var query = 'UPDATE products SET stock_quantity=? WHERE item_id=?';
	connection.query(query, [newQuantity, iID], function(err, res) {
		console.log('Total cost of your purchase: $' + (iUnit * iPrice));
	});
}