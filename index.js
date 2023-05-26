const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "userDB",
});

app.post("/register", (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;

    db.query(
        "INSERT INTO userTable (name, email, pass) VALUES (?, ?, ?)", 
        [name, email, pass], 
        (err, result) => {
            console.log(err);
        }
    );
});

app.post("/login", (req, res) => {
    
    const email = req.body.email;
    const pass = req.body.pass;

    db.query(
        "SELECT * FROM users WHERE email = ? AND pass = ?", 
        [email, pass], 
        (err, result) => {
            
            if (err) {
                res.send({err: err});
            }
            
            if (result.length > 0) {
                res.send(result);
            } else {
                res.send({message: "Wrong email/password combination!" });
            }
        }
    );
});

app.listen(3005, () => {    
    console.log("Server running on port 3005");
});