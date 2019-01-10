const express = require('express')
const app = express()

// Serve static resources
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    'use strict'
    res.render('index.html')
})