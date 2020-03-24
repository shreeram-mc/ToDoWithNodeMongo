(function(database) {

    var mongoDb = require("mongodb");
    //var mongoUrl = "mongodb://172.17.0.3:27017/theBoard";
    //var mongoUrl = "mongodb://172.17.0.3:27017/theBoard";
    var mongoUrl = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/theBoard';
    var theDb = null;

    database.getDb = function(next) {
        if (!theDb) { 

            mongoDb.MongoClient.connect(mongoUrl, function(err, db) {
                if (err)
                    next(err, null);
                else
                    theDb = {
                        db: db,
                        notes: db.collection("notes"),
                        users: db.collection("users"),
                        counters:db.collection("counters")
                    };

                next(null, theDb);
            });
        } else {
            next(null, theDb); 
        }
    };

})(module.exports);