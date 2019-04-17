var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localHost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome To Bamazon")
    console.log("--------------------------");
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        // var table = new Table({
        //     head: ["ID", "Product Description", "Price", "Quantity"],
        //     colWidths: [10, 45, 10, 10],
        //     colAligns: ["center", "left", "center", "center"],
        //     style: {
        //         head: ["aqua"],
        //         compact: true
        //     }
        // });
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price);
        }
        console.log("---------------------------------------------------------");
        shopping();
    });
    // connection.end();
}

var shopping = function () {
    inquirer.prompt({
        name: "ProductToBuy",
        type: "input",
        message: "Enter product ID of item you would like to purchase!"
    }).then(function (ans1) {
        var selection = ans1.ProductToBuy;
        connection.query("SELECT * FROM products WHERE item_id=?", selection, function (err, res) {
            if (err) throw err;
            if (res.length === 0) {
                console.log("That is not a product, Try again!");

                shopping();
            } else {
                // console.log("Added to cart!");
                inquirer.prompt({
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to purchase?"
                }).then(function (ans2) {
                    var quantity = ans2.quantity;
                    if (quantity > res[0].stock_quantity) {
                        console.log("Sorry we currently have " + res[0].stock_quantity + " of the items selected");
                        shopping();
                    } else {
                        console.log(res[0].product_name + " Purchased");
                        console.log(quantity + " items @ $" + res[0].price);


                    }
                })
            }
        })

    });
}
