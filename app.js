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

    const salt = crypto.randomBytes(128).toString("base64");
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");

    users[username] = {salt, hash};
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
})