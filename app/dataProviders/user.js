/**
 * Created by Dmitriy on 18.03.2016.
 */

module.exports = function(dataContext){
    return {
        /**
         * Gets user by name.
         *
         * @param callback Function called after operation is completed.
         */
        getByName: function(name, callback){
            dataContext.models.user.findOne({
                name: name
            }, callback);
        }
    };
};