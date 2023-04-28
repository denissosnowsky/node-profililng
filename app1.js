const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Hello world");
});

const users = [];

app.get('/signUp', (req, res) => {
    let username = req.query.username || "";
    const password = req.query.password || "";
    users[username] = {};

    if (!username || !password) {
        return res.send("Please enter both username/password");
    }

    const computeHash = (pass, salt) => {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(pass, salt, 10000, 512, "sha512", (err, key) => {
                resolve(key.toString("base64"));
            });        
        });
    }

    const createNewUser = async (user, pass) => {
        const salt = await crypto.randomBytes(128).toString("base64");
        const hash = await computeHash(pass, salt).then(res => res);
        users[user] = {salt, hash};
        res.send(users[user]);
    }

    createNewUser(username, password);
});

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
})