/**
 * Created by Dmitriy on 17.03.2016.
 */
(function(){
    module.exports = function(dataContext){

        var express = require('express'),
            router = express.Router(),
            userDataProvider = dataContext.dataProviders.user,
            jwt = dataContext.jwt;

        /* GET home page. */
        router.get('/', function(req, res, next) {
            res.send('Hello! This is the Jason Web Tokens Authorization NodeJs test API');
        });

        router.post('/auth', function(req, res) {

            userDataProvider.getByName(req.body.name, function (err, user) {

                if (err) throw err;

                if (!user) {
                    res.json({success: false, message: 'Authentication failed. User not found.'});
                } else if (user) {

                    // check if password matches
                    if (user.password != req.body.password) {
                        res.json({success: false, message: 'Authentication failed. Wrong password.'});
                    } else {

                        // if user is found and password is right
                        // create a token
                        var token = jwt.sign(user, dataContext.app.get('superSecret'), {
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

        return router;
    }
})();