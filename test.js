const fs = require("fs");
const users = require("./users.json");
const http = require("http");
const url = require("url");

let user = {
    name: "New User",
    hand: "left",
    age: 30,
    limbs: ["0 arms", "0 legs"]
};

users.push(user);
fs.writeFile(
    "users.json",
    
    JSON.stringify(users),
    err => {
        if (err) throw err;

        console.log("The file has been saved!");
    }
);
fs.readFile("users.json", function (err, data) {
    if (err) throw err;

    const users = JSON.parse(data);
    console.log(users);
});

http.createServer(function(req, res)){
    var q = url.parse
}

fs.readFile("../week4/lab4/view/index.html", function (err, data) {

}