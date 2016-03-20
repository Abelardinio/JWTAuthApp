/**
 * Created by Dmitriy on 17.03.2016.
 */
(function(){
    module.exports = function(dataContext){

        var express = require('express'),
            router = express.Router(),
            authFilter = dataContext.filters.auth.getFilter(dataContext),
            adminFilter = dataContext.filters.auth.getFilter(dataContext, "admin");

        // route middleware to verify a token
        router.use(authFilter);

        router.get('/', function(req, res, next) {
            res.send('All values');
        });

        router.get('/:index', function(req, res, next) {
            res.send('Value with index: ' + req.params.index);
        });

        router.post('/', function(req, res, next) {
            res.send('Add new value');
        });

        router.put('/:index', function(req, res, next) {
            res.send('Update value with index: ' + req.params.index);
        });

        router.delete('/:index', adminFilter, function(req, res, next) {
            res.send('Delete value with index: ' + req.params.index);
        });

        return router;
    }
})();