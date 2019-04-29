var mysql = require("mysql");

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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++){
        console.log(res[i].id)
        console.log(res[i].product_name)
        console.log(res[i].department_name)
        console.log(res[i].price)
        console.log(res[i].stock_quantity)
        console.log("\n")
    }
    console.log(res);
    console.log(res[0].id);
    connection.end();
  });
  
});
