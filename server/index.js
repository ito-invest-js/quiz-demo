const express  =  require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
var uuid = require("uuid");

const { database } = require('./db/sqliteConnector');

require('dotenv').config(); // Load the .env variables

// create application/json parser
const jsonParser = bodyParser.json();

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-xjhfxj14.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://ide-api.ross128.lu/api',
    issuer: 'https://dev-xjhfxj14.us.auth0.com/',
    algorithms: ['RS256']
});

//app.use(jwtCheck);

app.listen(8008, () => {
    console.log("Quiz server running at http://localhost:8008.");
});

// Root endpoint
app.get("/api/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// All Quiz by User endpoint
app.get("/api/secure/quiz", jwtCheck, (req, res, next) => {
    var sql = "select * from quiz where author = ?";
    var params = [req.auth.sub];
    database.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      rows = rows.map(function(r) {
        var content = JSON.parse(r['content']);
        delete r.content;
        return {...r, ...content};
      });
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

app.delete("/api/secure/quiz/:id", jwtCheck, (req, res, next) => {
    var sql = "delete from quiz where id = ? and author = ?"
    var params = [req.params.id, req.auth.sub]
    database.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success"
        })
    });
});

app.post("/api/secure/quiz/", jwtCheck, jsonParser, (req, res, next) => {
    var errors=[]
    if (!req.body.title){
        errors.push("No title specified");
    }
    if (!req.body.questions){
        errors.push("No question specified");
    }
    if (errors.length){
        console.log(err);
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var id = uuid.v4().substring(0, 6);
    console.log('Create id : ' + id);
    var sql ='INSERT INTO quiz (id, author, title, content) VALUES (?,?,?,?)';
    var params = [id, req.auth.sub, req.body.title, JSON.stringify(req.body)];
    database.run(sql, params, function (err, result) {
        if (err){
            console.log(err);
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "id" : id
        })
    });
});

// Public Endpoint

// Root endpoint
app.get("/api/", (req, res, next) => {
    res.json({"message":"Ok"})
    return;
});

// All Quiz endpoint
app.get("/api/quiz", (req, res, next) => {
    var sql = "select * from quiz";
    var params = [];
    database.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      rows = rows.map(function(r) {
        var content = JSON.parse(r['content']);
        delete r.content;
        return {...r, ...content};
      });
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

app.get("/api/quiz/:id", (req, res, next) => {
    var sql = "select * from quiz where id = ?"
    var params = [req.params.id]
    database.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      if (row) {
        var content = JSON.parse(row['content']);
        delete row.content;
        row = {...row, ...content};
        res.json({
            "message":"success",
            "data":row
        })
        return
      }
      res.status(400).json({"error":"id not found"});
      return
    });
});

app.get("/api/quiz/title/:query", (req, res, next) => {
    var sql = "select id, title from quiz where UPPER(title) like ?"
    var params = ['%'+req.params.query.toUpperCase()+'%']
    database.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
        return
    });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404).json({ error: 'Not found' });
    return;
});