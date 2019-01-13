const express = require('express'),
    app = express(),
    dotenv = require('dotenv'),
    bodyParser = require('body-parser'),
    handlebars = require('handlebars');
    handlebarsIntl = require('handlebars-intl'),

// Configure environment variables
dotenv.config();

// Serve static resources
app.use(express.static(__dirname + '/public'));

// Set view engine
var exphbs = require('express-handlebars');
app.engine('html', exphbs());
app.set('view engine', 'html');

// Register Handlebars helpers
handlebarsIntl.registerWith(handlebars);

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// MySQL Initialization
var mysqldb = require('./mysqldb');
mysqldb.connectToDatabase();

// Routing
app.get('/', (req, res) => {
let sqlQuery = 'SELECT name, date, msg FROM guestbook ORDER BY id DESC';
mysqldb.connection.query(sqlQuery, (error, result) => {
    if (error) {
    console.error(error);
    res.send('query-error');
    } else {
    // Organize data into a useable object
    resultObj = {
        // The 'result' is originally passed as an array
        // 'guestbookPosts' is the name of the array our handlebars code is expecting
        guestbookPosts: result
    };
    res.render('index.html', resultObj);
    }
})
})

app.post('/', (req, res) => {
    const name = req.body.posterName || 'Anonymous',
            msg = req.body.posterMessage

    let sqlQuery = 'INSERT INTO guestbook (name, msg) VALUES (\'' + name + '\',\'' + msg + '\')';
    mysqldb.connection.query(sqlQuery, (error, result) => {
        if (error) {
        console.error(error);
        res.send('query-error');
        } else {
        // Send an email, query the database and re-render the page
        const mailgun = require('mailgun-js')({
            domain: process.env.MAILGUN_DOMAIN,
            apiKey: process.env.MAILGUN_KEY
        });

        const data = {
            from: 'TyrellMcCurbin.com <tmccurbin@gmail.com>',
            to: 'tmccurbin@gmail.com',
            subject: 'Guestbook post from ' + req.body.posterName,
            text: req.body.posterMessage
        }

        mailgun.messages().send(data, (error, body) => {
            // Check for errors (optional)
        })
        
        // GET RID OF THIS CODE BLOCK ONCE I IMPLEMENT SOCKETS
        // Currently, everything happens so quickly that I could forego socket implementation for a while
        // The problem is that clients that aren't posting wont see the updates until they refresh
        sqlQuery = 'SELECT name, date, msg FROM guestbook ORDER BY id DESC';
        mysqldb.connection.query(sqlQuery, (error, result) => {
            if (error) {
            console.error(error);
            res.send('query-error');
            } else {
            // Organize data into a useable object
            newResultObj = {
                // The 'result' is originally passed as an array
                // 'guestbookPosts' is the name of the array our handlebars code is expecting
                guestbookPosts: result
            };
            res.render('index', newResultObj);
            }
        })
        }
    });
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
