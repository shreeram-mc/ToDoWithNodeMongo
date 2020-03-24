// auth/index.js
(function (auth) {
    
    var data = require("../data");
    var hasher = require("./hasher");
    
    var passport = require("passport");
    var localStrategy = require("passport-local").Strategy;
    
    function userVerify(username, password, next) {
        data.getUser(username, function (err, user) {
            if (!err && user) {
                var testHash = hasher.computeHash(password, user.salt);
                if (testHash === user.passwordHash) {
                    next(null, user);
                    return;
                }
            }
            
            if (!user) {
                next(null, false, { message: "Didnt find username" });
            }

            next(null, false, { message: "Invalid Credentials." });
        });
    }
    
    auth.ensureAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    };
    
    auth.ensureApiAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.send(401, "Not authorized");
        }
    };
    
    auth.init = function (app) {
        
        // setup passport authentication
        passport.use(new localStrategy(userVerify));

        passport.serializeUser(function (user, done) {
            done(null, user);
        });
        
        passport.deserializeUser(function (user, done) {
            done(null, user);
        });
        
        app.use(passport.initialize());
        app.use(passport.session());
        
        app.get("/login", function (req, res) {
            res.render("login", { title: "Login to The Board", message: req.flash("loginError") });
        });
        
        app.post("/login", function (req, res, next) {
            var authFunction = passport.authenticate("local", function (err, user, info) {
                if (err) {
                    next(err);
                } else {
                    req.logIn(user, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            res.redirect("/");
                        }
                    });
                }
            });
           return authFunction(req, res, next);
        });
        
        app.get("/register", function (req, res) {
            res.render("register", { title: "Register for The Board", message: req.flash("registrationError") });
        });
        
        app.post("/register", function (req, res) {
            
            var salt = hasher.createSalt();
            
            var user = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                passwordHash: hasher.computeHash(req.body.password, salt),
                salt: salt
            };
            
            data.addUser(user, function (err) {
                if (err) {
                    req.flash("registrationError", "Could not save user to database.");
                    res.redirect("/register");
                } else {
                    res.redirect("/login");
                }
            });
        });

    };

})(module.exports);