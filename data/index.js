(function (data) {
    
    var seedData = require('./seedData');
    var database = require('./database');

   

    data.getNoteCatagories = function (next) {
        //  next(null, seedData.initialNotes);
        
        
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.find().toArray(function (err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
    };
    
    
    data.addNotes = function (catName, noteToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.update({ name: catName }, { $push: { notes: noteToInsert } }, next);
            }
        });

    };
    
    data.delNote = function (category,noteToDelete, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.update({ 'name': category}, { $pull: { "notes" : { "note" : noteToDelete } } }, {multi:false}, next);
            }
        });
    };
    
    
    data.getNotes = function (catName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.findOne({ name: catName }, next);
            }
        });
    };
    
    data.createCategoryName = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                
                db.notes.find({ name: categoryName }).count(function (err, count) {
                    if (err)
                        next(err);
                    else {
                        if (count == 0) {
                            var cat = {
                                name: categoryName,
                                notes: []
                            };
                            
                            db.notes.insert(cat, function (err) {
                                if (err) {
                                    next(err);
                                } else {
                                    next(null);
                                }
                            });
                        } else {
                            next("Category already exists!");
                        }
                    }
                });

               
            }
        });
    };
    
    
    data.deleteCategoryName = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                var cat = {
                    name: categoryName
                };
                
                db.notes.remove(cat, function (err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            }
        });
    };
    
    
    data.addUser = function (user, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.insert(user, next);
            }
        });
    };
    
    
    data.getUser = function (userName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.users.findOne({ username: userName }, next);
            }
        });
    };
    
    function seedDataBase() {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed the DB " + err);
            } else {
                db.notes.count(function (error, count) {
                    if (error)
                        console.log("Failed to seed the DB " + err);
                    else {
                        if (count == 0) {
                            
                            setDbCounters("autoId");

                            //seed the DB
                            console.log("seeding the data");

                            seedData.initialNotes.forEach(function (item) {

                                setDbCounters(item._id);

                                var i = 0;
                                
                                item.notes.forEach(function (part, index, theArray) {
                                    i++;
                                    theArray[index]._id = i;
                                });

                                console.log("Check now");
                                console.log(item.notes);
                                 
                                db.notes.insert(item, function (erri) {
                                    if (erri) 
                                        console.log("Failed to insert " + item);
                                });  

                                 
                               // resetSequence("autoId"); 
                            });
                        } else { 
                            console.log("DB already seeded");
                        }
                    }
                });
            }
        }); 
    }
    
    function setDbCounters(name) {
        database.getDb(function(err, db) {
            if (err) {
                console.log("Failed to seed the DB " + err);
            } else {

                db.counters.insert(
                {
                    _id: name,
                    seq: 0
                });
            }
        });
    } 
    
    function setDbCountersWithSeq(name, seq) {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed the DB " + err);
            } else {
                
                db.counters.insert(
                    {
                        _id: name,
                        seq: seq
                    });
            }
        });
    }
    

seedDataBase();

 
    
    
    function getNextSequence(name) {
        
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed the DB " + err);
                
                return -1;

            } else {
                
                var ret = db.counters.findAndModify(
                    {
                        query: { _id: name },
                        update: { $inc: { seq: 1 } },
                        new: false
                    }
                );
                
                return ret.seq;
            }
        }); 
        
        return -1;
    }

    function resetSequence(name) {
        
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed the DB " + err);
                
                return -1;

            } else {
                
                var ret = db.counters.findAndModify(
                    {
                        query: { _id: name },
                        update: { seq: 0  },
                        new: true
                    }
                );
                
                return ret.seq;
            }
        });
        
        return 0;
    }
   
   
   
})(module.exports);