module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req,res) {
        // sql query to execute
        let sqlquery = "SELECT * FROM `books` WHERE `name` = ?";
        // search database for names matching user input submitted through form
        db.query(sqlquery, [req.query.keyword], (err, result) => {
            if (err) {
                // redirect to index page if error
                res.redirect('./');
            } else {
                // create newData object by combining shopData and data found in database
                let newData = Object.assign({}, shopData, {availableBooks:result});
                if (!newData.availableBooks.length) { // check if array empty
                    res.send("No results found");
                } else {
                    // display search results page if array not empty
                    console.log(newData);
                    res.render("search-results.ejs", newData);
                }
            }
         });
    });
    app.get('/advanced-search-result', function (req,res) {
        // sql query to execute
        let sqlquery = "SELECT * FROM `books` WHERE `name` LIKE ?";
        // search database for names containing user input submitted through form
        db.query(sqlquery, ["%" + req.query.advKeyword + "%"], (err, result) => {
            if (err) {
                // redirect to index page if error
                res.redirect('./');
            } else {
                // create newData object by combining shopData and data found in database
                let newData = Object.assign({}, shopData, {availableBooks:result});
                if (!newData.availableBooks.length) { // check if array empty
                    res.send("No results found");
                } else {
                    // display search results page if array not empty
                    console.log(newData);
                    res.render("search-results.ejs", newData);
                }
            }
         });
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });     
    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData);
            res.render("list.ejs", newData);
         });
    });
    app.get('/bargainbooks', function(req, res) {
        let sqlquery = "SELECT * FROM books WHERE price < 20"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData);
            res.render("bargainbooks.ejs", newData);
         });
    });
    app.get('/addbook', function (req,res) {
        res.render('addbook.ejs', shopData);
    });
    app.post('/bookadded', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            res.send(' This book is added to database, name: '
                      + req.body.name + ' price '+ req.body.price);
          }
        });
    });                                                                                       
    app.post('/registered', function (req,res) {
        // saving data in database
        res.send(' Hello ' + req.body.first + ' ' + req.body.last
                  + ' you are now registered!  We will send an email to you at '
                  + req.body.email);                                                                              
    }); 
}
