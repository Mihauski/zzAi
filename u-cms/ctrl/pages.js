const express = require('express'),
    router = express.Router();

/*
    Definition of Page object
*/

class Page {
    constructor(id, creator, date, url, title, content, modified, blog) {
        this.id = id || "";
        this.creator = creator || "";
        this.date = date || "";
        this.url = url || "";
        this.title = title || "";
        this.content = content || "";
        this.modified = modified || "";
        this.blog = blog || "";
    }
}

/*
    Helper functions
*/
function isNonEmpty(str) {
    return !(str === "" || str.length === 0);
}

function logError(str, err) {
    console.log("\x1b[31m"+str+": "+err);
}

function logSuccess(str) {
    console.log("\x1b[32m"+str);
}

module.exports = router;