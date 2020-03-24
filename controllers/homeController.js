(function (homeController) {

    var data = require("../data/");

    homeController.init = function(app) {

        //HOME PAGE
        app.get("/", function (req, res) {
            //res.send("Hello there");

            data.getNoteCatagories(function (err, results) {

                res.render("index", { title: "The Board", error:err, categories:results, newCatError:req.flash("newCatName"), user:req.user });
                
            });

        });

        app.post("/newCategory", function(req, res) {
            var catName = req.body.categoryName;
          
            console.log(catName);

            data.createCategoryName(catName, function(err) {
                if (err) {
                    console.log(err);
                    req.flash("newCatName",err);
                    res.redirect("/");
                } else {
                    res.redirect("/notes/" + catName );
                }
            });

            //res.send("");
        });

        //app.post("/removeCategory", function (req, res) {
        //    var catName = req.body.categoryName;
        //    //var format = req.query.cat,
        //    console.log(catName);
            
        //    data.deleteCategoryName(catName, function (err) {
        //        if (err) {
        //            console.log(err);
        //            req.flash("newCatName", err);
        //            res.redirect("/");
        //        } else {
        //            res.redirect("/");
        //        }
        //    });

            //res.send("");
      //  });

    };

})(module.exports);