const { SchemaTypes } = require('mongoose');
const connection=require('../base/connection');
const Schema = connection.Schema;
const userSchema= new Schema({
    'User-ID':{type:SchemaTypes.String,required:true,unique:true},
    'Playlist':{type:SchemaTypes.Array},
    'Subscriber':{type:SchemaTypes.String,default:'false'},
    'Subscription':{type:SchemaTypes.Date}
});
const userModel= connection.model('User',userSchema);
module.exports = userModel;