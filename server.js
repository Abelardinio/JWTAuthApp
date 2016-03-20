/**
 * Created by Dmitriy on 16.03.2016.
 */

(function(){
    /**
     * Getting the packages we need.
     */
    var express = require('express'),

        /**
         * Initializing express.js
         */
        app = express(),
        bodyParser = require('body-parser'),
        morgan = require('morgan'),
        mongoose = require('mongoose'),
        jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens

        config = require('./config'), // get our config file
        userModel = require('./app/models/user'), // get our mongoose model
        dataContext = {models:{
            user: userModel
        }},
        userDataProvider = require('./app/dataProviders/user')(dataContext);

    dataContext.dataProviders = {
        user: userDataProvider
    };

    dataContext.jwt = jwt;
    dataContext.app = app;
    dataContext.filters = require('./app/filters/auth')
    /**
     * Connecting route configuration files.
     */
    var routes = {
        base:require('./routes/routes')(dataContext),
        api:{
           values:require('./routes/api/values')(dataContext)
        }
    };

    /**
     * Server configuration.
     */
    (function(){
        mongoose.connect(config.database); // connect to database
        app.set('superSecret', config.secret); // secret variable

        // use body parser so we can get info from POST and/or URL parameters
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        // use morgan to log requests to the console
        app.use(morgan('dev'));
    })();

    /**
     * Routes initialization.
     */
    (function(){
        app.use('/api', routes.base);
        app.use('/api/values', routes.api.values);

    })();

    app.listen(config.port);
    console.log('Magic happens at http://localhost:' + config.port);
})();

/*// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
        name: 'Nick Cerminara',
        password: 'password',
        admin: true
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

/// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/auth', function(req, res) {

    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});


// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);*/