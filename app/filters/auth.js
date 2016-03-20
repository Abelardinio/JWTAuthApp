/**
 * Created by Dmitriy on 20.03.2016.
 */
(function(){
    module.exports = {
        auth:{
            getFilter: function(dataContext, role){
                var app = dataContext.app,
                    jwt = dataContext.jwt;

                return function (req, res, next) {

                        // check header or url parameters or post parameters for token
                        var token = req.body.token || req.query.token || req.headers['x-access-token'];

                        // decode token
                        if (token) {

                            // verifies secret and checks exp
                            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                                var user = decoded._doc;
                                if (err) {
                                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                                } else {
                                    if (role && role === "admin" && user.admin !== true){
                                        return res.json({ success: false, message: 'This method is available only for administrator.' });
                                    }

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
                    };
            }
        }
    };
})();