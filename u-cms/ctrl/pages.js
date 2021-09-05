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

router.post('/add', function(req, res) {
    let page = new Page(null, req.body.creator, null, req.body.url, req.body.title, req.body.content, null, req.body.isBlog);

    if(!isAddPageValid(page)) {
        return res.status(500).json("Invalid or incomplete page data");
    }

    let sql = 'INSERT INTO pages(id, creator, date, url, title, content, modified, blog) VALUES (null, ?, NOW(), ?, ?, ?, NOW(), ?)';

    dbPool.query(sql, [page.creator, page.url, page.title, page.content, page.blog], function(err, data) {
        if(err) {
            logError("Pages -> SQL error", err);
            res.status(500).json("SQL error: "+err);
        } else {
            logSuccess("Pages -> Added successfully");
            res.status(200).json("Page added successfully");
        }
    });

    function isAddPageValid(post) {
        return isNonEmpty(post.creator) && isNonEmpty(post.url) && isNonEmpty(post.title) && isNonEmpty(post.content) && isNonEmpty(post.isBlog);
    }
});

router.put('/edit', function(req,res) {
    if(!req.body.id) {
        logError("Pages -> Unable to edit. Missing data");
        res.status(500).json("Unable to edit - missing data.");
    }

    let pageId = req.body.id;
    let sql = "SELECT * FROM pages WHERE pages.id = ?";

    dbPool.query(sql, [pageId], function(err,data) {
        if(err) {
            logError("Pages -> SQL Error", err);
            res.status(500).json("Pages -> Unable to edit. No such page.");
        } else {
            let modPage = new Page(null, req.body.creator || data[0].creator, data[0].date, req.body.url || data[0].url, req.body.title || data[0].title, req.body.content || data[0].content, null, data[0].blog);

            sql = "UPDATE posts SET creator = ?, url = ?, title = ?, content = ?, modified = NOW()";

            dbPool.query(sql, [page.creator, page.url, page.title, page.content], function(err,data) {
                if(err) {
                    logError("Pages -> SQL error", err);
                    res.status(500).json("Sql error"+ err);
                } else {
                    logSuccess("Pages -> Edited successfully");
                    res.status(200).json("Page modified successfully");
                }
            });
        }
    });
});

router.delete('/delete/:id', function(req,res) {
    if(!req.params.id) {
        logError("Paramter missing","");
        res.status(500).json("Pages -> Cannot delete. Parameter missing");
    }

    let id = req.params.id;

    let sql = "DELETE FROM pages WHERE pages.id = ?";

    dbPool.query(sql, [id], function(err, data) {
        if(err) {
            logError("Pages -> SQL error", err);
            res.status(200).json("Could not delete page. SQL error "+err);
        } else {
            logSuccess("Pages -> Deleted successfully.");
            res.status(200).json("Page deleted");
        }
    });
});

router.get('/find/:id', function(req, res) {
    if(!req.params.id) {
        logError("Parameter missing.", "");
        res.status(500).json("Pages -> Cannot find. Parameter missing.");
    }

    let identifier = req.params.id;
    let isUrl = identifier.match(/^[a-z0-9]+$/i);

    let sql;
    if(isUrl) {
        sql = "SELECT * FROM pages WHERE pages.url = ?";
    } else {
        sql = "SELECT * FROM pages WHERE pages.id = ?";
    }

    dbPool.query(sql, [identifier], function(err, data) {
        if(err) {
            logError("Pages -> SQL error", err);
            res.status(500).json("Could not find page to load.");
        } else {
            logSuccess("Pages -> found and returned");
            res.status(200).json(data);
        }
    });
});

router.get('/list', function(req,res) {
    let sql = "SELECT * FROM pages ORDER BY date DESC";

    dbPool.query(sql, function (err, data) {
        if(err) {
            logError("Pages -> SQL error", err);
            res.status(500).json("Could not get pages list. SQL error "+err);
        } else {
            logSuccess("Pages -> returned list");
            res.status(200).json(data);
        }
    });
});

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