(function(notesController) {

    var data = require("../data");

    notesController.init = function(app) {
        app.get("/api/notes/:categoryName", function (req, res) {

            var catName = req.params.categoryName;

            data.getNotes(catName, function (err, notes) {
                if (err) {
                    res.send(400, err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(notes.notes);
                }
            });
           
        });
        
        app.get("/notes/:categoryName", function (req, res) {
            
            var catName = req.params.categoryName;

            res.render("notes", { title: catName, user: req.user  });

        });
        
       

        app.post("/api/notes/:categoryName", function (req, res) {
            
            var catName = req.params.categoryName;
            var noteToInsert = {
                note: req.body.note,
                color: req.body.color,
                author:"Shreeram"
            };

           
            data.addNotes(catName, noteToInsert, function (err, notes) {
                if (err) {
                    res.send(400, err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(noteToInsert);
                }
            });
           
        });
        

        app.del("/api/notes/:categoryName", function (req, res) {

            var note = req.query.note;
            var catName = req.params.categoryName;

            data.delNote(catName, note, function (err, notes) {
                if (err) {
                    res.send(400, err);
                } else {
                   // res.set("Content-Type", "application/json");
                    res.send(note);
                }
            });

            //res.send(400, "Unknown error occurred!");

        });

    };

})(module.exports);