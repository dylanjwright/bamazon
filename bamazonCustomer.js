var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    show();
});

var show = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\nID: " + res[i].id)
            console.log("Name: " + res[i].product_name)
            console.log("Dept: " + res[i].department_name)
            console.log("Price: " + res[i].price)
            console.log("In Stock: " + res[i].stock_quantity)
            console.log("\n")
        }
        question(res);
    });
};

var question = function (res) {
    var id;

    inquirer.prompt([{

        name: "customer",
        type: "input",
        message: "What is the ID of the product you would like to buy?"

    }]).then(function (answer) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].id == answer.customer) {
                id = i;
                inquirer.prompt({

                    name: "howmany",
                    type: "input",
                    message: "How many would you like to buy?",

                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } 
                        return false;
                    }
                    
                }).then(function (answer) {
                    if ((res[id].stock_quantity - parseInt(answer.howmany)) > 0) {
                        connection.query(
                            "UPDATE products SET ? WHERE ?", 
                            [
                                {
                                    stock_quantity: res[id].stock_quantity - parseInt(answer.howmany)
                                },
                                {
                                    id: i
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                                console.log("\nBought!");
                                console.log("Total: $" + res[id].price * parseInt(answer.howmany));
                            })
                    } else {
                        console.log("Insufficient Quantity");
                        show(res);
                    }
                })
            }
        }
    })
};