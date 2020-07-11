const express = require("express");
const path = require("path");

const app = express();


const rootDir = path.dirname(process.mainModule.filename);

app.use(express.static(path.join(rootDir, 'public')));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'home.html'));
});

app.get('/users', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'users.html'));
})

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, './', 'views', '404.html'));
})

app.listen(3000);