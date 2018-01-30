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
	displayMenu();
});

// List menu options
function displayMenu() {
	inquirer
		.prompt([
			{
				type: 'list',
				message: 'Choose one option from the menu:',
				choices: ['View products', 'View low inventory', 'Add to inventory', 'Add new product'],
				name: 'choice'
			}
		])
		.then(function(answer) {
			//console.log(answer.choice);
			switch (answer.choice) {
				case 'View products':
					viewProducts();
					break;
				case 'View low inventory':
					viewLowInv();
					break;
				case 'Add to inventory':
					addToInv();
					break;
				case 'Add new product':
					addProduct();
					break;
			}
		});
}
// View products for sale: item IDs, item names, prices, quantities
function viewProducts() {
	var data, output, dataRow;
	data = [['ITEM #', 'ITEM NAME', 'DEPARTMENT', 'PRICE', 'QUANTITY']];
	var query = 'SELECT * FROM products';
	con.connection.query(query, function(err, res) {
		if (err) throw err;
	    for (var i = 0; i < res.length; i++) {
	      dataRow = [res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity];
	      data.push(dataRow);
	    }
	    output = table(data);
	    console.log('\nPRODUCTS FOR SALE');
	    console.log(output);
	    // Display menu for new selection
	    continueProcess();
	});
}

// View low inventory: all items lower than 5 units
function viewLowInv() {
	var data, output, dataRow;
	data = [['ITEM #', 'ITEM NAME', 'DEPARTMENT', 'PRICE', 'QUANTITY']];
	var query = 'SELECT * FROM products WHERE stock_quantity < ?';
	con.connection.query(query, [5],function(err, res) {
		if (err) throw err;
	    for (var i = 0; i < res.length; i++) {
    		dataRow = [res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity];
    		data.push(dataRow);
	    }
	    output = table(data);
	    console.log('\nLOW INVENTORY PRODUCTS');
	    if (res.length < 1) {
	    		console.log('\nNo product in the low inventory.\n');
	    } else {
	    	console.log(output);
	    }
	    // Display menu for new selection
	    continueProcess();
	});
}

// Add to inventory: display a prompt to ask which item and how many to add
function addToInv() {
	inquirer
		.prompt([
			{
				type: 'input',
				message: 'Enter the item number of the product that you want to add to:',
				name: 'item'
			},
			{
				type: 'input',
				message: 'How many do you want to add?',
				name: 'quantity'
			}
		])
		.then(function(answer) {
			var quantity; 
			var query_1 = 'SELECT * FROM products WHERE item_id=?';
			con.connection.query(query_1, [answer.item], function(err, res) {
				if (err) throw err;
				for (var i = 0; i < res.length; i++) {
					quantity = res[i].stock_quantity;
				}
				var newQuantity = parseInt(answer.quantity) + parseInt(quantity);
				var query_2 = 'UPDATE products SET stock_quantity=? WHERE item_id=?';
				con.connection.query(query_2, [newQuantity, answer.item], function(err, res) {
					if (err) throw err;
					console.log('\nStock inventory updated.\n');
					// Display menu for new selection
	    			continueProcess();
				});
			});
		});
}

// Add new product: display a prompt to ask about new item details
function addProduct() {
	inquirer
		.prompt([
			{
				type: 'input',
				message: 'Enter the name of the new item that you want to add to the inventory:',
				name: 'name'
			},
			{
				type: 'list',
				message: 'Choose a department:',
				choices: ['Clothing & Shoes', 'Books & Audible', 'CDs & Vinyl', 'Electronics & Computers', 'Sports & Outdoors'],
				name: 'choice'
			},
			{
				type: 'input',
				message: 'Enter the unit price of the new item:',
				name: 'price'
			},
			{
				type: 'input',
				message: 'Enter the quantity of the new item:',
				name: 'quantity'
			}
		])
		.then(function(answer) { 
			var query = 'INSERT INTO products (product_name, department_name, price, stock_quantity)' + 
						  'VALUES (?, ?, ?, ?)';
			con.connection.query(query, [answer.name, answer.choice, answer.price, answer.quantity], function(err, res) {
				if (err) throw err;
				console.log('\nNew item added\n');
				// Display menu for new selection
	    		continueProcess();
			});
		});
}

// Function that decides if the process will continue or end.
function continueProcess() {
	inquirer
		.prompt([
			{
				type: 'confirm',
				message: 'Do you want to continue to the menu?',
				name: 'name',
				default: true
			}
		])
		.then(function(answer) { 
			if (answer.name) {
				displayMenu();
			} else {
				con.connection.end();
			}
		});
}