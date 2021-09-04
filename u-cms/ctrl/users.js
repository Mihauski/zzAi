const express = require('express'),
    router = express.Router();


/*
    Definition of User object
*/

class User {
    constructor(id, login, email, password, roleId) {
        this.id = id || "";
        this.login = login || "";
        this.email = email || "";
        this.password = password || "";
        this.roleId = roleId || "";
    }
}

/*
    Add user to the database
*/
router.post('/add', function (req, res) {
    let user = new User(null, req.body.login, req.body.email, req.body.password, req.body.roleId);

    if(!isAddUserValid(user)) {
        return res.status(500).json("Invalid or incomplete user data.");
    }

    let sql = 'INSERT INTO users(id, login, email, password, roleId) VALUES(null, ?, ?, ?, ?)';

    dbPool.query(sql, [user.login, user.email, user.password, user.roleId], function(err, data) {
        if(err) {
            logError("Users -> SQL error", err);
            res.status(500).json("SQL error: "+err);
        } else {
            logSuccess("Users -> Added successfully");
            res.status(200).json("User added successfully.");
        }
    });

    function isAddUserValid(user) {
        return isNonEmpty(user.login) && isNonEmpty(user.email) && isNonEmpty(user.password) && isNonEmpty(user.roleId);
    }
});

router.put('/edit', function(req,res) {
    if(!req.body.id) {
        logError("Users -> Unable to edit. Missing data");
        res.status(500).json("Unable to edit - missing data.");
    }

    let usrId = req.body.id;
    let sql = "SELECT * FROM users WHERE users.id = ?";

    dbPool.query(sql, [usrId], function(err, data) {
        if(err) {
            logError("Users -> SQL error", err);
            res.status(500).json("Users -> Unable to edit. No such user");
        } else {
            let modUser = new User(null, req.body.login || data[0].login, req.body.email || data[0].email, req.body.password || data[0].password, req.body.roleId || data[0].roleId);

            sql = "UPDATE users SET login = ?, email = ?, password = ?, roleId = ? WHERE users.id = ?";

            dbPool.query(sql, [modUser.login, modUser.email, modUser.password, modUser.roleId, usrId], function(err, data) {
                if(err) {
                    logError("Users -> SQL error", err);
                    res.status(500).json("SQL error" + err);
                } else {
                    logSuccess("Users -> Edited successfully");
                    res.status(200).json("User modified successfully. You will be logged out if needed.");
                }
            });
        }
    });
});

router.delete('/delete/:id', function(req, res) {
    if(!req.params.id) {
        logError("Parameter missing.","");
        res.status(500).json("Users -> Cannot delete. Parameter missing.");
    }

    let identifier = req.params.id;
    let isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(identifier);

    let sql;
    if(isEmail) {
        sql = "DELETE FROM users WHERE users.email = ?";
    } else {
        sql = "DELETE FROM users WHERE users.id = ?";
    }

    dbPool.query(sql, [identifier], function(err,data) {
        if(err) {
            logError("Users -> SQL error", err);
            res.status(500).json("Could not delete user. SQL error "+err);
        } else {
            logSuccess("Users -> Deleted successfully.");
            res.status(200).json("User deleted");
        }
    });
});

router.get('/find/:id', function(req, res) {
    if(!req.params.id) {
        logError("Parameter missing.","");
        res.status(500).json("Users -> Cannot find. Parameter missing.");
    }

    let identifier = req.params.id;
    let isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(identifier);

    let sql;
    if(isEmail) {
        sql = "SELECT * FROM users WHERE users.email = ?";
    } else {
        sql = "SELECT * FROM users WHERE users.id = ?";
    }

    dbPool.query(sql, [identifier], function(err,data) {
        if(err) {
            logError("Users -> SQL error", err);
            res.status(500).json("Could not find user.");
        } else {
            logSuccess("Users -> found and returned");
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