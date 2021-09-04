// Use Express
const express = require("express"),
    app = express(),
    mysql = require("mysql"),
    cors = require("cors"),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    expressjwt = require('express-jwt');


mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ez_blog_dev'
};

// Connections pool for DB
dbPool = mysql.createPool(mysqlConfig);

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// embedding required subcontrollers files
const usersCtrl = require('./ctrl/users.js');
const pagesCtrl = require('./ctrl/pages.js');
const mediaCtrl = require('./ctrl/media.js');
const postsCtrl = require('./ctrl/posts.js');
const settingsCtrl = require('./ctrl/settings.js');

//enable CORS and json parsing
app.use(cors());
app.options('*', cors());
app.use(express.json());

//initialize routes
app.use("/users", usersCtrl);
app.use("/pages", pagesCtrl);
app.use("/media", mediaCtrl);
app.use("/posts", postsCtrl);
app.use("/settings", settingsCtrl);


// Init the server
app.listen(8085, function () {
    console.log("App now running on port 8085");
});

/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});