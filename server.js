const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const MongoClient = require('mongodb').MongoClient
const path = require('path')

app.get('/',(req,res) => {
  res.render("index.ejs");
});

app.listen(process.env.port || 8000);
console.log('works')

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + './public'));
