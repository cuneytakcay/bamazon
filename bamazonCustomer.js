// Use required node packages
var inquirer = require("inquirer");
var {table} = require('table');
// Use constructor module
var Connection = require('./connectionModule.js');

// Initialize instance of object
var con = new Connection();

// Start the connection with the database and display menu options
con.connection.connect(function(err) {
	if (err) throw err;
	displayItems();
});

// Display products for sale 
function displayItems() {
	var data, output, dataRow;
	data = [['ITEM #', 'ITEM NAME', 'PRICE']];
	var query = 'SELECT * FROM products';
	con.connection.query(query, function(err, res) {
		if (err) throw err;
	    for (var i = 0; i < res.length; i++) {
	      dataRow = [res[i].item_id, res[i].product_name, '$' + res[i].price];
	      data.push(dataRow);
	    }
	    output = table(data);
	    console.log(output);
	    runSearch();
	});
}

// Prompt purchase questions
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

// Start the purchase process of the selected item
function selectProduct(item, unit) {
	var price, quantity;
	var query = 'SELECT * FROM products WHERE item_id=?';
	con.connection.query(query, [item], function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			price = res[i].price;
			quantity = res[i].stock_quantity;
			if (unit > quantity) {
				console.log('\nSorry, we have only ' + quantity +' in the stock.\n');
				continueProcess();
			} else {
				updateProduct(item, unit, price, quantity);
			}
		}
	});
}

// Update the inventory with the new quantity
function updateProduct(iID, iUnit, iPrice, iQuantity) {
	var newQuantity = iQuantity - iUnit;
	var query = 'UPDATE products SET stock_quantity=? WHERE item_id=?';
	con.connection.query(query, [newQuantity, iID], function(err, res) {
		if (err) throw err;
		console.log('\nTotal cost of your purchase: $' + (iUnit * iPrice) + '\n');
		continueProcess();
	});
}

// Function that decides if the process will continue or end.
function continueProcess() {
	inquirer
		.prompt([
			{
				type: 'confirm',
				message: 'Do you want to continue shopping?',
				name: 'name',
				default: true
			}
		])
		.then(function(answer) { 
			if (answer.name) {
				runSearch();
			} else {
				con.connection.end();
			}
		});
}