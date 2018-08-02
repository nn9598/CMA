const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var path = require('path');
var fs = require('fs');
var request = require('request');
var MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname));

//Creating server and having it listen at port 8000
const server = app.listen(8000, () => {
  console.log('Server listening on port %d in %s mode', 
    server.address().port, app.settings.env);
})

//Use localtunnel to get a dummy URL for site when server is up locally
var localtunnel = require('localtunnel');
var tunnel = localtunnel(server.address().port, {subdomain: 'hello'},
  function(err, tunnel) {
    console.log(`tunnelling through ${tunnel.url}`)

    tunnel.url;

  });





//Linking to MongoDB database
//Currently just playing around and learning implementation
MongoClient.connect("mongodb://localhost:27017/WindsorHeights", function(err, client) {

  const db = client.db('WindsorHeights');

  var cursor = db.collection('Houses');

  app.post('/myaction', (req, res) => {
  console.log('action command invoked');
  var address = req.body.address;
  cursor.find({'"FullAddress"': address}).toArray(function(err, docs) {
    if (err) throw err;
    var mongoSqFt = docs[0];
    console.log(mongoSqFt)
    storage.push(mongoSqFt);

    fs.writeFile('data.json', JSON.stringify(storage), function(err) {
    if(err) throw err;
    console.log(`Saved update!`)
  });
  })

  
  res.sendFile(__dirname + '/index.html');
})

   
});




//Initializing array that will store user entered values
var storage = [];
//Passing data from POST request into storage array
fs.readFile('data.json', function (err, data) {
  if(err == null)
    storage = JSON.parse(data);
  else
    console.log("Error in DB!")  // body...
});


//Root get request that sends the index.htmml to user
app.get('/', (req,res) => {
  fs.readFile('index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
})

//Post request used in tandem with HTML forms action
//Takes user entered square footage, parses, and writes it into a JSON file
//Returns initial index.html after completion


//Sends storage data to client-side
//Data is formatted and displayed from the client-side
app.get('/data', (req, res) => {

    var goodData = JSON.stringify(storage); 
    res.send(goodData);
})

