const express = require('express')
const app = express()

// Serve static resources
app.use(express.static(__dirname + '/public'));

// Set view engine
var exphbs = require('express-handlebars');
app.engine('html', exphbs());
app.set('view engine', 'html');

app.get('/', function (req, res) {
    'use strict'
    res.render('index.html')
})

app.set('port', process.env.PORT || 3000);

// Get IP address
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening at: ' + addresses + ':' + server.address().port);
});
