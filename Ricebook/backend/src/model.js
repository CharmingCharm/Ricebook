var mongoose = require('mongoose');
require('./db.js');

var userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String 
});

var profileSchema = new mongoose.Schema({
    username: String,
    displayname: String,
    headline: String,
    following: [ String ],
    email: String,
    phone: String,
    dob: String,
    zipcode: String,    
    avatar: String
});

var commentSchema = new mongoose.Schema({
    author: String,
    text: String,
    date: Date
});

var articleSchema = new mongoose.Schema({
    pid: String,
    author: String,
    body: String,
    date: Date,
    picture: String, 
    comments: [commentSchema]
});

exports.User = mongoose.model('user', userSchema);
exports.Profile = mongoose.model('profile', profileSchema);
exports.Comment = mongoose.model('comment', commentSchema);
exports.Article = mongoose.model('article', articleSchema);
