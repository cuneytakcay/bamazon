# bamazon
Amazon-like storefront using MySQL. The app takes in orders from customers and depletes stock from the store's inventory. 

[Watch the app in action](https://youtu.be/NZt_EE6H4Mk)

## Install

Following Node packages must be installed before using the program:

* [mysql](https://www.npmjs.com/package/mysql)
* [inquirer](https://www.npmjs.com/package/inquirer)
* [table](https://www.npmjs.com/package/table)

```
npm install
```
This will install all necessary packages for the app. (Dependencies are included in package.json.)

## Usage

***MySql database is required.***

Create a 'products' table and insert dummy data in it.
```
CREATE TABLE products ( 
    item_id int NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100),
    price DECIMAL(13,2) NULL,
    stock_quantity int NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("<item>", "<department>", <price>, <quantity>);
```
***Command-line***

* Customer view

*Prompt asks customer which item and how many to buy, then displays the total cost if the item is adequate in the stock.*

![image_1](https://user-images.githubusercontent.com/25511541/35535805-0dd28630-0502-11e8-9e05-9dd8cfe92eaf.PNG)
![image_2](https://user-images.githubusercontent.com/25511541/35535813-12e7d5da-0502-11e8-9ae0-f0dce87b9117.PNG)


* Manager view

*Menu*

![image_3](https://user-images.githubusercontent.com/25511541/35535841-282fcfe2-0502-11e8-969d-f11b390b1843.PNG)

*View products*

![image_4](https://user-images.githubusercontent.com/25511541/35535848-2a75180c-0502-11e8-97d1-349eb499a9ce.PNG)

*View low-inventory products (displays items lower than 5 units)*

![image_5](https://user-images.githubusercontent.com/25511541/35535853-2cdda35c-0502-11e8-9a33-2357e78374b2.PNG)

*Add to inventory*

![image_6](https://user-images.githubusercontent.com/25511541/35535858-2f59acf2-0502-11e8-9a72-dd483fc2edbd.PNG)
![image_7](https://user-images.githubusercontent.com/25511541/35535860-319bb636-0502-11e8-939b-cbdfa2f5ade6.PNG)

*Add new item*

![image_8](https://user-images.githubusercontent.com/25511541/35535865-340765be-0502-11e8-86e6-54ac5bce4bcd.PNG)
![image_9](https://user-images.githubusercontent.com/25511541/35535867-36479326-0502-11e8-9182-d9b49eb71817.PNG)


## Authors

* Cuneyt Akcay

## Acknowledgements

* University of Arizona Coding Bootcamp
* J. Jorgensen
* N. Green
* P. Fesz-Nguyen
* J. Borjorquez