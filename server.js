// Reference Node Modules 
//==================================================================
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");
var mysql = require("mysql");

//Create Server 
//===================================================================
var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(methodOverride('_method'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var PORT = 3000;

app.listen(PORT, function(err){
    if (err) throw err;
    console.log("Server Listening on Port: " + PORT);
});

//Connect to Databse 
//=========================================================================

var connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'root',
    database:  'movie_planner_db'
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId);
})

app.get("/", function(req,res){
    connection.query('SELECT * FROM movies;', function(err,data){
        res.render('index', {movies:data});
    })
});

app.post("/create", function(req,res){
    connection.query('INSERT INTO movies (movie) VALUES (?);', [req.body.movie], function(err,result){
        if(err) throw err;
        res.redirect('/');
    })
})

app.put("/update", function(req,res){
    connection.query('UPDATE movies SET movie = ? where id = ?;', [req.body.movie, req.body.id], function(err,results){
        if(err) throw err;
        res.redirect('/');
    })
})

app.delete("/delete", function(req,res){
    connection.query('DELETE FROM movies where id = ?;', [req.body.id], function(err,results){
        if (err) throw err;
        res.redirect('/');
    })
})